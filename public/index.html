<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RINTU DASHBOARD</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body {
    font-family: 'Rajdhani', -apple-system, sans-serif;
    background: radial-gradient(ellipse at top, #1a0a2e 0%, #0a0414 60%, #000 100%);
    color: #e0e0e0;
    padding: 18px 14px 60px;
    min-height: 100vh;
    font-size: 15px;
  }
  .logo { text-align: center; margin-bottom: 8px; }
  .logo .flower {
    font-size: 42px;
    background: linear-gradient(135deg, #ff6ec7, #b57cff, #7c4dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
    filter: drop-shadow(0 0 12px #b57cff88);
  }
  h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: 30px;
    letter-spacing: 4px;
    text-align: center;
    background: linear-gradient(90deg, #ff6ec7, #b57cff, #7c4dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px #b57cff66);
    line-height: 1.1;
  }
  .subtitle {
    text-align: center;
    font-size: 12px;
    letter-spacing: 4px;
    color: #8866aa;
    margin-top: 4px;
    text-transform: uppercase;
  }
  .divider {
    height: 2px; width: 60px; margin: 14px auto 20px;
    background: linear-gradient(90deg, transparent, #b57cff, transparent);
    border-radius: 2px;
  }
  .card {
    background: linear-gradient(180deg, #1a1230, #12091f);
    border: 1px solid #2d1f4a;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 14px;
    box-shadow: 0 0 20px #7c4dff22, inset 0 1px 0 #ffffff08;
  }
  .card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    letter-spacing: 3px;
    color: #a688e0;
    margin-bottom: 12px;
    text-transform: uppercase;
  }
  textarea {
    width: 100%;
    min-height: 110px;
    background: #0a0514;
    color: #cbb8ff;
    border: 1px solid #2d1f4a;
    border-radius: 10px;
    padding: 12px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    resize: vertical;
    line-height: 1.5;
  }
  textarea::placeholder { color: #4a3d6b; }
  input[type=text] {
    width: 100%;
    background: #0a0514;
    color: #cbb8ff;
    border: 1px solid #2d1f4a;
    border-radius: 10px;
    padding: 12px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
  }
  input[type=text]::placeholder { color: #4a3d6b; }
  button {
    border: none;
    padding: 12px 18px;
    border-radius: 10px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.15s ease;
    margin: 8px 6px 0 0;
  }
  button:active { transform: scale(0.96); }
  .btn-save { background: linear-gradient(135deg, #ffb340, #ff8c00); color: #1a0a2e; box-shadow: 0 0 16px #ffb34066; }
  .btn-load { background: linear-gradient(135deg, #b57cff, #7c4dff); color: #fff; box-shadow: 0 0 16px #7c4dff66; }
  .btn-start { background: linear-gradient(135deg, #00e676, #00a854); color: #fff; box-shadow: 0 0 18px #00e67666; padding: 12px 24px; }
  .btn-stop { background: linear-gradient(135deg, #ff5252, #d32f2f); color: #fff; box-shadow: 0 0 18px #ff525266; padding: 12px 24px; }
  .btn-send { width: 100%; background: linear-gradient(135deg, #b57cff, #7c4dff); color: #fff; box-shadow: 0 0 18px #7c4dff66; margin-top: 12px; padding: 14px; font-size: 15px; letter-spacing: 2px; }
  .token-info { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
  .pill {
    background: #1f1538; border: 1px solid #2d1f4a; padding: 6px 14px;
    border-radius: 20px; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
  }
  .pill .val { color: #ff6ec7; font-weight: 700; }
  .pill.ok .val { color: #00e676; }
  .status-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; align-items: center; }
  .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px currentColor; margin-right: 4px; }
  .online-dot { background: #00e676; color: #00e676; }
  .offline-dot { background: #ff5252; color: #ff5252; }
  .status-text { font-family: 'Orbitron', sans-serif; letter-spacing: 2px; font-size: 14px; font-weight: 700; }
  .now-playing { background: radial-gradient(ellipse at center, #1a0f2e, #0a0514); border: 1px solid #2d1f4a; border-radius: 12px; padding: 22px 14px; text-align: center; margin-top: 14px; }
  .disc { font-size: 44px; background: linear-gradient(135deg, #b57cff, #7c4dff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 14px #b57cff); display: inline-block; animation: spin 4s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .np-label { font-size: 11px; letter-spacing: 4px; color: #8866aa; margin-top: 8px; text-transform: uppercase; }
  .np-title { font-size: 17px; color: #d9c8ff; font-weight: 600; margin-top: 4px; word-break: break-word; }
  .np-tags { display: flex; justify-content: center; gap: 10px; margin-top: 14px; }
  .tag { background: #1f1538; border: 1px solid #2d1f4a; padding: 6px 16px; border-radius: 8px; font-size: 12px; letter-spacing: 2px; font-weight: 700; color: #8866aa; transition: all 0.2s; }
  .tag.active { background: linear-gradient(135deg, #7c4dff, #b57cff); color: #fff; border-color: #b57cff; box-shadow: 0 0 12px #b57cff88; }
  .cmd-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .cmd-btn { background: #1a1230; border: 1px solid #2d1f4a; border-radius: 10px; padding: 12px 4px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; transition: all 0.15s; margin: 0; }
  .cmd-btn:active { background: #2d1f4a; transform: scale(0.95); }
  .cmd-icon { font-size: 20px; }
  .cmd-label { font-size: 11px; color: #a688e0; letter-spacing: 1px; font-weight: 600; }
  #log { background: #0a0514; border: 1px solid #2d1f4a; border-radius: 10px; padding: 12px; font-family: 'Courier New', monospace; font-size: 12px; max-height: 260px; overflow-y: auto; white-space: pre-wrap; color: #00e676; line-height: 1.6; }
  #log .err { color: #ff5252; }
  #log .info { color: #b57cff; }
  #log .warn { color: #ffb340; }
</style>
</head>
<body>

<div class="logo"><span class="flower">❀</span></div>
<h1>RINTU<br>DASHBOARD</h1>
<div class="subtitle">◆ Discord Self-Bot Controller ◆</div>
<div class="divider"></div>

<div class="card">
  <div class="card-title">🔑 Token Manager</div>
  <textarea id="tokens" placeholder="Paste your Discord user tokens here — one per line"></textarea>
  <div class="token-info">
    <div class="pill">🎫 Tokens: <span class="val" id="token-count">0</span></div>
    <div class="pill ok">✅ Valid: <span class="val" id="token-valid">0</span></div>
  </div>
  <button class="btn-save" onclick="saveTokens()">💾 Save Tokens</button>
  <button class="btn-load" onclick="loadTokens()">📂 Load Saved</button>
</div>

<div class="card">
  <div class="status-row">
    <span class="status-dot offline-dot" id="status-dot"></span>
    <span class="status-text" id="status-text">OFFLINE</span>
    <div class="pill">🤖 <span class="val" id="bot-count">0</span> bots</div>
    <div class="pill">🔊 <span class="val" id="vol-display">100%</span></div>
  </div>
  <button class="btn-start" onclick="startBots()">▶ START</button>
  <button class="btn-stop" onclick="stopBots()">■ STOP</button>

  <div class="now-playing">
    <div class="disc" id="disc">💿</div>
    <div class="np-label">NOW PLAYING</div>
    <div class="np-title" id="np-title">Nothing playing</div>
    <div class="np-tags">
      <div class="tag" id="tag-loop">🔄 LOOP</div>
      <div class="tag" id="tag-loud">🔊 LOUD</div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-title">⚡ Quick Commands</div>
  <div class="cmd-grid">
    <div class="cmd-btn" onclick="sendCmd('stop')"><span class="cmd-icon">⏹️</span><span class="cmd-label">Stop</span></div>
    <div class="cmd-btn" onclick="sendCmd('pause')"><span class="cmd-icon">⏸️</span><span class="cmd-label">Pause</span></div>
    <div class="cmd-btn" onclick="sendCmd('resume')"><span class="cmd-icon">▶️</span><span class="cmd-label">Resume</span></div>
    <div class="cmd-btn" onclick="sendCmd('blast')"><span class="cmd-icon">🔥</span><span class="cmd-label">Blast</span></div>
    <div class="cmd-btn" onclick="sendCmd('doubleblast')"><span class="cmd-icon">💥</span><span class="cmd-label">Double</span></div>
    <div class="cmd-btn" onclick="sendCmd('superloud')"><span class="cmd-icon">🔊</span><span class="cmd-label">Super</span></div>
    <div class="cmd-btn" onclick="sendCmd('forceloud')"><span class="cmd-icon">⚡</span><span class="cmd-label">Force</span></div>
    <div class="cmd-btn" onclick="sendCmd('bassboost')"><span class="cmd-icon">🎵</span><span class="cmd-label">Bass</span></div>
    <div class="cmd-btn" onclick="sendCmd('pungi')"><span class="cmd-icon">🐍</span><span class="cmd-label">Pungi</span></div>
    <div class="cmd-btn" onclick="sendCmd('loudmode')"><span class="cmd-icon">📢</span><span class="cmd-label">Loud</span></div>
    <div class="cmd-btn" onclick="sendCmd('loop')"><span class="cmd-icon">🔄</span><span class="cmd-label">Loop</span></div>
    <div class="cmd-btn" onclick="sendCmd('leave')"><span class="cmd-icon">👋</span><span class="cmd-label">Leave</span></div>
    <div class="cmd-btn" onclick="sendCmd('max')"><span class="cmd-icon">💀</span><span class="cmd-label">Max</span></div>
    <div class="cmd-btn" onclick="sendCmd('status')"><span class="cmd-icon">📊</span><span class="cmd-label">Status</span></div>
  </div>
</div>

<div class="card">
  <div class="card-title">⌨️ Custom Command</div>
  <input type="text" id="cmd-input" placeholder="play https://youtube.com/... or channelId or help"
         onkeydown="if(event.key==='Enter') sendCustom()">
  <button class="btn-send" onclick="sendCustom()">Send ✦</button>
</div>

<div class="card">
  <div class="card-title">📜 Activity Log</div>
  <div id="log"></div>
</div>

<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
  const $ = id => document.getElementById(id);

  const log = (msg, cls = '') => {
    const el = $('log');
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
    if (el.children.length > 200) el.removeChild(el.children[0]);
  };

  $('tokens').addEventListener('input', () => {
    const lines = $('tokens').value.split('\n').map(t => t.trim()).filter(t => t.length > 20);
    $('token-count').textContent = lines.length;
    $('token-valid').textContent = lines.length;
  });

  function saveTokens() {
    const val = $('tokens').value;
    localStorage.setItem('rintu_tokens', val);
    log(`tokens saved (${val.split('\n').filter(t => t.trim().length > 20).length})`, 'info');
  }

  function loadTokens() {
    const val = localStorage.getItem('rintu_tokens') || '';
    $('tokens').value = val;
    const count = val.split('\n').filter(t => t.trim().length > 20).length;
    $('token-count').textContent = count;
    $('token-valid').textContent = count;
    log(`loaded ${count} saved tokens`, 'info');
  }

  window.addEventListener('DOMContentLoaded', loadTokens);

  function startBots() {
    const raw = $('tokens').value.trim();
    if (!raw) return log('no tokens', 'err');
    const list = raw.split('\n').map(t => t.trim()).filter(t => t.length > 20);
    if (list.length === 0) return log('no valid tokens', 'err');
    log(`starting ${list.length} bots...`, 'info');
    socket.emit('start_bots_with_tokens', { tokens: list });
  }

  function stopBots() {
    socket.emit('stop_bots');
    log('stop sent', 'warn');
  }

  async function sendCmd(cmd) {
    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      log(`> ${cmd}\n${data.response || data.error}`, data.error ? 'err' : '');
    } catch (e) {
      log(`fetch fail: ${e.message}`, 'err');
    }
  }

  async function sendCustom() {
    const cmd = $('cmd-input').value.trim();
    if (!cmd) return;
    await sendCmd(cmd);
    $('cmd-input').value = '';
  }

  socket.on('connect', () => {
    log('connected', 'info');
    $('status-dot').className = 'status-dot online-dot';
    $('status-text').textContent = 'CONNECTED';
  });

  socket.on('disconnect', () => {
    log('disconnected', 'err');
    $('status-dot').className = 'status-dot offline-dot';
    $('status-text').textContent = 'OFFLINE';
  });

  socket.on('status_update', s => {
    const running = s.isRunning || false;
    $('status-dot').className = 'status-dot ' + (running ? 'online-dot' : 'offline-dot');
    $('status-text').textContent = running ? 'ONLINE' : 'OFFLINE';
    $('bot-count').textContent = s.botCount || s.tokenCount || 0;
    $('vol-display').textContent = (s.volume || 100) + '%';
  });

  socket.on('bot_status', b => {
    log(`bot ${b.index} ${b.status}: ${b.tag || ''}`, 'info');
    $('bot-count').textContent = b.index;
  });

  socket.on('bots_started', d => {
    log(`started ${d.count} bots`, 'info');
    $('status-dot').className = 'status-dot online-dot';
    $('status-text').textContent = 'ONLINE';
    $('bot-count').textContent = d.count;
  });

  socket.on('bots_stopped', () => {
    log('bots stopped', 'warn');
    $('status-dot').className = 'status-dot offline-dot';
    $('status-text').textContent = 'OFFLINE';
    $('bot-count').textContent = 0;
  });

  socket.on('command_response', d => {
    log(`> ${d.command}\n${d.response}`);
  });

  socket.on('audio_update', a => {
    log(`audio ${a.status}: ${a.title} (${a.volume}%)`);
    $('np-title').textContent = a.title || 'nothing';
    $('vol-display').textContent = a.volume + '%';
  });
</script>
</body>
</html>
