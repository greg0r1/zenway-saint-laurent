/* ============================================================
   ADMIN-AUTH — connexion Google et session, partagé par tous les
   modules de l'admin (voir assets/js/admin.js pour la coquille).
   ============================================================ */
const AdminAuth = (function adminAuth() {
  let currentEmail = null;

  function initGoogleButton(onSuccess) {
    // Le script Google est chargé en `async` : sur ce premier appel, il n'a
    // souvent pas fini de charger. Sans cette attente, le bouton ne
    // s'affiche jamais et rien ne le signale.
    if (!window.google || !window.google.accounts) {
      attendreGoogle(onSuccess);
      return;
    }
    rendreBouton(onSuccess);
  }

  function attendreGoogle(onSuccess, tentative = 0) {
    if (window.google && window.google.accounts) {
      rendreBouton(onSuccess);
      return;
    }
    if (tentative >= 100) { // ~10 s
      const loginError = document.getElementById('loginError');
      loginError.textContent = 'La connexion Google n’a pas pu se charger. Rechargez la page.';
      loginError.hidden = false;
      return;
    }
    setTimeout(() => attendreGoogle(onSuccess, tentative + 1), 100);
  }

  function rendreBouton(onSuccess) {
    google.accounts.id.initialize({
      client_id: CONFIG_ADMIN.googleClientId,
      callback: (response) => handleCredentialResponse(response, onSuccess)
    });
    google.accounts.id.renderButton(document.getElementById('gsiButton'), {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      locale: 'fr'
    });
  }

  async function handleCredentialResponse(response, onSuccess) {
    const loginError = document.getElementById('loginError');
    loginError.hidden = true;
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      if (!res.ok) {
        loginError.textContent = res.status === 403
          ? "Ce compte Google n'est pas autorisé à administrer le site."
          : 'Connexion impossible, réessayez.';
        loginError.hidden = false;
        return;
      }
      const data = await res.json();
      currentEmail = data.email;
      onSuccess(data.email);
    } catch {
      loginError.textContent = 'Connexion impossible, réessayez.';
      loginError.hidden = false;
    }
  }

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        currentEmail = data.email;
        return data.email;
      }
    } catch { /* API indisponible : on retombe sur l'écran de connexion */ }
    return null;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    currentEmail = null;
  }

  function getEmail() {
    return currentEmail;
  }

  return { initGoogleButton, checkSession, logout, getEmail };
})();
