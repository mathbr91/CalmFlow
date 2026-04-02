const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CalmFlow Psi</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: "Segoe UI", "Helvetica Neue", sans-serif;
        background: radial-gradient(circle at top, #f0f9ff 0%, #e0f2fe 35%, #dbeafe 100%);
        color: #0f172a;
      }
      main {
        width: min(680px, 92vw);
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 18px;
        padding: 28px;
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
      }
      h1 {
        margin: 0 0 12px;
        font-size: 1.8rem;
      }
      p {
        margin: 0;
        line-height: 1.55;
      }
      .tag {
        display: inline-block;
        margin-top: 14px;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #0c4a6e;
        background: #bae6fd;
        border-radius: 999px;
        padding: 6px 10px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>CalmFlow Psi</h1>
      <p>Deploy inicial ativo no Railway. O portal web do psicólogo está em fase de construção.</p>
      <span class="tag">MVP bootstrap</span>
    </main>
  </body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'calmflow_psi' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, HOST, () => {
  console.log(`CalmFlow PSI a correr na porta ${PORT}`);
});
