#!/usr/bin/env python3
"""Genera glosario.json (y embebe los mismos datos en glosario.html) leyendo el
Glosario de cada Guía Visual (clases/Clase NN - *.html -> .gloss-item).
Los HTML de cada clase siguen siendo la FUENTE; este archivo es derivado, igual
que moodle/entregas.json. Uso: python3 scripts/build_glosario.py
Imprime las palabras que aparecen en 2+ clases con definiciones DISTINTAS."""
import html as _h, json, re, sys, unicodedata
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ACENTOS = {  # manual 2.5
    '01': '#5b4b9e', '02': '#4285f4', '03': '#4285f4', '04': '#4285f4', '05': '#4285f4',
    '06': '#e8a317', '08': '#1e8e3e', '09': '#1e8e3e', '10': '#1e8e3e', '11': '#1e8e3e',
    '13': '#673ab7', '14': '#673ab7', '15': '#673ab7'}

UNIDADES = [  # manual 2.5: unidades temáticas del programa (Evaluación no tiene glosario)
    ('herramientas', 'Herramientas digitales', ['01']),
    ('procesador', 'Procesador de texto', ['02', '03', '04', '05']),
    ('presentaciones', 'Presentaciones', ['06']),
    ('planilla', 'Planilla de cálculo', ['08', '09', '10', '11']),
    ('datos', 'Base de datos', ['13', '14', '15'])]
UNIDAD_DE = {n: u[0] for u in UNIDADES for n in u[2]}

def mix_white(h, pct): r, g, b = [int(h[i:i+2], 16) for i in (1, 3, 5)]; return '#%02x%02x%02x' % tuple(round(c*pct + 255*(1-pct)) for c in (r, g, b))
def darken(h, pct=0.65): r, g, b = [int(h[i:i+2], 16) for i in (1, 3, 5)]; return '#%02x%02x%02x' % tuple(round(c*pct) for c in (r, g, b))
def norm(s): return re.sub(r'\s+', ' ', unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()).strip()

class P(HTMLParser):
    def __init__(s): super().__init__(); s.items = []; s.mode = None; s.depth = 0; s.cur = None; s.title = ''; s.in_title = False
    def handle_starttag(s, tag, a):
        c = dict(a).get('class', '') or ''
        if tag == 'title': s.in_title = True
        if 'gloss-item' in c.split(): s.cur = {'term': '', 'html': '', 'icon': dict(a).get('data-icon') or ''}; s.items.append(s.cur); s.mode = None
        elif s.cur is not None and tag == 'span' and 'gloss-term' in c.split(): s.mode = 'term'
        elif s.cur is not None and tag == 'p' and 'gloss-def' in c.split(): s.mode = 'def'; s.depth = 0
        elif s.mode == 'def':
            s.cur['html'] += '<%s>' % tag; s.depth += 1
    def handle_endtag(s, tag):
        if tag == 'title': s.in_title = False
        if s.mode == 'term' and tag == 'span': s.mode = None
        elif s.mode == 'def':
            if tag == 'p' and s.depth == 0: s.mode = None
            else: s.cur['html'] += '</%s>' % tag; s.depth -= 1
    def handle_data(s, d):
        if s.in_title: s.title += d
        if s.mode == 'term': s.cur['term'] += d
        elif s.mode == 'def': s.cur['html'] += d.replace('&', '&amp;').replace('<', '&lt;')
    def handle_entityref(s, n): s.handle_data({'amp': '&', 'lt': '<', 'gt': '>', 'nbsp': ' '}.get(n, ''))


def nombres(raw):
    """Nombre principal + alias, igual que js/guia-glosario.js"""
    m = re.match(r'^(.*?)\s*\(([^)]*)\)\s*$', raw); main = m.group(1) if m else raw; par = m.group(2) if m else ''
    ns = [n.strip() for n in re.split(r'\s+/\s+', main) if n.strip()]
    if par and (re.search(r'\d', par) or (re.match(r'^[A-ZÁÉÍÓÚÑ]', par) and len(par) >= 5)): ns.append(par)
    return ns

def aparece(texto, texto_n, raw):
    """¿Algún nombre del término aparece en el texto de la clase (sin contar el propio glosario)?"""
    for n in nombres(raw):
        sens = (n == n.upper() and re.search('[A-Z]', n)) or re.search(r'\d', n) or n.startswith('.')
        src, nm = (texto, n) if sens else (texto_n, norm(n))
        pat = r'\s+'.join(re.escape(w) + (r'(?:es|s)?' if re.search(r'[^\W\d_]$', w) else '') for w in nm.split())
        if re.search(r'(?<!\w)' + pat + r'(?!\w)', src, 0 if sens else re.I): return True
    return False

def texto_visible(raw_html):
    t = re.sub(r'<div class="gloss-item"[^>]*>.*?</div>', ' ', raw_html, flags=re.S)
    t = re.sub(r'<(script|style)\b.*?</\1>', ' ', t, flags=re.S | re.I)
    return _h.unescape(re.sub(r'<[^>]+>', ' ', t))

LIMPIAR = '--limpiar' in sys.argv
terms = {}
clases = []
huerfanos = []
for f in sorted((ROOT / 'clases').glob('Clase [0-9][0-9] - *.html')):
    num = f.name[6:8]; p = P(); p.feed(f.read_text(encoding='utf-8'))
    if not p.items: continue
    raw = f.read_text(encoding='utf-8'); tx = texto_visible(raw); txn = norm(tx)
    orf = [it['term'].strip() for it in p.items if not aparece(tx, txn, it['term'].strip())]
    if orf:
        huerfanos.append((num, orf))
        if LIMPIAR:
            for lab in orf: raw = re.sub(r'[ \t]*<div class="gloss-item"[^>]*><span class="gloss-term">' + re.escape(lab) + r'</span>.*?</div>[ \t]*\n?', '', raw, count=1, flags=re.S)
            f.write_text(raw, encoding='utf-8'); p.items = [it for it in p.items if it['term'].strip() not in orf]
    m = re.match(r'^Clase\s*\d+\s*[-–]\s*(.*)$', p.title.split('·')[0].strip()); titulo = m.group(1) if m else f.stem[11:]
    ac = ACENTOS.get(num, '#8d8b9c')
    clases.append({'num': num, 'unidad': UNIDAD_DE.get(num, ''), 'titulo': titulo, 'archivo': f.name, 'acento': ac, 'deep': darken(ac), 'tint': mix_white(ac, .14)})
    for it in p.items:
        raw = it['term'].strip(); main = re.sub(r'\s*\([^)]*\)\s*$', '', raw)
        html = it['html'].strip(); key = norm(main)
        t = terms.setdefault(key, {'term': main, 'variants': {}})
        v = t['variants'].setdefault(norm(re.sub(r'<[^>]+>', '', html)), {'def': html, 'label': raw, 'clases': [], 'icon': it['icon']})
        v['clases'].append(num)

out = []
for key, t in sorted(terms.items(), key=lambda kv: kv[0]):
    vs = list(t['variants'].values())
    out.append({'term': t['term'], 'variants': vs, 'divergente': len(vs) > 1})
unidades = []
for uid, nombre, nums in UNIDADES:
    pres = [c for c in clases if c['num'] in nums]
    if pres: unidades.append({'id': uid, 'nombre': nombre, 'clases': [c['num'] for c in pres], 'acento': pres[0]['acento'], 'deep': pres[0]['deep'], 'tint': pres[0]['tint']})
data = {'unidades': unidades, 'clases': clases, 'terms': out}
(ROOT / 'glosario.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')

page = ROOT / 'glosario.html'
if page.exists():
    s = page.read_text(encoding='utf-8')
    blob = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    s2 = re.sub(r'(/\*DATA\*/).*?(/\*/DATA\*/)', lambda m: m.group(1) + blob + m.group(2), s, flags=re.S)
    page.write_text(s2, encoding='utf-8')

n = sum(len(x['variants'][0]['clases']) if len(x['variants']) == 1 else 0 for x in out)
print('%d términos únicos, %d clases con glosario' % (len(out), len(clases)))
rep = [x for x in out if any(len(v['clases']) > 1 for v in x['variants']) or x['divergente']]
for x in rep:
    print('\n• %s' % x['term'] + ('  [DEFINICIONES DISTINTAS]' if x['divergente'] else '  (misma definición)'))
    for v in x['variants']: print('   Clases %s: %s' % (','.join(v['clases']), re.sub(r'<[^>]+>', '', v['def'])[:160]))

print('\nTérminos del Glosario que NO aparecen en el texto de su clase%s:' % (' (ELIMINADOS)' if LIMPIAR else ' (usar --limpiar para quitarlos)'))
for num, orf in huerfanos: print('  Clase %s: %s' % (num, ' | '.join(orf)))
if not huerfanos: print('  ninguno')
