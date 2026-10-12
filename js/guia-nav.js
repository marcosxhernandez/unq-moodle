/* ==========================================================================
   guia-nav.js — Menú lateral de navegación de la Guía Visual (oct. 2026)
   ARCHIVO ÚNICO COMPARTIDO, vive en unq-moodle/js/. Cada Guía Visual lo
   referencia con una línea, ANTES de guia-print.js y de </body>:

     <script defer src="../js/guia-nav.js"></script>

   Qué hace: arma un panel lateral (escritorio) o una barra superior con
   hoja desplegable (móvil) con TODOS los títulos de la clase (h2 de cada
   section.block + sus h3 y h4), resalta el título actual, rellena una
   línea de tiempo según el avance y anima el scroll con una única curva
   (links del menú, "Volver arriba", links internos y seguimiento del propio
   menú). No necesita markup ni configuración por clase: lee el DOM.

   Todo el estilo vive en css/guia-estilo.css (bloque "Menú lateral de
   navegación"). Solo pantalla: en impresión no existe. No se pega en
   moodle/ ni en index.html (Moodle no ejecuta <script>, CLAUDE-moodle.md 4.2).
   Si no hay JS, la guía queda exactamente como antes (índice de portada).
   ========================================================================== */
(function(){
  'use strict';
  if(window.__guiaNav) return; window.__guiaNav=true;
  var secs=[].slice.call(document.querySelectorAll('section.block'));
  var body=document.body, m=/^(Clase\s*\d+)\s*[-–]\s*(.*)$/.exec(document.title)||[0,'Guía visual',document.title];
  function esc(s){return s.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}

  /* ---- Un único desplazamiento animado para TODO: links del menú, "Volver arriba", título del panel,
          links internos de la página y el seguimiento del propio menú. Misma curva, misma lógica. ---- */
  /* Desde oct. 2026 el desplazamiento se anima SIEMPRE, incluso con "Reducir movimiento" activado en el sistema:
     antes ese ajuste (común en Mac) hacía saltar directo y parecía que la animación no funcionaba. */
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function glide(el,target,opt){
    opt=opt||{}; var isWin=(el===window), box=isWin?document.documentElement:el;
    var start=isWin?window.scrollY:el.scrollTop, max=isWin?box.scrollHeight-innerHeight:el.scrollHeight-el.clientHeight;
    target=Math.max(0,Math.min(max,target)); var dist=target-start;
    if(box.__glide){cancelAnimationFrame(box.__glide.raf);box.__glide=null;}
    if(Math.abs(dist)<2) return;
    function put(y){ if(isWin) window.scrollTo(0,y); else el.scrollTop=y; }
    var dur=opt.dur||Math.min(1800,Math.max(650,600+Math.sqrt(Math.abs(dist))*12)), t0=null, prev=box.style.scrollBehavior;
    box.style.scrollBehavior='auto';
    var st={raf:0}; box.__glide=st;
    function stop(){ if(box.__glide===st){cancelAnimationFrame(st.raf);box.__glide=null;} box.style.scrollBehavior=prev; if(isWin){removeEventListener('wheel',stop);removeEventListener('touchstart',stop);removeEventListener('keydown',stop);removeEventListener('mousedown',stop);} }
    if(isWin){addEventListener('wheel',stop,{passive:true,once:true});addEventListener('touchstart',stop,{passive:true,once:true});addEventListener('keydown',stop,{once:true});addEventListener('mousedown',stop,{once:true});}
    function frame(ts){
      if(box.__glide!==st) return;
      if(t0===null) t0=ts; var k=Math.min(1,(ts-t0)/dur); put(start+dist*ease(k));
      if(k<1) st.raf=requestAnimationFrame(frame); else stop();
    }
    st.raf=requestAnimationFrame(frame);
  }
  function goTo(el,hash){
    var off=parseFloat(getComputedStyle(el).scrollMarginTop)||0;
    glide(window,el.getBoundingClientRect().top+window.scrollY-off);
    if(hash&&history.replaceState){try{history.replaceState(null,'','#'+hash);}catch(e){}}
  }
  /* Cualquier link que apunte a un marcador de ESTA página (#id, o nombre-de-archivo#id, o URL completa#id)
     se anima igual. Se registra antes de armar el menú: funciona aunque la página no tenga menú. */
  function aqui(a){ var h=a.getAttribute('href')||''; if(h.charAt(0)==='#') return h.slice(1);
    if(h.indexOf('#')<0||/^(mailto|tel|javascript):/i.test(h)) return null;
    try{ var u=new URL(a.href,location.href); if(u.hash&&u.href.split('#')[0]===location.href.split('#')[0]) return u.hash.slice(1); }catch(e){} return null; }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a||(a.target&&a.target!=='_self')) return;
    var id=aqui(a); if(!id) return; id=decodeURIComponent(id);
    var t=document.getElementById(id)||document.getElementsByName(id)[0]; if(!t) return;
    e.preventDefault(); body.classList.remove('nav-open'); goTo(t,id);
  });
  var uid=0, entries=[], groups=[];
  secs.forEach(function(sec){
    var h2=sec.querySelector('.block-title'); if(!h2) return;
    var numEl=sec.querySelector('.block-num');
    if(!sec.id) sec.id='g-sec-'+(++uid);
    var g={sec:sec,id:sec.id,lv:2,el:sec,text:h2.textContent.trim(),num:numEl?numEl.textContent.trim():'',kids:[]};
    entries.push(g); groups.push(g);
    [].slice.call(sec.querySelectorAll('h3,h4')).forEach(function(h){
      var t=h.textContent.trim(); if(!t) return;
      if(!h.id) h.id='g-h-'+(++uid);
      var e={sec:sec,id:h.id,lv:h.tagName==='H4'?4:3,el:h,text:t,act:!!h.closest('[class*="activity"]')};
      entries.push(e); g.kids.push(e);
    });
  });
  function li(e,cls){return '<li><a class="lv'+e.lv+(e.act?' is-act':'')+'" href="#'+e.id+'" data-id="'+e.id+'"><span class="gnav-text">'+esc(e.text)+'</span></a></li>';}
  var tree='<div class="gnav-tree"><ol>'+groups.map(function(g){
    return '<li class="sec" data-sec="'+g.id+'"><a class="lv2" href="#'+g.id+'" data-id="'+g.id+'"><span class="gnav-num">'+esc(g.num)+'</span><span class="gnav-text">'+esc(g.text)+'</span></a>'+
      (g.kids.length?'<ul class="kids">'+g.kids.map(li).join('')+'</ul>':'')+'</li>';}).join('')+'</ol></div>';
  var ICON='<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/></svg>';
  var aside=document.createElement('aside'); aside.className='gnav'; aside.setAttribute('aria-label','Contenido de la clase');
  aside.innerHTML='<div class="gnav-head"><button type="button" class="gnav-brand" title="Ir al inicio"><span class="gnav-kicker">'+esc(m[1])+'</span><span class="gnav-title">'+esc(m[2])+'</span></button><button type="button" class="gnav-hide" aria-label="Ocultar el menú" title="Ocultar el menú">'+ICON+'</button></div>'+
    '<div class="gnav-scroll"><nav>'+tree+'</nav></div>'+
    '<div class="gnav-foot"><div class="gnav-bar"><i></i></div><div class="gnav-meta"><span class="gnav-pct">0% leído</span><button type="button" class="gnav-top">Volver arriba ↑</button></div>'+(entries.some(function(e){return e.act;})?'<div class="gnav-legend"><i></i>Actividad</div>':'')+'</div>';
  body.appendChild(aside); body.classList.add('has-gnav');
  var bar=document.createElement('div'); bar.className='gbar';
  bar.innerHTML='<button type="button" aria-expanded="false"><span class="gbar-num"></span><span class="gbar-text">Contenido</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button><span class="gbar-progress"></span>';
  body.appendChild(bar);
  var tg=document.createElement('button'); tg.className='gtoggle'; tg.type='button'; tg.setAttribute('aria-label','Mostrar el menú'); tg.innerHTML=ICON; body.appendChild(tg);
  function setCollapsed(c){body.classList.toggle('nav-collapsed',c);try{localStorage.setItem('gnav-collapsed',c?'1':'0');}catch(e){}}
  try{ if(localStorage.getItem('gnav-collapsed')==='1') body.classList.add('nav-collapsed'); }catch(e){}
  aside.querySelector('.gnav-hide').addEventListener('click',function(){setCollapsed(true);});
  tg.addEventListener('click',function(){setCollapsed(false);});
  function toTop(){body.classList.remove('nav-open');glide(window,0);if(history.replaceState){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}}
  aside.querySelector('.gnav-brand').addEventListener('click',toTop); aside.querySelector('.gnav-top').addEventListener('click',toTop);
  bar.querySelector('button').addEventListener('click',function(){var o=body.classList.toggle('nav-open');this.setAttribute('aria-expanded',o);});
  aside.addEventListener('click',function(e){if(e.target.closest('a'))bar.querySelector('button').setAttribute('aria-expanded','false');});
  aside.addEventListener('click',function(e){if(e.target.closest('a'))body.classList.remove('nav-open');});
  document.addEventListener('click',function(e){if(body.classList.contains('nav-open')&&!e.target.closest('.gnav,.gbar')){body.classList.remove('nav-open');bar.querySelector('button').setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&body.classList.contains('nav-open')){body.classList.remove('nav-open');bar.querySelector('button').focus();}});
  var anchors={}; [].forEach.call(aside.querySelectorAll('a[data-id]'),function(a){anchors[a.dataset.id]=a;});
  var tr=aside.querySelector('.gnav-tree'), sc=aside.querySelector('.gnav-scroll'), secLis=[].slice.call(aside.querySelectorAll('.sec'));
  var last=null, tick=false;
  function update(){
    tick=false; var y=window.scrollY, H=document.documentElement.scrollHeight-innerHeight, p=H>0?Math.min(1,Math.max(0,y/H)):0, line=innerHeight*0.3, curIdx=-1;
    body.classList.toggle('is-scrolled',y>320);
    entries.forEach(function(e,i){ if(e.el.getBoundingClientRect().top<=line){ curIdx=i; e.done=true; } else e.done=false; });
    var cur=curIdx>=0?entries[curIdx]:null;
    entries.forEach(function(e){var a=anchors[e.id]; a.classList.toggle('is-done',e.done); a.classList.toggle('is-active',e===cur); if(e===cur)a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');});
    secLis.forEach(function(l){l.classList.toggle('is-current',!!cur&&l.dataset.sec===cur.sec.id);});
    var a=cur&&anchors[cur.id], trc=tr.getBoundingClientRect();
    if(a&&trc.height){
      var ar=a.getBoundingClientRect();
      tr.style.setProperty('--rail-fill',Math.max(0,ar.top-trc.top+ar.height/2-18)+'px');
    } else { tr.style.setProperty('--rail-fill','0px'); }
    if(cur!==last){ last=cur;
      if(a&&sc.clientHeight){var sr=sc.getBoundingClientRect(),r=a.getBoundingClientRect();
        if(r.top<sr.top+40||r.bottom>sr.bottom-40) glide(sc,sc.scrollTop+(r.top-sr.top)-sr.height/2+r.height/2,{dur:520});}
      var num=cur?(cur.lv===2?cur.num:groups.filter(function(g){return g.sec===cur.sec;})[0].num):'';
      bar.querySelector('.gbar-num').textContent=num; bar.querySelector('.gbar-text').textContent=cur?cur.text:'Contenido';
    }
    aside.querySelector('.gnav-bar i').style.width=(p*100)+'%';
    aside.querySelector('.gnav-pct').textContent=Math.round(p*100)+'% leído';
    bar.querySelector('.gbar-progress').style.width=(p*100)+'%';
  }
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update); update();
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(update);
})();
