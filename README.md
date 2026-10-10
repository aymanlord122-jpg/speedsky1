<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Speed Sky</title>
  <style>
    :root {
      --bg: #071320;
      --card: #101c2d;
      --cyan: #38bdf8;
      --orange: #f97316;
      --green: #22c55e;
      --muted: #94a3b8;
      --text: #f8fafc;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, sans-serif;
      background: linear-gradient(180deg, #071320, #0b1728);
      color: var(--text);
      direction: rtl;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(15, 23, 42, 0.86);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .brand {
      font-weight: 900;
      font-size: 1.1rem;
      color: var(--cyan);
    }

    .badge {
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(34, 197, 94, 0.12);
      color: #86efac;
      font-size: 0.72rem;
      font-weight: 700;
      border: 1px solid rgba(34, 197, 94, 0.25);
    }

    .container {
      max-width: 960px;
      margin: 20px auto;
      padding: 0 16px 32px;
    }

    .panel {
      background: rgba(16, 28, 45, 0.9);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 18px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.24);
    }

    .main-meter {
      display: grid;
      place-items: center;
      min-height: 320px;
      text-align: center;
      background: linear-gradient(180deg, rgba(14, 30, 48, 0.94), rgba(10, 21, 32, 0.94));
      border-radius: 24px;
      margin-top: 14px;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .status { color: var(--muted); font-size: 0.9rem; margin-bottom: 8px; }
    .speed {
      font-size: clamp(2.5rem, 9vw, 5rem);
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.06em;
    }

    .unit { color: var(--muted); font-weight: 700; margin-top: 8px; }

    .stats {
      margin-top: 18px;
      display: grid;
      grid-template-columns: repeat(3, minmax(120px, 1fr));
      gap: 12px;
    }

    .stat {
      background: rgba(255,255,255,0.03);
      border-radius: 18px;
      padding: 14px 12px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .stat-label { color: var(--muted); font-size: 0.7rem; margin-bottom: 8px; }
    .stat-value { font-weight: 800; font-size: 1.2rem; }

    .cta-row {
      margin-top: 16px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    button {
      appearance: none;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      font-weight: 800;
      padding: 14px 20px;
      transition: transform 0.2s ease, opacity 0.2s ease;
      color: white;
    }

    button:hover { transform: translateY(-1px); }
    button:disabled { opacity: 0.7; cursor: wait; }

    .primary {
      background: linear-gradient(135deg, var(--orange), #ff8b3d);
      min-width: 220px;
      flex: 1;
    }

    .secondary {
      background: rgba(56, 189, 248, 0.18);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: var(--cyan);
    }

    .server-box {
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
      padding: 12px 14px;
    }

    .server-meta {
      color: var(--muted);
      font-size: 0.8rem;
    }

    select {
      background: #0f172a;
      color: white;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 10px 12px;
      min-width: 180px;
    }

    @media (max-width: 640px) {
      .stats { grid-template-columns: 1fr; }
      .cta-row { flex-direction: column; }
      .primary, .secondary { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="brand">Speed Sky</div>
    <div class="badge" id="statusBadge">جاهز</div>
  </div>

  <div class="container">
    <div class="panel">
      <div class="server-box">
        <div>
          <div style="font-weight: 800;">الخادم الأقرب</div>
          <div class="server-meta" id="serverLabel">اختيار الخادم...</div>
        </div>
        <select id="serverSelect"></select>
      </div>

      <div class="main-meter">
        <div>
          <div class="status" id="statusText">جاهز للفحص</div>
          <div class="speed" id="speedValue">0.00</div>
          <div class="unit">Mbps</div>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Download</div>
          <div class="stat-value" id="downloadValue">0.00 Mbps</div>
        </div>
        <div class="stat">
          <div class="stat-label">Upload</div>
          <div class="stat-value" id="uploadValue">0.00 Mbps</div>
        </div>
        <div class="stat">
          <div class="stat-label">Ping</div>
          <div class="stat-value" id="pingValue">0 ms</div>
        </div>
      </div>

      <div class="cta-row">
        <button class="primary" id="startBtn">ابدأ الفحص</button>
        <button class="secondary" id="refreshBtn">اختيار أقرب خادم</button>
      </div>
    </div>
  </div>

  <script>
    const state = {
      servers: [],
      activeServer: null,
      initialPing: null,
      running: false,
    };

    const serverSelect = document.getElementById('serverSelect');
    const serverLabel = document.getElementById('serverLabel');
    const statusText = document.getElementById('statusText');
    const speedValue = document.getElementById('speedValue');
    const downloadValue = document.getElementById('downloadValue');
    const uploadValue = document.getElementById('uploadValue');
    const pingValue = document.getElementById('pingValue');
    const startBtn = document.getElementById('startBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const statusBadge = document.getElementById('statusBadge');

    async function loadServers() {
      const res = await fetch('/api/servers');
      const data = await res.json();
      state.servers = data.servers;

      const options = state.servers.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
      serverSelect.innerHTML = options;
      chooseClosestServer();
    }

    async function pingServer(url) {
      const start = performance.now();
      await fetch(`${url}/api/ping?t=${Date.now()}`);
      const elapsed = performance.now() - start;
      return Math.round(elapsed);
    }

    async function chooseClosestServer() {
      const results = [];
      for (const server of state.servers) {
        try {
          const latency = await pingServer(server.url);
          results.push({ ...server, latency });
        } catch (_) {
          results.push({ ...server, latency: 9999 });
        }
      }

      results.sort((a, b) => a.latency - b.latency);
      const nearest = results[0];
      state.activeServer = nearest;
      state.initialPing = nearest.latency;
      serverSelect.value = nearest.id;
      serverLabel.textContent = `${nearest.name} • ${nearest.latency} ms`;
      statusBadge.textContent = 'أقرب خادم';
      pingValue.textContent = `${nearest.latency} ms`;
      statusText.textContent = 'جاهز للفحص';
    }

    async function runDownloadTest() {
      const sizeMb = 8;
      const start = performance.now();
      const res = await fetch(`${state.activeServer.url}/api/download-test?size=${sizeMb}&t=${Date.now()}`);
      const blob = await res.blob();
      const elapsed = (performance.now() - start) / 1000;
      const bytes = blob.size;
      const mbps = ((bytes / 1024 / 1024) / elapsed) * 8;
      return Number(mbps.toFixed(2));
    }

    async function runUploadTest() {
      const payload = new Blob([new Uint8Array(8 * 1024 * 1024)], { type: 'application/octet-stream' });
      const start = performance.now();
      await fetch(`${state.activeServer.url}/api/upload-test`, {
        method: 'POST',
        body: payload,
      });
      const elapsed = (performance.now() - start) / 1000;
      const bytes = payload.size;
      const mbps = ((bytes / 1024 / 1024) / elapsed) * 8;
      return Number(mbps.toFixed(2));
    }

    async function runSpeedTest() {
      if (state.running) return;
      state.running = true;
      startBtn.disabled = true;
      statusBadge.textContent = 'جارٍ فحص...';
      statusText.textContent = 'جاري قياس التنزيل...';
      speedValue.textContent = '0.00';

      try {
        const downloadMbps = await runDownloadTest();
        statusText.textContent = 'جاري قياس الرفع...';
        const uploadMbps = await runUploadTest();
        const ping = state.initialPing ?? 0;

        downloadValue.textContent = `${downloadMbps.toFixed(2)} Mbps`;
        uploadValue.textContent = `${uploadMbps.toFixed(2)} Mbps`;
        pingValue.textContent = `${ping} ms`;
        speedValue.textContent = downloadMbps.toFixed(2);
        statusText.textContent = 'اكتمل الفحص';
        statusBadge.textContent = 'تم';
      } catch (error) {
        statusText.textContent = 'تعذّر الاختبار';
        statusBadge.textContent = 'خطأ';
      } finally {
        state.running = false;
        startBtn.disabled = false;
      }
    }

    serverSelect.addEventListener('change', async () => {
      const selected = state.servers.find((s) => s.id === serverSelect.value);
      if (!selected) return;
      state.activeServer = selected;
      state.initialPing = await pingServer(selected.url);
      serverLabel.textContent = `${selected.name} • ${state.initialPing} ms`;
      pingValue.textContent = `${state.initialPing} ms`;
    });

    startBtn.addEventListener('click', runSpeedTest);
    refreshBtn.addEventListener('click', chooseClosestServer);

    loadServers();
  </script>
</body>
</html>
