(function () {
  "use strict";

  var WA_NUMBER = "50374657567";
  var WA_MESSAGES = {
    hero: "Hola, vengo de la página web y quiero información sobre los planes empresariales.",
    plans:
      "Hola, vi los planes en la página web y quiero una cotización para mi empresa.",
    close:
      "Hola, vengo de la página web y quiero agendar una reunión para conocer los planes empresariales.",
    float:
      "Hola, vengo de la página web y quiero hablar con un asesor.",
    social:
      "Hola, vengo de las redes en la página web y quiero información sobre los planes empresariales.",
  };

  function waUrl(source) {
    var text = WA_MESSAGES[source] || WA_MESSAGES.hero;
    return (
      "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text)
    );
  }

  function track(eventName) {
    var endpoint = document.documentElement.getAttribute("data-goatcounter");
    if (!endpoint) return;
    var url =
      endpoint +
      "?p=" +
      encodeURIComponent(eventName) +
      "&t=" +
      encodeURIComponent(eventName) +
      "&e=true";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
      return;
    }
    var img = new Image();
    img.src = url;
  }

  function processAnnotations() {
    var elements = document.querySelectorAll("[data-annotate]");
    elements.forEach(function (el) {
      if (el.querySelector(".annotation")) return;
      el.innerHTML = el.innerHTML.replace(
        /\[([^\]]+)\]/g,
        '<span class="annotation">[$1]</span>',
      );
    });
  }

  function wireWhatsApp() {
    var links = document.querySelectorAll("[data-wa]");
    links.forEach(function (link) {
      var source = link.getAttribute("data-wa");
      link.setAttribute("href", waUrl(source));
      link.addEventListener("click", function () {
        track("whatsapp-" + source);
      });
    });
  }

  function wireSocial() {
    var links = document.querySelectorAll("[data-social]");
    links.forEach(function (link) {
      var id = link.getAttribute("data-social");
      link.addEventListener("click", function () {
        track("social-" + id);
      });
    });
  }

  function setupFloatingWhatsApp() {
    var button = document.getElementById("wa-float");
    if (!button) return;

    var anchors = [].slice.call(document.querySelectorAll(".masthead, .cta"));
    if (!anchors.length || !("IntersectionObserver" in window)) {
      button.classList.add("is-visible");
      return;
    }

    var onScreen = new Set();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            onScreen.add(entry.target);
          } else {
            onScreen.delete(entry.target);
          }
        });
        button.classList.toggle("is-visible", onScreen.size === 0);
      },
      { rootMargin: "0px 0px 30% 0px", threshold: 0 },
    );

    anchors.forEach(function (anchor) {
      observer.observe(anchor);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    processAnnotations();
    wireWhatsApp();
    wireSocial();
    setupFloatingWhatsApp();
  });

  if (typeof window !== "undefined") {
    window.DesignSystem = {
      processAnnotations: processAnnotations,
      waUrl: waUrl,
    };
  }
})();
