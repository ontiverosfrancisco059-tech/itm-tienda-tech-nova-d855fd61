(() => {
  "use strict";
  const WA = "523423432324";

  // Año dinámico
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Menú móvil
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mobileNav.classList.remove("open"))
    );
  }

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Filtro de catálogo
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll("#productGrid .card");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      cards.forEach((card) => {
        const cats = (card.dataset.cat || "").split(" ");
        card.style.display = f === "all" || cats.includes(f) ? "" : "none";
      });
    });
  });

  // Formulario -> WhatsApp (no guarda datos en el sitio)
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const nombre = document.getElementById("fNombre").value.trim();
      const interes = document.getElementById("fInteres").value.trim();
      const tel = document.getElementById("fTel").value.trim();
      const msg =
        "Hola Tech Nova, soy " + nombre +
        ". Me interesa: " + interes +
        (tel ? ". Mi tel: " + tel : "") +
        ". ¿Me ayudas con cotización?";
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }
})();
