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

  /* -------- Lumière douce qui suit le curseur (bureau, après l'intro) ---- */
  function initHeroCursor(hero, layer) {
    var tx = 68, ty = 26, cx = 68, cy = 26, raf = 0;
    function loop() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      layer.style.setProperty("--cx", cx.toFixed(2) + "%");
      layer.style.setProperty("--cy", cy.toFixed(2) + "%");
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) { raf = requestAnimationFrame(loop); }
      else { raf = 0; }
    }
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) { raf = requestAnimationFrame(loop); }
    }, { passive: true });
    hero.classList.add("cursor-on");
  }

  /* -------- Animation signature du Hero au chargement --------
     Le mot ABONÉ apparaît, puis une fine ligne lumineuse « de coupe »
     traverse l'écran et révèle le reste du Hero. Le texte n'est pas
     modifié ; l'état final du Hero est strictement identique.            */
  function initHeroIntro() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var h1 = hero.querySelector(".hero-title");
    var sub = h1 ? h1.querySelector("span") : null;
    var word = null;

    if (h1) {
      var big = "";
      Array.prototype.forEach.call(h1.childNodes, function (n) { if (n.nodeType === 3) big += n.nodeValue; });
      big = big.trim();
      if (big) {
        Array.prototype.slice.call(h1.childNodes).forEach(function (n) { if (n.nodeType === 3) h1.removeChild(n); });
        word = document.createElement("span");
        word.className = "hero-word";
        word.textContent = big;
        h1.insertBefore(word, sub || null);
      }
      h1.classList.remove("reveal");
    }

    // sortir les éléments du Hero du système .reveal (l'intro les pilote)
    Array.prototype.forEach.call(hero.querySelectorAll(".reveal"), function (el) { el.classList.remove("reveal"); });

    if (prefersReduced) return;   // affichage statique immédiat

    var isMobile = window.matchMedia && matchMedia("(max-width: 560px)").matches;
    var canHover = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

    // couches d'effet
    var bgfx = document.createElement("div"); bgfx.className = "hero-bgfx";
    var cursor = document.createElement("div"); cursor.className = "hero-cursor";
    bgfx.appendChild(cursor); hero.insertBefore(bgfx, hero.firstChild);

    var topfx = document.createElement("div"); topfx.className = "hero-topfx";
    var line = document.createElement("div"); line.className = "hero-scanline";
    topfx.appendChild(line); hero.appendChild(topfx);

    function anim(el, name, dur, delay) {
      if (!el) return;
      el.style.animation = name + " " + dur + "ms cubic-bezier(.4,0,.2,1) " + delay + "ms both";
    }
    anim(word, isMobile ? "heroWordSimple" : "heroWord", 760, 150);
    anim(hero.querySelector(".hero-kicker"), "heroReveal", 700, 560);
    anim(sub, "heroReveal", 700, 640);
    anim(hero.querySelector(".hero-lead"), "heroReveal", 700, 780);
    anim(hero.querySelector(".hero-cta"), "heroReveal", 700, 940);
    anim(hero.querySelector(".hero-strip"), "heroReveal", 700, 1050);
    anim(hero.querySelector(".hero-visual"), "heroReveal", 800, 1080);

    window.setTimeout(function () {
      if (topfx && topfx.parentNode) { topfx.parentNode.removeChild(topfx); }
      if (canHover && !isMobile) { initHeroCursor(hero, cursor); }
      else if (bgfx && bgfx.parentNode) { bgfx.parentNode.removeChild(bgfx); }
    }, 1750);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeroIntro();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initScrollSpy();
    initHours();
    initYear();
  });
})();
