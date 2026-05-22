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
const concertParallax = document.querySelector("[data-concert-parallax] img");

if (
  concertParallax &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const updateConcertParallax = () => {
    const rect = concertParallax.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.bottom < 0 || rect.top > windowHeight) return;

    const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
    const offset = (progress - 0.5) * 28;

    concertParallax.style.transform = `scale(1.04) translateY(${offset}px)`;
  };

  updateConcertParallax();
  window.addEventListener("scroll", updateConcertParallax, { passive: true });
  window.addEventListener("resize", updateConcertParallax);
}
