require("dotenv").config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require("fs");
const path = require("path");

// selfbot patch
try {
    const ClientUserSettingManager = require("./node_modules/discord.js-selfbot-v13/src/managers/ClientUserSettingManager.js");
    if (ClientUserSettingManager && ClientUserSettingManager.prototype) {
        ClientUserSettingManager.prototype._patch = function () { return this; };
    }
} catch (e) {}

const { Client } = require("discord.js-selfbot-v13");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    StreamType,
    entersState,
    VoiceConnectionStatus
} = require("@discordjs/voice");
const { spawn } = require("child_process");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const playdl = require('play-dl');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// debug route
app.get('/debug', (req, res) => {
    const publicDir = path.join(__dirname, 'public');
    const indexPath = path.join(publicDir, 'index.html');
    res.json({
        __dirname: __dirname,
        cwd: process.cwd(),
        publicExists: fs.existsSync(publicDir),
        publicContents: fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : null,
        indexPath: indexPath,
        indexExists: fs.existsSync(indexPath)
    });
});

// dashboard auth
const DASH_PASS = process.env.DASH_PASS || '';
if (DASH_PASS) {
    app.use((req, res, next) => {
        if (req.path === '/' && req.query.p !== DASH_PASS) {
            return res.status(401).send('unauthorized — add ?p=yourpassword');
        }
        next();
    });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// state
let tokens = [];
let clients = [];
let connections = new Map();
let players = new Map();
let activeResources = new Map();
let currentFFmpegProcess = null;
let currentUrl = null;
let currentTitle = "Nothing playing";
let currentChannelId = null;
let loopMode = false;
let isPaused = false;
let isBassboosted = false;
let currentVolumeMultiplier = 1.0;
let blastMode = false;
let blastVolume = 50.0;
let pungiMode = false;
let pungiIntensity = 50.0;
let loudMode = false;
let loudModeBoost = 20.0;
let loudModeMaxVolume = 500.0;
let loudModeInterval = null;
let superLoudMode = false;
let forceLoudMode = false;
let isBotRunning = false;
let keepAliveInterval = null;

console.log("waiting for tokens from dashboard...");

function stopFFmpeg() {
    if (currentFFmpegProcess) {
        try { currentFFmpegProcess.kill("SIGKILL"); } catch (e) {}
        currentFFmpegProcess = null;
    }
}

function stopLoudMode() {
    if (loudModeInterval) { clearInterval(loudModeInterval); loudModeInterval = null; }
    loudMode = false;
}

function startLoudMode() {
    if (loudModeInterval) clearInterval(loudModeInterval);
    loudModeInterval = setInterval(() => {
        if (!loudMode || connections.size === 0) return;
        const primaryClient = clients[0];
        if (!primaryClient || !currentChannelId) return;
        const channel = primaryClient.channels.cache.get(currentChannelId);
        if (!channel) return;
        const clusterIds = clients.map(c => c.user?.id).filter(Boolean);
        const speaking = channel.members.filter(m => !clusterIds.includes(m.id) && !m.voice.selfMute && m.voice.speaking);
        const targetVolume = speaking.size > 0 ? Math.min(currentVolumeMultiplier * loudModeBoost, loudModeMaxVolume) : currentVolumeMultiplier;
        activeResources.forEach((resource) => {
            if (resource && resource.volume && resource.volume.volume !== targetVolume) {
                resource.volume.setVolume(targetVolume);
            }
        });
    }, 400);
}

function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
}
function isDirectAudio(url) {
    return /\.(mp3|ogg|webm|m4a|wav|opus|aac)(\?.*)?$/i.test(url);
}

function buildFilters() {
    const f = ["highpass=f=60"];
    if (superLoudMode) {
        f.push("compand=attacks=0.01:decays=0.01:points=-80/-80|-30/-15|-12/-6|-6/-3|0/-2|20/-1");
        f.push("volume=15dB");
        f.push("acompressor=threshold=0.05:ratio=20:attack=5:release=50");
        f.push("alimiter=level_in=15:level_out=0:limit=0.99:attack=1:release=50");
        f.push("dynaudnorm=p=0.95:m=100:g=20");
    }
    if (forceLoudMode) {
        f.push("compand=attacks=0.001:decays=0.001:points=-80/-80|-40/-25|-20/-10|0/-5|10/-2|20/0|30/5");
        f.push("acompressor=threshold=0.01:ratio=50:attack=1:release=100");
        f.push("alimiter=level_in=25:level_out=0.99:limit=1:attack=1:release=100");
        f.push("dynaudnorm=p=1:m=100:g=30");
        f.push("volume=20dB");
        f.push("aecho=0.8:0.9:1000:0.3");
    }
    if (isBassboosted) f.push("equalizer=f=60:width_type=h:width=50:g=15");
    if (pungiMode) {
        f.push("acrusher=bits=4:mode=log:aa=1");
        f.push("equalizer=f=30:width_type=h:width=80:g=20");
        f.push("equalizer=f=1000:width_type=h:width=500:g=10");
        f.push(`volume=${pungiIntensity}`);
        f.push("aphaser=0.8:0.8:2000:0.4");
        f.push("aecho=0.8:0.9:1000:0.3");
    } else if (blastMode) {
        f.push(`volume=${blastVolume}`);
        f.push("dynaudnorm=p=0.9:m=50.0:g=15");
        f.push("alimiter=level_in=2.0:level_out=0.98:limit=0.99:attack=5:release=50");
    } else if (currentVolumeMultiplier > 1.0) {
        f.push(`volume=${currentVolumeMultiplier}`);
    }
    return f.join(",");
}

function startFFmpegStream(inputSource) {
    stopFFmpeg();
    const filters = buildFilters();

    currentFFmpegProcess = spawn(ffmpegPath, [
        "-reconnect", "1",
        "-reconnect_streamed", "1",
        "-reconnect_delay_max", "5",
        "-i", inputSource,
        "-filter:a", filters,
        "-f", "s16le",
        "-ar", "48000",
        "-ac", "2",
        "pipe:1"
    ]);

    currentFFmpegProcess.on('error', (e) => console.log('ffmpeg error:', e.message));

    clients.forEach((client, index) => {
        const player = players.get(index);
        if (player && currentFFmpegProcess) {
            const resource = createAudioResource(currentFFmpegProcess.stdout, { inputType: StreamType.Raw, inlineVolume: true });
            let effectiveVol = currentVolumeMultiplier;
            if (pungiMode) effectiveVol = Math.min(pungiIntensity, 200.0);
            else if (blastMode) effectiveVol = Math.min(blastVolume, 500.0);
            else if (superLoudMode) effectiveVol = Math.min(currentVolumeMultiplier * 20, 2000.0);
            else if (forceLoudMode) effectiveVol = Math.min(currentVolumeMultiplier * 30, 3000.0);
            else effectiveVol = Math.min(currentVolumeMultiplier * 2, 200.0);
            resource.volume.setVolume(effectiveVol);
            activeResources.set(index, resource);
            player.play(resource);
            io.emit('audio_update', { status: 'playing', title: currentTitle, volume: Math.round(effectiveVol * 100) });
        }
    });
    isPaused = false;
    if (loudMode) startLoudMode();
}

function startVoiceKeepAlive() {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(() => {
        connections.forEach((conn, index) => {
            if (!conn) return;
            const status = conn.state.status;
            if (status === VoiceConnectionStatus.Disconnected || status === VoiceConnectionStatus.Destroyed) {
                console.log(`bot ${index+1} voice dropped (${status})`);
            }
        });
    }, 30000);
}

function startBots() {
    if (tokens.length === 0) { console.log('no tokens'); return; }
    clients.length = 0;
    isBotRunning = true;

    tokens.forEach((token, index) => {
        const client = new Client({ checkUpdate: false });
        client.on("ready", () => {
            console.log(`bot ${index + 1}: ${client.user.tag}`);
            io.emit('bot_status', { index: index + 1, tag: client.user.tag, status: 'online' });
        });
        client.on("error", (e) => console.log(`bot ${index+1} error: ${e.message}`));
        client.login(token).catch((err) => {
            console.log(`bot ${index + 1} login failed: ${err.message}`);
            io.emit('bot_status', { index: index + 1, status: 'failed', tag: err.message });
        });
        clients.push(client);
    });
    io.emit('bots_started', { count: tokens.length });
    startVoiceKeepAlive();
}

function stopBots() {
    isBotRunning = false;
    stopFFmpeg();
    stopLoudMode();
    if (keepAliveInterval) { clearInterval(keepAliveInterval); keepAliveInterval = null; }
    players.forEach(p => { try { p.stop(); } catch(e){} });
    players.clear();
    connections.forEach(c => { try { c.destroy(); } catch(e){} });
    connections.clear();
    activeResources.clear();
    clients.forEach(c => { try { c.destroy(); } catch(e){} });
    clients.length = 0;
    currentUrl = null;
    currentChannelId = null;
    io.emit('bots_stopped');
    console.log("all bots stopped");
}

app.get('/api/status', (req, res) => {
    res.json({
        isRunning: isBotRunning,
        botCount: clients.length,
        currentTitle,
        volume: Math.round(currentVolumeMultiplier * 100),
        isPaused, loopMode, isBassboosted, blastMode, pungiMode, loudMode, superLoudMode, forceLoudMode,
        connected: connections.size > 0
    });
});

app.post('/api/command', async (req, res) => {
    const { command } = req.body;
    if (!command) return res.json({ error: 'no command' });
    const c = command.toLowerCase().trim();
    let response = '';

    try {
        if (c === 'help') {
            response = 'cmds: play <url|yt|mp3>, volume <1-20000>, max, blast, doubleblast, superloud, forceloud, bassboost, pungi, pungiset <n>, loudmode, loop, pause, resume, stop, leave, status';
        }
        else if (c.startsWith('play ')) {
            const url = command.slice(5).trim();
            if (connections.size === 0) { response = 'join a vc first (send channel id)'; }
            else if (isDirectAudio(url)) {
                currentUrl = url; currentTitle = "Direct Audio";
                startFFmpegStream(url);
                response = `playing direct: ${url}`;
            }
            else if (isYouTubeUrl(url)) {
                try {
                    const info = await playdl.video_info(url);
                    const stream = await playdl.stream(url, { quality: 2 });
                    currentUrl = stream.stream.url;
                    currentTitle = info.video_details.title || 'youtube';
                    startFFmpegStream(currentUrl);
                    response = `playing yt: ${currentTitle}`;
                } catch (e) { response = `yt error: ${e.message}`; }
            } else {
                currentUrl = url; currentTitle = "External Stream";
                startFFmpegStream(url);
                response = `playing: ${url}`;
            }
        }
        else if (c === 'stop') { stopFFmpeg(); stopLoudMode(); players.forEach(p => p.stop()); activeResources.clear(); response = 'stopped'; }
        else if (c === 'pause') { players.forEach(p => p.pause()); isPaused = true; response = 'paused'; }
        else if (c === 'resume') { players.forEach(p => p.unpause()); isPaused = false; response = 'resumed'; }
        else if (c === 'leave') {
            stopFFmpeg(); stopLoudMode();
            players.forEach(p => p.stop()); players.clear();
            connections.forEach(x => { try { x.destroy(); } catch(e){} }); connections.clear();
            activeResources.clear(); currentUrl = null; currentChannelId = null;
            response = 'left all vcs';
        }
        else if (c.startsWith('volume ')) {
            const v = parseInt(command.slice(7).trim(), 10);
            if (isNaN(v) || v < 1 || v > 20000) response = 'volume 1-20000';
            else { currentVolumeMultiplier = v / 100; activeResources.forEach(r => r?.volume?.setVolume(currentVolumeMultiplier)); response = `volume ${v}%`; }
        }
        else if (c === 'max') {
            currentVolumeMultiplier = 100.0;
            activeResources.forEach(r => r?.volume?.setVolume(100.0));
            if (currentUrl) startFFmpegStream(currentUrl);
            response = 'max volume 10000%';
        }
        else if (c === 'blast') { blastMode = !blastMode; pungiMode = superLoudMode = forceLoudMode = false; if (currentUrl) startFFmpegStream(currentUrl); response = `blast ${blastMode?'on':'off'}`; }
        else if (c === 'doubleblast') { blastMode = true; blastVolume = 100.0; currentVolumeMultiplier = 100.0; if (currentUrl) startFFmpegStream(currentUrl); response = 'double blast'; }
        else if (c === 'superloud') { superLoudMode = !superLoudMode; if (superLoudMode) { blastMode = pungiMode = forceLoudMode = false; } if (currentUrl) startFFmpegStream(currentUrl); response = `superloud ${superLoudMode?'on':'off'}`; }
        else if (c === 'forceloud') { forceLoudMode = !forceLoudMode; if (forceLoudMode) { blastMode = pungiMode = superLoudMode = false; } if (currentUrl) startFFmpegStream(currentUrl); response = `forceloud ${forceLoudMode?'on':'off'}`; }
        else if (c === 'bassboost') { isBassboosted = !isBassboosted; if (currentUrl) startFFmpegStream(currentUrl); response = `bass ${isBassboosted?'on':'off'}`; }
        else if (c === 'pungi') { pungiMode = !pungiMode; if (pungiMode) { blastMode = superLoudMode = forceLoudMode = false; } if (currentUrl) startFFmpegStream(currentUrl); response = `pungi ${pungiMode?'on':'off'}`; }
        else if (c.startsWith('pungiset ')) { const v = parseFloat(command.slice(9)); if (!isNaN(v) && v>=1 && v<=200) { pungiIntensity = v; if (pungiMode && currentUrl) startFFmpegStream(currentUrl); response = `pungi ${v}x`; } else response = 'pungiset 1-200'; }
        else if (c === 'loudmode') { loudMode = !loudMode; if (loudMode) startLoudMode(); else stopLoudMode(); response = `loudmode ${loudMode?'on':'off'}`; }
        else if (c === 'loop') { loopMode = !loopMode; response = `loop ${loopMode?'on':'off'}`; }
        else if (c === 'status') { response = `now: ${currentTitle}\nbots: ${clients.length}\nvol: ${Math.round(currentVolumeMultiplier*100)}%\nloop: ${loopMode?'on':'off'}`; }
        else if (/^\d{15,25}$/.test(c)) {
            currentChannelId = c;
            let joined = 0;
            for (const [index, client] of clients.entries()) {
                try {
                    const channel = await client.channels.fetch(c);
                    if (!channel || !channel.guild) continue;
                    const conn = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                        selfMute: false,
                        selfDeaf: false,
                        group: client.user.id
                    });
                    const player = createAudioPlayer();
                    conn.subscribe(player);

                    conn.on('stateChange', async (oldS, newS) => {
                        if (newS.status === VoiceConnectionStatus.Disconnected) {
                            try {
                                await Promise.race([
                                    entersState(conn, VoiceConnectionStatus.Signalling, 5000),
                                    entersState(conn, VoiceConnectionStatus.Connecting, 5000),
                                ]);
                            } catch {
                                try { conn.destroy(); } catch(e){}
                                setTimeout(() => {
                                    try {
                                        const nc = joinVoiceChannel({
                                            channelId: channel.id,
                                            guildId: channel.guild.id,
                                            adapterCreator: channel.guild.voiceAdapterCreator,
                                            selfMute: false, selfDeaf: false, group: client.user.id
                                        });
                                        nc.subscribe(players.get(index));
                                        connections.set(index, nc);
                                    } catch(e) { console.log('rejoin fail:', e.message); }
                                }, 3000);
                            }
                        }
                    });

                    player.on(AudioPlayerStatus.Idle, () => {
                        if (loopMode && currentUrl && !isPaused && index === 0) {
                            setTimeout(() => startFFmpegStream(currentUrl), 500);
                        }
                    });

                    connections.set(index, conn);
                    players.set(index, player);
                    joined++;
                } catch (err) {
                    console.log(`bot ${index+1} join error: ${err.message}`);
                }
            }
            response = `joined ${joined}/${clients.length} bots to ${c}`;
        }
        else response = 'unknown cmd. type help';
    } catch (err) {
        response = `error: ${err.message}`;
    }

    io.emit('command_response', { command, response });
    res.json({ response });
});

io.on('connection', (socket) => {
    console.log('dashboard connected');
    socket.emit('status_update', {
        isRunning: isBotRunning,
        botCount: clients.length,
        totalTokens: tokens.length,
        currentTitle,
        volume: Math.round(currentVolumeMultiplier * 100)
    });

    socket.on('start_bots_with_tokens', (data) => {
        const incoming = (data?.tokens || []).map(t => (t || '').trim()).filter(t => t.length > 20);
        if (incoming.length === 0) {
            socket.emit('command_response', { command: 'start', response: 'no valid tokens (must be >20 chars)' });
            return;
        }
        if (isBotRunning) stopBots();
        tokens = incoming;
        console.log(`tokens from dashboard: ${tokens.length}`);
        setTimeout(() => {
            startBots();
            socket.emit('command_response', { command: 'start', response: `starting ${tokens.length} bots` });
        }, 600);
    });

    socket.on('start_bots', () => startBots());
    socket.on('stop_bots', () => stopBots());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`dashboard on ${PORT}`);
});
