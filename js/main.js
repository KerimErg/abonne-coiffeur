/* ============================================================
   Aboné Coiffeur — Bischheim
   Interactions : menu, apparitions, navigation, horaires
   HTML/CSS/JS simple et léger — aucune dépendance.
   ============================================================ */
(function () {
  "use strict";

  /* -------- En-tête : fond au défilement -------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 20); };
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
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* -------- Apparition douce au défilement -------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* -------- Navigation active (scrollspy) -------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
    var map = {};
    links.forEach(function (l) {
      var t = document.querySelector(l.getAttribute("href"));
      if (t) map[t.id] = l;
    });
    var targets = Object.keys(map).map(function (id) { return document.getElementById(id); });
    if (!targets.length || !("IntersectionObserver" in window)) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          if (map[entry.target.id]) map[entry.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* -------- Horaires : jour courant + ouvert/fermé --------
     Horaires vérifiés : lundi à samedi 9h–19h, dimanche fermé.     */
  function initHours() {
    var OPEN_HOUR = 9, CLOSE_HOUR = 19;
    var now = new Date();
    var day = now.getDay();
    var hour = now.getHours() + now.getMinutes() / 60;

    document.querySelectorAll(".hours-list li").forEach(function (li) {
      if (parseInt(li.getAttribute("data-day"), 10) === day) { li.classList.add("today"); }
    });

    var statusEl = document.getElementById("hoursStatus");
    if (!statusEl) return;

    var isOpenDay = day >= 1 && day <= 6;
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

  var prefersReduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- Text Reveal du titre principal --------
     Le texte « Aboné Coiffeur » apparaît progressivement, lettre par
     lettre (fade + montée + léger flou), au chargement. Le texte lui-même
     n'est pas modifié : les lettres sont ré-assemblées à l'identique.     */
  function fillChars(container, text, start, step) {
    var chars = Array.from(text);
    var idx = start;
    chars.forEach(function (ch) {
      var s = document.createElement("span");
      s.className = "tr-char";
      s.textContent = ch;
      s.style.transitionDelay = (idx * step) + "ms";
      container.appendChild(s);
      idx++;
    });
    return idx;
  }

  function initTextReveal() {
    var h1 = document.querySelector(".hero-title");
    if (!h1) return;
    var sub = h1.querySelector("span");                 // « Coiffeur »
    var big = "";
    Array.prototype.forEach.call(h1.childNodes, function (n) {
      if (n.nodeType === 3) big += n.nodeValue;         // « Aboné »
    });
    big = big.trim();
    var subText = sub ? sub.textContent : "";
    if (!big && !subText) return;

    if (prefersReduced) return;                         // titre affiché normalement

    // Retirer les nœuds texte bruts, reconstruire en lettres
    Array.prototype.slice.call(h1.childNodes).forEach(function (n) {
      if (n.nodeType === 3) h1.removeChild(n);
    });

    var step = 38, idx = 0;
    if (big) {
      var line = document.createElement("span");
      line.className = "tr-line";
      idx = fillChars(line, big, idx, step);
      h1.insertBefore(line, sub || null);
    }
    if (sub) {
      sub.textContent = "";
      idx = fillChars(sub, subText, idx, step);
    }

    h1.classList.remove("reveal");
    h1.classList.add("tr-ready");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        h1.querySelectorAll(".tr-char").forEach(function (c) { c.classList.add("tr-in"); });
      });
    });
  }

  /* -------- Léger décalage (cascade) des apparitions groupées -------- */
  function applyStagger() {
    [".presta-list", ".gallery"].forEach(function (sel) {
      var wrap = document.querySelector(sel);
      if (!wrap) return;
      wrap.querySelectorAll(".reveal").forEach(function (el, i) {
        el.style.transitionDelay = (Math.min(i, 6) * 70) + "ms";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTextReveal();
    applyStagger();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initScrollSpy();
    initHours();
    initYear();
  });
})();
