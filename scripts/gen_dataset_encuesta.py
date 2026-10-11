#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera el dataset "Retrato del curso" (encuesta simulada a ingresantes 2026)
para las Clases 08-11 de Sheets. Semilla fija: mismo resultado siempre.
No editar los .csv a mano: editar este script y regenerar.

Salidas (en archivos/), separador ";" y UTF-8:
  Encuesta_ingresantes_2026.csv   120 filas + defectos intencionales
  Catalogo_carreras_2026.csv      carrera -> departamento
  Practica_encuesta_mini.csv      11 filas con cada defecto una vez (micro ejercicios Clase 08)
Imprime en JSON las cifras de control (copiar a archivos/README.md).
"""
import random, csv, json, sys, datetime as dt, collections

random.seed(20260609)
OUT = sys.argv[1] if len(sys.argv) > 1 else "archivos"

CARRERAS = [  # carrera, departamento, peso
    ("Licenciatura en Administración",          "DEyA", 20),
    ("Licenciatura en Comercio Internacional",  "DEyA", 18),
    ("Contador Público",                        "DEyA", 18),
    ("Licenciatura en Comunicación Social",     "CS",   14),
    ("Licenciatura en Educación",               "CS",   8),
    ("Licenciatura en Trabajo Social",          "CS",   8),
    ("Tecnicatura en Programación Informática", "CyT",  10),
    ("Ingeniería en Alimentos",                 "CyT",  8),
    ("Licenciatura en Biotecnología",           "CyT",  7),
    ("Licenciatura en Artes Electrónicas",      "EUdA", 8),
    ("Licenciatura en Música y Tecnología",     "EUdA", 8),
]
# pesos aproximados: DEyA 56, CS 30, CyT 25, EUdA 16 (balanceada, NO la real)

N = 120
filas = []
pool = [c for c in CARRERAS for _ in range(c[2])]
for i in range(1, N + 1):
    car, dep, _ = random.choice(pool)
    edad = random.choice([17,18,18,18,19,19,19,20,20,21,22,23,25,28,31,36,42])
    trabaja = random.choices(["Sí", "No"], [45, 55])[0]
    if edad >= 25: trabaja = random.choices(["Sí", "No"], [80, 20])[0]
    horas_estudio = max(0, round(random.gauss(9 if trabaja == "No" else 6, 3)))
    horas_celu = round(min(9, max(1, random.gauss(5, 1.8))))
    viaje = max(10, int(random.gauss(55, 25)))
    uso_ia = random.choices(["Nunca", "A veces", "Seguido", "Todos los días"], [6, 30, 36, 28])[0]
    dom_excel = random.choices([1, 2, 3, 4, 5], [22, 34, 28, 12, 4])[0]
    gasto = int(round(random.gauss(95000 if trabaja == "No" else 140000, 30000), -3))
    gasto = max(30000, gasto)
    f = dt.date(2026, 8, 3) + dt.timedelta(days=random.randint(0, 20))
    filas.append(dict(ID=i, Fecha=f, Carrera=car, Dep=dep, Edad=edad, Trabaja=trabaja,
        Horas_estudio=horas_estudio, Horas_celular=horas_celu, Viaje_min=viaje,
        Uso_IA=uso_ia, Dominio_Excel=dom_excel, Gasto=gasto))

# ---- defectos intencionales (sobre la copia "cruda") ----
crudo = [dict(r) for r in filas]
idx = list(range(N)); random.shuffle(idx)
# D1: espacios y mayúsculas raras en Carrera (10 filas)
d1 = idx[0:10]
for k, j in enumerate(d1):
    c = crudo[j]["Carrera"]
    crudo[j]["Carrera"] = ["  " + c, c + "  ", c.upper(), c.lower(), " " + c + " "][k % 5]
# D2: edad con texto "19 años" (4 filas)
d2 = idx[10:14]
for j in d2: crudo[j]["Edad"] = f'{crudo[j]["Edad"]} años'
# D3: gasto como texto "95000 pesos" (4 filas)
d3 = idx[14:18]
for j in d3: crudo[j]["Gasto"] = f'{crudo[j]["Gasto"]} pesos'
# D4: viaje vacío (5 filas)
d4 = idx[18:23]
for j in d4: crudo[j]["Viaje_min"] = ""
# D5: 3 filas duplicadas exactas (se agregan al final, ID repetido)
dups = [dict(crudo[j]) for j in idx[23:26]]
crudo += dups

cols = ["ID","Fecha","Carrera","Edad","Trabaja","Horas_estudio","Horas_celular","Viaje_min","Uso_IA","Dominio_Excel","Gasto_mensual"]
with open(f"{OUT}/Encuesta_ingresantes_2026.csv", "w", encoding="utf-8", newline="") as fh:
    w = csv.writer(fh, delimiter=";", lineterminator="\r\n")
    w.writerow(cols)
    for r in crudo:
        w.writerow([r["ID"], r["Fecha"].strftime("%d/%m/%Y"), r["Carrera"], r["Edad"], r["Trabaja"],
                    r["Horas_estudio"], r["Horas_celular"], r["Viaje_min"], r["Uso_IA"],
                    r["Dominio_Excel"], r["Gasto"]])
with open(f"{OUT}/Catalogo_carreras_2026.csv", "w", encoding="utf-8", newline="") as fh:
    w = csv.writer(fh, delimiter=";", lineterminator="\r\n")
    w.writerow(["Carrera", "Departamento"])
    for c, d, _ in CARRERAS: w.writerow([c, d])

# ---- cifras de control (sobre los datos LIMPIOS, sin duplicados) ----
def avg(x): return round(sum(x) / len(x), 2)
ctl = {"filas_crudo": len(crudo), "filas_limpio": N,
       "por_dep": dict(collections.Counter(r["Dep"] for r in filas)),
       "por_carrera": dict(collections.Counter(r["Carrera"] for r in filas)),
       "trabaja_si": sum(r["Trabaja"] == "Sí" for r in filas),
       "uso_ia": dict(collections.Counter(r["Uso_IA"] for r in filas)),
       "prom_edad": avg([r["Edad"] for r in filas]),
       "prom_horas_celular": avg([r["Horas_celular"] for r in filas]),
       "prom_estudio": avg([r["Horas_estudio"] for r in filas]),
       "prom_gasto": avg([r["Gasto"] for r in filas]),
       "max_gasto": max(r["Gasto"] for r in filas),
       "min_edad": min(r["Edad"] for r in filas), "max_edad": max(r["Edad"] for r in filas),
       "dominio_excel_1o2": sum(r["Dominio_Excel"] <= 2 for r in filas),
       "prom_viaje_con_vacios_reales": avg([r["Viaje_min"] for r in filas]),
       "prom_viaje_sin_vacios": avg([r["Viaje_min"] for j, r in enumerate(filas) if j not in d4]),
       "defectos": {"carrera_espacios_mayus": len(d1), "edad_con_texto": len(d2),
                    "gasto_con_texto": len(d3), "viaje_vacio": len(d4), "duplicados": len(dups)}}
# por dep: promedios
dep = {}
for d in ["DEyA","CS","CyT","EUdA"]:
    x = [r for r in filas if r["Dep"] == d]
    dep[d] = {"n": len(x), "prom_celu": avg([r["Horas_celular"] for r in x]),
              "prom_gasto": avg([r["Gasto"] for r in x]),
              "trabaja": sum(r["Trabaja"]=="Sí" for r in x),
              "ia_seguido_o_diario": sum(r["Uso_IA"] in ("Seguido","Todos los días") for r in x)}
ctl["por_dep_detalle"] = dep
print(json.dumps(ctl, ensure_ascii=False, indent=1))

# ---- muestra chica para los micro ejercicios de la Clase 08 (cada defecto aparece una vez) ----
mini_ids = [1, 2, 3, 4, 5, 6, 12, 21, 22, 35]
mini = [dict(r) for r in crudo if r["ID"] in mini_ids]
mini.sort(key=lambda r: r["ID"])
mini.append(dict(next(r for r in crudo if r["ID"] == 22)))   # duplicado exacto de la 22
with open(f"{OUT}/Practica_encuesta_mini.csv", "w", encoding="utf-8", newline="") as fh:
    w = csv.writer(fh, delimiter=";", lineterminator="\r\n")
    w.writerow(cols)
    for r in mini:
        w.writerow([r["ID"], r["Fecha"].strftime("%d/%m/%Y"), r["Carrera"], r["Edad"], r["Trabaja"],
                    r["Horas_estudio"], r["Horas_celular"], r["Viaje_min"], r["Uso_IA"],
                    r["Dominio_Excel"], r["Gasto_mensual" if "Gasto_mensual" in r else "Gasto"]])
