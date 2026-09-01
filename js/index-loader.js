/* ==========================================================================
   index-loader.js — Carga dinámica de los bloques Moodle + el cronograma
   dentro de index.html.

   Antes, index.html llevaba una COPIA PEGADA de cada moodle/Clase NN.html
   (y de Cronograma.html en la barra lateral): al editar el fragmento
   original había que volver a pegar el mismo contenido acá a mano, y si
   alguien se olvidaba, index.html quedaba desincronizado en silencio
   (ver historial de CLAUDE.md / README.md, "index.html y sincronización").

   Este archivo reemplaza esa copia por el MISMO patrón de carga dinámica
   ya confirmado funcionando en Qoodle real (CLAUDE-moodle.md 4.2quinquies,
   Clase 04, sep. 2026): cada bloque hace fetch() del .html publicado en
   GitHub Pages y lo inyecta en el DOM. index.html termina mostrando
   exactamente lo mismo que ve un/a estudiante en el campus — porque es
   literalmente el mismo archivo — sin que haga falta tocar index.html de
   nuevo después de cada edición.

   Contrapartida a tener presente: como el fetch apunta al sitio YA
   PUBLICADO (no al archivo local en disco), un cambio recién editado en
   moodle/*.html o en Cronograma.html no se ve acá hasta hacer `git push`
   (y GitHub Pages puede tardar unos minutos en servir la versión nueva,
   cache `max-age=600`). Si hace falta previsualizar un cambio todavía sin
   publicar, por ahora conviene abrir ese .html suelto directamente.

   Cómo se marca un bloque para que este script lo cargue: un contenedor
   vacío con el atributo `data-mdl-src`, con la ruta (relativa a la raíz
   del sitio publicado) del fragmento a traer:

     <div id="m01root" data-mdl-src="moodle/Clase 01 - Herramientas Digitales.html">
       <div>Cargando…</div>
     </div>

   Este script no necesita un listado de bloques a mano: al cargar la
   página, busca todo elemento con `data-mdl-src` y lo resuelve solo — para
   sumar una clase nueva a index.html alcanza con agregar el `<div
   data-mdl-src="...">` correspondiente, no hay que tocar este archivo.
   ========================================================================== */
(function () {
  'use strict';

  var BASE = 'https://marcosxhernandez.github.io/unq-moodle/';
  var AULA_PREVIEW = '39500'; // versión canónica de vista previa, CLAUDE-moodle.md 4.8
  var TIMEOUT_MS = 12000;

  var entregasPromise = null;

  function fetchConTimeout(url, ms) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, ms);
    return fetch(url, { signal: controller.signal }).finally(function () {
      clearTimeout(timer);
    });
  }

  // moodle/entregas.json se pide una sola vez y se comparte entre todos los
  // bloques (varias clases lo necesitan para resolver el botón "Subir link").
  function obtenerEntregas() {
    if (!entregasPromise) {
      entregasPromise = fetchConTimeout(BASE + 'moodle/entregas.json', TIMEOUT_MS)
        .then(function (r) { return r.json(); })
        .catch(function () { return {}; });
    }
    return entregasPromise;
  }

  // Mismo mecanismo que el loader real de Qoodle (CLAUDE-moodle.md
  // 4.2quinquies): los fragmentos de Clases 01-06 traen placeholders
  // {{ENTREGA:NN:orden}} en vez del id de Tarea — se resuelven acá del
  // lado del cliente contra moodle/entregas.json. En un fragmento sin
  // placeholders (la mayoría) este reemplazo simplemente no encuentra nada.
  function resolverPlaceholders(html, mapaAula) {
    return html.replace(/\{\{ENTREGA:(\d+):(\d+)\}\}/g, function (_, clase, orden) {
      return (mapaAula && mapaAula[clase + ':' + orden]) || '';
    });
  }

  // Insertar HTML vía innerHTML no ejecuta los <script> que traiga adentro
  // (los ignora el navegador, a propósito). Cronograma.html sí trae uno
  // (el countdown de "días restantes") — sin esto, se vería el cronograma
  // pero todas las cuentas quedarían en "--" para siempre.
  function ejecutarScripts(contenedor) {
    var scripts = contenedor.querySelectorAll('script');
    scripts.forEach(function (viejo) {
      var nuevo = document.createElement('script');
      for (var i = 0; i < viejo.attributes.length; i++) {
        nuevo.setAttribute(viejo.attributes[i].name, viejo.attributes[i].value);
      }
      nuevo.textContent = viejo.textContent;
      viejo.parentNode.replaceChild(nuevo, viejo);
    });
  }

  function mostrarError(el, src, err) {
    el.innerHTML =
      '<div style="padding:22px 16px;text-align:center;font-size:12.5px;line-height:1.6;color:#8d8b9c;">' +
      '⚠️ No se pudo cargar este bloque (¿sin conexión, o todavía no está publicado?).<br>' +
      '<a href="' + src + '" target="_blank" rel="noopener" style="color:#5b4b9e;">Abrirlo localmente ↗</a>' +
      '</div>';
    if (window.console && console.warn) console.warn('index-loader: fallo al cargar', src, err);
  }

  function cargarBloque(el) {
    var src = el.getAttribute('data-mdl-src');
    if (!src) return;
    var url = encodeURI(BASE + src);

    Promise.all([
      fetchConTimeout(url, TIMEOUT_MS).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      }),
      obtenerEntregas()
    ]).then(function (resultados) {
      var html = resolverPlaceholders(resultados[0], resultados[1][AULA_PREVIEW]);
      var doc = new DOMParser().parseFromString(html, 'text/html');
      el.innerHTML = doc.body.innerHTML;
      ejecutarScripts(el);
    }).catch(function (err) {
      mostrarError(el, src, err);
    });
  }

  function iniciar() {
    document.querySelectorAll('[data-mdl-src]').forEach(cargarBloque);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
