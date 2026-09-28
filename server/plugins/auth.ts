import { createAuthPlugin } from "@agent-native/core/server";

const loginHtml = `
<!doctype html>
<html lang="lt">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Prisijungti • Atrinkta</title>
    <style>
      :root {
        --bg: #f7f8f6;
        --panel: #ffffff;
        --ink: #203b40;
        --muted: #5d7377;
        --line: rgba(32,59,64,.12);
        --accent: #2f7f7b;
        --accent-soft: #e4f1ed;
        --shadow: rgba(18, 33, 36, 0.12);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0; min-height: 100vh; display: grid; place-items: center;
        background: radial-gradient(circle at top, #eef7f5 0%, var(--bg) 40%, #f2f1ee 100%);
        font-family: Inter, system-ui, sans-serif; color: var(--ink);
      }
      .shell {
        width: min(92vw, 440px); background: var(--panel); border: 1px solid var(--line);
        border-radius: 28px; box-shadow: 0 18px 50px var(--shadow); padding: 28px 26px 20px;
      }
      .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; font-weight: 700; letter-spacing: -.05em; }
      .mark { display: inline-flex; width: 26px; height: 26px; border-radius: 8px 8px 8px 3px; background: var(--accent); transform: rotate(-8deg); color: white; align-items: center; justify-content: center; }
      .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
      h1 { margin: 0 0 10px; font-size: clamp(2rem, 3vw, 2.4rem); letter-spacing: -.06em; }
      p { margin: 0; color: var(--muted); line-height: 1.5; }
      form { margin-top: 22px; display: grid; gap: 12px; }
      input {
        width: 100%; border-radius: 12px; border: 1px solid var(--line); background: #fbfcfb; color: var(--ink);
        padding: 12px 14px; font-size: 14px; outline: none;
      }
      input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(47,127,123,.12); }
      button {
        margin-top: 6px; border: 0; border-radius: 999px; background: var(--accent); color: white; padding: 12px 16px;
        font-size: 14px; font-weight: 700; cursor: pointer;
      }
      button.secondary {
        background: var(--accent-soft); color: var(--ink); border: 1px solid rgba(47,127,123,.15);
      }
      .swap { margin-top: 14px; display: flex; justify-content: center; gap: 6px; font-size: 13px; color: var(--muted); }
      .swap button { margin: 0; padding: 0; background: transparent; color: var(--accent); font-weight: 700; }
      .error { display: none; margin-top: 14px; border-radius: 12px; background: #fbe9e7; color: #8d3b3a; padding: 10px 12px; font-size: 12px; font-weight: 600; }
      .error.visible { display: block; }
      .note { margin-top: 16px; font-size: 12px; color: var(--muted); }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="brand"><span class="mark">a</span><span>atrinkta.</span></div>
      <div class="eyebrow">Admin access</div>
      <h1 id="title">Prisijungti</h1>
      <p id="copy">Prašome prisijungti prie parduotuvės administravimo srities.</p>
      <form id="authForm">
        <input id="email" type="email" name="email" placeholder="El. paštas" autocomplete="email" required />
        <input id="password" type="password" name="password" placeholder="Slaptažodis" autocomplete="current-password" required />
        <button id="submitBtn" type="submit">Prisijungti</button>
      </form>
      <div class="swap">
        <span>Neturite paskyros?</span>
        <button id="toggleMode" type="button">Sukurti</button>
      </div>
      <div id="error" class="error"></div>
      <div class="note">Naudokite savo el. paštą ir slaptažodį arba užsiregistruokite naujai, jei dar neturite paskyros.</div>
    </div>

    <script>
      const form = document.getElementById('authForm');
      const title = document.getElementById('title');
      const copy = document.getElementById('copy');
      const submitBtn = document.getElementById('submitBtn');
      const toggleMode = document.getElementById('toggleMode');
      const error = document.getElementById('error');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      let mode = 'login';

      function showError(message) {
        error.textContent = message;
        error.classList.add('visible');
      }

      function clearError() {
        error.textContent = '';
        error.classList.remove('visible');
      }

      function setMode(nextMode) {
        mode = nextMode;
        title.textContent = mode === 'login' ? 'Prisijungti' : 'Sukurti paskyrą';
        copy.textContent = mode === 'login'
          ? 'Prašome prisijungti prie parduotuvės administravimo srities.'
          : 'Sukurkite naują admin paskyrą, kad galėtumėte valdyti parduotuvę.';
        submitBtn.textContent = mode === 'login' ? 'Prisijungti' : 'Sukurti paskyrą';
        toggleMode.textContent = mode === 'login' ? 'Sukurti' : 'Prisijungti';
      }

      toggleMode.addEventListener('click', () => {
        clearError();
        setMode(mode === 'login' ? 'register' : 'login');
        emailInput.focus();
      });

      async function postJson(url, payload) {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok || (data && data.error)) {
          throw new Error((data && data.error) || 'Klaida');
        }
        return data;
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearError();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
          if (mode === 'register') {
            const registerResult = await postJson('/_agent-native/auth/register', { email, password });
            if (!(registerResult && registerResult.ok)) {
              throw new Error('Registracija nepavyko.');
            }
            const loginResult = await postJson('/_agent-native/auth/login', { email, password });
            if (!(loginResult && loginResult.ok)) {
              throw new Error('Prisijungimas po registracijos nepavyko.');
            }
          } else {
            const result = await postJson('/_agent-native/auth/login', { email, password });
            if (!(result && result.ok)) {
              throw new Error('Neteisingas el. paštas arba slaptažodis.');
            }
          }
          window.location.replace('/admin');
        } catch (error) {
          showError(error.message || 'Nepavyko prisijungti.');
        }
      });
    </script>
  </body>
</html>
`;

export default createAuthPlugin({
  workspaceAppPublicPaths: ["/", "/login"],
  workspaceAppProtectedPaths: ["/admin"],
  loginHtml,
});
