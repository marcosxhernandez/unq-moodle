/* ==========================================================================
   guia-print.js — Botón flotante "Guardar PDF" de la Guía Visual
   ARCHIVO ÚNICO COMPARTIDO, vive en unq-moodle/js/. Cada Guía Visual lo
   referencia con una ruta relativa hacia arriba, como última línea antes
   de </body>:

     <script defer src="../js/guia-print.js"></script>

   Qué hace: inyecta un botón fijo abajo a la derecha que abre el diálogo
   de impresión de Chrome (window.print(), el mismo Ctrl+P). Antes de
   abrirlo muestra un recordatorio de 3 líneas con los ajustes que el
   navegador NO deja forzar desde JS — sobre todo "Gráficos de fondo",
   que si queda apagado exporta el PDF sin los fondos de color de
   callouts, portada y encabezados de sección.

   Todo el estilo vive en css/guia-estilo.css (bloque "Botón flotante
   Guardar PDF"), no acá: este archivo solo arma el DOM y engancha los
   eventos. El botón hereda --acento, así que toma solo el color de cada
   clase sin configuración por archivo.

   No se pega en los fragmentos de bloques/ ni en index.html: ahí el HTML
   lo sirve Moodle, que no ejecuta <script> propio (ver CLAUDE-bloques.md
   4.2). Es exclusivo de clases/*.html.
   ========================================================================== */

(function () {
  'use strict';

  /* Preferencia del lector: si tildó "No volver a mostrarme esto", el
     botón pasa a imprimir directo. En localStorage y no en cookie porque
     el sitio es estático (GitHub Pages) y no hay backend que la lea. El
     try/catch cubre el modo incógnito con almacenamiento bloqueado, donde
     el solo hecho de leer localStorage tira excepción. */
  var SKIP_KEY = 'unq-guia-pdf-sin-recordatorio';

  function recordatorioApagado() {
    try { return window.localStorage.getItem(SKIP_KEY) === '1'; }
    catch (e) { return false; }
  }

  function apagarRecordatorio() {
    try { window.localStorage.setItem(SKIP_KEY, '1'); } catch (e) { /* sin persistencia, no es crítico */ }
  }

  /* Flecha hacia abajo dentro de un disco sólido del acento: el disco
     ocupa el lugar de la foto en la burbuja del docente (.cover-teacher),
     así el botón se lee como el mismo objeto de la portada. En SVG y no
     como emoji ni PNG: hereda el color por currentColor y no suma un
     archivo más a img/. */
  var ICONO_DESCARGA =
    '<span class="pdf-fab-disc" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 4v11"></path>' +
    '<path d="M7.5 10.5 12 15l4.5-4.5"></path>' +
    '<path d="M5 19h14"></path>' +
    '</svg></span>';

  var boton, capa, panel, ultimoFoco;

  /* ---------- Botón flotante ---------- */

  function crearBoton() {
    boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'pdf-fab';
    boton.setAttribute('aria-label', 'Guardar esta clase como PDF');
    /* Misma anatomía que .cover-teacher: disco a la izquierda, dos
       líneas de texto a la derecha (acción arriba, detalle abajo). */
    boton.innerHTML = ICONO_DESCARGA +
      '<span class="pdf-fab-text">' +
        '<span class="pdf-fab-title">Guardar PDF</span>' +
        '<span class="pdf-fab-sub">Esta clase, lista para imprimir</span>' +
      '</span>';
    boton.addEventListener('click', function () {
      if (recordatorioApagado()) { imprimir(); } else { abrirPanel(); }
    });
    document.body.appendChild(boton);
  }

  /* ---------- Panel de recordatorio ---------- */

  function crearPanel() {
    capa = document.createElement('div');
    capa.className = 'pdf-sheet-overlay';
    capa.hidden = true;

    panel = document.createElement('div');
    panel.className = 'pdf-sheet';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'pdf-sheet-title');
    panel.innerHTML =
      '<h2 class="pdf-sheet-title" id="pdf-sheet-title">Antes de guardar</h2>' +
      '<p class="pdf-sheet-intro">Se abre el cuadro de impresión del navegador. ' +
      'Revisá que quede así:</p>' +
      '<ul class="pdf-sheet-list">' +
        '<li><span class="pdf-sheet-key">Destino</span>' +
        '<span class="pdf-sheet-val">Guardar como PDF</span></li>' +
        '<li><span class="pdf-sheet-key">Márgenes</span>' +
        '<span class="pdf-sheet-val">Predeterminado</span></li>' +
        '<li class="is-critical"><span class="pdf-sheet-key">Gráficos de fondo</span>' +
        '<span class="pdf-sheet-val">Activado</span>' +
        '<span class="pdf-sheet-note">Sin esto el PDF sale sin los colores. ' +
        'Está dentro de <em>Más opciones</em>.</span></li>' +
      '</ul>' +
      '<label class="pdf-sheet-skip">' +
        '<input type="checkbox" id="pdf-sheet-skip-input">' +
        '<span>No volver a mostrarme esto</span>' +
      '</label>' +
      '<div class="pdf-sheet-actions">' +
        '<button type="button" class="pdf-sheet-btn is-ghost" data-pdf-action="cerrar">Cancelar</button>' +
        '<button type="button" class="pdf-sheet-btn is-primary" data-pdf-action="imprimir">Abrir impresión</button>' +
      '</div>';

    capa.appendChild(panel);
    document.body.appendChild(capa);

    capa.addEventListener('click', function (ev) {
      if (ev.target === capa) { cerrarPanel(); }
    });

    panel.addEventListener('click', function (ev) {
      var accion = ev.target.getAttribute && ev.target.getAttribute('data-pdf-action');
      if (accion === 'cerrar') { cerrarPanel(); }
      if (accion === 'imprimir') {
        if (panel.querySelector('#pdf-sheet-skip-input').checked) { apagarRecordatorio(); }
        cerrarPanel();
        imprimir();
      }
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !capa.hidden) { cerrarPanel(); }
    });
  }

  function abrirPanel() {
    ultimoFoco = document.activeElement;
    capa.hidden = false;
    /* El foco arranca en la acción principal: con Enter, el flujo
       completo es un clic y una tecla. */
    panel.querySelector('[data-pdf-action="imprimir"]').focus();
  }

  function cerrarPanel() {
    capa.hidden = true;
    if (ultimoFoco && ultimoFoco.focus) { ultimoFoco.focus(); }
  }

  /* ---------- Impresión ---------- */

  /* El panel y el botón ya están ocultos en @media print, pero igual se
     difiere window.print() un frame: en Chrome el diálogo congela un
     snapshot de la página y conviene que el cierre del panel ya esté
     pintado antes de pedirlo. */
  function imprimir() {
    window.requestAnimationFrame(function () {
      window.setTimeout(function () { window.print(); }, 0);
    });
  }

  function iniciar() {
    if (document.querySelector('.pdf-fab')) { return; }  /* por si el script se incluye dos veces */
    crearBoton();
    crearPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
