#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_dataset_exportaciones.py

Datos del Modelo E del 2° Parcial (Clase 12): Exportaciones argentinas.
Genera, con semilla fija, dos CSV en ../archivos/:
  Exportaciones_Argentina_operaciones.csv  61 filas (60 operaciones + 1 repetida)
  Exportaciones_Argentina_productos.csv    8 filas (producto, complejo, precio por tonelada)
Defectos deliberados: espacios sobrantes en destino y cod_producto, una operación repetida.
Datos de práctica, ficticios (los precios son valores de referencia aproximados).
Uso: python3 gen_dataset_exportaciones.py
"""
import csv, random, datetime as dt
from pathlib import Path

ARCH = Path(__file__).resolve().parent.parent / "archivos"
SEED = 20261117
UMBRAL_GRANDE = 4000000          # USD: Grande si el valor FOB llega a este monto

PRODUCTOS = [  # cod, producto, complejo, precio_usd_tn
    ("P-01", "Poroto de soja", "Oleaginoso", 480),
    ("P-02", "Aceite de soja", "Oleaginoso", 1150),
    ("P-03", "Maíz", "Cerealero", 210),
    ("P-04", "Trigo", "Cerealero", 235),
    ("P-05", "Carne bovina", "Cárnico", 5200),
    ("P-06", "Vino", "Economías regionales", 1900),
    ("P-07", "Limón", "Economías regionales", 1100),
    ("P-08", "Miel", "Economías regionales", 2400),
]
CANT = {"P-01": 10, "P-02": 6, "P-03": 9, "P-04": 7, "P-05": 8, "P-06": 7, "P-07": 7, "P-08": 6}
RANGO = {"P-01": (4000, 24000, 500), "P-02": (1500, 9000, 250), "P-03": (5000, 28000, 500),
         "P-04": (3000, 18000, 500), "P-05": (150, 900, 25), "P-06": (80, 500, 10),
         "P-07": (150, 1200, 25), "P-08": (40, 260, 5)}
DEST = {"P-01": ["China", "India", "Países Bajos"], "P-02": ["India", "China", "Chile"],
        "P-03": ["Brasil", "Chile", "Países Bajos"], "P-04": ["Brasil", "Chile", "India"],
        "P-05": ["China", "Estados Unidos", "Países Bajos"], "P-06": ["Estados Unidos", "Brasil", "Países Bajos"],
        "P-07": ["Países Bajos", "Estados Unidos", "Brasil"], "P-08": ["Estados Unidos", "Países Bajos", "Chile"]}


def limpias():
    rnd = random.Random(SEED)
    base = []
    for cod, n in CANT.items():
        lo, hi, st = RANGO[cod]
        for _ in range(n):
            tn = rnd.randrange(lo, hi + 1, st)
            fecha = dt.date(2026, 1, 5) + dt.timedelta(days=rnd.randrange(0, 176))
            base.append([fecha, cod, rnd.choice(DEST[cod]), tn])
    base.sort(key=lambda r: (r[0], r[1]))
    rows = [[f"EX-{3001 + i}", r[0].isoformat(), r[1], r[2], r[3]] for i, r in enumerate(base)]
    return rows


def sucias(rows):
    rnd = random.Random(SEED + 1)
    out = [r[:] for r in rows]
    idx = rnd.sample(range(len(out)), 7)
    for i in idx[:3]:
        out[i][3] = out[i][3] + " "          # destino con espacio al final
    out[idx[3]][3] = " " + out[idx[3]][3]     # destino con espacio al inicio
    for i in idx[4:6]:
        out[i][2] = out[i][2] + " "          # cod_producto con espacio al final
    # operación repetida (copia exacta de una fila limpia)
    k = next(i for i in range(10, 40) if i not in idx)
    out.insert(k + 3, out[k][:])
    return out, rows[k][0], [rows[i][0] for i in idx]


def controles(rows):
    prod = {c: (n, cx, p) for c, n, cx, p in PRODUCTOS}
    res = {}
    tot = 0
    for c, (n, cx, p) in prod.items():
        r = [x for x in rows if x[2] == c]
        fob = sum(x[4] * p for x in r)
        g = sum(1 for x in r if x[4] * p >= UMBRAL_GRANDE)
        res[n] = dict(ops=len(r), tn=sum(x[4] for x in r), fob=fob, prom=fob / len(r), grandes=g, complejo=cx)
        tot += fob
    return res, tot


def escribir(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, quoting=csv.QUOTE_ALL, lineterminator="\r\n")
        w.writerow(header)
        w.writerows(rows)


if __name__ == "__main__":
    limp = limpias()
    suc, repetida, tocadas = sucias(limp)
    escribir(ARCH / "Exportaciones_Argentina_operaciones.csv",
             ["id_op", "fecha", "cod_producto", "destino", "toneladas"], suc)
    escribir(ARCH / "Exportaciones_Argentina_productos.csv",
             ["cod_producto", "producto", "complejo", "precio_usd_tn"], PRODUCTOS)
    res, tot = controles(limp)
    g = sum(1 for r in limp if r[4] * {c: p for c, _, _, p in PRODUCTOS}[r[2]] >= UMBRAL_GRANDE)
    print("filas con duplicado:", len(suc), "| repetida:", repetida, "| sucias:", tocadas)
    print("umbral", UMBRAL_GRANDE, "| grandes:", g, "de", len(limp), "| total FOB:", tot)
    for n, d in res.items():
        print(n, d)
