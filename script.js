/* =========================================================
   Roamly Guide — Landing Page Scripts
   Vanilla JS, no dependencies.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Sticky navbar: switch to a transparent-glass dark-ish
        style once the user scrolls past the hero.
     --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const SCROLL_THRESHOLD = 24;

  function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Run once on load in case the page opens mid-scroll (e.g. anchor link)
  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  /* ---------------------------------------------------------
     2. Mobile menu toggle
     --------------------------------------------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const iconOpen = document.getElementById("menuIconOpen");
  const iconClose = document.getElementById("menuIconClose");

  function closeMobileMenu() {
    mobileMenu.classList.add("hidden");
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  function toggleMobileMenu() {
    const isHidden = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");
    iconOpen.classList.toggle("hidden");
    iconClose.classList.toggle("hidden");
    menuBtn.setAttribute("aria-expanded", String(isHidden));
  }

  menuBtn.addEventListener("click", toggleMobileMenu);

  // Close the mobile menu whenever a nav link is tapped
  document.querySelectorAll("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* ---------------------------------------------------------
     3. FAQ accordion
        Only one answer open at a time for a cleaner reading flow.
     --------------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Collapse every other item
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // Re-open the clicked one only if it wasn't already open
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------------------------------------------------
     4. Scroll-reveal animations
        Uses IntersectionObserver so it's cheap and doesn't
        run on every scroll frame.
     --------------------------------------------------------- */
  const animatedEls = document.querySelectorAll("[data-animate]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute("data-delay") || 0;
            // Stagger via inline transition-delay, then reveal
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    animatedEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just show everything if IntersectionObserver isn't supported
    animatedEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------------------------------------------------
     5. Smooth-scroll for in-page anchor links
        (native CSS `scroll-behavior: smooth` already covers most
        browsers, this is a safety net + closes mobile menu first)
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------------------------------------------------------
     6. Footer year (avoids a hardcoded, aging copyright date)
     --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
