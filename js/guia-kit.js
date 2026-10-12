/* ==========================================================================
   guia-kit.js · El "Resumen de la clase" como Kit interactivo en pantalla

   Principio: UN SOLO contenido, DOS presentaciones.
   - Papel: la sección 05 "Resumen de la clase" se imprime completa, como siempre.
   - Pantalla: la sección no se muestra (ni aparece en el menú). Este script lee
     sus mismas partes (h3 con id: actividades, referencia-rapida, herramientas,
     glosario, fuentes) y las ofrece como pestañas de un cajón lateral.
   Si el script falla, o el Resumen tiene un h3 que no conoce, no hace nada y la
   sección queda visible: no se pierde contenido.

   Va ANTES de guia-nav.js (marca body.gkit-on, que el menú consulta).
   API pública: window.guiaKit = { open(tab), close(), openGlossary(itemId, fromId) }
   ========================================================================== */
(function(){
  'use strict';
  if(window.guiaKit) return;
  var res=document.getElementById('resumen'); if(!res) return;
  var prose=res.querySelector('.prose'); if(!prose) return;

  var TABS=[
    {id:'actividades',      label:'Actividades',       icon:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9"/>'},
    {id:'referencia-rapida',label:'Referencia',        title:'Referencia rápida', icon:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'},
    {id:'herramientas',     label:'Herramientas',      icon:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.3-.6-.6-2.3z"/>'},
    {id:'glosario',         label:'Glosario',          icon:'<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 4v16"/>'},
    {id:'fuentes',          label:'Fuentes', web:false,           icon:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>'}
  ];
  var known={}; TABS.forEach(function(t){ known[t.id]=t; });

  /* ---- 1. Leer las partes del Resumen. Si hay algo desconocido, no hacemos nada. ---- */
  var parts={}, order=[], cur=null;
  [].slice.call(prose.children).forEach(function(n){
    if(n.tagName==='H3'){
      if(!known[n.id]||parts[n.id]){ parts=null; return; }
      if(!parts) return;
      cur=n.id; parts[cur]={h:n,nodes:[]}; order.push(cur); return;
    }
    if(parts&&cur) parts[cur].nodes.push(n);
    else if(parts&&n.nodeType===1) parts=null;           /* contenido suelto antes del primer h3 */
  });
  if(!parts||!order.length) return;

  function store(op,k,v){ try{ if(op==='get') return localStorage.getItem(k); if(op==='set') localStorage.setItem(k,v); }catch(e){} return null; }
  var KEY='gkit:'+location.pathname;
  function el(tag,cls,html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function svg(p){ return '<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>'; }
  function txt(n){ return n.textContent.replace(/\s+/g,' ').trim(); }
  function norm(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(); }

  document.body.classList.add('gkit-on');

  /* ---- 2. Estructura: barra de pestañas + cajón ---- */
  var bar=el('nav','gkit-bar'); bar.setAttribute('aria-label','Kit de la clase');
  /* Escritorio (>=1100px): la barra va ARRIBA (marca + buscador + pestañas + PDF). En móvil es el dock inferior y estos extras se ocultan. */
  var tm=/^(Clase\s*\d+)\s*[-–]\s*(.*)$/.exec(document.title)||[0,'Guía visual',document.title];
  var brand=el('div','gkit-brand','<span class="gkit-kicker"></span><span class="gkit-btitle"></span>');
  brand.firstChild.textContent=tm[1]; brand.lastChild.textContent=tm[2];
  var search=el('button','gkit-search','<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span>Buscar en la clase</span><kbd>Ctrl K</kbd>'); search.type='button';
  search.addEventListener('click',function(){ var b=document.querySelector('.gs-open'); if(b) b.click(); });
  var tabsBox=el('div','gkit-tabs');
  /* Botón del índice (estilo barra lateral de macOS): a la izquierda de la barra; reemplaza al botón del encabezado del índice */
  var side=el('button','gkit-side','<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>'); side.type='button';
  side.title='Mostrar u ocultar el índice'; side.setAttribute('aria-label','Mostrar u ocultar el índice');
  side.addEventListener('click',function(){ var c=document.body.classList.toggle('nav-collapsed'); try{ localStorage.setItem('gnav-collapsed',c?'1':'0'); }catch(e){} });
  bar.appendChild(side); bar.appendChild(brand); bar.appendChild(search); bar.appendChild(tabsBox);
  var drawer=el('aside','gkit-drawer'); drawer.id='gkit-drawer'; drawer.setAttribute('aria-hidden','true');
  var head=el('div','gkit-head'); var title=el('h2','gkit-title',''); head.appendChild(title);
  var pdfBtn=el('button','gkit-pdf','Guardar PDF'); pdfBtn.type='button';
  pdfBtn.addEventListener('click',function(){ var f=document.querySelector('.pdf-fab'); if(f) f.click(); });
  head.appendChild(pdfBtn);
  var closeBtn=el('button','gkit-close','×'); closeBtn.type='button'; closeBtn.setAttribute('aria-label','Cerrar'); head.appendChild(closeBtn);
  drawer.appendChild(head);
  var body=el('div','gkit-body'); drawer.appendChild(body);

  var panels={}, tabBtns={};
  var webOrder=order.filter(function(id){ return known[id].web!==false; });   /* Fuentes: solo en papel */
  order.forEach(function(id){
    var t=known[id]; if(t.web===false) return;
    var b=el('button','gkit-tab',svg(t.icon)+'<span>'+t.label+'</span>'); b.type='button';
    b.title=(t.title||t.label); b.setAttribute('aria-label',(t.title||t.label)); b.setAttribute('aria-controls','gkit-p-'+id); b.setAttribute('aria-expanded','false'); b.dataset.tab=id;
    b.addEventListener('click',function(){ if(drawer.classList.contains('open')&&active===id) close(); else open(id); });
    tabsBox.appendChild(b); tabBtns[id]=b;
    var p=el('section','gkit-panel gkit-panel-'+id); p.id='gkit-p-'+id; p.hidden=true; p.dataset.title=t.title||parts[id].h.textContent.trim();
    parts[id].nodes.forEach(function(n){ p.appendChild(n.cloneNode(true)); });
    /* ids de las copias: prefijo k- (los originales siguen existiendo para el papel) */
    [].forEach.call(p.querySelectorAll('[id]'),function(e){ e.id='k-'+e.id; });
    [].forEach.call(p.querySelectorAll('label[for]'),function(e){ e.setAttribute('for','k-'+e.getAttribute('for')); });
    body.appendChild(p); panels[id]=p;
  });
  var scrim=el('div','gkit-scrim'); scrim.addEventListener('click',function(){ close(); });
  tabsBox.appendChild(el('span','gkit-sep',''));
  var pdfTop=el('button','gkit-pdf-top','Guardar PDF'); pdfTop.type='button';
  pdfTop.addEventListener('click',function(){ var f=document.querySelector('.pdf-fab'); if(f) f.click(); });
  tabsBox.appendChild(pdfTop);
  var prog=el('div','gkit-prog','<i></i>'); bar.appendChild(prog);
  function syncProg(){ var i=document.querySelector('.gnav-bar i'), w=i&&i.style.width;
    if(!w){ var H=document.documentElement.scrollHeight-innerHeight; w=(H>0?Math.min(100,Math.max(0,scrollY*100/H)):0)+'%'; }
    prog.firstChild.style.width=w; }
  var tk=false; addEventListener('scroll',function(){ if(tk) return; tk=true; requestAnimationFrame(function(){ tk=false; syncProg(); }); },{passive:true}); syncProg();
  document.body.appendChild(scrim); document.body.appendChild(drawer); document.body.appendChild(bar);

  /* ---- 3. Actividades: sin entregables ni la frase del objetivo, con conteo y estado guardado ---- */
  var pa=panels['actividades'];
  if(pa){
    [].forEach.call(pa.querySelectorAll('.callout[data-type="action"]'),function(c){ c.remove(); });
    var first=pa.firstElementChild; if(first&&first.tagName==='P') first.remove();
    var boxes=[].slice.call(pa.querySelectorAll('input.checkbox'));
    var saved={}; try{ saved=JSON.parse(store('get',KEY+':chk')||'{}')||{}; }catch(e){ saved={}; }
    var sum=el('div','gkit-sum'); pa.insertBefore(sum,pa.firstChild);
    var units=[];
    [].slice.call(pa.querySelectorAll('h4')).forEach(function(h){
      var u=el('div','gkit-unit'), n=h.nextElementSibling, own=[];
      h.parentNode.insertBefore(u,h); u.appendChild(h);
      while(n&&n.tagName!=='H4'){ var nx=n.nextElementSibling; u.appendChild(n); n=nx; }
      h.setAttribute('role','button'); h.tabIndex=0; h.setAttribute('aria-expanded','true');
      var cnt=el('span','gkit-count',''); h.appendChild(cnt);
      var goal=h.getAttribute('data-goal'), href=h.getAttribute('data-href');
      if(goal||href){
        var info=el('div','gkit-goal');
        if(goal) info.appendChild(el('span','',goal.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];})));
        if(href&&document.querySelector(href)){ var a=el('a','gkit-go','Ir a la unidad →'); a.href=href; a.addEventListener('click',function(){ if(window.matchMedia('(max-width:1099px)').matches) close(); }); info.appendChild(a); }
        u.insertBefore(info,h.nextSibling);
      }
      function tog(){ var c=u.classList.toggle('closed'); h.setAttribute('aria-expanded',c?'false':'true'); }
      h.addEventListener('click',function(e){ if(e.target.closest('a')) return; tog(); });
      h.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tog(); } });
      units.push({u:u,cnt:cnt});
    });
    function recount(){
      var done=0; boxes.forEach(function(b){ if(b.checked) done++; });
      sum.innerHTML='<b>'+done+' de '+boxes.length+'</b> actividades hechas<span class="gkit-bar-track"><i style="width:'+(boxes.length?Math.round(done*100/boxes.length):0)+'%"></i></span>';
      units.forEach(function(x){
        var bs=x.u.querySelectorAll('input.checkbox'), d=0; [].forEach.call(bs,function(b){ if(b.checked) d++; });
        x.cnt.textContent=d+' de '+bs.length; x.u.classList.toggle('done',bs.length>0&&d===bs.length);
      });
    }
    boxes.forEach(function(b){
      var oid=b.id.replace(/^k-/,''), orig=document.getElementById(oid);
      if(saved[oid]){ b.checked=true; if(orig) orig.checked=true; }
      b.addEventListener('change',function(){
        if(orig) orig.checked=b.checked;
        if(b.checked) saved[oid]=1; else delete saved[oid];
        store('set',KEY+':chk',JSON.stringify(saved)); recount();
      });
    });
    recount();
  }

  /* ---- 4. Herramientas: filtros ---- */
  var ph=panels['herramientas'];
  if(ph){
    var tools=[].slice.call(ph.querySelectorAll('.kit-tool'));
    tabBtns['herramientas'].insertAdjacentHTML('beforeend','<em class="gkit-badge">'+tools.length+'</em>');
    var HL=''; var cs0=document.currentScript; if(cs0&&cs0.src) HL=cs0.src.replace(/js\/guia-kit\.js(\?.*)?$/,'herramientas.html');
    if(HL){ var ah=el('a','gkit-gl','Todas las herramientas del curso →'); ah.href=HL; ah.target='_blank'; ah.rel='noopener'; ah.style.display='inline-block'; ah.style.margin='4px 0 14px';
      var pp=ph.querySelector('p'); if(pp) pp.after(ah); else ph.insertBefore(ah,ph.firstChild); }
  }

  /* ---- 5. Glosario: filtro, interruptor de marcas, leyenda y enlace al glosario del curso ---- */
  var pg=panels['glosario'], origItems=[].slice.call(document.querySelectorAll('#resumen .glossary .gloss-item')), cloneItems=[];
  if(pg){
    cloneItems=[].slice.call(pg.querySelectorAll('.gloss-item'));
    var tools2=el('div','gkit-gtools');
    var inp=el('input','gkit-find'); inp.type='search'; inp.placeholder='Buscar un término'; inp.setAttribute('aria-label','Buscar un término');
    inp.addEventListener('input',function(){ var q=norm(inp.value.trim()); cloneItems.forEach(function(it){ it.hidden=!!q&&norm(txt(it)).indexOf(q)<0; }); });
    var lab=el('label','gkit-switch'); var cb=el('input'); cb.type='checkbox'; cb.checked=store('get','gkit:gh')!=='off';
    lab.appendChild(cb); lab.appendChild(el('span','','Marcar términos en la guía'));
    function applyGh(){ document.body.classList.toggle('gkit-gh-off',!cb.checked); store('set','gkit:gh',cb.checked?'on':'off'); }
    cb.addEventListener('change',applyGh); applyGh();
    var legend=el('p','gkit-legend','<span class="gs-sample">Término</span> Los términos subrayados en el texto muestran su definición al pasar el mouse o tocarlos.');
    tools2.appendChild(inp); tools2.appendChild(lab); tools2.appendChild(legend);
    var GL=''; var cs=document.currentScript; if(cs&&cs.src) GL=cs.src.replace(/js\/guia-kit\.js(\?.*)?$/,'glosario.html');
    if(GL){ var al=el('a','gkit-gl','Glosario de todo el curso →'); al.href=GL; al.target='_blank'; al.rel='noopener'; tools2.appendChild(al); }
    pg.insertBefore(tools2,pg.firstChild);
  }

  /* ---- 6. Abrir / cerrar ---- */
  var active=null, lastFocus=null;
  function open(id){
    if(!panels[id]) id=webOrder[0];
    if(!drawer.classList.contains('open')) lastFocus=document.activeElement;
    active=id;
    webOrder.forEach(function(k){ panels[k].hidden=(k!==id); tabBtns[k].setAttribute('aria-expanded',k===id?'true':'false'); tabBtns[k].classList.toggle('on',k===id); });
    title.textContent=panels[id].dataset.title;
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); scrim.classList.add('on');
    body.scrollTop=0;
  }
  function close(){
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); scrim.classList.remove('on');
    webOrder.forEach(function(k){ tabBtns[k].classList.remove('on'); tabBtns[k].setAttribute('aria-expanded','false'); });
    active=null;
    if(lastFocus&&lastFocus.focus){ try{ lastFocus.focus({preventScroll:true}); }catch(e){} }
  }
  closeBtn.addEventListener('click',close);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&drawer.classList.contains('open')){ close(); } });
  /* clic fuera del cajón y de la barra: lo cierra (en escritorio no hay velo) */
  document.addEventListener('mousedown',function(e){
    if(!drawer.classList.contains('open')) return;
    if(drawer.contains(e.target)||bar.contains(e.target)||(e.target.closest&&(e.target.closest('.pdf-fab')||e.target.closest('.gh-card')||e.target.closest('.gs-box')||e.target.closest('.gh-sheet')))) return;
    close();
  });

  function openGlossary(itemId,fromId){
    var orig=document.getElementById(itemId), i=origItems.indexOf(orig);
    if(!pg||i<0) { open('glosario'); return; }
    var inp2=pg.querySelector('.gkit-find'); if(inp2&&inp2.value){ inp2.value=''; inp2.dispatchEvent(new Event('input')); }
    open('glosario');
    var it=cloneItems[i];
    [].forEach.call(pg.querySelectorAll('.gh-back'),function(b){ b.remove(); });
    if(fromId){
      var b=el('a','gh-back','↩ Volver al texto'); b.href='#'+fromId;
      b.addEventListener('click',function(){ if(window.matchMedia('(max-width:1099px)').matches) close(); });
      it.appendChild(b);
    }
    setTimeout(function(){
      it.scrollIntoView({block:'center',behavior:'smooth'});
      it.classList.add('gh-flash'); setTimeout(function(){ it.classList.remove('gh-flash'); },2200);
    },60);
  }

  window.guiaKit={ open:open, close:close, openGlossary:openGlossary };
})();
