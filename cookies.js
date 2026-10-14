(() => {
  const key = 'asym-media-consent-v1';
  let allowed = null;
  let pendingVideo;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && saved.expires > Date.now() && typeof saved.allowed === 'boolean') allowed = saved.allowed;
  } catch (_) { /* The choice still works for this visit when storage is unavailable. */ }

  const dialog = document.createElement('dialog');
  dialog.className = 'cookie-dialog';
  dialog.setAttribute('aria-labelledby', 'cookie-title');
  dialog.setAttribute('aria-describedby', 'cookie-description');
  dialog.innerHTML = `<h2 id="cookie-title">Informasjonskapsler</h2>
    <p id="cookie-description">Vi bruker ikke analyse- eller reklamecookies. YouTube-videoer kan bruke informasjonskapsler og behandle opplysninger om deg. Godta for å spille videoer på nettstedet.</p>
    <a href="/personvern.html">Les om personvern</a>
    <div class="cookie-actions"><button type="button" data-cookie-choice="reject">Avslå</button><button type="button" data-cookie-choice="accept">Godta</button></div>`;
  document.body.append(dialog);

  function open() {
    if (!dialog.open) dialog.showModal();
  }
  function choose(value) {
    allowed = value;
    try { localStorage.setItem(key, JSON.stringify({allowed:value, expires:Date.now() + 180 * 86400000})); } catch (_) {}
    dialog.close();
    window.dispatchEvent(new CustomEvent('asym-cookie-change', {detail:{allowed:value}}));
    const play = pendingVideo;
    pendingVideo = null;
    if (value && play) play();
  }
  dialog.querySelector('[data-cookie-choice="reject"]').addEventListener('click', () => choose(false));
  dialog.querySelector('[data-cookie-choice="accept"]').addEventListener('click', () => choose(true));
  dialog.addEventListener('cancel', event => { event.preventDefault(); choose(false); });
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
