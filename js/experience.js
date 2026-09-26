(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function persist(theme) {
    try {
      localStorage.setItem("fmt-theme", theme);
    } catch (e) {}
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0f1a28" : "#f4efe4");
    if (!toggle) return;
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
    var label = toggle.querySelector(".theme-toggle-label");
    if (label) label.textContent = dark ? "Claro" : "Oscuro";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      persist(next);
    });
  }

  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  function revealAll() {
    document.querySelectorAll(".reveal").forEach(function (node) {
      node.classList.add("is-in");
    });
  }

  if (reduce.matches) {
    revealAll();
    return;
  }

  if (typeof reduce.addEventListener === "function") {
    reduce.addEventListener("change", function () {
      if (reduce.matches) revealAll();
    });
  }

  var revealNodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
    );
    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  } else {
    revealAll();
  }

  function paintCount(el, value) {
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    el.textContent = decimals ? value.toFixed(decimals) : String(Math.round(value));
  }

  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var from = parseFloat(el.getAttribute("data-from") || "0");
    if (!isFinite(target)) return;
    if (!isFinite(from)) from = 0;
    var start = performance.now();
    var duration = 1000;
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      paintCount(el, t === 1 ? target : from + (target - from) * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.55 },
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  var layers = document.querySelectorAll("[data-parallax]");
  if (!layers.length) return;
  var ticking = false;
  function paintParallax() {
    var y = window.scrollY || window.pageYOffset || 0;
    layers.forEach(function (el) {
      var factor = parseFloat(el.getAttribute("data-parallax")) || 0;
      el.style.transform = "translate3d(0," + (y * factor).toFixed(2) + "px,0)";
    });
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paintParallax);
    },
    { passive: true },
  );
  paintParallax();
})();
