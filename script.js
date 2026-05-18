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
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let intervalId;

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
      intervalId = window.setInterval(nextSlide, 5000);
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

  showSlide(0);
  startTimer();
}
