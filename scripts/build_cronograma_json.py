#!/usr/bin/env python3
"""
Genera moodle/cronograma.json a partir de moodle/cronograma.csv -- el mapa
que usan tanto js/index-loader.js como el loader pegado en Qoodle (patron
CLAUDE-moodle.md 4.2quinquies) para decidir si el bloque de una clase ya
paso de fecha y tiene que arrancar colapsado -- mismo criterio de "pasada"
que ya usa Cronograma.html (data-fecha < hoy, comparacion de string
'YYYY-MM-DD').

No editar moodle/cronograma.json a mano -- se regenera con este script cada
vez que cronograma.csv cambia (mismo criterio que entregas.csv/entregas.json,
ver scripts/build_entregas_json.py y CLAUDE.md raiz S1).

Una fila con fecha "TODO" (clase todavia sin fecha confirmada en el
cronograma real) se omite del JSON -- sin fecha, el loader no tiene forma
de decidir si esa clase ya paso, asi que la deja como viene (abierta).

Uso:
    python3 scripts/build_cronograma_json.py

Salida: moodle/cronograma.json
    { "<clase>": {"fecha": "YYYY-MM-DD", "tipo": "...", "unidad": "...", "titulo": "..."}, ... }
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "moodle" / "cronograma.csv"
JSON_PATH = ROOT / "moodle" / "cronograma.json"

def main():
    with open(CSV_PATH, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        mapa = {}
        omitidas = []
        for row in reader:
            fecha = row["fecha"].strip()
            if not fecha or fecha.upper() == "TODO":
                omitidas.append(row["clase"])
                continue
            mapa[row["clase"]] = {
                "fecha": fecha,
                "tipo": row["tipo"].strip(),
                "unidad": row["unidad"].strip(),
                "titulo": row["titulo"].strip(),
            }

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(mapa, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")

    print(f"{len(mapa)} clase(s) con fecha resuelta")
    if omitidas:
        print(f"Sin fecha todavia (omitidas del JSON): {', '.join(omitidas)}")
    print(f"Escrito en {JSON_PATH.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
