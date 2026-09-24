/* ==========================================================================
   GFS LEGACY DEBATES — animations.js
   Anime.js choreography: startup sequence, page entrances, scroll reveals,
   parallax, and page transitions.

   Content is fully visible without JavaScript. Motion is only enabled when
   Anime.js is present and the visitor has not requested reduced motion —
   in that case the `js-motion` class is added to <html>, which applies the
   hidden initial states defined in css/animations.css.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasAnime = typeof window.anime === "function";
  var motionOK = hasAnime && !prefersReducedMotion;
  var INTRO_KEY = "gld_intro_played";

  var intro = document.querySelector("[data-intro]");

  function introAlreadyPlayed() {
    try {
      return window.sessionStorage.getItem(INTRO_KEY) === "1";
    } catch (e) {
      return true; // storage unavailable: never replay rather than always replay
    }
  }

  function markIntroPlayed() {
    try {
      window.sessionStorage.setItem(INTRO_KEY, "1");
    } catch (e) { /* non-fatal */ }
  }

  /* ---------- No-motion path: show everything immediately ---------- */

  if (!motionOK) {
    if (intro) intro.hidden = true;
    return;
  }

  document.documentElement.classList.add("js-motion");

  /* ---------- Split intro wordmark into animatable letters ---------- */

  function splitIntroWord() {
    var word = document.querySelector("[data-intro-word]");
    if (!word) return [];
    var text = word.textContent;
    word.textContent = "";
    var spans = [];
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement("span");
      span.className = "ch";
      span.textContent = text[i];
      word.appendChild(span);
      spans.push(span);
    }
    return spans;
  }

  /* ---------- Page entrance (after intro, or on every navigation) ---------- */

  function enterHome(delayBase) {
    var tl = window.anime.timeline({ easing: "easeOutQuint" });

    tl.add({
      targets: ".site-header .header-inner",
      opacity: [0, 1],
      translateY: [-16, 0],
      duration: 800
    }, delayBase);

    tl.add({
      targets: ".hero-school",
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 700
    }, delayBase + 100);

    tl.add({
      targets: ".hero-title .line > span",
      opacity: [0, 1],
      translateY: ["105%", "0%"],
      duration: 1000,
      delay: window.anime.stagger(130)
    }, delayBase + 200);

    tl.add({
      targets: ".hero-tagline",
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 750
    }, delayBase + 650);

    tl.add({
      targets: ".hero-aside",
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 750
    }, delayBase + 800);

    tl.add({
      targets: ".hero-crest",
      opacity: [0, 1],
      translateY: [26, 0],
      duration: 900
    }, delayBase + 500);

    tl.add({
      targets: ".marquee",
      opacity: [0, 1],
      duration: 700,
      easing: "linear"
    }, delayBase + 1000);
  }

  function enterInnerPage(delayBase) {
    var tl = window.anime.timeline({ easing: "easeOutQuint" });

    tl.add({
      targets: ".site-header .header-inner",
      opacity: [0, 1],
      translateY: [-16, 0],
      duration: 800
    }, delayBase);

    tl.add({
      targets: ".page-hero .kicker",
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 700
    }, delayBase + 100);

    tl.add({
      targets: ".page-hero h1",
      opacity: [0, 1],
      translateY: [36, 0],
      duration: 950
    }, delayBase + 200);

    tl.add({
      targets: ".page-hero .lede",
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 800
    }, delayBase + 450);
  }

  function enterPage(delayBase) {
    if (document.body.dataset.page === "home") {
      enterHome(delayBase);
    } else {
      enterInnerPage(delayBase);
    }
  }

  /* ---------- Startup animation ---------- */

  function playIntro() {
    document.body.classList.add("intro-lock");
    var letters = splitIntroWord();

    var tl = window.anime.timeline({
      easing: "easeOutCubic",
      complete: function () {
        markIntroPlayed();
        intro.hidden = true;
        document.body.classList.remove("intro-lock");
      }
    });

    tl.add({
      targets: ".intro-logo-mask img",
      opacity: [0, 1],
      translateY: [26, 0],
      scale: [0.82, 1],
      duration: 750
    });

    tl.add({
      targets: letters,
      opacity: [0, 1],
      translateY: ["0.5em", "0em"],
      duration: 500,
      delay: window.anime.stagger(22)
    }, "-=300");

    tl.add({
      targets: ".intro-tag",
      opacity: [0, 1],
      duration: 400,
      easing: "linear"
    }, "-=220");

    // Hold briefly, then wipe the overlay upward into the page.
    tl.add({
      targets: intro,
      translateY: ["0%", "-100%"],
      duration: 700,
      easing: "easeInOutQuint"
    }, "+=380");

    // Start the page entrance as the overlay lifts.
    window.setTimeout(function () {
      enterPage(0);
    }, tl.duration - 480);
  }

  function skipIntro() {
    if (intro) {
      window.anime({
        targets: intro,
        opacity: [1, 0],
        duration: 350,
        easing: "linear",
        complete: function () { intro.hidden = true; }
      });
    }
    enterPage(80);
  }

  /* ---------- Scroll reveals ---------- */

  function initReveals() {
    var revealTargets = document.querySelectorAll("[data-reveal]");
    var growTargets = document.querySelectorAll("[data-grow]");
    var maskTargets = document.querySelectorAll(".reveal-mask");

    var pending = [];
    var flushScheduled = false;

    // Anime.js cannot read transforms applied by CSS classes, so the
    // from-values must mirror the initial states in css/animations.css.
    function fromX(el) {
      var type = el.getAttribute("data-reveal");
      if (type === "left") return -32;
      if (type === "right") return 32;
      return 0;
    }

    function fromY(el) {
      var type = el.getAttribute("data-reveal");
      return (type === "" || type === null) ? 28 : 0;
    }

    function flush() {
      flushScheduled = false;
      var batch = pending.splice(0, pending.length);
      if (!batch.length) return;
      window.anime({
        targets: batch,
        opacity: [0, 1],
        translateX: function (el) { return [fromX(el), 0]; },
        translateY: function (el) { return [fromY(el), 0]; },
        duration: 900,
        delay: window.anime.stagger(90),
        easing: "easeOutQuint",
        complete: function () {
          batch.forEach(function (el) { el.classList.add("is-revealed"); });
        }
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        pending.push(entry.target);
        if (!flushScheduled) {
          flushScheduled = true;
          window.requestAnimationFrame(flush);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    revealTargets.forEach(function (el) { io.observe(el); });

    var growIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        growIO.unobserve(entry.target);
        var axis = entry.target.getAttribute("data-grow") === "y" ? "scaleY" : "scaleX";
        var props = { targets: entry.target, duration: 1000, easing: "easeOutQuart" };
        props[axis] = [0, 1];
        window.anime(props);
      });
    }, { threshold: 0.4 });

    growTargets.forEach(function (el) { growIO.observe(el); });

    var maskIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        maskIO.unobserve(entry.target);
        var veil = entry.target.querySelector(".mask-veil");
        var img = entry.target.querySelector("img");
        if (veil) {
          window.anime({
            targets: veil,
            scaleY: [1, 0],
            duration: 950,
            easing: "easeInOutQuart"
          });
        }
        if (img) {
          window.anime({
            targets: img,
            scale: [1.1, 1],
            duration: 1400,
            easing: "easeOutQuart"
          });
        }
      });
    }, { threshold: 0.25 });

    maskTargets.forEach(function (el) { maskIO.observe(el); });
  }

  /* ---------- Page transitions (fade out before navigating) ---------- */

  function initPageTransitions() {
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      var link = e.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      var url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      var isSamePage = url.pathname === window.location.pathname;
      if (isSamePage && url.hash) return;

      e.preventDefault();
      window.anime({
        targets: ["main", ".site-header", ".site-footer"],
        opacity: [1, 0],
        duration: 240,
        easing: "easeInQuad",
        complete: function () {
          window.location.href = url.href;
        }
      });
    });

    // Restore visibility when a page is served from the back/forward cache.
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        ["main", ".site-header", ".site-footer"].forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) el.style.opacity = "1";
        });
      }
    });
  }

  /* ---------- Boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initReveals();
    initPageTransitions();

    if (intro && !introAlreadyPlayed()) {
      playIntro();
    } else {
      markIntroPlayed();
      skipIntro();
    }
  });
})();
