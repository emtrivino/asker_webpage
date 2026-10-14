(() => {
  const key = 'asym-media-consent-v1';
  let allowed = null;
  let pendingVideo;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && saved.expires > Date.now() && typeof saved.allowed === 'boolean') allowed = saved.allowed;
  } catch (_) { /* The choice still works for this visit when storage is unavailable. */ }

  const dialog = document.createElement('aside');
  dialog.className = 'cookie-dialog';
  dialog.hidden = true;
  dialog.setAttribute('aria-labelledby', 'cookie-title');
  dialog.setAttribute('aria-describedby', 'cookie-description');
  dialog.innerHTML = `<button class="cookie-close" type="button" aria-label="Lukk cookievarsel">×</button><h2 id="cookie-title">Informasjonskapsler</h2>
    <p id="cookie-description">Ingen analyse- eller reklamecookies. Godta for å spille YouTube-videoer, eller fortsett uten.</p>
    <a href="/personvern.html">Les om personvern</a>
    <div class="cookie-actions"><button type="button" data-cookie-choice="reject">Avslå</button><button type="button" data-cookie-choice="accept">Godta</button></div>`;
  document.body.append(dialog);

  function open() {
    dialog.hidden = false;
  }
  function dismiss() {
    dialog.hidden = true;
    pendingVideo = null;
  }
  function choose(value) {
    allowed = value;
    try { localStorage.setItem(key, JSON.stringify({allowed:value, expires:Date.now() + 180 * 86400000})); } catch (_) {}
    dialog.hidden = true;
    window.dispatchEvent(new CustomEvent('asym-cookie-change', {detail:{allowed:value}}));
    const play = pendingVideo;
    pendingVideo = null;
    if (value && play) play();
  }
  dialog.querySelector('[data-cookie-choice="reject"]').addEventListener('click', () => choose(false));
  dialog.querySelector('[data-cookie-choice="accept"]').addEventListener('click', () => choose(true));
  dialog.querySelector('.cookie-close').addEventListener('click', dismiss);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { dismiss(); preferences.focus({preventScroll:true}); }
  });
  const preferences = document.createElement('button');
  preferences.type = 'button';
  preferences.className = 'cookie-preferences';
  preferences.textContent = 'Informasjonskapsler';
  preferences.addEventListener('click', open);
  (document.querySelector('.footer-links') || document.querySelector('.site-footer')).append(preferences);
  window.asymCookies = {
    requestVideo(play) { if (allowed === true) play(); else { pendingVideo = play; open(); } }
  };
  if (allowed === null) open();
})();
