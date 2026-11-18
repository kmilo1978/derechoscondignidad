(function () {
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // ---------- Menú móvil ----------
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    var iOpen = btn.querySelector('[data-icon-open]');
    var iClose = btn.querySelector('[data-icon-close]');
    var setMenu = function (open) {
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      if (iOpen) iOpen.classList.toggle('hidden', open);
      if (iClose) iClose.classList.toggle('hidden', !open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      document.documentElement.classList.toggle('menu-open', open);
    };
    var isOpen = function () { return !menu.classList.contains('hidden'); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!isOpen()); });
    // Cerrar al elegir un enlace (incluye anclas en la misma página)
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    // Cerrar al tocar fuera del encabezado
    document.addEventListener('click', function (e) { if (isOpen() && !e.target.closest('header')) setMenu(false); });
    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) { setMenu(false); btn.focus(); } });
    // Si la pantalla pasa a escritorio, cerrar
    var mq = window.matchMedia('(min-width: 1280px)');
    var onMq = function () { if (mq.matches) setMenu(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
    // Volver con el botón "atrás" (bfcache) con el menú cerrado
    window.addEventListener('pageshow', function () { setMenu(false); });
  }

  // ---------- Seguimiento de conversiones (GA4 si existe; siempre dataLayer) ----------
  window.dataLayer = window.dataLayer || [];
  function track(name, loc) {
    var evt = { event: name, location: loc || '' };
    window.dataLayer.push(evt);
    if (typeof window.gtag === 'function') window.gtag('event', name, { location: loc || '' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-track]');
    if (a) track('click_' + a.getAttribute('data-track'), a.getAttribute('data-loc'));
  });

  // ---------- Lectura: barra de progreso y botón volver arriba ----------
  var bar = document.getElementById('readProgress');
  var top = document.getElementById('toTop');
  var maxScroll = 0, ticking = false;
  function measure() { var h = document.documentElement; maxScroll = h.scrollHeight - h.clientHeight; }
  function paint() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (bar) bar.style.width = (maxScroll > 0 ? Math.min(100, (y / maxScroll) * 100) : 0) + '%';
    if (top) { top.classList.toggle('opacity-0', y < 700); top.classList.toggle('pointer-events-none', y < 700); }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  window.addEventListener('resize', function () { measure(); paint(); });
  window.addEventListener('load', function () { measure(); paint(); });
  requestAnimationFrame(function () { measure(); paint(); });
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ---------- Índice con resaltado de la sección activa ----------
  var tocs = $$('nav[data-toc]');
  if (tocs.length && 'IntersectionObserver' in window) {
    var links = {};
    $$('a[href^="#"]', tocs[0]).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          if (current) current.classList.remove('is-active');
          current = links[en.target.id];
          current.classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  // ---------- Preguntas frecuentes: abrir/cerrar todas y buscador ----------
  $$('[data-faq-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('data-faq-toggle') === 'open';
      $$('details', b.closest('[data-faq]')).forEach(function (d) { d.open = open; });
    });
  });
  $$('[data-faq-search]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      var q = inp.value.toLowerCase().trim();
      var scope = inp.closest('[data-faq]');
      var shown = 0;
      $$('details', scope).forEach(function (d) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        d.classList.toggle('hidden', !hit);
        if (hit) shown++;
        if (q && hit) d.open = true;
      });
      var empty = scope.querySelector('[data-faq-empty]');
      if (empty) empty.classList.toggle('hidden', shown > 0);
    });
  });

  // ---------- Página de guías: buscador y filtros por tema ----------
  var gWrap = document.querySelector('[data-guides]');
  if (gWrap) {
    var cards = $$('a[data-cluster]', gWrap), chips = $$('[data-guide-filter]'), gSearch = document.querySelector('[data-guide-search]');
    var gCount = document.querySelector('[data-guide-count]'), gEmpty = document.querySelector('[data-guide-empty]');
    var topic = 'all';
    var applyGuides = function () {
      var q = (gSearch.value || '').toLowerCase().trim(), n = 0;
      cards.forEach(function (c) {
        var ok = (topic === 'all' || c.getAttribute('data-cluster') === topic) && (!q || c.getAttribute('data-text').indexOf(q) !== -1);
        c.classList.toggle('hidden', !ok); if (ok) n++;
      });
      gCount.textContent = n + (n === 1 ? ' guía' : ' guías');
      gEmpty.classList.toggle('hidden', n > 0);
    };
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        topic = ch.getAttribute('data-guide-filter');
        chips.forEach(function (x) {
          var on = x === ch; x.setAttribute('aria-pressed', String(on));
          x.classList.toggle('bg-navy-900', on); x.classList.toggle('text-white', on); x.classList.toggle('border-navy-900', on);
          x.classList.toggle('bg-white', !on); x.classList.toggle('text-navy-900', !on); x.classList.toggle('border-slate-200', !on);
        });
        applyGuides();
      });
    });
    gSearch.addEventListener('input', applyGuides);
    var hash = decodeURIComponent(location.hash.slice(1));
    if (hash && hash !== 'guias') { chips.forEach(function (ch) { if (ch.getAttribute('data-guide-filter') === hash) ch.click(); }); }
  }

  // ---------- Lista de documentos interactiva (se guarda en el navegador) ----------
  $$('[data-checklist]').forEach(function (box) {
    var key = 'chk:' + box.getAttribute('data-checklist');
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    var items = $$('input[type=checkbox]', box);
    var counter = box.querySelector('[data-count]');
    var barEl = box.querySelector('[data-bar]');
    function update() {
      var done = items.filter(function (i) { return i.checked; }).length;
      if (counter) counter.textContent = done + ' de ' + items.length;
      if (barEl) barEl.style.width = (items.length ? done / items.length * 100 : 0) + '%';
      var st = {}; items.forEach(function (i, n) { if (i.checked) st[n] = 1; });
      try { localStorage.setItem(key, JSON.stringify(st)); } catch (e) {}
    }
    items.forEach(function (i, n) { i.checked = !!saved[n]; i.addEventListener('change', update); });
    update();
    var copy = box.querySelector('[data-checklist-copy]');
    if (copy) copy.addEventListener('click', function () {
      var t = items.map(function (i) { return (i.checked ? '[x] ' : '[ ] ') + i.parentNode.textContent.trim(); }).join('\n');
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { copy.textContent = 'Copiada'; setTimeout(function () { copy.textContent = 'Copiar lista'; }, 2000); });
    });
    var pr = box.querySelector('[data-checklist-print]');
    if (pr) pr.addEventListener('click', function () { window.print(); });
  });

  // ---------- Tooltips de glosario (también en táctil) ----------
  $$('.tip').forEach(function (t) {
    t.addEventListener('click', function (e) { e.preventDefault(); t.focus(); });
  });

  // ---------- Botón copiar (recursos) ----------
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copy]');
    if (!b) return;
    var el = document.querySelector(b.getAttribute('data-copy'));
    if (el && navigator.clipboard) {
      navigator.clipboard.writeText(el.innerText).then(function () {
        b.textContent = 'Copiado';
        setTimeout(function () { b.textContent = 'Copiar'; }, 2000);
      });
    }
  });

  // ---------- Formularios de consulta ----------
  function labelOf(el) {
    if (el.getAttribute('data-label')) return el.getAttribute('data-label');
    var l = el.id && document.querySelector('label[for="' + el.id + '"]');
    return l ? l.textContent.trim() : el.name;
  }
  $$('#leadForm, form[data-lead]').forEach(function (form) {
    var msg = form.querySelector('[role=status]') || document.getElementById('formMsg');
    var panel = form.parentNode.querySelector('[data-success]');
    function show(text, ok) { if (!msg) return; msg.textContent = text; msg.className = 'text-sm ' + (ok ? 'text-green-700' : 'text-red-600'); }
    function invalid(el, text) { el.setAttribute('aria-invalid', 'true'); el.focus(); show(text, false); return false; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      $$('[aria-invalid]', form).forEach(function (x) { x.removeAttribute('aria-invalid'); });
      var f = form.elements;
      if (f.website && f.website.value) return; // honeypot
      if (f.nombre && !f.nombre.value.trim()) return invalid(f.nombre, 'Escribe tu nombre.');
      var tel = (f.telefono && f.telefono.value || '').replace(/\D/g, '');
      if (f.telefono && tel.length < 7) return invalid(f.telefono, 'Escribe un teléfono válido.');
      if (f.correo && f.correo.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.correo.value)) return invalid(f.correo, 'El correo no parece válido.');
      if (f.consent && !f.consent.checked) return invalid(f.consent, 'Debes autorizar el tratamiento de datos para poder contactarte.');
      var lines = [];
      $$('input, select, textarea', form).forEach(function (el) {
        if (!el.name || el.name === 'website' || el.name === 'consent' || el.name === 'consent_salud' || el.type === 'submit') return;
        if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
        if (!el.value || !el.value.trim()) return;
        var label = labelOf(el);
        var existing = lines.filter(function (l) { return l.label === label; })[0];
        if (existing && (el.type === 'checkbox')) existing.value += ', ' + el.value; else lines.push({ label: label, value: el.value.trim() });
      });
      var text = 'Hola, quisiera una orientación sobre mi accidente de tránsito.\n' + lines.map(function (l) { return l.label + ': ' + l.value; }).join('\n');
      track('form_submit', form.getAttribute('data-loc') || 'home');
      var wa = document.querySelector('a[data-track="whatsapp"][href^="https://wa.me/"]');
      if (panel) {
        panel.querySelector('[data-summary]').textContent = text;
        var link = panel.querySelector('[data-wa-link]');
        if (link) { if (wa) { link.href = wa.getAttribute('href').split('?')[0] + '?text=' + encodeURIComponent(text); link.classList.remove('hidden'); } else link.classList.add('hidden'); }
        form.classList.add('hidden'); panel.classList.remove('hidden'); panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (wa) {
        window.open(wa.getAttribute('href').split('?')[0] + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        show('Abrimos WhatsApp con tu mensaje listo para enviar.', true);
        form.reset();
      } else {
        show('Recibimos tu solicitud en esta vista previa. El envío real se activa al configurar WhatsApp o un correo de destino.', true);
        form.reset();
      }
    });
  });
  $$('[data-success]').forEach(function (p) {
    var c = p.querySelector('[data-copy-summary]');
    if (c) c.addEventListener('click', function () {
      var t = p.querySelector('[data-summary]').textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { c.textContent = 'Copiado'; setTimeout(function () { c.textContent = 'Copiar resumen'; }, 2000); });
    });
    var again = p.querySelector('[data-again]');
    if (again) again.addEventListener('click', function () {
      var form = p.parentNode.querySelector('form'); p.classList.add('hidden'); form.classList.remove('hidden'); form.reset();
    });
  });
})();
