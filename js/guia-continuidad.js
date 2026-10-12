/* ==========================================================================
   guia-continuidad.js — "Seguir donde dejaste" + búsqueda Ctrl/⌘+K (oct. 2026)
   ARCHIVO ÚNICO COMPARTIDO, vive en unq-moodle/js/. Cada Guía Visual lo
   referencia con una línea, después de guia-nav.js y guia-glosario.js:

     <script defer src="../js/guia-continuidad.js"></script>

   1) Seguir donde dejaste: guarda en localStorage (por navegador y por clase)
      el último título que el lector pasó; al volver a abrir la clase arriba
      de todo ofrece "Continuar" con un aviso discreto. Sin datos, sin cuenta.
   2) Leyenda del glosario + link a glosario.html en el pie del menú.
   3) Buscar en la clase: Ctrl/⌘+K (o "/") abre un buscador sobre los títulos
      y el glosario de ESTA clase. Botón en el pie del menú (escritorio) y
      botón redondo abajo a la izquierda (móvil).
   Solo pantalla, no va en moodle/ ni index.html. Estilo en guia-estilo.css
   (bloque "Continuidad"). Sin JS la guía queda como antes.
   ========================================================================== */
(function(){
  'use strict';
  if(window.__guiaCont) return; window.__guiaCont=true;
  var cs=document.currentScript, GL=cs&&cs.src?cs.src.replace(/js\/guia-continuidad\.js(\?.*)?$/,'glosario.html'):'';
  var kitOn=document.body.classList.contains('gkit-on');   /* con el Kit, el Resumen vive en el cajón, no en el texto */
  var heads=[].slice.call(document.querySelectorAll('section.block h2, section.block h3, section.block h4')).filter(function(h){ return !(kitOn&&h.closest('#resumen')); });
  if(!heads.length) return;
  function txt(el){ return el.textContent.replace(/\s+/g,' ').trim(); }
  function norm(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(); }
  function store(op,k,v){ try{ if(op==='get') return localStorage.getItem(k); if(op==='set') localStorage.setItem(k,v); else localStorage.removeItem(k); }catch(e){} return null; }

  /* ---------- 1. Seguir donde dejaste ---------- */
  var KEY='guia-pos:'+decodeURIComponent(location.pathname), tSave=0, toast=null;
  function current(){
    var line=window.innerHeight*0.35, idx=0;
    for(var i=0;i<heads.length;i++){ if(heads[i].getBoundingClientRect().top<=line) idx=i; else break; }
    return idx;
  }
  function save(){
    var y=window.scrollY||0; if(y<300) return;
    var h=document.documentElement, max=h.scrollHeight-window.innerHeight, i=current();
    store('set',KEY,JSON.stringify({i:i,t:txt(heads[i]),p:max>0?y/max:0,ts:Date.now()}));
  }
  window.addEventListener('scroll',function(){
    clearTimeout(tSave); tSave=setTimeout(save,400);
    if(toast&&(window.scrollY||0)>250) closeToast();
  },{passive:true});
  function closeToast(){ if(toast){ toast.remove(); toast=null; } }
  (function offer(){
    var raw=store('get',KEY), s=null; try{ s=raw&&JSON.parse(raw); }catch(e){}
    if(!s||!(s.i>=1)||s.i>=heads.length||s.p>=0.95||(window.scrollY||0)>200||location.hash) return;
    if(txt(heads[s.i])!==s.t) return;                       /* la clase cambió desde la última visita */
    setTimeout(function(){
      if((window.scrollY||0)>200) return;
      toast=document.createElement('div'); toast.className='gs-resume'; toast.setAttribute('role','status');
      toast.innerHTML='Seguiste leyendo en<b></b><div class="gs-resume-row"><button type="button" class="go">Continuar</button><button type="button" class="no">Ahora no</button></div>';
      toast.querySelector('b').textContent='«'+s.t+'» · '+Math.round(s.p*100)+'% de la clase';
      toast.querySelector('.go').addEventListener('click',function(){ closeToast(); heads[s.i].scrollIntoView({behavior:'smooth',block:'start'}); });
      toast.querySelector('.no').addEventListener('click',closeToast);
      document.body.appendChild(toast); setTimeout(closeToast,14000);
    },700);
  })();

  /* ---------- 2. Buscar en la clase ---------- */
  var entries=[];
  var secTitle='';
  heads.forEach(function(h){
    var tag=h.tagName, t=txt(h);
    if(tag==='H2'){ secTitle=t; entries.push({kind:'Sección',title:t,sub:'',el:h,rank:0}); }
    else entries.push({kind:tag==='H3'?'Tema':'Subtema',title:t,sub:secTitle,el:h,rank:1});
  });
  [].forEach.call(document.querySelectorAll('.glossary .gloss-item'),function(it,i){
    var t=it.querySelector('.gloss-term'), d=it.querySelector('.gloss-def'); if(!t||!d) return;
    if(!it.id) it.id='gh-item-'+i;
    entries.push({kind:'Glosario',title:txt(t),sub:txt(d),id:it.id,el:it,rank:2,hay:norm(txt(t)+' '+txt(d))});
  });
  entries.forEach(function(e){ e.nt=norm(e.title); if(!e.hay) e.hay=norm(e.title+' '+e.sub); });

  var scrim=document.createElement('div'); scrim.className='gs-scrim';
  var box=document.createElement('div'); box.className='gs-box'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); box.setAttribute('aria-label','Buscar en la clase');
  box.innerHTML='<input class="gs-in" type="text" placeholder="Buscar un tema o un término de esta clase…" role="combobox" aria-expanded="true" aria-controls="gs-list" aria-autocomplete="list" autocomplete="off" spellcheck="false">'+
                '<ul class="gs-list" id="gs-list" role="listbox"></ul><div class="gs-hint">↑ ↓ para moverte · Enter para ir · Esc para cerrar</div>';
  document.body.appendChild(scrim); document.body.appendChild(box);
  var input=box.querySelector('.gs-in'), list=box.querySelector('.gs-list'), shown=[], sel=0, back=null;

  function render(){
    var q=norm(input.value.trim()), toks=q.split(/\s+/).filter(Boolean);
    if(!toks.length) shown=entries.filter(function(e){return e.kind==='Sección';});
    else shown=entries.filter(function(e){ return toks.every(function(t){return e.hay.indexOf(t)>-1;}); })
      .sort(function(a,b){
        function sc(e){ return e.nt.indexOf(q)===0?0:e.nt.indexOf(q)>-1?1:2; }
        return sc(a)-sc(b)||a.rank-b.rank; }).slice(0,10);
    sel=0; list.innerHTML='';
    if(!shown.length){ list.innerHTML='<li class="gs-empty" role="presentation">Sin resultados para «'+input.value.replace(/</g,'&lt;')+'»</li>'; return; }
    shown.forEach(function(e,i){
      var li=document.createElement('li'); li.className='gs-item'; li.id='gs-opt-'+i; li.setAttribute('role','option'); li.setAttribute('aria-selected',i===0?'true':'false');
      var tg=document.createElement('span'); tg.className='gs-tag'; tg.textContent=e.kind;
      var tx=document.createElement('span'); tx.textContent=e.title;
      var sub=e.kind==='Glosario'?(e.sub.length>90?e.sub.slice(0,88)+'…':e.sub):e.sub;
      if(sub){ var s=document.createElement('span'); s.className='gs-sub'; s.textContent=sub; tx.appendChild(s); }
      li.appendChild(tg); li.appendChild(tx);
      li.addEventListener('mousemove',function(){ mark(i); });
      li.addEventListener('click',function(){ go(i); });
      list.appendChild(li);
    });
    input.setAttribute('aria-activedescendant','gs-opt-0');
  }
  function mark(i){
    sel=i; [].forEach.call(list.children,function(li,k){ li.setAttribute('aria-selected',k===i?'true':'false'); });
    input.setAttribute('aria-activedescendant','gs-opt-'+i);
    var el=list.children[i]; if(el&&el.scrollIntoView) el.scrollIntoView({block:'nearest'});
  }
  function openS(){
    if(box.classList.contains('open')) return;
    back=document.activeElement; scrim.classList.add('open'); box.classList.add('open');
    input.value=''; render(); input.focus();
  }
  function closeS(){
    scrim.classList.remove('open'); box.classList.remove('open');
    if(back&&back.focus){ try{ back.focus({preventScroll:true}); }catch(e){} } back=null;
  }
  function go(i){
    var e=shown[i]; if(!e) return; closeS();
    setTimeout(function(){
      if(e.kind==='Glosario'&&window.guiaGlosario) window.guiaGlosario.jump(e.id);
      else e.el.scrollIntoView({behavior:'smooth',block:'start'});
    },60);
  }
  input.addEventListener('input',render);
  scrim.addEventListener('click',closeS);
  box.addEventListener('keydown',function(ev){
    if(ev.key==='ArrowDown'){ ev.preventDefault(); if(shown.length) mark((sel+1)%shown.length); }
    else if(ev.key==='ArrowUp'){ ev.preventDefault(); if(shown.length) mark((sel-1+shown.length)%shown.length); }
    else if(ev.key==='Enter'){ ev.preventDefault(); go(sel); }
    else if(ev.key==='Escape'){ ev.preventDefault(); ev.stopPropagation(); closeS(); }
    else if(ev.key==='Tab'){ ev.preventDefault(); }          /* el foco se queda en el campo */
  });
  document.addEventListener('keydown',function(ev){
    var tg=ev.target, typing=tg&&(/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName)||tg.isContentEditable);
    if((ev.key==='k'||ev.key==='K')&&(ev.ctrlKey||ev.metaKey)){ ev.preventDefault(); box.classList.contains('open')?closeS():openS(); }
    else if(ev.key==='/'&&!typing&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){ ev.preventDefault(); openS(); }
  });

  /* Botones de entrada */
  var SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  var mac=/Mac|iPhone|iPad/i.test(navigator.platform||navigator.userAgent||'');
  function mount(){
    var foot=document.querySelector('.gnav-foot');
    if(foot&&!foot.querySelector('.gs-open')){
      var b=document.createElement('button'); b.type='button'; b.className='gs-open';
      b.innerHTML=SVG+'<span>Buscar en la clase</span><kbd>'+(mac?'⌘K':'Ctrl K')+'</kbd>';
      b.addEventListener('click',openS); foot.insertBefore(b,foot.firstChild);
    }
    /* Leyenda del glosario + acceso al glosario de todo el curso (solo si la clase tiene términos marcados) */
    if(foot&&!kitOn&&!foot.querySelector('.gs-leg')&&document.querySelector('.gh-term')){
      var l=document.createElement('div'); l.className='gnav-legend gs-leg';
      l.innerHTML='<span class="gs-sample">Término</span><span>Pasá el mouse para ver qué significa</span>'; foot.appendChild(l);
      if(GL){ var a=document.createElement('a'); a.className='gs-link'; a.href=GL; a.target='_blank'; a.rel='noopener'; a.textContent='Glosario de todo el curso →'; foot.appendChild(a); }
    }
  }
  mount(); setTimeout(mount,500);
  var fab=document.createElement('button'); fab.type='button'; fab.className='gs-fab'; fab.setAttribute('aria-label','Buscar en la clase'); fab.innerHTML=SVG;
  fab.addEventListener('click',openS); document.body.appendChild(fab);
})();
