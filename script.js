const WA_NUMBER = "523423432324";
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

// Menu móvil
const btn = $("#menuBtn"), nav = $("#nav");
btn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open ? "true" : "false");
});
$$("#nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// Filtros catálogo
$$(".chip").forEach(chip => chip.addEventListener("click", () => {
  $$(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  const f = chip.dataset.filter;
  $$("#productGrid .product").forEach(card => {
    card.style.display = (f === "all" || card.dataset.cat === f) ? "" : "none";
  });
}));

// Botones con mensaje prellenado
$$("[data-wa]").forEach(a => {
  const msg = a.getAttribute("data-wa");
  a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
});

// Cotizador
$("#waForm").addEventListener("submit", e => {
  e.preventDefault();
  const cat = $("#waCat").value;
  const msg = $("#waMsg").value.trim();
  const text = `Hola Tech Nova, busco (${cat}): ${msg || "quiero asesoría"}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// Form contacto -> WhatsApp
$("#leadForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#leadName").value.trim();
  const want = $("#leadWant").value.trim();
  const text = `Hola Tech Nova, soy ${name}. Me interesa: ${want}. ¿Me ayudas?`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
}), { threshold: 0.12 });
$$(".card, .photo-card, .steps li, .wa-box, .widget-card, .store-info").forEach(el => {
  el.classList.add("reveal"); io.observe(el);
});
