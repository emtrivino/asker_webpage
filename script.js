// YouTube rejects some otherwise embeddable recordings when the local preview uses an IP address.
if (window.location.hostname === '127.0.0.1') {
  const localPreview = new URL(window.location.href);
  localPreview.hostname = 'localhost';
  window.location.replace(localPreview.href);
}

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('[data-nav-menu]');

const eventDialog = document.querySelector('#event-dialog');
if (eventDialog && typeof eventDialog.showModal === 'function') {
  const events = {
    hostkonsert: {
      title: 'Høstkonsert i Asker kirke', date: 'Søndag 25. oktober 2026 · kl. 18.00',
      place: 'Asker kirke', image: 'images/hostkonsert-2026.png',
      imageAlt: 'Plakat for høstkonserten 25. oktober',
      description: '<p>Tsjaikovskij og Bruch står på programmet. Tanja Karita Ikonen dirigerer, og Ida Kamilla Andersen er solist.</p><ul><li>Tsjaikovskij: Symfoni nr. 5</li><li>Max Bruch: Fiolinkonsert i G-moll</li><li>Ida Kamilla Andersen, fiolin</li></ul>',
      ticket: 'https://checkout.ebillett.no/359/events/20/purchase/setup'
    },
    'afternoon-tea': {
      title: 'Afternoon Tea i Venskaben', date: '21. november 2026',
      place: 'Venskaben', image: 'images/afternoon-tea-2026-v3.png',
      imageAlt: 'Afternoon Tea i Venskaben',
      description: '<p>Salongorkester, te og kaker i et musikalsk ettermiddagsformat.</p>',
      ticket: 'https://checkout.ebillett.no/359/events/21/purchase'
    },
    opera: {
      title: 'Opera & Operettekveld', date: 'Søndag 29. november 2026 · kl. 18.00',
      place: 'Østenstad kirke', image: 'images/opera-operette-2026.png',
      imageAlt: 'Plakat for Opera & Operettekveld 29. november',
      description: '<p>Opplev kjente opera- og operetteperler i Østenstad kirke – en kveld for både nysgjerrige og erfarne operalyttere.</p><dl class="event-performers"><div><dt>Dirigent</dt><dd>Guro Anstensen Haugli</dd></div><div><dt>Solister</dt><dd>Marit Sehl, Cecilie Cathrine Ødegården og Øystein Skre</dd></div></dl>',
      ticket: 'https://checkout.ebillett.no/359/events/22/purchase/setup'
    },
    'opera-dynamitten': {
      title: 'Opera & Operettekveld i Dynamitten', date: 'Søndag 6. desember 2026',
      place: 'Dynamitten, Sætre', image: 'images/opera-dynamitten-2026.png',
      imageAlt: 'Plakat for opera- og operettekvelden i Dynamitten, med arkivfoto av orkesteret',
      description: '<p>Den andre av orkesterets to opera- og operettekvelder, denne gangen i Dynamitten i Sætre. Programmet er et utvalg fra opera- og operettelitteraturen.</p><dl class="event-performers"><div><dt>Dirigent</dt><dd>Guro Anstensen Haugli</dd></div><div><dt>Solister</dt><dd>Øystein Skre (bass), Marit Sehl (mezzosopran) og Cecilie Cathrine Ødegården (sopran)</dd></div></dl><p>Klokkeslett og billettinformasjon kommer.</p>'
    },
    varkonsert: {
      title: 'Vårkonsert i Asker kirke', date: 'Søndag 7. mars 2027',
      place: 'Asker kirke', image: 'images/varkonsert-2027.png',
      imageAlt: 'Plakat for vårkonserten med arkivfoto av pianist og orkester',
      description: '<p>Beethovens trippelkonsert står på programmet med studenter fra Barratt Due. Eldar Nilsen dirigerer.</p><p>Konserten markerer Barratt Dues 100-årsjubileum og 200 år siden Beethovens død. Øvrig program, klokkeslett og billettinformasjon kommer.</p>'
    },
    bratsjfestival: {
      title: 'Konsert under bratsjfestivalen', date: 'Tirsdag 1. juni 2027',
      place: 'Asker kirke', image: 'images/bratsjfestival-2027.png',
      imageAlt: 'Plakat for bratsjfestivalen med arkivfoto av orkesteret',
      description: '<p>Asker symfoniorkester samarbeider med Povilas Syrrist-Gelgota og hans bratsjfestival om en konsert i Asker kirke.</p><p>Program, dirigent, klokkeslett og billettinformasjon kommer.</p>'
    }
  };
  document.querySelectorAll('[data-event]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = events[button.dataset.event];
      if (!item) return;
      const image = eventDialog.querySelector('.event-dialog-image');
      image.src = item.image;
      image.alt = item.imageAlt;
      eventDialog.querySelector('.event-dialog-media-backdrop').src = item.image;
      eventDialog.querySelector('#event-dialog-title').textContent = item.title;
      eventDialog.querySelector('.event-dialog-date').textContent = item.date;
      eventDialog.querySelector('.event-dialog-place').textContent = item.place;
      eventDialog.querySelector('.event-dialog-description').innerHTML = item.description;
      const ticketLink = eventDialog.querySelector('.event-dialog-ticket');
      ticketLink.closest('.event-dialog-footer').hidden = !item.ticket;
      if (item.ticket) ticketLink.href = item.ticket;
      else ticketLink.removeAttribute('href');
      eventDialog.showModal();
    });
  });
  eventDialog.querySelector('.event-dialog-close').addEventListener('click', () => eventDialog.close());
  eventDialog.addEventListener('click', (event) => {
    if (event.target === eventDialog) eventDialog.close();
  });
}

const concertCarousel = document.querySelector('.upcoming-carousel');
if (concertCarousel) {
  const track = concertCarousel.querySelector('.upcoming-grid');
  const cards = [...track.children];
  const count = document.querySelector('.upcoming-carousel-count');
  const progress = document.querySelector('.upcoming-carousel-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panel = concertCarousel.closest('.upcoming-panel');
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const nextConcert = cards.findIndex((card) => card.querySelector('time')?.dateTime.slice(0, 10) >= todayKey);
  let firstIndex = nextConcert < 0 ? 0 : nextConcert;
  let moving = false;
  let pointerStart = null;
  let dragWidth = 0;
  let queuedTarget = null;
  let autoplayTimer;
  let inView = false;

  for (let index = 0; index < firstIndex; index++) track.append(track.firstElementChild);

  cards.forEach((card) => { card.querySelector('img').draggable = false; });
  cards.forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Vis ${card.querySelector('h3').textContent}`);
    button.addEventListener('click', (event) => {
      goTo(index);
      if (event.detail > 0) button.blur();
    });
    progress.append(button);
  });

  const visibleCount = () => window.innerWidth <= 760 ? 1 : window.innerWidth <= 1000 ? 2 : 3;
  const stepWidth = () => track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);

  function updateVisible() {
    const visible = visibleCount();
    [...track.children].forEach((card, index) => {
      card.inert = index >= visible;
      card.setAttribute('aria-hidden', String(index >= visible));
    });
    count.textContent = `Konsert ${firstIndex + 1} av ${cards.length} er først i visningen`;
    [...progress.children].forEach((button, index) => {
      button.classList.toggle('is-active', index === firstIndex);
      if (index === firstIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  function beginDrag() {
    if (moving || pointerStart || cards.length <= visibleCount()) return false;
    dragWidth = stepWidth();
    track.prepend(track.lastElementChild);
    track.style.transition = 'none';
    track.style.transform = `translateX(-${dragWidth}px)`;
    concertCarousel.classList.add('is-dragging');
    return true;
  }

  function settle(direction) {
    moving = true;
    pointerStart = null;
    concertCarousel.classList.remove('is-dragging');
    const duration = reducedMotion.matches ? 0 : 360;
    track.style.transition = `transform ${duration}ms cubic-bezier(.25,.75,.25,1)`;
    track.style.transform = `translateX(${-dragWidth * (direction + 1)}px)`;
    window.setTimeout(() => {
      track.style.transition = 'none';
      if (direction > 0) {
        track.append(track.firstElementChild);
        track.append(track.firstElementChild);
      } else if (direction === 0) {
        track.append(track.firstElementChild);
      }
      track.style.transform = 'translateX(0)';
      firstIndex = (firstIndex + direction + cards.length) % cards.length;
      moving = false;
      updateVisible();
      if (queuedTarget !== null) requestAnimationFrame(advanceToTarget);
    }, duration + 20);
  }

  function move(direction) {
    if (!beginDrag()) return false;
    track.offsetWidth;
    settle(direction);
    return true;
  }

  function advanceToTarget() {
    if (queuedTarget === null || moving || pointerStart) return;
    if (queuedTarget === firstIndex) {
      queuedTarget = null;
      return;
    }
    const forward = (queuedTarget - firstIndex + cards.length) % cards.length;
    move(forward <= cards.length / 2 ? 1 : -1);
  }

  function goTo(index) {
    queuedTarget = index;
    scheduleAutoplay();
    advanceToTarget();
  }

  function scheduleAutoplay() {
    window.clearTimeout(autoplayTimer);
    if (reducedMotion.matches || !inView || document.hidden) return;
    autoplayTimer = window.setTimeout(() => {
      if (!eventDialog?.open && !(panel.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) && !moving && !pointerStart && queuedTarget === null) {
        move(1);
      }
      scheduleAutoplay();
    }, 6000);
  }

  concertCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      queuedTarget = null;
      move(event.key === 'ArrowRight' ? 1 : -1);
      scheduleAutoplay();
    }
  });
  concertCarousel.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, a')) return;
    queuedTarget = null;
    if (!beginDrag()) return;
    scheduleAutoplay();
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    concertCarousel.setPointerCapture(event.pointerId);
  });
  concertCarousel.addEventListener('pointermove', (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    if (Math.abs(deltaY) > 12 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      settle(0);
      return;
    }
    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      const position = Math.max(-dragWidth * 2.2, Math.min(dragWidth * .2, -dragWidth + deltaX));
      track.style.transform = `translateX(${position}px)`;
    }
  });
  concertCarousel.addEventListener('pointerup', (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    const direction = Math.abs(deltaX) > Math.min(70, dragWidth * .18) && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 ? (deltaX < 0 ? 1 : -1) : 0;
    settle(direction);
  });
  concertCarousel.addEventListener('pointercancel', () => { if (pointerStart) settle(0); });
  window.addEventListener('resize', updateVisible);
  panel.addEventListener('focusin', () => {
    if (document.activeElement.matches(':focus-visible')) window.clearTimeout(autoplayTimer);
    else scheduleAutoplay();
  });
  panel.addEventListener('focusout', () => {
    requestAnimationFrame(() => { if (!panel.contains(document.activeElement)) scheduleAutoplay(); });
  });
  document.addEventListener('visibilitychange', scheduleAutoplay);
  reducedMotion.addEventListener('change', scheduleAutoplay);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= .2;
      scheduleAutoplay();
    }, { threshold: .2 }).observe(panel);
  } else {
    inView = true;
  }
  updateVisible();
  scheduleAutoplay();
}

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
  viewer.setAttribute('aria-label', 'Bildevisning fra konsertscenen');
  viewer.innerHTML = '<button class="viewer-close" type="button" aria-label="Lukk bilde">×</button><div class="viewer-stage"><button class="viewer-arrow viewer-prev" type="button" aria-label="Forrige bilde">‹</button><img alt=""><button class="viewer-arrow viewer-next" type="button" aria-label="Neste bilde">›</button></div><div class="viewer-footer"><p class="viewer-caption" aria-live="polite"></p><span class="viewer-count" aria-live="polite"></span></div>';
  document.body.append(viewer);
  const photo = viewer.querySelector('img');
  const caption = viewer.querySelector('.viewer-caption');
  const count = viewer.querySelector('.viewer-count');
  const images = [...gallery.querySelectorAll('img')];
  let selected = 0;

  function showPhoto(index) {
    selected = (index + images.length) % images.length;
    const img = images[selected];
    photo.src = img.currentSrc || img.src;
    photo.alt = img.alt;
    caption.textContent = img.alt;
    count.textContent = `${selected + 1} / ${images.length}`;
    // Prepare neighboring photos so swiping feels immediate.
    [images[(selected + 1) % images.length], images[(selected - 1 + images.length) % images.length]].forEach((neighbor) => {
      const preload = new Image();
      preload.src = neighbor.currentSrc || neighbor.src;
    });
  }

  images.forEach((img, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item';
    button.setAttribute('aria-label', `Åpne bilde: ${img.alt}`);
    img.replaceWith(button);
    button.append(img);
    button.addEventListener('click', () => {
      showPhoto(index);
      viewer.showModal();
    });
  });
  viewer.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(selected - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => showPhoto(selected + 1));
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(selected - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(selected + 1); }
    if (event.key === 'Home') { event.preventDefault(); showPhoto(0); }
    if (event.key === 'End') { event.preventDefault(); showPhoto(images.length - 1); }
  });
  let touchStart;
  viewer.querySelector('.viewer-stage').addEventListener('touchstart', (event) => {
    touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
  }, { passive: true });
  viewer.querySelector('.viewer-stage').addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) showPhoto(selected + (dx < 0 ? 1 : -1));
    touchStart = undefined;
  }, { passive: true });
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
  let selected = 0;
  const stackedVideos = window.matchMedia('(min-width: 1001px)');
  const scrollRail = (amount) => rail.scrollBy({
    [stackedVideos.matches ? 'top' : 'left']: amount,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });

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
    choices.forEach((item, i) => {
      item.classList.toggle('is-selected', i === selected);
      item.setAttribute('aria-current', String(i === selected));
    });
    const bounds = rail.getBoundingClientRect();
    const itemBounds = choice.getBoundingClientRect();
    const start = stackedVideos.matches ? itemBounds.top - bounds.top : itemBounds.left - bounds.left;
    const end = stackedVideos.matches ? itemBounds.bottom - bounds.bottom : itemBounds.right - bounds.right;
    if (start < 0 || end > 0) scrollRail(start < 0 ? start : end);
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
  stage.addEventListener('click', (event) => {
    if (!event.target.closest('.video-launch') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const choice = choices[selected];
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${choice.dataset.videoId}?autoplay=1&rel=0&playsinline=1&fs=1`;
    frame.title = choice.dataset.videoTitle;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    stage.replaceChildren(frame);
    frame.focus();
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
    slides[(activeSlide + 1) % slides.length].querySelector('img').loading = 'eager';
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
