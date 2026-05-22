(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================================
     Mobile navigation
     ================================ */

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (navToggle && navMenu) {
    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Åpne meny");
      navMenu.classList.remove("is-open");
    };

    const toggleMenu = () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";

      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Åpne meny" : "Lukk meny");
      navMenu.classList.toggle("is-open", !isOpen);
    };

    navToggle.addEventListener("click", toggleMenu);

    navMenu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !navMenu.contains(target) &&
        !navToggle.contains(target)
      ) {
        closeMenu();
      }
    });
  }

  /* ================================
     Hero slideshow
     ================================ */

  const hero = document.querySelector(".hero");
  const heroSlider = document.querySelector("[data-hero-slider]");
  const heroSlides = heroSlider
    ? Array.from(heroSlider.querySelectorAll(".hero-slide"))
    : [];

  if (heroSlides.length > 1 && !reduceMotion) {
    let activeSlide = 0;
    let heroTimer = null;

    const showSlide = (nextIndex) => {
      if (nextIndex === activeSlide) return;

      const currentSlide = heroSlides[activeSlide];
      const nextSlide = heroSlides[nextIndex];

      currentSlide.classList.remove("is-active");
      currentSlide.classList.add("is-leaving");
      nextSlide.classList.add("is-active");

      window.setTimeout(() => {
        currentSlide.classList.remove("is-leaving");
      }, 1200);

      activeSlide = nextIndex;
    };

    const nextSlide = () => {
      showSlide((activeSlide + 1) % heroSlides.length);
    };

    const startHero = () => {
      stopHero();
      heroTimer = window.setInterval(nextSlide, 6500);
    };

    const stopHero = () => {
      if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
      }
    };

    startHero();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopHero();
      } else {
        startHero();
      }
    });
  }

  /* ================================
     Hero scroll depth effect
     ================================ */

  if (hero && heroSlider && !reduceMotion) {
    let ticking = false;

    const updateHeroParallax = () => {
      const rect = hero.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

      if (isVisible) {
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        const offset = progress * 70;

        heroSlider.style.transform = `translateY(${offset}px) scale(1.04)`;
      }

      ticking = false;
    };

    const requestHeroParallax = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
      }
    };

    updateHeroParallax();

    window.addEventListener("scroll", requestHeroParallax, { passive: true });
    window.addEventListener("resize", requestHeroParallax);
  }

  /* ================================
     Video + gallery carousels
     ================================ */

  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".media-carousel-track");
    const items = track ? Array.from(track.children) : [];

    if (!track || items.length < 2) return;

    const section = carousel.closest(".section");
    const prevButton = section?.querySelector("[data-carousel-prev]");
    const nextButton = section?.querySelector("[data-carousel-next]");

    let index = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const getVisibleCount = () => {
      const value = window
        .getComputedStyle(carousel)
        .getPropertyValue("--visible")
        .trim();

      const visible = Number.parseInt(value, 10);
      return Number.isFinite(visible) && visible > 0 ? visible : 1;
    };

    const getGap = () => {
      const styles = window.getComputedStyle(track);
      return Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    };

    const getStep = () => {
      const firstItem = items[0];
      if (!firstItem) return 0;

      return firstItem.getBoundingClientRect().width + getGap();
    };

    const getMaxIndex = () => {
      return Math.max(0, items.length - getVisibleCount());
    };

    const updateCarousel = () => {
      const step = getStep();
      track.style.transform = `translateX(${-index * step}px)`;
    };

    const goTo = (nextIndex) => {
      const maxIndex = getMaxIndex();

      if (nextIndex > maxIndex) {
        index = 0;
      } else if (nextIndex < 0) {
        index = maxIndex;
      } else {
        index = nextIndex;
      }

      updateCarousel();
    };

    const goNext = () => {
      goTo(index + 1);
    };

    const goPrev = () => {
      goTo(index - 1);
    };

    nextButton?.addEventListener("click", goNext);
    prevButton?.addEventListener("click", goPrev);

    carousel.addEventListener("pointerdown", (event) => {
      if (event.target instanceof HTMLIFrameElement) return;

      isDragging = true;
      startX = event.clientX;
      currentX = event.clientX;
      carousel.setPointerCapture?.(event.pointerId);
    });

    carousel.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      currentX = event.clientX;
    });

    carousel.addEventListener("pointerup", () => {
      if (!isDragging) return;

      const delta = currentX - startX;
      const threshold = 45;

      if (delta > threshold) {
        goPrev();
      }

      if (delta < -threshold) {
        goNext();
      }

      isDragging = false;
    });

    carousel.addEventListener("pointercancel", () => {
      isDragging = false;
    });

    window.addEventListener("resize", () => {
      index = Math.min(index, getMaxIndex());
      updateCarousel();
    });

    updateCarousel();
  });
})();
