/* ============================================================
   Aboné Coiffeur — Bischheim
   Interactions : en-tête, menu, révélations, repère, horaires.
   Trois comportements de mouvement seulement :
   1. Entrée du Hero  (ligne de coupe + montée des mots)
   2. Révélation au défilement (montée douce)
   3. Survol (géré en CSS)
   Respecte prefers-reduced-motion ; simplifié sur mobile.
   Aucune dépendance.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 960px)").matches;

  /* -------- 1. En-tête : ombre/fond au défilement -------- */
  function initHeader() {
    var hd = document.getElementById("hd");
    if (!hd) return;
    var onScroll = function () { hd.classList.toggle("scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Menu mobile -------- */
  function initNav() {
    var burger = document.getElementById("burger");
    var nav = document.getElementById("nav");
    var hd = document.getElementById("hd");
    if (!burger || !nav) return;

    var close = function () {
      nav.classList.remove("open");
      if (hd) hd.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu");
    };
    var open = function () {
      nav.classList.add("open");
      if (hd) hd.classList.add("open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Fermer le menu");
    };
    burger.addEventListener("click", function () {
      if (nav.classList.contains("open")) close(); else open();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) close();
    });
  }

  /* -------- Entrée du Hero : ligne de coupe + montée des mots -------- */
  function initHeroEntry() {
    var h1 = document.querySelector(".hero-h1");
    var scan = document.querySelector(".hero-scan");
    var ruler = document.querySelector(".ruler");

    var play = function () {
      if (h1) h1.classList.add("in");
      if (scan) scan.classList.add("in");
      if (ruler) ruler.classList.add("lit");
    };

    if (reduce) { play(); return; }
    // laisse la page peindre, puis joue l'entrée
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(play);
    });
  }

  /* -------- 2. Révélation au défilement -------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
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
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* -------- Repère latéral + navigation active (scrollspy) -------- */
  function initSpy() {
    var tag = document.getElementById("rulerTag");
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("section[id]")
    );
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var labels = {
      accueil: "00 · Accueil",
      principe: "01 · Le principe",
      prestations: "02 · Prestations",
      studio: "03 · Le studio",
      horaires: "04 · Horaires",
      contact: "05 · Contact"
    };

    var setActive = function (id) {
      links.forEach(function (l) {
        var href = l.getAttribute("href") || "";
        l.classList.toggle("active", href === "#" + id);
      });
      if (tag && labels[id]) tag.textContent = labels[id];
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* -------- Horaires : jour courant + ouvert/fermé --------
     Horaires vérifiés : lundi à samedi 9h–19h, dimanche fermé. */
  function initHours() {
    var OPEN = 9, CLOSE = 19;
    var now = new Date();
    var day = now.getDay();
    var hour = now.getHours() + now.getMinutes() / 60;

    document.querySelectorAll(".tt li[data-day]").forEach(function (li) {
      if (parseInt(li.getAttribute("data-day"), 10) === day) li.classList.add("today");
    });

    var el = document.getElementById("hoursStatus");
    if (!el) return;

    var openDay = day >= 1 && day <= 6;
    var isOpen = openDay && hour >= OPEN && hour < CLOSE;

    if (isOpen) {
      el.classList.remove("closed");
      el.textContent = "Ouvert · jusqu'à 19h00";
    } else {
      el.classList.add("closed");
      if (openDay && hour < OPEN) el.textContent = "Fermé · ouvre à 09h00";
      else if (day === 6) el.textContent = "Fermé · réouverture lundi 09h00";
      else if (day === 0) el.textContent = "Fermé le dimanche · lundi 09h00";
      else el.textContent = "Fermé · réouverture demain 09h00";
    }
  }

  /* -------- Année du pied de page -------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initNav();
    initHeroEntry();
    initReveal();
    if (!isMobile) initSpy();
    initHours();
    initYear();
  });
})();
