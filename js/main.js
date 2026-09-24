/* ==========================================================================
   GFS LEGACY DEBATES — main.js
   Site behaviour: nav state, scroll progress, mobile menu, contact form.
   Reveal/entrance choreography lives in js/animations.js.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasAnime = typeof window.anime === "function";
  var motionOK = hasAnime && !prefersReducedMotion;

  /* ---------- Nav scrolled state + scroll progress ---------- */

  function initScrollUI() {
    var nav = document.querySelector("[data-nav]");
    var bar = document.querySelector("[data-scroll-progress]");
    var ticking = false;

    function update() {
      var y = window.scrollY;

      if (nav) nav.classList.toggle("nav--scrolled", y > 12);

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      }

      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Mobile menu ---------- */

  function initMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    var links = menu.querySelectorAll(".mobile-menu__link");
    var backdrop = menu.querySelector("[data-close-menu]");
    var isOpen = false;

    function open() {
      if (isOpen) return;
      isOpen = true;
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
      document.body.classList.add("menu-open");

      // Reflow so the CSS opacity/transform transitions run.
      void menu.offsetHeight;
      menu.classList.add("is-open");

      if (motionOK) {
        window.anime.set(links, { translateX: 18, opacity: 0 });
        window.anime({
          targets: links,
          translateX: 0,
          opacity: 1,
          duration: 450,
          delay: window.anime.stagger(55, { start: 90 }),
          easing: "easeOutCubic"
        });
      }

      if (links.length) links[0].focus();
    }

    function close(returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
      document.body.classList.remove("menu-open");
      menu.classList.remove("is-open");

      window.setTimeout(function () {
        if (!isOpen) menu.hidden = true;
      }, 300);

      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      if (isOpen) { close(true); } else { open(); }
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () { close(false); });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) close(true);
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () { close(false); });
    });
  }

  /* ---------- Contact form ---------- */

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var success = form.querySelector("[data-form-success]");

    function setValidity(input, valid) {
      var field = input.closest(".field");
      if (!field) return;
      field.classList.toggle("is-invalid", !valid);
      input.setAttribute("aria-invalid", valid ? "false" : "true");
      var error = field.querySelector(".field__error");
      if (error && error.id) {
        input.setAttribute("aria-describedby", error.id);
      }
    }

    function validate(input) {
      var value = input.value.trim();
      if (input.hasAttribute("required") && !value) return false;
      if (input.type === "email" && value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      return true;
    }

    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("blur", function () {
        setValidity(input, validate(input));
      });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-invalid")) {
          setValidity(input, validate(input));
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = null;
      form.querySelectorAll("input, textarea").forEach(function (input) {
        var ok = validate(input);
        setValidity(input, ok);
        if (!ok && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      /*
        BACKEND HOOK
        Send the form data to your endpoint here, e.g.
        fetch("/api/contact", { method: "POST", body: new FormData(form) })
      */

      Array.prototype.forEach.call(form.children, function (child) {
        if (!child.hasAttribute("data-form-success")) child.style.display = "none";
      });
      success.hidden = false;
      success.focus();

      if (motionOK) {
        var circle = success.querySelector("[data-success-circle]");
        var check = success.querySelector("[data-success-check]");
        window.anime.timeline({ easing: "easeOutCubic" })
          .add({ targets: success, opacity: [0, 1], translateY: [10, 0], duration: 350 })
          .add({ targets: circle, strokeDashoffset: [window.anime.setDashoffset, 0], duration: 600 }, "-=150")
          .add({ targets: check, strokeDashoffset: [window.anime.setDashoffset, 0], duration: 400 }, "-=200");
      }
    });
  }

  /* ---------- Footer year ---------- */

  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = year;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScrollUI();
    initMobileMenu();
    initContactForm();
    initYear();
  });
})();
