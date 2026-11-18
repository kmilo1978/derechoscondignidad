/* Calculadora orientativa de perjuicios patrimoniales. Todo se calcula en el navegador.
   NO es una oferta ni una predicción. Metodología pendiente de validación por abogado. */
(function () {
  var root = document.getElementById('calc');
  if (!root) return;
  var $ = function (id) { return document.getElementById(id); };
  var fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  var num = function (id) {
    var el = $(id);
    // Campos de dinero: se muestran con separador de miles (3.000.000), así que se leen solo los dígitos
    var v = el.hasAttribute('data-money') ? parseInt(String(el.value).replace(/\D/g, ''), 10) : parseFloat(String(el.value).replace(',', '.'));
    return isFinite(v) && v > 0 ? v : 0;
  };
  var yearsTouched = false;

  // Formato con separador de miles en campos de dinero
  Array.prototype.forEach.call(root.querySelectorAll('[data-money]'), function (el) {
    el.addEventListener('input', function () {
      var raw = el.value.replace(/\D/g, '');
      el.value = raw ? Number(raw).toLocaleString('es-CO') : '';
      run();
    });
  });
  Array.prototype.forEach.call(root.querySelectorAll('input:not([data-money]), select'), function (el) {
    el.addEventListener('input', function () { if (el.id === 'c-anios') yearsTouched = true; run(); });
    el.addEventListener('change', run);
  });
  $('c-edad').addEventListener('input', function () {
    if (!yearsTouched) { var e = num('c-edad'); $('c-anios').value = e > 0 ? Math.max(0, 65 - e) : ''; }
  });

  var last = null;
  function run() {
    var ingreso = num('c-ingreso'), dias = num('c-dias'), pcl = Math.min(100, num('c-pcl'));
    var anios = num('c-anios'), culpa = Math.min(100, num('c-culpa'));
    var tasa = (num('c-tasa') || 6) / 100;
    var gastos = num('c-gastos'), futuros = num('c-futuros'), otros = num('c-otros');
    var formal = $('c-formal').checked;
    var i = Math.pow(1 + tasa, 1 / 12) - 1; // interés técnico mensual equivalente
    var ra = ingreso * (formal ? 1.25 : 1);   // renta actualizada (con factor prestacional si es empleado formal)

    var emergente = gastos + futuros + otros;
    var consolidado = ra * (dias / 30);
    var n = anios * 12;
    var futuro = (pcl > 0 && n > 0 && i > 0) ? (ra * (pcl / 100)) * ((1 - Math.pow(1 + i, -n)) / i) : 0;
    var subtotal = emergente + consolidado + futuro;
    var ajuste = subtotal * (culpa / 100);
    var total = subtotal - ajuste;
    last = { ingreso: ingreso, dias: dias, pcl: pcl, anios: anios, culpa: culpa, tasa: tasa, formal: formal, emergente: emergente, consolidado: consolidado, futuro: futuro, subtotal: subtotal, ajuste: ajuste, total: total };

    var any = ingreso || dias || gastos || futuros || otros || pcl;
    $('c-empty').classList.toggle('hidden', !!any);
    $('c-result').classList.toggle('hidden', !any);
    if (!any) return;
    $('r-emergente').textContent = fmt.format(emergente);
    $('r-consolidado').textContent = fmt.format(consolidado);
    $('r-futuro').textContent = fmt.format(futuro);
    $('r-subtotal').textContent = fmt.format(subtotal);
    $('r-ajuste').textContent = ajuste > 0 ? '− ' + fmt.format(ajuste) : fmt.format(0);
    $('r-total').textContent = fmt.format(total);
    var max = Math.max(emergente, consolidado, futuro, 1);
    $('b-emergente').style.width = (emergente / max * 100) + '%';
    $('b-consolidado').style.width = (consolidado / max * 100) + '%';
    $('b-futuro').style.width = (futuro / max * 100) + '%';
    var warn = [];
    if (pcl > 0 && anios === 0) warn.push('Indicaste pérdida de capacidad laboral pero 0 años de vida laboral restante: el lucro cesante futuro es cero.');
    if (pcl === 0) warn.push('Sin calificación de pérdida de capacidad laboral no se estima el lucro cesante futuro.');
    $('r-warn').innerHTML = warn.map(function (w) { return '<li>' + w + '</li>'; }).join('');
  }

  function summary() {
    if (!last) return '';
    var l = last;
    return [
      'Estimación orientativa de perjuicios patrimoniales (no es una oferta ni una predicción)',
      'Ingreso mensual: ' + fmt.format(l.ingreso) + (l.formal ? ' (con factor prestacional)' : ''),
      'Días de incapacidad: ' + l.dias + ' | Pérdida de capacidad laboral: ' + l.pcl + '% | Años de vida laboral considerados: ' + l.anios,
      'Daño emergente: ' + fmt.format(l.emergente),
      'Lucro cesante consolidado: ' + fmt.format(l.consolidado),
      'Lucro cesante futuro: ' + fmt.format(l.futuro),
      'Subtotal: ' + fmt.format(l.subtotal),
      'Concurrencia de culpa de la víctima: ' + l.culpa + '% (ajuste ' + fmt.format(l.ajuste) + ')',
      'Total patrimonial orientativo: ' + fmt.format(l.total),
      'No incluye perjuicios morales, daño a la vida de relación ni otros extrapatrimoniales.'
    ].join('\n');
  }

  $('c-copy').addEventListener('click', function () {
    var t = summary();
    if (navigator.clipboard && t) navigator.clipboard.writeText(t).then(function () { $('c-copy').textContent = 'Copiado'; setTimeout(function () { $('c-copy').textContent = 'Copiar resumen'; }, 2000); });
  });
  var wa = $('c-wa');
  if (wa) wa.addEventListener('click', function (e) {
    var base = wa.getAttribute('data-wa');
    if (!base || !last) return;
    e.preventDefault();
    window.open(base + '?text=' + encodeURIComponent('Hola, hice la estimación orientativa en su sitio y quisiera que la revisen:\n' + summary()), '_blank', 'noopener');
    if (window.dataLayer) window.dataLayer.push({ event: 'click_whatsapp', location: 'calculadora' });
  });
  $('c-print').addEventListener('click', function () { window.print(); });
  $('c-reset').addEventListener('click', function () {
    Array.prototype.forEach.call(root.querySelectorAll('input[type=text],input[type=number]'), function (el) { if (el.id !== 'c-tasa') el.value = ''; });
    $('c-formal').checked = false; yearsTouched = false; run();
  });
  run();
})();
