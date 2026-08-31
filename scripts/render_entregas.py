#!/usr/bin/env python3
"""
Genera, para una aula (cyt o dcs), la version final y pegable de cada
moodle/Clase NN - <Titulo>.html: reemplaza los placeholders
{{ENTREGA:<clase>:<orden>}} por el id real de la Tarea de esa aula,
segun moodle/entregas.csv.

Uso:
    python3 scripts/render_entregas.py cyt
    python3 scripts/render_entregas.py dcs
    python3 scripts/render_entregas.py cyt "Clase 01"      # solo esa clase

Salida: moodle/_build/<aula>/Clase NN - <Titulo>.html
    (listo para copiar y pegar en Atto, sin ningun {{...}} suelto)

Si a una clase le falta el id de la aula pedida en entregas.csv (columna
en TODO o fila inexistente), el placeholder se deja SIN reemplazar y se
avisa por consola al final -- para no pegar por error un link roto en Qoodle.
"""
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MOODLE_DIR = ROOT / "moodle"
CSV_PATH = MOODLE_DIR / "entregas.csv"
BUILD_DIR = MOODLE_DIR / "_build"

TOKEN_RE = re.compile(r"\{\{ENTREGA:(\d+):(\d+)\}\}")


def cargar_registro():
    registro = {}
    with open(CSV_PATH, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            clave = (row["clase"].strip(), row["orden"].strip())
            registro[clave] = row
    return registro


def render_archivo(path, aula, registro, faltantes):
    texto = path.read_text(encoding="utf-8")

    def reemplazar(m):
        clase, orden = m.group(1), m.group(2)
        fila = registro.get((clase, orden))
        col = f"{aula}_id"
        if fila is None or fila.get(col, "").strip().upper() in ("", "TODO"):
            titulo = fila["titulo"] if fila else "(sin fila en entregas.csv)"
            faltantes.append((clase, orden, titulo))
            return m.group(0)  # deja el placeholder tal cual, sin inventar un id
        return fila[col].strip()

    return TOKEN_RE.sub(reemplazar, texto)


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ("cyt", "dcs"):
        print(__doc__)
        sys.exit(1)
    aula = sys.argv[1]
    filtro = sys.argv[2] if len(sys.argv) > 2 else None

    registro = cargar_registro()
    destino = BUILD_DIR / aula
    destino.mkdir(parents=True, exist_ok=True)

    faltantes = []
    generados = []
    for path in sorted(MOODLE_DIR.glob("Clase * - *.html")):
        if filtro and filtro not in path.name:
            continue
        salida = render_archivo(path, aula, registro, faltantes)
        out_path = destino / path.name
        out_path.write_text(salida, encoding="utf-8")
        generados.append(out_path)

    print(f"Aula: {aula}")
    print(f"Generados {len(generados)} archivo(s) en {destino.relative_to(ROOT)}/")
    for p in generados:
        print(f"  - {p.name}")

    if faltantes:
        print()
        print(f"⚠️  {len(faltantes)} entrega(s) sin id para esta aula (quedaron con el placeholder, NO pegar así):")
        for clase, orden, titulo in faltantes:
            print(f"  - Clase {clase}, entrega {orden} ({titulo}) -> completar columna '{aula}_id' en moodle/entregas.csv")
    else:
        print()
        print("Sin faltantes: todos los ids de esta aula están completos.")


if __name__ == "__main__":
    main()
