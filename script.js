const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Åpne meny' : 'Lukk meny');
    navMenu.classList.toggle('is-open', !isOpen);
  });

  navMenu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Åpne meny');
      navMenu.classList.remove('is-open');
    }
  });
}

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const dotsContainer = carousel.querySelector('[data-carousel-dots]');
  const carouselTrack = carousel.querySelector('.carousel-track');
  const hero = carousel.closest('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let intervalId;
  let parallaxTicking = false;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Vis bilde ${index + 1}`);
    dot.addEventListener('click', () => {
      showSlide(index);
      restartTimer();
    });
    dotsContainer?.appendChild(dot);
    return dot;
  });

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
      dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
    });
  }

  function nextSlide() {
    showSlide(activeIndex + 1);
  }

  function previousSlide() {
    showSlide(activeIndex - 1);
  }

  function startTimer() {
    if (!reduceMotion && slides.length > 1) {
      intervalId = window.setInterval(nextSlide, 3800);
    }
  }

  function restartTimer() {
    window.clearInterval(intervalId);
    startTimer();
  }

  prevButton?.addEventListener('click', () => {
    previousSlide();
    restartTimer();
  });

  nextButton?.addEventListener('click', () => {
    nextSlide();
    restartTimer();
  });

  carousel.addEventListener('mouseenter', () => window.clearInterval(intervalId));
  carousel.addEventListener('mouseleave', startTimer);

  function updateHeroParallax() {
    if (!hero || !carouselTrack) {
      return;
    }

    const heroRect = hero.getBoundingClientRect();

    if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) {
      parallaxTicking = false;
      return;
    }

    const offset = Math.min(90, Math.max(0, -heroRect.top * 0.18));
    carouselTrack.style.setProperty('--hero-parallax', `${offset}px`);
    parallaxTicking = false;
  }

  function requestHeroParallax() {
    if (!parallaxTicking) {
      window.requestAnimationFrame(updateHeroParallax);
      parallaxTicking = true;
    }
  }

  if (!reduceMotion && hero && carouselTrack) {
    window.addEventListener('scroll', requestHeroParallax, { passive: true });
    window.addEventListener('resize', requestHeroParallax);
    updateHeroParallax();
  }

  showSlide(0);
  startTimer();
}

const upcomingCarousel = document.querySelector('[data-upcoming-carousel]');

if (upcomingCarousel) {
  const upcomingTrack = upcomingCarousel.querySelector('[data-upcoming-track]');
  const upcomingCards = Array.from(upcomingCarousel.querySelectorAll('.upcoming-card'));
  const upcomingSection = upcomingCarousel.closest('.upcoming-section');
  const upcomingPrev = upcomingSection?.querySelector('[data-upcoming-prev]');
  const upcomingNext = upcomingSection?.querySelector('[data-upcoming-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeUpcomingIndex = 0;
  let upcomingTimerId;

  function getUpcomingItemsPerView() {
    return window.matchMedia('(min-width: 961px)').matches ? 2 : 1;
  }

  function getUpcomingMaxIndex() {
    return Math.max(0, upcomingCards.length - getUpcomingItemsPerView());
  }

  function showUpcoming(index) {
    const maxIndex = getUpcomingMaxIndex();
    activeUpcomingIndex = index > maxIndex ? 0 : index < 0 ? maxIndex : index;
    upcomingTrack?.style.setProperty('--upcoming-index', String(activeUpcomingIndex));
  }

  function nextUpcoming() {
    showUpcoming(activeUpcomingIndex + 1);
  }

  function previousUpcoming() {
    showUpcoming(activeUpcomingIndex - 1);
  }

  function startUpcomingTimer() {
    if (!reduceMotion && upcomingCards.length > getUpcomingItemsPerView()) {
      upcomingTimerId = window.setInterval(nextUpcoming, 4600);
    }
  }

  function restartUpcomingTimer() {
    window.clearInterval(upcomingTimerId);
    startUpcomingTimer();
  }

  upcomingPrev?.addEventListener('click', () => {
    previousUpcoming();
    restartUpcomingTimer();
  });

  upcomingNext?.addEventListener('click', () => {
    nextUpcoming();
    restartUpcomingTimer();
  });

  upcomingCarousel.addEventListener('mouseenter', () => window.clearInterval(upcomingTimerId));
  upcomingCarousel.addEventListener('mouseleave', startUpcomingTimer);

  window.addEventListener('resize', () => {
    showUpcoming(activeUpcomingIndex);
    restartUpcomingTimer();
  });

  showUpcoming(0);
  startUpcomingTimer();
}
