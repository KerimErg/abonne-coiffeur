/* ============================================================
   Aboné Coiffeur — Bischheim
   Scripts de l'interface
   ============================================================ */
(function () {
  "use strict";

  /* -------- Galerie --------
     Pour afficher vos propres photos : déposez vos images dans le
     dossier /images puis remplacez « src » ci-dessous (ou ajoutez
     de nouvelles entrées). Voir images/README-PHOTOS.md.

     « wide » = vignette large (2 colonnes).                        */
  var galleryItems = [
    { src: "images/gallery-1.svg", alt: "Coupe et coiffage au salon Aboné Coiffeur", caption: "Coupe & coiffage", wide: true },
    { src: "images/gallery-2.svg", alt: "Coloration réalisée au salon", caption: "Coloration" },
    { src: "images/gallery-3.svg", alt: "Balayage et jeux de lumière", caption: "Balayage & mèches" },
    { src: "images/gallery-4.svg", alt: "Brushing et mise en forme", caption: "Brushing & soins" },
    { src: "images/gallery-5.svg", alt: "Chignon et coiffure de mariage", caption: "Chignon & mariage" },
    { src: "images/gallery-6.svg", alt: "Ambiance chaleureuse du salon", caption: "Notre ambiance", wide: true }
  ];

  function buildGallery() {
    var wrap = document.getElementById("gallery");
    if (!wrap) return;
    var frag = document.createDocumentFragment();
    galleryItems.forEach(function (item, i) {
      var fig = document.createElement("figure");
      fig.className = "gallery-item reveal" + (item.wide ? " wide" : "");
      fig.setAttribute("role", "listitem");
      fig.style.transitionDelay = (i % 4) * 70 + "ms";

      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "";
      img.loading = "lazy";

      var cap = document.createElement("figcaption");
      cap.textContent = item.caption || "";

      fig.appendChild(img);
      if (item.caption) fig.appendChild(cap);
      frag.appendChild(fig);
    });
    wrap.appendChild(frag);
  }

  /* -------- Léger décalage (stagger) pour les groupes -------- */
  function applyStagger() {
    document.querySelectorAll(".cards .card.reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms";
    });
  }

  /* -------- En-tête : fond au défilement -------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Menu mobile -------- */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    var close = function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
    };
    var open = function () {
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
    };

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("open")) { close(); } else { open(); }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* -------- Apparition au défilement -------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* -------- Navigation active (scrollspy) -------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
    var sections = links
      .map(function (l) { return document.querySelector(l.getAttribute("href")); })
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* -------- Horaires : jour courant + ouvert/fermé --------
     Horaires vérifiés : lundi à samedi 9h–19h, dimanche fermé.     */
  function initHours() {
    var OPEN_HOUR = 9, CLOSE_HOUR = 19;
    var now = new Date();
    var day = now.getDay();            // 0 = dimanche … 6 = samedi
    var hour = now.getHours() + now.getMinutes() / 60;

    document.querySelectorAll(".hours-list li").forEach(function (li) {
      if (parseInt(li.getAttribute("data-day"), 10) === day) {
        li.classList.add("today");
      }
    });

    var statusEl = document.getElementById("hoursStatus");
    if (!statusEl) return;

    var isOpenDay = day >= 1 && day <= 6;      // lundi–samedi
    var isOpen = isOpenDay && hour >= OPEN_HOUR && hour < CLOSE_HOUR;

    if (isOpen) {
      statusEl.classList.remove("closed");
      statusEl.textContent = "Ouvert maintenant · jusqu'à 19h00";
    } else {
      statusEl.classList.add("closed");
      if (isOpenDay && hour < OPEN_HOUR) {
        statusEl.textContent = "Fermé · ouvre aujourd'hui à 09h00";
      } else if (day === 6) {
        statusEl.textContent = "Fermé · réouverture lundi à 09h00";
      } else if (day === 0) {
        statusEl.textContent = "Fermé le dimanche · réouverture lundi à 09h00";
      } else {
        statusEl.textContent = "Fermé · réouverture demain à 09h00";
      }
    }
  }

  /* -------- Année du pied de page -------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* -------- Réglages effets pointeur --------
     Les effets 3D / parallaxe ne s'activent que sur ordinateur
     (souris fine) et jamais si l'utilisateur préfère réduire les
     animations, ni sur écran tactile → mobile reste léger.          */
  function pointerEffectsAllowed() {
    if (!window.matchMedia) return false;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  /* -------- Inclinaison 3D légère au survol -------- */
  function initTilt() {
    if (!pointerEffectsAllowed()) return;

    var groups = [
      { sel: ".card", max: 6, depth: 16 },
      { sel: ".gallery-item", max: 7, depth: 18 },
      { sel: ".framed", max: 5, depth: 12 }
    ];

    groups.forEach(function (g) {
      document.querySelectorAll(g.sel).forEach(function (el) {
        var glare = document.createElement("span");
        glare.className = "tilt-glare";
        el.appendChild(glare);

        var rect = null, raf = 0, lastE = null;

        var render = function () {
          raf = 0;
          if (!rect || !lastE) return;
          var px = (lastE.clientX - rect.left) / rect.width;
          var py = (lastE.clientY - rect.top) / rect.height;
          px = Math.min(1, Math.max(0, px));
          py = Math.min(1, Math.max(0, py));
          var rx = (0.5 - py) * g.max;
          var ry = (px - 0.5) * g.max;
          el.style.transform =
            "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) +
            "deg) translateZ(" + g.depth + "px)";
          el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        };

        el.addEventListener("mouseenter", function () {
          rect = el.getBoundingClientRect();
          el.classList.add("is-tilting");
          el.style.transition = "transform .2s var(--ease)";
        });
        el.addEventListener("mousemove", function (e) {
          lastE = e;
          if (!raf) raf = requestAnimationFrame(render);
        }, { passive: true });
        el.addEventListener("mouseleave", function () {
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          el.classList.remove("is-tilting");
          el.style.transition = "transform .6s var(--ease)";
          el.style.transform = "";
        });
      });
    });
  }

  /* -------- Parallaxe douce de l'accueil au curseur -------- */
  function initHeroParallax() {
    if (!pointerEffectsAllowed()) return;
    var hero = document.querySelector(".hero");
    var frame = document.querySelector(".hero-frame");
    if (!hero || !frame) return;

    var chip = document.querySelector(".hero-chip");
    var glow = document.createElement("div");
    glow.className = "hero-glow";
    hero.insertBefore(glow, hero.firstChild);

    var raf = 0, lastE = null;
    var render = function () {
      raf = 0;
      if (!lastE) return;
      var r = hero.getBoundingClientRect();
      var nx = (lastE.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
      var ny = (lastE.clientY - r.top) / r.height - 0.5;
      frame.style.transform =
        "translate3d(" + (nx * -20).toFixed(1) + "px," + (ny * -16).toFixed(1) +
        "px,0) rotateX(" + (ny * -4).toFixed(2) + "deg) rotateY(" + (nx * 6).toFixed(2) + "deg)";
      if (chip) chip.style.transform =
        "translate3d(" + (nx * 26).toFixed(1) + "px," + (ny * 20).toFixed(1) + "px,0)";
      glow.style.left = (lastE.clientX - r.left) + "px";
      glow.style.top = (lastE.clientY - r.top) + "px";
    };

    hero.addEventListener("mouseenter", function () { glow.style.opacity = "1"; });
    hero.addEventListener("mousemove", function (e) {
      lastE = e;
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });
    hero.addEventListener("mouseleave", function () {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      glow.style.opacity = "0";
      frame.style.transform = "";
      if (chip) chip.style.transform = "";
    });
  }

  /* -------- Initialisation -------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildGallery();
    applyStagger();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initScrollSpy();
    initHours();
    initYear();
    initTilt();
    initHeroParallax();
  });
})();
