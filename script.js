const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
  function setMenu(open, restoreFocus = false) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
    navMenu.classList.toggle('is-open', open);
    if (restoreFocus) navToggle.focus();
  }
  navToggle.addEventListener('click', () => {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  navMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  navMenu.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!document.activeElement.closest('.site-header')) setMenu(false);
    });
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => setMenu(false));
}

// Native dialog provides keyboard focus containment and Escape-to-close.
const gallery = document.querySelector('.gallery-grid');
if (gallery && typeof HTMLDialogElement !== 'undefined') {
  const viewer = document.createElement('dialog');
  viewer.className = 'image-viewer';
  viewer.setAttribute('aria-label', 'Bilder fra konsertscenen');
  viewer.innerHTML = '<button class="viewer-close" type="button" aria-label="Lukk bilde">×</button><img alt=""><p></p>';
  document.body.append(viewer);
  const photo = viewer.querySelector('img');
  const caption = viewer.querySelector('p');
  gallery.querySelectorAll('img').forEach((img) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item';
    button.setAttribute('aria-label', `Forstørr: ${img.alt}`);
    img.replaceWith(button);
    button.append(img);
    button.addEventListener('click', () => {
      photo.src = img.currentSrc || img.src;
      photo.alt = img.alt;
      caption.textContent = img.alt;
      viewer.showModal();
    });
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (event) => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
}

const videoSection = document.querySelector('.video-section');
if (videoSection) {
  const rail = videoSection.querySelector('.video-rail');
  const choices = [...rail.querySelectorAll('.video-choice')];
  const stage = videoSection.querySelector('.video-stage');
  const launchTemplate = stage.querySelector('.video-launch').cloneNode(true);
  const previous = videoSection.querySelector('.video-prev');
  const next = videoSection.querySelector('.video-next');
  const externalLink = videoSection.querySelector('.video-youtube-link');
  let selected = 0;
  videoSection.querySelector('.video-controls').hidden = false;

  function selectVideo(index, focus = false) {
    selected = Math.max(0, Math.min(choices.length - 1, index));
    const choice = choices[selected];
    const { videoId, videoTitle, videoDate } = choice.dataset;
    // Removing the previous frame stops audio when another recording is selected.
    const launch = launchTemplate.cloneNode(true);
    launch.href = choice.href;
    launch.setAttribute('aria-label', `Spill av ${videoTitle}`);
    launch.querySelector('img').src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    stage.replaceChildren(launch);
    videoSection.querySelector('.video-current-title').textContent = videoTitle;
    videoSection.querySelector('.video-current-date').textContent = videoDate;
    videoSection.querySelector('.video-counter').textContent = `${String(selected + 1).padStart(2, '0')} / ${String(choices.length).padStart(2, '0')}`;
    externalLink.href = choice.href;
    choices.forEach((item, i) => {
      item.classList.toggle('is-selected', i === selected);
      item.setAttribute('aria-current', String(i === selected));
    });
    previous.disabled = selected === 0;
    next.disabled = selected === choices.length - 1;
    const bounds = rail.getBoundingClientRect();
    const itemBounds = choice.getBoundingClientRect();
    if (itemBounds.left < bounds.left || itemBounds.right > bounds.right) {
      rail.scrollTo({left: rail.scrollLeft + itemBounds.left - bounds.left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
    if (focus) choice.focus({preventScroll: true});
  }

  choices.forEach((choice, index) => {
    choice.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      selectVideo(index);
    });
    choice.addEventListener('keydown', (event) => {
      const target = {ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: choices.length - 1}[event.key];
      if (target === undefined) return;
      event.preventDefault();
      selectVideo(target, true);
    });
  });
  previous.addEventListener('click', () => selectVideo(selected - 1));
  next.addEventListener('click', () => selectVideo(selected + 1));
  stage.addEventListener('click', (event) => {
    if (!event.target.closest('.video-launch') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const choice = choices[selected];
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${choice.dataset.videoId}?autoplay=1&rel=0&playsinline=1`;
    frame.title = choice.dataset.videoTitle;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    stage.replaceChildren(frame);
    frame.focus();
  });
}

const facebookFloat = document.querySelector('[data-facebook-float]');
const facebookClose = document.querySelector('[data-facebook-close]');
if (facebookFloat && facebookClose) {
  facebookClose.addEventListener('click', () => {
    facebookFloat.classList.add('is-dismissed');
  });
}

const heroGallery = document.querySelector('[data-hero-gallery]');
if (heroGallery) {
  const slides = [...heroGallery.querySelectorAll('.hero-gallery-slide')];
  const controls = [...heroGallery.querySelectorAll('.hero-gallery-controls button')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeSlide = 0;
  let rotation;

  function showHeroSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeSlide));
    controls.forEach((control, controlIndex) => {
      const selected = controlIndex === activeSlide;
      control.classList.toggle('is-active', selected);
      control.setAttribute('aria-current', String(selected));
    });
  }

  function startHeroRotation() {
    if (!reducedMotion && slides.length > 1 && !rotation) {
      rotation = window.setInterval(() => showHeroSlide(activeSlide + 1), 6800);
    }
  }

  function stopHeroRotation() {
    window.clearInterval(rotation);
    rotation = undefined;
  }

  controls.forEach((control, index) => control.addEventListener('click', () => {
    showHeroSlide(index);
    stopHeroRotation();
    startHeroRotation();
  }));
  document.addEventListener('visibilitychange', () => document.hidden ? stopHeroRotation() : startHeroRotation());
  startHeroRotation();
}
