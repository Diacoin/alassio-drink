/* Alassio Drink — interazioni base */
(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");

  /* navbar: sfondo pieno dopo lo scroll */
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* menu mobile */
  if (toggle) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      nav.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        nav.classList.remove("open");
      });
    });
  }

  /* reveal on scroll */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    io.observe(el);
  });

  /* lightbox galleria */
  var lb = document.querySelector(".lb");
  var lbImg = lb ? lb.querySelector("img") : null;
  document.querySelectorAll("[data-lb]").forEach(function (fig) {
    fig.addEventListener("click", function () {
      var img = fig.querySelector("img");
      if (!img) return;
      lbImg.src = img.currentSrc || img.src;
      lb.classList.add("open");
    });
  });
  if (lb) {
    lb.addEventListener("click", function () {
      lb.classList.remove("open");
      lbImg.src = "";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        lb.classList.remove("open");
        lbImg.src = "";
      }
    });
  }

  /* modulo contatti — invio via Web3Forms, senza aprire il client email */
  var cf = document.getElementById("contactForm");
  if (cf) {
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = cf.querySelector(".contact-form__status");
      var btn = cf.querySelector('button[type="submit"]');
      var keyEl = cf.querySelector('input[name="access_key"]');
      var key = keyEl ? keyEl.value : "";
      if (key.indexOf("PLACEHOLDER") !== -1) {
        status.className = "contact-form__status err";
        status.textContent = "Modulo in fase di attivazione — nel frattempo scrivici su Instagram o Facebook.";
        return;
      }
      status.className = "contact-form__status";
      status.textContent = "Invio in corso…";
      btn.disabled = true;
      fetch("https://api.web3forms.com/submit", { method: "POST", body: new FormData(cf) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.success) {
            cf.reset();
            status.className = "contact-form__status ok";
            status.textContent = "Grazie! Messaggio inviato, ti risponderemo presto.";
          } else {
            status.className = "contact-form__status err";
            status.textContent = "Invio non riuscito. Riprova o scrivici sui social.";
          }
          btn.disabled = false;
        })
        .catch(function () {
          status.className = "contact-form__status err";
          status.textContent = "Errore di rete. Riprova più tardi.";
          btn.disabled = false;
        });
    });
  }
})();
