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
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSlides = heroSlider ? Array.from(heroSlider.querySelectorAll(".hero-slide")) : [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroSlides.length > 1 && !reduceMotion) {
  let activeHeroSlide = 0;

  const showHeroSlide = (nextIndex) => {
    const currentSlide = heroSlides[activeHeroSlide];
    const nextSlide = heroSlides[nextIndex];

    currentSlide.classList.remove("is-active");
    currentSlide.classList.add("is-leaving");

    nextSlide.classList.add("is-active");

    window.setTimeout(() => {
      currentSlide.classList.remove("is-leaving");
    }, 1200);

    activeHeroSlide = nextIndex;
  };

  window.setInterval(() => {
    const nextIndex = (activeHeroSlide + 1) % heroSlides.length;
    showHeroSlide(nextIndex);
  }, 6500);
}

if (heroSlider && !reduceMotion) {
  const updateHeroParallax = () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const heroVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    if (!heroVisible) return;

    const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    const offset = progress * 70;

    heroSlider.style.transform = `translateY(${offset}px) scale(1.04)`;
  };

  updateHeroParallax();

  window.addEventListener("scroll", updateHeroParallax, { passive: true });
  window.addEventListener("resize", updateHeroParallax);
}
const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const track = carousel.querySelector(".media-carousel-track");
  if (!track) return;

  const originalItems = Array.from(track.children);
  if (originalItems.length < 2) return;

  const section = carousel.closest(".section");
  const prevButton = section?.querySelector("[data-carousel-prev]");
  const nextButton = section?.querySelector("[data-carousel-next]");

  const cloneCount = Math.min(3, originalItems.length);

  const firstClones = originalItems.slice(0, cloneCount).map((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    return clone;
  });

  const lastClones = originalItems.slice(-cloneCount).map((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    return clone;
  });

  lastClones.forEach((clone) => track.prepend(clone));
  firstClones.forEach((clone) => track.append(clone));

  let index = cloneCount;
  let isMoving = false;

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || 0);
  };

  const getStep = () => {
    const item = track.children[index];
    if (!item) return 0;
    return item.getBoundingClientRect().width + getGap();
  };

  const moveToIndex = (withTransition = true) => {
    track.style.transition = withTransition
      ? "transform 520ms cubic-bezier(.2, .8, .2, 1)"
      : "none";

    track.style.transform = `translateX(${-index * getStep()}px)`;
  };

  const goNext = () => {
    if (isMoving) return;
    isMoving = true;
    index += 1;
    moveToIndex(true);
  };

  const goPrev = () => {
    if (isMoving) return;
    isMoving = true;
    index -= 1;
    moveToIndex(true);
  };

  track.addEventListener("transitionend", () => {
    const itemCount = originalItems.length;

    if (index >= itemCount + cloneCount) {
      index = cloneCount;
      moveToIndex(false);
    }

    if (index < cloneCount) {
      index = itemCount + cloneCount - 1;
      moveToIndex(false);
    }

    isMoving = false;
  });

  nextButton?.addEventListener("click", goNext);
  prevButton?.addEventListener("click", goPrev);

  window.addEventListener("resize", () => {
    moveToIndex(false);
  });

  moveToIndex(false);
});
