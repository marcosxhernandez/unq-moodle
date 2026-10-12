/* ==========================================================================
   guia-glosario.js — Glosario en contexto de la Guía Visual (oct. 2026)
   ARCHIVO ÚNICO COMPARTIDO, vive en unq-moodle/js/. Cada Guía Visual lo
   referencia con una línea, junto a guia-nav.js:

     <script defer src="../js/guia-glosario.js"></script>

   Qué hace: lee los .gloss-item que la clase ya tiene en su Glosario (nada
   que escribir ni duplicar), busca cada término en el texto y marca SOLO su
   primera aparición en toda la clase. Al pasar el mouse o enfocar con el
   teclado muestra una tarjeta con la definición (escritorio); al tocar, una
   hoja inferior (celular/tablet). En los términos que son una app, la tarjeta muestra su ícono (atributo data-icon="Compañía - App.png" en el .gloss-item; archivo en img/apps/). Ambas traen "Ver también" (otros términos
   del glosario que la definición menciona) y "Ver en el glosario", que baja
   a la fila (la resalta y deja un "Volver al texto").

   No se marca: títulos, links, código, botones, labels, el propio glosario,
   portada, índice, la sección de cierre (Resumen), ni una aparición que ya
   está definiendo el término ("CRAAP es…", "LLM (Large…)", en negrita/dfn):
   en ese caso se marca la siguiente. Opt-out: data-no-gloss en cualquier
   contenedor. Forzar un término: <span data-gl="Nombre exacto del glosario">.
   En papel: cada término marcado lleva un ° que remite al Glosario del final.
   No se pega en moodle/ ni en index.html (Moodle no ejecuta <script>).
   Sin JS la guía queda como antes. Estilo en css/guia-estilo.css.
   ========================================================================== */
(function(){
  'use strict';
  if(window.__guiaGlosario) return; window.__guiaGlosario=true;

  var items=[].slice.call(document.querySelectorAll('.glossary .gloss-item'));
  var cs=document.currentScript, BASE=cs&&cs.src?cs.src.replace(/js\/guia-glosario\.js(\?.*)?$/,'img/apps/'):'';   /* íconos: img/apps/ */
  var secs=[].slice.call(document.querySelectorAll('section.block'));
  if(!items.length||!secs.length) return;

  /* ---------- 1. Términos: nombre principal + alias ---------- */
  function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
  var defs=items.map(function(it,i){
    var t=it.querySelector('.gloss-term'), d=it.querySelector('.gloss-def');
    if(!t||!d) return null;
    if(!it.id) it.id='gh-item-'+i;
    var raw=t.textContent.trim(), names=[];
    var m=/^(.*?)\s*\(([^)]*)\)\s*$/.exec(raw), main=m?m[1]:raw, par=m?m[2]:'';
    main.split(/\s+\/\s+/).forEach(function(n){ if(n) names.push(n.trim()); });
    /* El paréntesis es alias solo si es específico (lleva dígito, o empieza en mayúscula y tiene 5+ letras): "(2FA)", "(Qoodle)", "(Google Forms)", sí; "(IA)", "(Docs)", "(de diapositivas)", no. */
    if(par && (/\d/.test(par) || /^[A-ZÁÉÍÓÚÑ]/.test(par) && par.length>=5)) names.push(par);
    return {i:i, label:raw, names:names, def:d, item:it, done:false, rel:[], icon:it.getAttribute('data-icon')||''};
  }).filter(Boolean);
  function byIdx(i){ return defs.filter(function(x){return x.i==i;})[0]; }

  /* Mayúsculas / con dígito / empieza con punto → distingue mayúsculas (SI, HOY, SUMA, 2FA, .pptx) */
  function sensitive(n){ return n===n.toUpperCase() && /[A-Z]/.test(n) || /\d/.test(n) || n.charAt(0)==='.'; }
  /* Cada palabra admite plural simple (-s/-es): "referencia absoluta" también cubre "referencias absolutas" */
  function pat(n){ return n.split(/\s+/).map(function(w){ return esc(w)+(/\p{L}$/u.test(w)?'(?:es|s)?':''); }).join('\\s+'); }
  function buildRe(list, sens){
    var parts=[];
    list.forEach(function(d){ d.names.forEach(function(n){ if(sensitive(n)===sens) parts.push({n:n,d:d}); }); });
    if(!parts.length) return null;
    parts.sort(function(a,b){return b.n.length-a.n.length;});
    var re=new RegExp('(?<![\\p{L}\\p{N}])(?:'+parts.map(function(p){return '('+pat(p.n)+')';}).join('|')+')(?![\\p{L}\\p{N}])', sens?'u':'iu');
    return {re:re,parts:parts};
  }
  function firstHit(text, res){
    var best=null;
    res.forEach(function(r){
      if(!r) return; var m=r.re.exec(text); if(!m) return;
      if(!best||m.index<best.index){ for(var g=1;g<m.length;g++){ if(m[g]!==undefined){ best={index:m.index,len:m[0].length,def:r.parts[g-1].d}; break; } } }
    });
    return best;
  }

  /* Términos relacionados: los que la definición de cada uno menciona */
  defs.forEach(function(d){
    var txt=d.def.textContent;
    defs.forEach(function(o){
      if(o===d) return;
      if(firstHit(txt,[buildRe([o],false),buildRe([o],true)])) d.rel.push(o);
    });
  });

  /* ---------- 2. Marcar la primera aparición en toda la clase ---------- */
  var SKIP='h1,h2,h3,h4,h5,h6,a,button,code,kbd,pre,label,summary,script,style,nav,input,textarea,select,option,th,'+
           '.glossary,.toc,.cover-page,.callout-label,.sources,.gnav,.gbar,.gtoggle,.pdf-fab,.pdf-sheet-overlay,.gh-term,[data-no-gloss]';
  var DEFINING=/^\s*(\(|(es|son|significa|se llama|se define)(?=[\s,:]))/;
  var n=0;
  function mkTerm(d, txt){
    var s=document.createElement('span');
    s.className='gh-term'; s.id='gh-t-'+(n++); s.tabIndex=0; s.setAttribute('role','button');
    s.setAttribute('aria-haspopup','dialog'); s.setAttribute('data-gh',d.i); s.textContent=txt; return s;
  }
  secs.forEach(function(sec){
    if(sec.querySelector('.glossary')||sec.id==='resumen') return;     /* cierre de la clase: sin marcas */
    /* términos forzados a mano */
    [].forEach.call(sec.querySelectorAll('[data-gl]'),function(el){
      var d=defs.filter(function(x){return x.label===el.getAttribute('data-gl');})[0];
      if(!d||d.done) return; d.done=true;
      el.classList.add('gh-term'); el.id=el.id||'gh-t-'+(n++); el.tabIndex=0; el.setAttribute('role','button');
      el.setAttribute('aria-haspopup','dialog'); el.setAttribute('data-gh',d.i);
    });
    var unused=defs.filter(function(d){return !d.done;});
    var res=[buildRe(unused,false),buildRe(unused,true)];
    var w=document.createTreeWalker(sec,NodeFilter.SHOW_TEXT,{acceptNode:function(t){
      if(!t.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return t.parentElement.closest(SKIP)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;
    }});
    var nodes=[],x; while((x=w.nextNode())) nodes.push(x);
    for(var k=0;k<nodes.length&&unused.length;k++){
      var node=nodes[k], off=0;
      while(node&&unused.length){
        var txt=node.nodeValue, h=firstHit(txt.slice(off),res); if(!h) break;
        h.index+=off;
        var defining=DEFINING.test(txt.slice(h.index+h.len)) || !!node.parentElement.closest('strong,b,dfn');
        if(defining){ off=h.index+h.len; continue; }      /* acá ya se está definiendo: se marca la siguiente aparición */
        var after=node.splitText(h.index+h.len);          /* node = antes + término; after = resto */
        var mid=h.index?node.splitText(h.index):node;      /* mid = solo el término */
        mid.parentNode.replaceChild(mkTerm(h.def,mid.nodeValue),mid);
        h.def.done=true; unused=unused.filter(function(d){return d!==h.def;});
        res=[buildRe(unused,false),buildRe(unused,true)];
        node=after; off=0;
      }
    }
  });

  /* Nota de papel: explica el ° (solo se ve en impresión) */
  var gl=document.querySelector('.glossary');
  if(gl&&document.querySelector('.gh-term')){
    var pn=document.createElement('p'); pn.className='gh-print-note';
    pn.textContent='° Los términos marcados con ° en el texto están definidos en este glosario.';
    gl.parentNode.insertBefore(pn,gl);
  }

  /* ---------- 3. Tarjeta (escritorio) y hoja (táctil) ---------- */
  var BODY='<div class="gh-head"><img class="gh-ic" alt="" hidden><b class="gh-card-t"></b></div><div class="gh-card-d"></div><div class="gh-rel"></div>';
  var card=document.createElement('div');
  card.className='gh-card'; card.id='gh-card'; card.setAttribute('role','tooltip');
  card.innerHTML=BODY+'<a class="gh-link" href="#">Ver en el glosario ↓</a>';
  var scrim=document.createElement('div'); scrim.className='gh-scrim';
  var sheet=document.createElement('div'); sheet.className='gh-sheet'; sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-labelledby','gh-sheet-t'); sheet.tabIndex=-1;
  sheet.innerHTML='<div class="gh-grip"></div>'+BODY.replace('class="gh-card-t"','class="gh-card-t" id="gh-sheet-t"')+
                  '<div class="gh-row"><a class="gh-link" href="#">Ver en el glosario ↓</a><button type="button" class="gh-close">Cerrar</button></div>';
  document.body.appendChild(card); document.body.appendChild(scrim); document.body.appendChild(sheet);

  var cur=null, viewing=null, stack=[], pinned=false, skipFocus=false, shownAt=0, tIn=0, tOut=0,
      fine=window.matchMedia('(hover:hover) and (pointer:fine)');
  function fill(box){
    var d=viewing;
    box.querySelector('.gh-card-t').textContent=d.label;
    var ic=box.querySelector('.gh-ic'); if(d.icon&&BASE){ ic.src=BASE+encodeURI(d.icon); ic.hidden=false; } else { ic.hidden=true; ic.removeAttribute('src'); }
    box.querySelector('.gh-card-d').innerHTML=d.def.innerHTML;
    var l=box.querySelector('.gh-link'); l.setAttribute('href','#'+d.item.id); l.setAttribute('data-from',cur.id);
    var rel=box.querySelector('.gh-rel'), h='';
    if(stack.length) h+='<button type="button" class="gh-chip gh-chip-back" data-back="1">‹ '+stack[stack.length-1].label.replace(/</g,'&lt;')+'</button>';
    if(d.rel.length){
      h+='<span class="gh-rel-l">Ver también</span>'+d.rel.map(function(o){
        return '<button type="button" class="gh-chip" data-rel="'+o.i+'">'+o.label.replace(/\s*\(.*\)$/,'').replace(/</g,'&lt;')+'</button>'; }).join('');
    }
    rel.innerHTML=h; rel.style.display=h?'':'none';
  }
  function place(termEl, ev){
    var rects=[].slice.call(termEl.getClientRects()), r=rects[0];
    if(ev&&ev.clientX!=null) rects.forEach(function(q){ if(ev.clientY>=q.top&&ev.clientY<=q.bottom) r=q; });
    var vw=document.documentElement.clientWidth;
    var left0=(document.body.classList.contains('has-gnav')&&vw>=1100&&!document.body.classList.contains('nav-collapsed'))?316:12;
    var w=Math.min(320,vw-24); card.style.width=w+'px';
    var h=card.offsetHeight, top0=vw<1100?60:8;
    var x=Math.max(left0,Math.min(r.left+r.width/2-w/2,vw-12-w));
    var above=r.top-h-12>=top0, y=above?r.top-h-12:r.bottom+12;
    card.classList.toggle('is-below',!above);
    card.style.left=x+'px'; card.style.top=y+'px';
    card.style.setProperty('--gh-ax',Math.max(14,Math.min(w-14,r.left+r.width/2-x))+'px');
  }
  function setPinned(v){
    pinned=v;
    /* Transitoria = tooltip. Fijada (clic/Enter) = diálogo no modal, que sí puede tener links y botones */
    card.setAttribute('role',v?'dialog':'tooltip');
    if(v) card.setAttribute('aria-label',viewing?viewing.label:'Definición'); else card.removeAttribute('aria-label');
  }
  function showCard(termEl,ev){
    var d=byIdx(termEl.getAttribute('data-gh')); if(!d) return;
    clearTimeout(tOut); cur=termEl; viewing=d; stack=[]; shownAt=Date.now(); fill(card);
    card.classList.add('on'); place(termEl,ev); termEl.setAttribute('aria-describedby','gh-card');
  }
  function hideCard(force){
    if(pinned&&!force) return; clearTimeout(tIn);
    card.classList.remove('on'); setPinned(false);
    if(cur){ cur.removeAttribute('aria-describedby'); }
    if(!sheet.classList.contains('open')){ cur=null; viewing=null; stack=[]; }
  }
  function openSheet(termEl){
    var d=byIdx(termEl.getAttribute('data-gh')); if(!d) return;
    cur=termEl; viewing=d; stack=[]; fill(sheet); sheet.classList.add('open'); scrim.classList.add('open');
    sheet.focus({preventScroll:true});
    var sh=sheet.offsetHeight, r=termEl.getBoundingClientRect(), lim=window.innerHeight-sh-16;
    if(r.bottom>lim) window.scrollBy({top:r.bottom-lim,behavior:'smooth'});
  }
  function closeSheet(restore){
    var was=sheet.classList.contains('open');
    sheet.classList.remove('open'); scrim.classList.remove('open');
    if(was&&restore&&cur&&cur.focus){ skipFocus=true; cur.focus({preventScroll:true}); }
    if(was){ cur=null; viewing=null; stack=[]; }
  }
  function goRel(i){
    var o=byIdx(i); if(!o||!viewing) return; stack.push(viewing); viewing=o;
    var box=sheet.classList.contains('open')?sheet:card; fill(box);
    if(box===card){ setPinned(true); place(cur); }
  }
  function goBack(){
    if(!stack.length) return; viewing=stack.pop();
    var box=sheet.classList.contains('open')?sheet:card; fill(box); if(box===card) place(cur);
  }
  function termOf(e){ return e.target.closest?e.target.closest('.gh-term'):null; }

  document.addEventListener('mouseover',function(e){
    if(!fine.matches) return; var t=termOf(e);
    if(t){ if(t===cur&&card.classList.contains('on')){clearTimeout(tOut);return;} clearTimeout(tOut); clearTimeout(tIn);
      tIn=setTimeout(function(){ if(pinned&&cur===t) return; setPinned(false); showCard(t,e); },140); }
    else if(e.target.closest&&e.target.closest('#gh-card')) clearTimeout(tOut);
  });
  document.addEventListener('mouseout',function(e){
    if(!fine.matches) return; var t=termOf(e), inCard=e.target.closest&&e.target.closest('#gh-card');
    if(t||inCard){ clearTimeout(tIn); tOut=setTimeout(function(){ hideCard(false); },200); }
  });
  document.addEventListener('focusin',function(e){
    var t=termOf(e); if(skipFocus){ skipFocus=false; return; } if(t&&fine.matches&&!pinned) showCard(t);
  });
  document.addEventListener('focusout',function(e){
    var t=termOf(e); if(t&&!pinned) tOut=setTimeout(function(){ if(!card.contains(document.activeElement)) hideCard(false); },120);
  });
  document.addEventListener('click',function(e){
    var chip=e.target.closest&&e.target.closest('.gh-chip');
    if(chip){ if(chip.getAttribute('data-back')) goBack(); else goRel(chip.getAttribute('data-rel')); return; }
    var t=termOf(e);
    if(t){
      if(!fine.matches){ openSheet(t); return; }
      if(pinned&&cur===t){ hideCard(true); return; }
      clearTimeout(tIn); showCard(t,e); setPinned(true); return;
    }
    if(!e.target.closest('#gh-card')&&!e.target.closest('.gh-sheet')) { hideCard(true); }
    var a=e.target.closest&&e.target.closest('.gh-link');
    if(a){ var from=a.getAttribute('data-from'); hideCard(true); closeSheet(false); jump(a.getAttribute('href').slice(1),from); }
    if(e.target.closest('.gh-close')||e.target===scrim) closeSheet(true);
  });
  document.addEventListener('keydown',function(e){
    var t=termOf(e);
    if((e.key==='Enter'||e.key===' ')&&t){
      e.preventDefault();
      if(!fine.matches){ openSheet(t); return; }
      showCard(t); setPinned(true); var l=card.querySelector('.gh-link'); if(l) l.focus();
    } else if(e.key==='Escape'){
      var back=cur; var open=card.classList.contains('on')||sheet.classList.contains('open');
      hideCard(true); closeSheet(false); if(open&&back&&back.focus){ skipFocus=true; back.focus(); }
    }
  });
  /* Scroll: cierra la tarjeta, salvo el que provoca el propio foco por teclado (ahí solo se reubica) */
  window.addEventListener('scroll',function(){ if(!card.classList.contains('on')) return;
    if(cur&&Date.now()-shownAt<500) place(cur); else hideCard(true); },{passive:true});
  window.addEventListener('resize',function(){ hideCard(true); closeSheet(false); });

  /* ---------- 4. Salto al glosario: resalta la fila y deja "Volver al texto" ---------- */
  function jump(itemId,fromId){
    var it=document.getElementById(itemId); if(!it) return;
    [].forEach.call(document.querySelectorAll('.gh-back'),function(b){b.remove();});
    [].forEach.call(document.querySelectorAll('.gh-flash'),function(b){b.classList.remove('gh-flash');});
    if(fromId){ var b=document.createElement('a'); b.className='gh-back'; b.href='#'+fromId; b.textContent='↩ Volver al texto'; it.appendChild(b); }
    setTimeout(function(){ it.classList.add('gh-flash'); setTimeout(function(){it.classList.remove('gh-flash');},2200); },500);
  }
  /* Para otros scripts (búsqueda Ctrl+K): ir a un término del glosario con el mismo resaltado */
  window.guiaGlosario={ jump:function(itemId){ var it=document.getElementById(itemId); if(!it) return;
    it.scrollIntoView({behavior:'smooth',block:'center'}); jump(itemId,null); } };
})();
