/* ============================================================
   Aboné Coiffeur — Bischheim
   Scripts de l'interface
   ============================================================ */
(function () {
  "use strict";

  /* -------- Galerie --------
     Pour afficher vos propres photos : déposez vos images dans le
     dossier /images puis remplacez « src » ci-dessous (ou ajoutez
     de nouvelles entrées). Voir images/README-PHOTOS.md.            */
  var galleryItems = [
    { src: "images/gallery-1.svg", alt: "Coupe et coiffage au salon Aboné Coiffeur", caption: "Coupe & coiffage" },
    { src: "images/gallery-2.svg", alt: "Coloration réalisée au salon", caption: "Coloration" },
    { src: "images/gallery-3.svg", alt: "Balayage et jeux de lumière", caption: "Balayage & mèches" },
    { src: "images/gallery-4.svg", alt: "Brushing et mise en forme", caption: "Brushing" },
    { src: "images/gallery-5.svg", alt: "Chignon et coiffure de mariage", caption: "Chignon & mariage" },
    { src: "images/gallery-6.svg", alt: "Ambiance chaleureuse du salon", caption: "Notre ambiance" }
  ];

  function buildGallery() {
    var wrap = document.getElementById("gallery");
    if (!wrap) return;
    var frag = document.createDocumentFragment();
    galleryItems.forEach(function (item, i) {
      var fig = document.createElement("figure");
      fig.className = "gallery-item reveal" + (i === 0 ? " wide" : "");
      fig.setAttribute("role", "listitem");

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

  /* -------- En-tête : ombre au défilement -------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 12);
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
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
    return io;
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

    var items = document.querySelectorAll(".hours-list li");
    items.forEach(function (li) {
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
      } else {
        statusEl.textContent = day === 6
          ? "Fermé · réouverture lundi à 09h00"
          : (day === 0
              ? "Fermé le dimanche · réouverture lundi à 09h00"
              : "Fermé · réouverture demain à 09h00");
      }
    }
  }

  /* -------- Année du pied de page -------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* -------- Initialisation -------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildGallery();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initScrollSpy();
    initHours();
    initYear();
  });
})();
