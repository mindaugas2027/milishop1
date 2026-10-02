import { createAuthPlugin } from "@agent-native/core/server";
import { signInJourneyInlineScript } from "@agent-native/core/shared";
import { getSupabaseAdminSession } from "../lib/supabase-admin-auth";

const loginHtml = `
<!doctype html>
<html lang="lt">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Administratoriaus prisijungimas — Milishop</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #203b40; background: #f7f8f6; }
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 50% 0%, #e4f1ed 0, #f7f8f6 44%, #f1f2ef 100%); }
      main { width: min(100%, 420px); border: 1px solid rgb(32 59 64 / .1); border-radius: 24px; background: white; padding: 30px; box-shadow: 0 20px 60px rgb(32 59 64 / .12); }
      .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; font-size: 17px; font-weight: 700; }
      .mark { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 9px; background: #2f7f7b; color: white; }
      .eyebrow { margin: 0 0 8px; color: #398b86; font-size: 11px; font-weight: 700; text-transform: uppercase; }
      h1 { margin: 0; font-size: 30px; line-height: 1.1; }
      p { margin: 10px 0 0; color: #617478; font-size: 14px; line-height: 1.5; }
      form { display: grid; gap: 14px; margin-top: 24px; }
      label { display: grid; gap: 7px; color: #40575b; font-size: 13px; font-weight: 600; }
      input { width: 100%; border: 1px solid rgb(32 59 64 / .16); border-radius: 10px; background: #fbfcfb; padding: 12px 13px; color: #203b40; font: inherit; outline: none; }
      input:focus { border-color: #2f7f7b; box-shadow: 0 0 0 3px rgb(47 127 123 / .14); }
      button { min-height: 44px; border: 0; border-radius: 999px; background: #2f7f7b; color: white; font: inherit; font-size: 14px; font-weight: 700; cursor: pointer; }
      button:disabled { cursor: wait; opacity: .65; }
      #error { display: none; border-radius: 10px; background: #fbe9e7; padding: 10px 12px; color: #8d3b3a; font-size: 13px; }
      #error.visible { display: block; }
      footer { margin-top: 20px; text-align: center; }
      footer a { color: #2f7f7b; font-size: 13px; font-weight: 600; text-decoration: none; }
      footer a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <main>
      <div class="brand"><span class="mark">M</span><span>milishop</span></div>
      <p class="eyebrow">Administratoriaus prieiga</p>
      <h1>Prisijunkite</h1>
      <form id="login-form">
        <label>El. paštas<input id="email" type="email" autocomplete="username" required /></label>
        <label>Slaptažodis<input id="password" type="password" autocomplete="current-password" required /></label>
        <div id="error" role="alert"></div>
        <button id="submit" type="submit">Prisijungti</button>
      </form>
      <footer><a href="/">Grįžti į parduotuvę</a></footer>
    </main>
    <script>${signInJourneyInlineScript()}</script>
    <script>
      const form = document.getElementById('login-form');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const submit = document.getElementById('submit');
      const error = document.getElementById('error');
      const journey = __anCreateSignInJourney('', '/');
      const resumeHref = journey.journeyForLocation(window.location).resumeHref;

      fetch('/_agent-native/auth/session')
        .then((response) => response.json())
        .then((session) => { if (session && session.email) window.location.replace(resumeHref); })
        .catch(() => {});

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        error.textContent = '';
        error.classList.remove('visible');
        submit.disabled = true;
        submit.textContent = 'Jungiama…';

        try {
          const response = await fetch('/api/admin-auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value.trim(), password: password.value }),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.statusMessage || 'Neteisingas el. paštas arba slaptažodis.');
          window.location.replace(resumeHref);
        } catch (loginError) {
          error.textContent = loginError instanceof Error ? loginError.message : 'Prisijungti nepavyko.';
          error.classList.add('visible');
        } finally {
          submit.disabled = false;
          submit.textContent = 'Prisijungti';
        }
      });
    </script>
  </body>
</html>
`;

export default createAuthPlugin({
  getSession: getSupabaseAdminSession,
  trustCustomEmailVerification: true,
  loginHtml,
  publicPaths: [
    "/login",
    "/_agent-native/auth/session",
    "/_agent-native/actions/list-product-landings",
    "/_agent-native/actions/get-product-landing",
    "/_agent-native/actions/create-order",
    "/api/admin-auth/login",
    "/api/admin-auth/logout",
  ],
  workspaceAppAudience: "public",
  workspaceAppPublicPaths: ["/"],
  workspaceAppProtectedPaths: ["/admin"],
});
