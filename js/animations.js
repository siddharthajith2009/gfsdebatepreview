/* ==========================================================================
   GFS LEGACY DEBATES — animations.js
   Quiet motion system:
   - hero entrance: gentle Anime.js stagger on [data-hero] elements
   - scroll reveals: IntersectionObserver toggling .is-visible, with the
     transitions themselves defined in css/animations.css
   No intro overlays, no page transitions — restraint is the point.

   Content is fully visible without JavaScript. The `js-motion` class is
   added to <html> only when Anime.js is available and the visitor has not
   requested reduced motion; it enables the hidden initial states in CSS.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasAnime = typeof window.anime === "function";
  var motionOK = hasAnime && !prefersReducedMotion;

  if (!motionOK) return;

  document.documentElement.classList.add("js-motion");

  /* ---------- Hero entrance ---------- */

  function enterHero() {
    var targets = document.querySelectorAll("[data-hero]");
    if (!targets.length) return;

    window.anime({
      targets: targets,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700,
      delay: window.anime.stagger(90, { start: 120 }),
      easing: "easeOutCubic"
    });
  }

  /* ---------- Scroll reveals ---------- */

  function initReveals() {
    var targets = document.querySelectorAll(".reveal, .reveal-group");

    // Stagger indices for grouped children (used by CSS transition-delay).
    document.querySelectorAll(".reveal-group").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty("--stagger", i);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    enterHero();
    initReveals();
  });
})();
