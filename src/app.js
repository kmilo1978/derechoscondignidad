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
    return l ? l.textContent.replace(/\s*\*\s*$/, '').trim() : el.name;
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
      var text = 'Hola, quisiera orientación jurídica confidencial sobre mi caso.\n' + lines.map(function (l) { return l.label + ': ' + l.value; }).join('\n');
      track('form_submit', form.getAttribute('data-loc') || 'home');
      var wa = document.querySelector('a[data-track="whatsapp"][href^="https://wa.me/"]');
      if (panel) {
        var summaryEl = panel.querySelector('[data-summary]');
        if (summaryEl) summaryEl.textContent = text;
        var link = panel.querySelector('[data-wa-link]');
        if (link) { if (wa) { link.href = wa.getAttribute('href').split('?')[0] + '?text=' + encodeURIComponent(text); link.classList.remove('hidden'); } else link.classList.add('hidden'); }
        form.classList.add('hidden'); panel.classList.remove('hidden'); panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (wa) {
        window.open(wa.getAttribute('href').split('?')[0] + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
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

  // ---------- Buscador general del sitio ----------
  (function () {
    var dialog = document.getElementById('searchDialog');
    if (!dialog) return;
    var input = document.getElementById('siteSearchInput');
    var resultsBox = document.getElementById('searchResults');
    var closeBtn = document.getElementById('searchCloseBtn');
    var emptyState = document.getElementById('searchEmptyState');
    var chips = $$('[data-search-chip]');
    var searchTriggers = $$('[data-open-search]');
    var searchData = null;
    var fetchPromise = null;
    var activeIndex = -1;
    var lastFocused = null;

    function loadIndex() {
      if (searchData) return Promise.resolve(searchData);
      if (fetchPromise) return fetchPromise;
      fetchPromise = fetch('/assets/search-index.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          searchData = data;
          return data;
        })
        .catch(function (err) {
          console.warn('Error cargando índice de búsqueda:', err);
          return [];
        });
      return fetchPromise;
    }

    function fold(str) {
      return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    }

    function escapeHtml(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function highlightMatch(text, tokens) {
      if (!text) return '';
      var esc = escapeHtml(text);
      if (!tokens || !tokens.length) return esc;
      tokens.forEach(function (token) {
        if (token.length < 2) return;
        var reg = new RegExp('(' + token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'gi');
        esc = esc.replace(reg, '<mark class="bg-gold-200 text-navy-950 font-semibold px-0.5 rounded">$1</mark>');
      });
      return esc;
    }

    function openSearch(initialQuery) {
      lastFocused = document.activeElement;
      loadIndex();
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.documentElement.classList.add('search-open');
      if (input) {
        if (initialQuery !== undefined) {
          input.value = initialQuery;
          doSearch(initialQuery);
        }
        setTimeout(function () { input.focus(); input.select(); }, 50);
      }
    }

    function closeSearch() {
      if (typeof dialog.close === 'function') {
        if (dialog.open) dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      document.documentElement.classList.remove('search-open');
      activeIndex = -1;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    searchTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
      btn.addEventListener('mouseenter', loadIndex, { once: true });
      btn.addEventListener('focus', loadIndex, { once: true });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSearch);
    }

    // Light dismiss: Test pointer position per modern web guidance
    dialog.addEventListener('click', function (e) {
      var rect = dialog.getBoundingClientRect();
      var isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeSearch();
      }
    });

    // Close on native cancel (Esc)
    dialog.addEventListener('cancel', function () {
      document.documentElement.classList.remove('search-open');
      activeIndex = -1;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        setTimeout(function () { lastFocused.focus(); }, 10);
      }
    });

    // Chips
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var q = chip.getAttribute('data-search-chip');
        if (input) {
          input.value = q;
          doSearch(q);
          input.focus();
        }
      });
    });

    function categoryColor(cat) {
      switch (cat) {
        case 'Áreas de Acción': return 'bg-gold-100 text-gold-900 border-gold-200';
        case 'Procesos y Demandas': return 'bg-blue-100 text-blue-900 border-blue-200';
        case 'Indemnizaciones': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
        case 'Legales': return 'bg-amber-100 text-amber-900 border-amber-200';
        default: return 'bg-slate-100 text-slate-800 border-slate-200';
      }
    }

    function doSearch(q) {
      var query = fold(q).trim();
      if (!query || query.length < 2) {
        resultsBox.innerHTML = '';
        if (emptyState) resultsBox.appendChild(emptyState);
        activeIndex = -1;
        return;
      }

      loadIndex().then(function (data) {
        if (!data || !data.length) return;
        var tokens = query.split(/\s+/).filter(Boolean);
        var scored = [];

        data.forEach(function (item) {
          var tFold = fold(item.t);
          var kFold = fold(item.k);
          var dFold = fold(item.d);
          var cFold = fold(item.c);

          var matchCount = 0;
          var score = 0;

          tokens.forEach(function (token) {
            var tokenScore = 0;
            if (tFold.startsWith(token)) tokenScore += 40;
            else if (tFold.indexOf(token) !== -1) tokenScore += 25;

            if (kFold.indexOf(token) !== -1) tokenScore += 15;
            if (cFold.indexOf(token) !== -1) tokenScore += 10;
            if (dFold.indexOf(token) !== -1) tokenScore += 5;

            if (tokenScore > 0) {
              matchCount++;
              score += tokenScore;
            }
          });

          if (matchCount === tokens.length || (tokens.length > 1 && matchCount >= tokens.length - 1 && score > 20)) {
            scored.push({ item: item, score: score });
          }
        });

        scored.sort(function (a, b) { return b.score - a.score; });
        var top = scored.slice(0, 10).map(function (s) { return s.item; });

        if (!top.length) {
          var waEl = document.querySelector('a[data-track="whatsapp"][href^="https://wa.me/"]') ||
                     document.querySelector('a[data-track="call"][href^="tel:"]') ||
                     document.querySelector('a[href="/contacto/"]');
          var linkHref = '/contacto/';
          var linkLabel = 'Consultar caso sin costo';
          var linkIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>';

          if (waEl) {
            var href = waEl.getAttribute('href');
            if (href.indexOf('wa.me') !== -1) {
              linkHref = href.split('?')[0] + '?text=' + encodeURIComponent('Hola, busqué en la web sobre "' + q + '" y quisiera orientación con un abogado.');
              linkLabel = 'Consultar por WhatsApp sin costo';
              linkIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';
            } else {
              linkHref = href;
              linkLabel = 'Llamar a un abogado ahora';
            }
          }

          var fallbackBtn = '<a href="' + escapeHtml(linkHref) + '" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer">' + linkIcon + linkLabel + '</a>';
          resultsBox.innerHTML = '<div class="py-10 px-6 text-center text-slate-600"><p class="text-base font-semibold text-navy-900">No encontramos resultados para &ldquo;' + escapeHtml(q) + '&rdquo;</p><p class="text-xs text-slate-500 mt-2 max-w-md mx-auto">Cada situación jurídica requiere revisión individual. Escríbenos de forma confidencial y te orientamos sin costo.</p>' + fallbackBtn + '</div>';
          activeIndex = -1;
          return;
        }

        var html = top.map(function (item, idx) {
          var catBadge = '<span class="inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ' + categoryColor(item.c) + '">' + escapeHtml(item.c) + '</span>';
          var highlightedTitle = highlightMatch(item.t, tokens);
          var highlightedDesc = highlightMatch(item.d ? (item.d.length > 110 ? item.d.slice(0, 110) + '…' : item.d) : '', tokens);

          return '<a href="' + item.u + '" role="option" aria-selected="false" data-search-index="' + idx + '" class="search-item group flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">' +
            '<div class="flex-1 min-w-0">' +
              '<div class="flex items-center gap-2 mb-1">' + catBadge + '<span class="text-xs text-slate-400 group-hover:text-slate-600">' + escapeHtml(item.u) + '</span></div>' +
              '<h3 class="text-sm font-semibold text-navy-900 group-hover:text-gold-700 leading-snug">' + highlightedTitle + '</h3>' +
              (highlightedDesc ? '<p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">' + highlightedDesc + '</p>' : '') +
            '</div>' +
            '<span class="text-slate-300 group-hover:text-gold-600 shrink-0 mt-1 transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></span>' +
          '</a>';
        }).join('');

        resultsBox.innerHTML = html;
        activeIndex = -1;
      });
    }

    if (input) {
      var debounceTimer;
      input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          doSearch(input.value);
        }, 120);
      });

      input.addEventListener('keydown', function (e) {
        var items = $$('.search-item', resultsBox);
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
          updateActiveItem(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          updateActiveItem(items);
        } else if (e.key === 'Enter') {
          if (activeIndex >= 0 && items[activeIndex]) {
            e.preventDefault();
            items[activeIndex].click();
          }
        }
      });
    }

    function updateActiveItem(items) {
      items.forEach(function (el, i) {
        var isSelected = (i === activeIndex);
        el.setAttribute('aria-selected', String(isSelected));
        if (isSelected) {
          el.classList.add('bg-slate-100', 'ring-1', 'ring-gold-500');
          el.scrollIntoView({ block: 'nearest' });
        } else {
          el.classList.remove('bg-slate-100', 'ring-1', 'ring-gold-500');
        }
      });
    }

    // Global keyboard shortcut: Ctrl+K / Cmd+K or / (when not typing in an input)
    document.addEventListener('keydown', function (e) {
      var activeTag = (document.activeElement && document.activeElement.tagName) || '';
      var isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';

      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (dialog.open) closeSearch(); else openSearch();
      } else if (e.key === '/' && !isInput && !dialog.open) {
        e.preventDefault();
        openSearch();
      }
    });
  })();

  // ---------- Burbuja flotante de WhatsApp con opciones y envío directo ----------
  (function () {
    var widget = document.getElementById('waWidget');
    if (!widget) return;
    var btn = document.getElementById('waBtn');
    var panel = document.getElementById('waPanel');
    var closeBtn = document.getElementById('waCloseBtn');
    var noteInput = document.getElementById('waNote');
    var emailInput = document.getElementById('waEmail');
    var sendLink = document.getElementById('waSendLink');
    var opts = $$('[data-wa-option]', widget);
    var waNum = widget.getAttribute('data-wa') || '';
    var h1El = document.querySelector('main h1');
    var pageName = h1El ? h1El.textContent.trim().replace(/\s+/g, ' ') : '';
    var pageTag = (location.pathname !== '/' && pageName) ? ' (desde: ' + pageName + ')' : '';
    var selectedBase = 'Hola, vengo desde el sitio web de Derechos con Dignidad y quisiera recibir orientación jurídica confidencial.';

    function buildMessage() {
      var msg = pageTag ? selectedBase.replace('Derechos con Dignidad', 'Derechos con Dignidad' + pageTag) : selectedBase;
      var note = noteInput ? noteInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      if (note) msg += ' Datos / detalle: ' + note + '.';
      if (email) msg += ' Correo: ' + email + '.';
      return msg;
    }

    function syncLink() {
      if (sendLink) {
        sendLink.href = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(buildMessage());
      }
    }

    function setOpen(open) {
      if (!panel || !btn) return;
      panel.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        syncLink();
        if (opts[0]) opts[0].focus();
      }
    }

    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(panel.classList.contains('hidden'));
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        setOpen(false);
        if (btn) btn.focus();
      });
    }
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        opts.forEach(function (o) {
          var active = o === opt;
          o.setAttribute('aria-pressed', String(active));
          o.classList.toggle('border-gold-500', active);
          o.classList.toggle('bg-gold-500/15', active);
          o.classList.toggle('font-semibold', active);
          o.classList.toggle('border-slate-200', !active);
          o.classList.toggle('bg-slate-50', !active);
        });
        selectedBase = opt.getAttribute('data-wa-option') || selectedBase;
        syncLink();
      });
    });
    if (noteInput) noteInput.addEventListener('input', syncLink);
    if (emailInput) emailInput.addEventListener('input', syncLink);
    document.addEventListener('click', function (e) {
      if (panel && !panel.classList.contains('hidden') && !widget.contains(e.target)) {
        setOpen(false);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.classList.contains('hidden')) {
        setOpen(false);
        if (btn) btn.focus();
      }
    });
    syncLink();
  })();

})();
