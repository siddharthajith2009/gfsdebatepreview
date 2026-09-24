/* ==========================================================================
   GFS LEGACY DEBATES — main.js
   Site behaviour: header, mobile menu, custom cursor, contact form, misc.
   Animation choreography lives in js/animations.js.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasAnime = typeof window.anime === "function";
  var motionOK = hasAnime && !prefersReducedMotion;

  /* ---------- Header: solid background + hide on scroll down ---------- */

  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle("is-solid", y > 24);

      // Hide when scrolling down past the hero, reveal on any upward scroll.
      if (y > 320 && y > lastY + 4 && !document.body.classList.contains("menu-open")) {
        header.classList.add("is-hidden");
      } else if (y < lastY - 4 || y <= 320) {
        header.classList.remove("is-hidden");
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  /* ---------- Mobile menu ---------- */

  function initMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    var links = menu.querySelectorAll(".mobile-menu-link");
    var meta = menu.querySelector(".mobile-menu-meta");
    var isOpen = false;
    var animating = false;

    function open() {
      if (animating || isOpen) return;
      isOpen = true;
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");

      // Force reflow so the visibility transition applies cleanly.
      void menu.offsetHeight;
      menu.classList.add("is-open");

      if (motionOK) {
        animating = true;
        window.anime.set(links, { translateY: 42, opacity: 0 });
        if (meta) window.anime.set(meta, { opacity: 0 });
        window.anime({
          targets: links,
          translateY: 0,
          opacity: 1,
          duration: 650,
          delay: window.anime.stagger(70, { start: 120 }),
          easing: "easeOutQuint",
          complete: function () { animating = false; }
        });
        if (meta) {
          window.anime({
            targets: meta,
            opacity: 1,
            duration: 500,
            delay: 450,
            easing: "linear"
          });
        }
      }

      if (links.length) links[0].focus();
    }

    function close(returnFocus) {
      if (animating || !isOpen) return;
      isOpen = false;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");

      function finish() {
        menu.classList.remove("is-open");
        menu.hidden = true;
        animating = false;
        if (returnFocus) toggle.focus();
      }

      if (motionOK) {
        animating = true;
        window.anime({
          targets: links,
          translateY: -24,
          opacity: 0,
          duration: 320,
          delay: window.anime.stagger(35),
          easing: "easeInQuad",
          complete: finish
        });
      } else {
        finish();
      }
    }

    toggle.addEventListener("click", function () {
      if (isOpen) { close(true); } else { open(); }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) close(true);
    });

    // Close the menu when a link is chosen (same-page anchors etc.).
    links.forEach(function (link) {
      link.addEventListener("click", function () { close(false); });
    });
  }

  /* ---------- Custom cursor (fine pointers only) ---------- */

  function initCursor() {
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion) return;

    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add("has-cursor");

    var x = -100, y = -100;
    var ringX = -100, ringY = -100;
    var ringScale = 1;
    var visible = false;

    document.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });

    function loop() {
      // Ring trails the dot slightly for a soft, weighted feel.
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      ringScale += ((ring.classList.contains("is-hover") ? 1.7 : 1) - ringScale) * 0.2;
      dot.style.transform = "translate(" + (x - 2.5) + "px," + (y - 2.5) + "px)";
      ring.style.transform = "translate(" + (ringX - 17) + "px," + (ringY - 17) + "px) scale(" + ringScale.toFixed(3) + ")";
      window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);

    var hoverables = "a, button, input, textarea, [data-cursor]";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverables)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverables)) ring.classList.remove("is-hover");
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
      var error = field.querySelector(".field-error");
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

      // Hide the fields, show the success state.
      Array.prototype.forEach.call(form.children, function (child) {
        if (!child.hasAttribute("data-form-success")) child.style.display = "none";
      });
      success.hidden = false;
      success.focus();

      if (motionOK) {
        var circle = success.querySelector("[data-success-circle]");
        var check = success.querySelector("[data-success-check]");
        [circle, check].forEach(function (el) {
          if (!el) return;
          var len = el.getTotalLength();
          el.style.strokeDasharray = len;
          el.style.strokeDashoffset = len;
        });
        window.anime.timeline({ easing: "easeOutCubic" })
          .add({ targets: success, opacity: [0, 1], translateY: [16, 0], duration: 450 })
          .add({ targets: circle, strokeDashoffset: [window.anime.setDashoffset, 0], duration: 700 }, "-=200")
          .add({ targets: check, strokeDashoffset: [window.anime.setDashoffset, 0], duration: 450 }, "-=250");
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
    initHeader();
    initMobileMenu();
    initCursor();
    initContactForm();
    initYear();
  });
})();
