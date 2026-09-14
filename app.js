(() => {
  'use strict';

  const WA_NUMBER = '523423432324';
  const STORAGE_KEY = 'tn_leads';
  const CRM_PIN = '1234';

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── year ── */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── mobile nav ── */
  const navToggle = qs('#navToggle');
  const mainNav = qs('#mainNav');
  const header = qs('#header');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      mainNav.setAttribute('aria-hidden', String(open));
      document.body.classList.toggle('no-scroll', !open);
    });

    qsa('.main-nav a', mainNav).forEach(a => {
      a.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ── header shrink ── */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('shrink', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── reveal on scroll ── */
  const reveals = qsa('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => io.observe(el));
  }

  /* ── smooth anchor scroll (fallback) ── */
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = qs(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── WhatsApp helper ── */
  function waLink(text) {
    const msg = encodeURIComponent(text || '');
    return `https://wa.me/${WA_NUMBER}?text=${msg}`;
  }

  /* ── data-wa-pretext buttons ── */
  qsa('[data-wa-pretext]').forEach(btn => {
    btn.addEventListener('click', e => {
      if (btn.tagName === 'A') {
        const text = btn.getAttribute('data-wa-pretext');
        if (text) {
          e.preventDefault();
          window.open(waLink(text), '_blank', 'noopener');
        }
      }
    });
  });

  /* ── leads storage ── */
  function getLeads() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveLeads(leads) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); }
    catch { /* quota exceeded – ignore */ }
  }

  /* ── lead form ── */
  const leadForm = qs('#leadForm');
  const leadResult = qs('#leadResult');

  if (leadForm) {
    leadForm.addEventListener('submit', e => {
      e.preventDefault();
      if (leadResult) { leadResult.textContent = ''; leadResult.className = 'form-note'; }

      const name = (qs('#leadName')?.value || '').trim();
      const phone = (qs('#leadPhone')?.value || '').trim();
      const product = qs('#leadProduct')?.value || '';
      const msg = (qs('#leadMsg')?.value || '').trim();

      if (!name || !phone || !product) {
        if (leadResult) {
          leadResult.textContent = 'Ingresa nombre, teléfono y producto.';
          leadResult.className = 'form-note error';
        }
        if (!name) qs('#leadName')?.setAttribute('aria-invalid', 'true');
        if (!phone) qs('#leadPhone')?.setAttribute('aria-invalid', 'true');
        if (!product) qs('#leadProduct')?.setAttribute('aria-invalid', 'true');
        return;
      }

      qs('#leadName')?.removeAttribute('aria-invalid');
      qs('#leadPhone')?.removeAttribute('aria-invalid');
      qs('#leadProduct')?.removeAttribute('aria-invalid');

      const lead = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name,
        phone,
        product,
        message: msg,
        date: new Date().toISOString(),
      };

      const leads = getLeads();
      leads.unshift(lead);
      saveLeads(leads);

      const waMsg = `Hola Tienda Tech Nova,\n\nSoy *${name}*.\nTel: ${phone}\nProducto: ${product}${msg ? `\nMensaje: ${msg}` : ''}\n\nQuiero una cotización, por favor.`;

      window.open(waLink(waMsg), '_blank', 'noopener');

      if (leadResult) {
        leadResult.textContent = '¡Listo! Tu mensaje se abrió en WhatsApp y lo guardamos como prospecto.';
        leadResult.className = 'form-note success';
      }

      leadForm.reset();
      setTimeout(() => { if (leadResult) leadResult.textContent = ''; }, 8000);
    });

    qsa('#leadForm input, #leadForm select, #leadForm textarea').forEach(inp => {
      inp.addEventListener('input', () => inp.removeAttribute('aria-invalid'));
    });
  }

  /* ── CRM modal ── */
  const crmModal = qs('#crmModal');
  const openCrmBtn = qs('#openCrmBtn');
  const crmLoginForm = qs('#crmLoginForm');
  const crmLogin = qs('#crmLogin');
  const crmView = qs('#crmView');
  const crmCount = qs('#crmCount');
  const crmList = qs('#crmList');
  const crmExport = qs('#crmExport');
  const crmClear = qs('#crmClear');
  const crmLoginMsg = qs('#crmLoginMsg');

  function openCrm() {
    if (!crmModal) return;
    crmModal.hidden = false;
    document.body.classList.add('no-scroll');
    if (openCrmBtn) openCrmBtn.setAttribute('aria-expanded', 'true');
    qs('#crmPin')?.focus();
  }

  function closeCrm() {
    if (!crmModal) return;
    crmModal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (openCrmBtn) openCrmBtn.setAttribute('aria-expanded', 'false');
    if (crmLogin) crmLogin.hidden = false;
    if (crmView) crmView.hidden = true;
    if (crmLoginMsg) { crmLoginMsg.textContent = ''; }
    const pin = qs('#crmPin');
    if (pin) pin.value = '';
  }

  if (openCrmBtn) openCrmBtn.addEventListener('click', openCrm);

  qsa('[data-close-crm]').forEach(el => {
    el.addEventListener('click', closeCrm);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && crmModal && !crmModal.hidden) closeCrm();
  });

  function renderLeads(leads) {
    if (!crmList) return;
    crmList.innerHTML = '';
    if (crmCount) crmCount.textContent = `${leads.length} prospecto${leads.length !== 1 ? 's' : ''}`;

    if (!leads.length) {
      const empty = document.createElement('p');
      empty.style.cssText = 'color:var(--text-3);text-align:center;padding:2rem;';
      empty.textContent = 'No hay prospectos registrados aún.';
      crmList.appendChild(empty);
      return;
    }

    leads.forEach(lead => {
      const row = document.createElement('div');
      row.className = 'lead-row';
      row.setAttribute('role', 'listitem');

      const date = new Date(lead.date);
      const dateStr = date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

      row.innerHTML = `
        <strong>${escHtml(lead.name)}</strong>
        <span class="lead-product">${escHtml(lead.product)}</span>
        <span class="lead-meta">
          ${escHtml(lead.phone)} · ${dateStr} ${timeStr}${lead.message ? ` · "${escHtml(lead.message)}"` : ''}
        </span>
      `;
      crmList.appendChild(row);
    });
  }

  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  if (crmLoginForm) {
    crmLoginForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = (qs('#crmPin')?.value || '').trim();
      if (val !== CRM_PIN) {
        if (crmLoginMsg) { crmLoginMsg.textContent = 'Clave incorrecta. Intenta de nuevo.'; }
        return;
      }
      if (crmLoginMsg) crmLoginMsg.textContent = '';
      if (crmLogin) crmLogin.hidden = true;
      if (crmView) crmView.hidden = false;
      renderLeads(getLeads());
    });
  }

  if (crmExport) {
    crmExport.addEventListener('click', () => {
      const leads = getLeads();
      if (!leads.length) return;

      const header = 'Nombre,Teléfono,Producto,Mensaje,Fecha';
      const rows = leads.map(l =>
        [l.name, l.phone, l.product, l.message || '', new Date(l.date).toLocaleString('es-MX')].map(v => `"${(v||'').replace(/"/g, '""')}"`).join(',')
      );
      const csv = [header, ...rows].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tienda-tech-nova-prospectos-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (crmClear) {
    crmClear.addEventListener('click', () => {
      if (!confirm('¿Eliminar todos los prospectos registrados?')) return;
      saveLeads([]);
      renderLeads([]);
    });
  }

})();