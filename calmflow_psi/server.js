const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const API_BASE = process.env.API_URL || 'https://calmflow-production.up.railway.app/api/v1';

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CalmFlow Psi | Login</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: light;
        --bg-top: #dff0ff;
        --bg-bottom: #f7fbff;
        --ink-1: #11233f;
        --ink-2: #455a7a;
        --line: rgba(17, 35, 63, 0.12);
        --card: rgba(255, 255, 255, 0.9);
        --accent: #1f7ae0;
        --accent-2: #0858b7;
        --ok: #0f9d58;
        --err: #c53929;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: 'Archivo', 'Segoe UI', sans-serif;
        background:
          radial-gradient(1200px 520px at 10% -10%, #c4e6ff 0%, transparent 58%),
          radial-gradient(900px 450px at 100% 100%, #d9efff 0%, transparent 52%),
          linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
        color: var(--ink-1);
        display: grid;
        place-items: center;
        padding: 28px;
      }

      .shell {
        width: min(1020px, 100%);
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        border: 1px solid var(--line);
        border-radius: 24px;
        overflow: hidden;
        background: var(--card);
        box-shadow: 0 28px 64px rgba(12, 36, 68, 0.18);
      }

      .left {
        padding: 44px;
        background: linear-gradient(160deg, #f9fcff 0%, #ebf5ff 100%);
        border-right: 1px solid var(--line);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #d6ebff;
        color: #0d447f;
        border-radius: 999px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .title {
        margin: 18px 0 12px;
        font-size: clamp(1.6rem, 2.6vw, 2.2rem);
        font-weight: 800;
        line-height: 1.1;
      }

      .lead {
        margin: 0;
        color: var(--ink-2);
        line-height: 1.6;
      }

      .facts {
        margin-top: 30px;
        display: grid;
        gap: 12px;
      }

      .fact {
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 12px 14px;
        background: #ffffff;
        font-size: 14px;
        color: #204065;
      }

      .right {
        padding: 44px;
      }

      .form-title {
        margin: 0;
        font-size: 1.55rem;
      }

      .form-subtitle {
        margin: 8px 0 0;
        color: var(--ink-2);
      }

      form {
        margin-top: 26px;
        display: grid;
        gap: 14px;
      }

      label {
        display: grid;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #29446b;
      }

      input {
        height: 46px;
        padding: 0 14px;
        border-radius: 12px;
        border: 1px solid var(--line);
        font-size: 15px;
        font-family: inherit;
        color: var(--ink-1);
        background: #fff;
      }

      .password-field {
        position: relative;
      }

      .password-field input {
        width: 100%;
        padding-right: 52px;
      }

      .password-toggle {
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: #4b6285;
        display: grid;
        place-items: center;
        padding: 0;
      }

      .password-toggle:hover {
        background: rgba(31, 122, 224, 0.08);
      }

      .password-toggle:focus-visible {
        outline: 2px solid rgba(31, 122, 224, 0.35);
        outline-offset: 2px;
      }

      .password-toggle svg {
        width: 18px;
        height: 18px;
      }

      input:focus {
        outline: none;
        border-color: #5ea6f4;
        box-shadow: 0 0 0 3px rgba(46, 133, 230, 0.14);
      }

      button {
        height: 48px;
        border: 0;
        border-radius: 12px;
        background: linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%);
        color: #fff;
        font-family: inherit;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.02em;
        cursor: pointer;
      }

      button[disabled] {
        cursor: not-allowed;
        opacity: 0.7;
      }

      .result {
        margin-top: 14px;
        min-height: 22px;
        font-size: 14px;
        font-weight: 600;
      }

      .result.ok {
        color: var(--ok);
      }

      .result.err {
        color: var(--err);
      }

      .me {
        margin-top: 18px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: #fff;
        padding: 12px;
        display: none;
      }

      .me pre {
        margin: 0;
        overflow: auto;
        font-size: 12px;
        color: #1e3554;
      }

      .api {
        margin-top: 20px;
        font-size: 12px;
        color: #516b90;
        word-break: break-all;
      }

      @media (max-width: 880px) {
        .shell {
          grid-template-columns: 1fr;
        }

        .left,
        .right {
          padding: 28px;
        }

        .left {
          border-right: 0;
          border-bottom: 1px solid var(--line);
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="left">
        <span class="badge">Portal Clínico</span>
        <h1 class="title">CalmFlow Psi</h1>
        <p class="lead">Login profissional para psicólogos acompanharem pacientes vinculados, com acesso seguro ao fluxo clínico.</p>

        <div class="facts">
          <div class="fact">Acesso exclusivo para contas com papel de psicólogo.</div>
          <div class="fact">Autenticação via endpoint psi dedicado.</div>
          <div class="fact">Ao logar, o sistema atualiza vínculos automáticos por registro profissional.</div>
        </div>
      </section>

      <section class="right">
        <h2 class="form-title">Entrar como Psicólogo</h2>
        <p class="form-subtitle">Use seu email profissional e senha cadastrada.</p>

        <form id="psi-login-form">
          <label>
            E-mail
            <input id="email" type="email" placeholder="psicologo@dominio.com" autocomplete="email" required />
          </label>

          <label>
            Senha
            <div class="password-field">
              <input id="password" type="password" placeholder="********" autocomplete="current-password" required />
              <button id="password-toggle" class="password-toggle" type="button" aria-label="Mostrar senha" aria-pressed="false">
                <svg id="password-toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
                </svg>
              </button>
            </div>
          </label>

          <button id="submit-btn" type="submit">Entrar no portal</button>
        </form>

        <div id="result" class="result"></div>

        <section id="me-card" class="me">
          <pre id="me-content"></pre>
        </section>

        <p id="api-hint" class="api"></p>
      </section>
    </main>

    <script>
      const API_BASE = ${JSON.stringify(API_BASE)};
      const form = document.getElementById('psi-login-form');
      const submitBtn = document.getElementById('submit-btn');
      const result = document.getElementById('result');
      const meCard = document.getElementById('me-card');
      const meContent = document.getElementById('me-content');
      const apiHint = document.getElementById('api-hint');
      const passwordInput = document.getElementById('password');
      const passwordToggle = document.getElementById('password-toggle');
      const passwordToggleIcon = document.getElementById('password-toggle-icon');

      apiHint.textContent = 'API via proxy interno: /api (upstream: ' + API_BASE + ')';

      function renderPasswordIcon(isVisible) {
        if (isVisible) {
          passwordToggleIcon.innerHTML = '<path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.6 10.7A3 3 0 0 0 13.3 13.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.9 5.1A11.4 11.4 0 0 1 12 5c6.5 0 10 7 10 7a17.2 17.2 0 0 1-3.4 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.2 6.3C3.8 7.9 2 12 2 12s3.5 7 10 7a9.9 9.9 0 0 0 3.1-.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
          passwordToggle.setAttribute('aria-label', 'Ocultar senha');
          passwordToggle.setAttribute('aria-pressed', 'true');
          return;
        }

        passwordToggleIcon.innerHTML = '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>';
        passwordToggle.setAttribute('aria-label', 'Mostrar senha');
        passwordToggle.setAttribute('aria-pressed', 'false');
      }

      passwordToggle.addEventListener('click', () => {
        const isVisible = passwordInput.type === 'text';
        passwordInput.type = isVisible ? 'password' : 'text';
        renderPasswordIcon(!isVisible);
      });

      renderPasswordIcon(false);

      async function fetchPsiMe(accessToken) {
        const response = await fetch('/api/psi/me/', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.detail || 'Falha ao carregar dados do psicólogo.');
        }
        return data;
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = (document.getElementById('email').value || '').trim().toLowerCase();
        const password = document.getElementById('password').value || '';

        if (!email || !password) {
          result.className = 'result err';
          result.textContent = 'Preencha email e senha.';
          return;
        }

        submitBtn.disabled = true;
        result.className = 'result';
        result.textContent = 'Autenticando...';
        meCard.style.display = 'none';
        meContent.textContent = '';

        try {
          const loginResponse = await fetch('/api/psi/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: email,
              password,
            }),
          });

          const loginData = await loginResponse.json().catch(() => ({}));
          if (!loginResponse.ok) {
            throw new Error(loginData.detail || 'Credenciais inválidas para o portal psi.');
          }

          localStorage.setItem('psi_access_token', loginData.access || '');
          localStorage.setItem('psi_refresh_token', loginData.refresh || '');

          const meData = await fetchPsiMe(loginData.access);
          meCard.style.display = 'block';
          meContent.textContent = JSON.stringify(meData, null, 2);

          result.className = 'result ok';
          result.textContent = 'Login realizado com sucesso.';
        } catch (error) {
          result.className = 'result err';
          result.textContent = error.message || 'Falha ao autenticar no portal psi.';
        } finally {
          submitBtn.disabled = false;
        }
      });
    </script>
  </body>
</html>`;

function sanitizeProxyHeaders(headers) {
  const blocked = new Set([
    'host',
    'connection',
    'content-length',
    'transfer-encoding',
    'accept-encoding',
  ]);

  const clean = {};
  Object.entries(headers || {}).forEach(([key, value]) => {
    const name = String(key || '').toLowerCase();
    if (!blocked.has(name)) {
      clean[key] = value;
    }
  });
  return clean;
}

function proxyApiRequest(req, res) {
  const upstreamPath = req.url.replace(/^\/api/, '') || '/';
  const targetUrl = new URL(API_BASE + upstreamPath);
  const transport = targetUrl.protocol === 'https:' ? https : http;

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('error', () => {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ detail: 'Falha ao ler requisição.' }));
  });

  req.on('end', () => {
    const bodyBuffer = Buffer.concat(chunks);
    const proxyReq = transport.request(
      {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers: {
          ...sanitizeProxyHeaders(req.headers),
          'Content-Length': bodyBuffer.length,
        },
      },
      (proxyRes) => {
        const responseHeaders = sanitizeProxyHeaders(proxyRes.headers);
        res.writeHead(proxyRes.statusCode || 502, responseHeaders);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ detail: 'Falha ao conectar com a API CalmFlow.' }));
    });

    if (bodyBuffer.length > 0) {
      proxyReq.write(bodyBuffer);
    }
    proxyReq.end();
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'calmflow_psi' }));
    return;
  }

  if (req.url.startsWith('/api/')) {
    proxyApiRequest(req, res);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, HOST, () => {
  console.log(`CalmFlow PSI a correr na porta ${PORT}`);
});
