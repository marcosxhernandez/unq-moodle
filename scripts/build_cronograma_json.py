#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera moodle/cronograma.json leyendo DIRECTAMENTE Cronograma.html -- no hay
ningun archivo intermedio que mantener sincronizado a mano. Cronograma.html
YA es el calendario real del cuatrimestre (lo edita Marcos cada vez que un
paro o un feriado corre la fecha de una clase, insertando o moviendo filas
.unq-cr-row) -- este script solo lee esas mismas filas y las traduce a
{"<clase>": {"fecha": ..., "tipo": ..., "unidad": ..., "titulo": ...}}, que
es lo que usan js/index-loader.js y el loader pegado en Qoodle (CLAUDE-moodle.md
4.2quinquies/4.2septies) para decidir si el bloque de una clase arranca
colapsado.

Por que NO uso el orden/posicion de las filas para numerar las clases: el
numero de clase (00-17) es fijo por CONTENIDO (tabla 2.5 de CLAUDE.md raiz),
no por posicion en el calendario -- un paro o feriado no consume un slot de
numeracion (esas filas son tipo "paro"/"feriado" y se saltean acá), pero
Cronograma.html puede tener huecos reales (hoy, set. 2026: la Clase 15 "Del
dato a la decision" todavia no tiene fila/fecha asignada) que romperian
cualquier conteo posicional -- todo lo que viene despues del hueco quedaria
corrido un numero. Por eso cada fila se identifica por su TITULO, matcheado
contra la tabla canonica de CLAUDE.md 2.5 (mas un par de alias para los 2-3
titulos que en Cronograma.html todavia estan marcados como "no confirmados
en la planilla maestra", con asterisco visible en la pagina).

Una fila que no matchea ni el titulo canonico ni ningun alias se reporta
como NO RESUELTA y se omite del JSON -- nunca se le asigna un numero
adivinado. Revisar la lista de alias de abajo si aparece un titulo asi.

Uso:
    python3 scripts/build_cronograma_json.py

Salida: moodle/cronograma.json
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_PATH = ROOT / "Cronograma.html"
JSON_PATH = ROOT / "moodle" / "cronograma.json"

# Tabla canonica numero -> titulo, CLAUDE.md raiz S2.5 (esquema 00-17 vigente
# desde set. 2026). Se compara en minusculas. Clase 00 (Bienvenida) y los
# comodines (Feriado/Paro) quedan afuera a proposito: no tienen fecha fija
# ni numero de clase respectivamente.
CANONICO = {
    "01": "herramientas digitales: internet, nube e ia",
    "02": "arquitectura del documento profesional",
    "03": "ia como asistente académico",
    "04": "arquitectura avanzada del documento",
    "05": "maquetación de alta precisión",
    "06": "presentaciones con ia: de borrador a entrega",
    "07": "1° parcial",
    "08": "lógica de celdas y funciones esenciales",
    "09": "funciones lógicas y validación de datos",
    "10": "búsqueda entre hojas y visualización",
    "11": "análisis de datos con tablas dinámicas e ia",
    "12": "2° parcial",
    "13": "cómo piensan las bases de datos",
    "14": "del formulario a la base de datos",
    "15": "del dato a la decisión",
    "16": "3° parcial",
    "17": "recuperatorio",
}

# Titulos que hoy aparecen en Cronograma.html con marca de "no confirmado
# en la planilla maestra" (asterisco visible en la pagina) y todavia no
# coinciden literalmente con el titulo canonico de arriba. Sacar el alias
# el dia que se corrija el titulo en Cronograma.html para que coincida
# directo -- si despues de eso una fila deja de matchear, esta lista es
# el primer lugar a revisar.
ALIAS = {
    "de la planilla a la captura de datos": "13",
    "preguntar a los datos: consultas e ia": "14",
    "3.º parcial integrador": "16",
    "3º parcial integrador": "16",
}

ROW_RE = re.compile(r'<div class="unq-cr-row"[^>]*>')
ATTR_RE = lambda nombre: re.compile(r'data-' + nombre + r'="([^"]*)"')

def main():
    html = HTML_PATH.read_text(encoding="utf-8")
    filas = ROW_RE.findall(html)
    if not filas:
        raise SystemExit(f"No se encontro ninguna fila .unq-cr-row en {HTML_PATH}")

    mapa = {}
    sin_clase = []   # filas clase/evaluacion que no matchean ningun numero
    vistos = set()   # numeros ya asignados, para detectar duplicados

    for fila in filas:
        tipo = ATTR_RE("tipo").search(fila).group(1)
        if tipo not in ("clase", "evaluacion"):
            continue  # paro/feriado: comodin, sin numero de clase fijo
        fecha = ATTR_RE("fecha").search(fila).group(1)
        titulo = ATTR_RE("titulo").search(fila).group(1)
        unidad = ATTR_RE("unidad").search(fila).group(1)

        clave = titulo.strip().lower()
        clase = None
        for numero, canon in CANONICO.items():
            if clave == canon:
                clase = numero
                break
        if clase is None:
            clase = ALIAS.get(clave)

        if clase is None:
            sin_clase.append((fecha, titulo))
            continue

        if clase in vistos:
            raise SystemExit(f"Clase {clase} matcheada mas de una vez (ultima: '{titulo}', {fecha}) -- revisar CANONICO/ALIAS, hay una fila duplicada o un alias mal puesto.")
        vistos.add(clase)

        mapa[clase] = {"fecha": fecha, "tipo": tipo, "unidad": unidad, "titulo": titulo}

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(mapa, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")

    print(f"{len(mapa)} clase(s) con fecha resuelta desde Cronograma.html")
    faltantes = sorted(set(CANONICO) - vistos, key=int)
    if faltantes:
        print(f"Sin fila en Cronograma.html todavia (sin fecha, no entran al JSON): {', '.join(faltantes)}")
    if sin_clase:
        print("ATENCION -- filas de Cronograma.html que no matchearon ningun numero (revisar CANONICO/ALIAS):")
        for fecha, titulo in sin_clase:
            print(f"  {fecha}  '{titulo}'")
    print(f"Escrito en {JSON_PATH.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
