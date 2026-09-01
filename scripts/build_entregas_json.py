#!/usr/bin/env python3
"""
Genera moodle/entregas.json a partir de moodle/entregas.csv -- el mapa que
el loader de Qoodle (CLAUDE-moodle.md 4.2quinquies) usa en tiempo real para
resolver los placeholders {{ENTREGA:<clase>:<orden>}} segun el curso (id de
Qoodle) donde se este ejecutando.

No editar moodle/entregas.json a mano -- se regenera con este script cada
vez que entregas.csv cambia (mismo criterio que los datasets de archivos/,
ver CLAUDE.md raiz S1).

Uso:
    python3 scripts/build_entregas_json.py

Salida: moodle/entregas.json
    { "<id_de_curso>": { "<clase>:<orden>": "<id_de_tarea>", ... }, ... }

Una celda "TODO" (fila sin ese id todavia) se omite del JSON -- el loader,
al no encontrar la clave, deja ver el error en vez de armar un link roto.
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "moodle" / "entregas.csv"
JSON_PATH = ROOT / "moodle" / "entregas.json"

def main():
    with open(CSV_PATH, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        cursos = [c for c in reader.fieldnames if c.endswith("_id")]
        mapa = {curso.replace("_id", ""): {} for curso in cursos}
        for row in reader:
            clave = f"{row['clase']}:{row['orden']}"
            for curso in cursos:
                valor = row[curso].strip()
                if valor and valor.upper() != "TODO":
                    mapa[curso.replace("_id", "")][clave] = valor

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(mapa, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")

    for curso, entregas in mapa.items():
        print(f"Curso {curso}: {len(entregas)} entrega(s) resuelta(s)")
    print(f"Escrito en {JSON_PATH.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
