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

      .view[hidden] {
        display: none !important;
      }

      .dashboard {
        display: grid;
        gap: 18px;
      }

      .dashboard-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .dashboard-title {
        margin: 0;
        font-size: 1.5rem;
      }

      .dashboard-subtitle {
        margin: 8px 0 0;
        color: var(--ink-2);
        line-height: 1.5;
      }

      .ghost-button {
        min-width: 120px;
        background: #eef5ff;
        color: #0c4d9a;
        border: 1px solid rgba(31, 122, 224, 0.16);
      }

      .profile-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .profile-card {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: #fff;
        padding: 14px;
      }

      .profile-label {
        margin: 0 0 8px;
        font-size: 12px;
        font-weight: 800;
        color: #5a7192;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .profile-value {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: #14345d;
        word-break: break-word;
      }

      .section-title {
        margin: 0 0 12px;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #4b739a;
      }

      .patient-list {
        display: grid;
        gap: 10px;
      }

      .patient-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: #fff;
        padding: 14px 16px;
        cursor: pointer;
        transition: box-shadow 0.15s, border-color 0.15s;
        text-align: left;
      }

      .patient-card:hover {
        border-color: #7bb8f5;
        box-shadow: 0 4px 16px rgba(17, 90, 180, 0.10);
      }

      .patient-avatar {
        width: 38px;
        height: 38px;
        border-radius: 999px;
        background: linear-gradient(135deg, #c3deff, #eaf4ff);
        color: #1a5fb0;
        font-weight: 800;
        font-size: 15px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .patient-info {
        flex: 1;
        min-width: 0;
      }

      .patient-name {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: var(--ink-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .patient-email {
        margin: 2px 0 0;
        font-size: 12px;
        color: var(--ink-2);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .patient-stats {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
      }

      .stat {
        text-align: center;
      }

      .stat-value {
        display: block;
        font-size: 15px;
        font-weight: 800;
        color: var(--accent);
      }

      .stat-label {
        font-size: 10px;
        color: #7a96ba;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .empty-state {
        text-align: center;
        padding: 24px;
        color: var(--ink-2);
        font-size: 14px;
        border: 1px dashed var(--line);
        border-radius: 14px;
      }

      .checkin-panel {
        display: none;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: #f9fcff;
        padding: 16px;
        gap: 10px;
        flex-direction: column;
      }

      .checkin-panel.open {
        display: flex;
      }

      .checkin-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .checkin-panel-title {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: var(--ink-1);
      }

      .back-btn {
        height: 32px;
        min-width: 80px;
        background: #eef5ff;
        color: #0c4d9a;
        border: 1px solid rgba(31,122,224,0.16);
        font-size: 13px;
        border-radius: 8px;
      }

      .checkin-list {
        display: grid;
        gap: 8px;
        max-height: 340px;
        overflow-y: auto;
      }

      .checkin-item {
        border: 1px solid var(--line);
        border-radius: 10px;
        background: #fff;
        padding: 10px 12px;
      }

      .checkin-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 6px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: #e8f2ff;
        color: #1a4d8a;
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 700;
      }

      .chip.bad {
        background: #fff0ef;
        color: #b03020;
      }

      .chip.ok {
        background: #edfff4;
        color: #1a7a45;
      }

      .checkin-date {
        font-size: 11px;
        color: #8ba4c0;
        margin-left: auto;
      }

      .checkin-notes {
        font-size: 12px;
        color: #334e6b;
        line-height: 1.5;
        margin: 0;
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

        .dashboard-header {
          flex-direction: column;
        }

        .profile-grid {
          grid-template-columns: 1fr;
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
        <section id="login-view" class="view">
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
        </section>

        <section id="dashboard-view" class="view dashboard" hidden>
          <div class="dashboard-header">
            <div>
              <h2 id="dashboard-title" class="dashboard-title">Portal do Psicólogo</h2>
              <p id="dashboard-subtitle" class="dashboard-subtitle">Sessão ativa.</p>
            </div>
            <button id="logout-btn" class="ghost-button" type="button">Sair</button>
          </div>

          <div class="profile-grid">
            <article class="profile-card">
              <p class="profile-label">E-mail</p>
              <p id="profile-email" class="profile-value">-</p>
            </article>
            <article class="profile-card">
              <p class="profile-label">Registro Profissional</p>
              <p id="profile-registro" class="profile-value">-</p>
            </article>
            <article class="profile-card">
              <p class="profile-label">Especialidade</p>
              <p id="profile-especialidade" class="profile-value">-</p>
            </article>
            <article class="profile-card">
              <p class="profile-label">Telefone</p>
              <p id="profile-telefone" class="profile-value">-</p>
            </article>
          </div>

          <div>
            <p class="section-title">Pacientes Vinculados</p>
            <div id="patient-list" class="patient-list">
              <div class="empty-state">Carregando...</div>
            </div>
          </div>

          <div id="checkin-panel" class="checkin-panel">
            <div class="checkin-panel-header">
              <h3 id="checkin-panel-title" class="checkin-panel-title">Check-ins</h3>
              <button id="back-btn" class="back-btn" type="button">← Voltar</button>
            </div>
            <div id="checkin-list" class="checkin-list">
              <div class="empty-state">Carregando...</div>
            </div>
          </div>
        </section>

        <p id="api-hint" class="api"></p>
      </section>
    </main>

    <script>
      const API_BASE = ${JSON.stringify(API_BASE)};
      const form = document.getElementById('psi-login-form');
      const submitBtn = document.getElementById('submit-btn');
      const result = document.getElementById('result');
      const loginView = document.getElementById('login-view');
      const dashboardView = document.getElementById('dashboard-view');
      const apiHint = document.getElementById('api-hint');
      const passwordInput = document.getElementById('password');
      const passwordToggle = document.getElementById('password-toggle');
      const passwordToggleIcon = document.getElementById('password-toggle-icon');
      const logoutBtn = document.getElementById('logout-btn');
      const dashboardTitle = document.getElementById('dashboard-title');
      const dashboardSubtitle = document.getElementById('dashboard-subtitle');
      const profileEmail = document.getElementById('profile-email');
      const profileRegistro = document.getElementById('profile-registro');
      const profileEspecialidade = document.getElementById('profile-especialidade');
      const profileTelefone = document.getElementById('profile-telefone');
      const patientListEl = document.getElementById('patient-list');
      const checkinPanel = document.getElementById('checkin-panel');
      const checkinPanelTitle = document.getElementById('checkin-panel-title');
      const checkinListEl = document.getElementById('checkin-list');
      const backBtn = document.getElementById('back-btn');
      const SESSION_KEYS = {
        access: 'psi_access_token',
        refresh: 'psi_refresh_token',
        email: 'psi_last_email',
      };

      apiHint.textContent = 'API via proxy interno: /api (upstream: ' + API_BASE + ')';

      function setView(viewName) {
        const isDashboard = viewName === 'dashboard';
        loginView.hidden = isDashboard;
        dashboardView.hidden = !isDashboard;
        history.replaceState(null, '', isDashboard ? '#dashboard' : '#login');
      }

      function setResult(type, message) {
        result.className = type ? 'result ' + type : 'result';
        result.textContent = message || '';
      }

      function storeSession(accessToken, refreshToken, email) {
        if (accessToken) {
          localStorage.setItem(SESSION_KEYS.access, accessToken);
        }
        if (refreshToken) {
          localStorage.setItem(SESSION_KEYS.refresh, refreshToken);
        }
        if (email) {
          localStorage.setItem(SESSION_KEYS.email, email);
        }
      }

      function clearSession() {
        localStorage.removeItem(SESSION_KEYS.access);
        localStorage.removeItem(SESSION_KEYS.refresh);
      }

      function getAccessToken() {
        return localStorage.getItem(SESSION_KEYS.access) || '';
      }

      function getRefreshToken() {
        return localStorage.getItem(SESSION_KEYS.refresh) || '';
      }

      const CLIMA_EMOJI = { ensolarado: '☀️', nublado: '☁️', tempestuoso: '⛈️', neblina: '🌫️' };

      function formatDate(iso) {
        if (!iso) return '-';
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      }

      function avatarLetter(p) {
        return ((p.first_name || p.email || '?')[0]).toUpperCase();
      }

      function fillDashboard(data) {
        const displayName = data.first_name || data.email || 'Psicólogo';
        dashboardTitle.textContent = 'Olá, ' + displayName;
        dashboardSubtitle.textContent = 'Sessão ativa. Bem-vindo ao portal clínico.';
        profileEmail.textContent = data.email || '-';
        profileRegistro.textContent = data.registro_profissional || '-';
        profileEspecialidade.textContent = data.especialidade || 'Não informado';
        profileTelefone.textContent = data.telefone || 'Não informado';
        loadPatients();
      }

      async function loadPatients() {
        patientListEl.innerHTML = '<div class="empty-state">Carregando pacientes...</div>';
        checkinPanel.classList.remove('open');
        try {
          const resp = await fetch('/api/psi/pacientes/', {
            headers: { Authorization: 'Bearer ' + getAccessToken() },
          });
          if (resp.status === 401) {
            const newToken = await refreshAccessToken();
            return loadPatients();
          }
          const data = await resp.json();
          renderPatients(data.pacientes || []);
        } catch (e) {
          patientListEl.innerHTML = '<div class="empty-state">Erro ao carregar pacientes.</div>';
        }
      }

      function renderPatients(patients) {
        if (!patients.length) {
          patientListEl.innerHTML = '<div class="empty-state">Nenhum paciente vinculado ainda. Pacientes que informarem seu registro profissional no app serão vinculados automaticamente.</div>';
          return;
        }
        patientListEl.innerHTML = '';
        patients.forEach((p) => {
          const card = document.createElement('button');
          card.type = 'button';
          card.className = 'patient-card';
          card.innerHTML =
            '<div class="patient-avatar">' + avatarLetter(p) + '</div>' +
            '<div class="patient-info">' +
              '<p class="patient-name">' + (p.first_name || 'Paciente') + '</p>' +
              '<p class="patient-email">' + p.email + '</p>' +
            '</div>' +
            '<div class="patient-stats">' +
              '<div class="stat"><span class="stat-value">' + p.total_checkins + '</span><span class="stat-label">Check-ins</span></div>' +
              '<div class="stat"><span class="stat-value">' + p.streak_dias + '</span><span class="stat-label">Streak</span></div>' +
            '</div>';
          card.addEventListener('click', () => openCheckins(p));
          patientListEl.appendChild(card);
        });
      }

      async function openCheckins(patient) {
        checkinPanel.classList.add('open');
        checkinPanelTitle.textContent = 'Check-ins de ' + (patient.first_name || patient.email);
        checkinListEl.innerHTML = '<div class="empty-state">Carregando...</div>';
        checkinPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        try {
          const resp = await fetch('/api/psi/pacientes/' + patient.id + '/checkins/', {
            headers: { Authorization: 'Bearer ' + getAccessToken() },
          });
          const data = await resp.json();
          renderCheckins(data.checkins || []);
        } catch (e) {
          checkinListEl.innerHTML = '<div class="empty-state">Erro ao carregar check-ins.</div>';
        }
      }

      function renderCheckins(checkins) {
        if (!checkins.length) {
          checkinListEl.innerHTML = '<div class="empty-state">Nenhum check-in registrado ainda.</div>';
          return;
        }
        checkinListEl.innerHTML = '';
        checkins.forEach((ci) => {
          const item = document.createElement('div');
          item.className = 'checkin-item';
          const emoji = CLIMA_EMOJI[ci.clima_interno] || '🌡️';
          const ruido = ci.nivel_ruido >= 7 ? 'bad' : ci.nivel_ruido <= 3 ? 'ok' : '';
          item.innerHTML =
            '<div class="checkin-meta">' +
              '<span class="chip">' + emoji + ' ' + ci.clima_interno + '</span>' +
              '<span class="chip ' + ruido + '">ruído ' + ci.nivel_ruido + '/10</span>' +
              '<span class="chip">auto: ' + ci.auto_eficacia + '/10</span>' +
              '<span class="chip">' + ci.gatilho + '</span>' +
              '<span class="checkin-date">' + formatDate(ci.criado_em) + '</span>' +
            '</div>' +
            (ci.notas ? '<p class="checkin-notes">' + ci.notas + '</p>' : '') +
            (ci.sintomas ? '<p class="checkin-notes" style="color:#7a4030">' + ci.sintomas + '</p>' : '');
          checkinListEl.appendChild(item);
        });
      }

      backBtn.addEventListener('click', () => {
        checkinPanel.classList.remove('open');
      });

      async function refreshAccessToken() {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('Sua sessão expirou. Faça login novamente.');
        }

        const response = await fetch('/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.access) {
          clearSession();
          throw new Error(data.detail || 'Sua sessão expirou. Faça login novamente.');
        }

        storeSession(data.access, data.refresh || refreshToken, localStorage.getItem(SESSION_KEYS.email) || '');
        return data.access;
      }

      async function fetchPsiMe(accessToken, allowRefresh = true) {
        const response = await fetch('/api/psi/me/', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        });

        if (response.status === 401 && allowRefresh) {
          const nextAccessToken = await refreshAccessToken();
          return fetchPsiMe(nextAccessToken, false);
        }

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.detail || 'Falha ao carregar dados do psicólogo.');
        }
        return data;
      }

      async function restoreSession() {
        const cachedEmail = localStorage.getItem(SESSION_KEYS.email) || '';
        if (cachedEmail) {
          document.getElementById('email').value = cachedEmail;
        }

        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        if (!accessToken && !refreshToken) {
          setView('login');
          return;
        }

        submitBtn.disabled = true;
        setResult('', 'Restaurando sessão...');

        try {
          const meData = await fetchPsiMe(accessToken || (await refreshAccessToken()));
          fillDashboard(meData);
          setView('dashboard');
          setResult('', '');
        } catch (error) {
          clearSession();
          setView('login');
          setResult('err', error.message || 'Não foi possível restaurar sua sessão.');
        } finally {
          submitBtn.disabled = false;
        }
      }

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

      logoutBtn.addEventListener('click', () => {
        clearSession();
        dashboardSubtitle.textContent = 'Sessão encerrada.';
        passwordInput.value = '';
        setView('login');
        setResult('', '');
      });

      renderPasswordIcon(false);

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
        setResult('', 'Autenticando...');

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

          storeSession(loginData.access || '', loginData.refresh || '', email);

          const meData = await fetchPsiMe(loginData.access);
          fillDashboard(meData);
          setView('dashboard');
          setResult('ok', 'Login realizado com sucesso.');
        } catch (error) {
          clearSession();
          setView('login');
          setResult('err', error.message || 'Falha ao autenticar no portal psi.');
        } finally {
          submitBtn.disabled = false;
        }
      });

      restoreSession();
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
