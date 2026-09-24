#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera el dataset "sucio" de Centro Cultural La Usina para las Clases 08-11
(Planilla de cálculo). Semilla fija: correr de nuevo produce el mismo
archivo byte a byte. No editar los .csv/.xlsx a mano -- editar este script
y regenerar.

Salidas (en archivos/):
  Inscripciones_LaUsina_202606.csv   dataset sucio
  Catalogo_talleres_2026.xlsx
  Docentes_LaUsina_2026.xlsx

Imprime a stdout, en JSON, las cifras de control reales para archivos/README.md.
"""
import random
import csv
import datetime as dt
import json
import os
import sys

random.seed(20260608)

OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else "archivos"

TALLERES = [
    # nombre,                docente,            sede,          cupo, arancel_base, fecha_alta_docente
    ("Cerámica",             "Valeria Núñez",    "Sede Centro", 18,   14000, dt.date(2024,3,1)),
    ("Guitarra",             "Emiliano Pais",    "Sede Centro", 12,   12000, dt.date(2023,8,15)),
    ("Fotografía analógica", "Rocío Beltrán",    "Sede Norte",  15,   16000, dt.date(2025,2,10)),
    ("Yoga",                 "Marina Suárez",    "Sede Sur",    20,   10000, dt.date(2022,11,1)),
    ("Huerta orgánica",      "Tomás Leiva",      "Sede Norte",  16,    9000, dt.date(2024,6,1)),
    ("Serigrafía",           "Julieta Campos",   "Sede Centro", 14,   15000, dt.date(2026,5,4)),
    ("Percusión",            "Braian Ortiz",     "Sede Sur",    18,   11000, dt.date(2023,3,20)),
    ("Costura creativa",     "Noelia Ferreyra",  "Sede Norte",  15,   13000, dt.date(2024,9,12)),
]

NOMBRES = ["Sofía","Mateo","Valentina","Bautista","Catalina","Benjamín","Martina","Thiago",
    "Lucía","Joaquín","Emma","Santino","Isabella","Dante","Renata","Ciro","Alma","Francisco",
    "Delfina","Felipe","Julieta","Benicio","Agustina","Ignacio","Mora","Lorenzo","Pilar","Tomás",
    "Victoria","Bruno","Zoe","Nicolás","Milagros","Gael","Josefina","Mariano","Camila","Lautaro",
    "Abril","León","Guadalupe","Simón","Valentino","Olivia","Ramiro","Antonella","Ian",
    "Malena","Franco","Ariadna","Baltasar"]
APELLIDOS = ["Gómez","Rodríguez","Fernández","López","Díaz","Martínez","Pérez","García","Romero",
    "Sosa","Torres","Ruiz","Acosta","Flores","Medina","Herrera","Aguirre","Vega","Molina","Castro",
    "Ortega","Silva","Núñez","Peralta","Cabrera","Rojas","Ibáñez","Godoy","Domínguez","Correa"]

MEDIOS_PAGO = ["Efectivo", "Transferencia", "Tarjeta"]

FECHA_INI = dt.date(2026, 3, 2)
FECHA_FIN = dt.date(2026, 6, 5)

def fecha_random():
    delta = (FECHA_FIN - FECHA_INI).days
    return FECHA_INI + dt.timedelta(days=random.randint(0, delta))

def nombre_alumno_y_dni(usados):
    while True:
        nom = f"{random.choice(NOMBRES)} {random.choice(APELLIDOS)}"
        dni = random.randint(30000000, 45999999)
        if (nom, dni) not in usados:
            usados.add((nom, dni))
            return nom, dni

usados_alumno = set()
filas = []
id_actual = 20001

talleres_activos = [t for t in TALLERES if t[0] != "Percusión"]
pesos_cupo = {t[0]: t[3] for t in talleres_activos}

N_FILAS = 328

for i in range(N_FILAS):
    pesos = [pesos_cupo[t[0]] for t in talleres_activos]
    taller = random.choices(talleres_activos, weights=pesos, k=1)[0]
    nombre_taller, docente, sede, cupo, arancel_base, alta_docente = taller
    alumno, dni = nombre_alumno_y_dni(usados_alumno)
    fecha = fecha_random()
    estado_real = random.choices(
        ["Confirmada", "Pendiente", "Anulada"], weights=[78, 14, 8], k=1
    )[0]
    beca_pct_real = random.choices(
        [0, 20, 30, 50], weights=[62, 18, 12, 8], k=1
    )[0]
    medio_pago = random.choice(MEDIOS_PAGO)
    filas.append({
        "id_inscripcion": f"INS-{id_actual}",
        "fecha": fecha,
        "taller": nombre_taller,
        "sede": sede,
        "alumno": alumno,
        "dni": dni,
        "arancel_base": arancel_base,
        "beca_pct": beca_pct_real,
        "estado": estado_real,
        "medio_pago": medio_pago,
        "docente": docente,
        "alta_docente": alta_docente,
    })
    id_actual += 1

filas_guitarra = [f for f in filas if f["taller"] == "Guitarra"]
exceso_beca_filas = random.sample(filas_guitarra, min(10, len(filas_guitarra)))
for f in exceso_beca_filas:
    f["beca_pct"] = random.choice([60, 65, 70, 80])
    f["_exceso_beca"] = True

filas_serigrafia = [f for f in filas if f["taller"] == "Serigrafía"]
pre_alta_filas = random.sample(filas_serigrafia, min(9, len(filas_serigrafia)))
for f in pre_alta_filas:
    delta = (dt.date(2026, 5, 3) - FECHA_INI).days
    f["fecha"] = FECHA_INI + dt.timedelta(days=random.randint(0, max(delta, 1)))
    f["_pre_alta_docente"] = True

candidatas_cero = [f for f in filas if not f.get("_exceso_beca") and f["beca_pct"] == 0]
cero_error_filas = random.sample(candidatas_cero, 6)
for f in cero_error_filas:
    f["_arancel_cero_error"] = True

candidatas_neg = [f for f in filas if not f.get("_arancel_cero_error") and not f.get("_exceso_beca")]
neg_filas = random.sample(candidatas_neg, 5)
for f in neg_filas:
    f["_arancel_negativo"] = True

for f in filas:
    base = f["arancel_base"]
    beca = f["beca_pct"]
    neto = round(base * (1 - beca / 100))
    if f.get("_arancel_cero_error"):
        neto = 0
        f["_neto_correcto_si_no_hubiera_error"] = round(base * (1 - 0 / 100))
    if f.get("_arancel_negativo"):
        neto = -abs(neto)
    f["importe_neto_real"] = neto

candidatas_dup = [f for f in filas if not f.get("_arancel_cero_error") and not f.get("_arancel_negativo")]
dup_originales = random.sample(candidatas_dup, 8)
duplicados = [dict(f) for f in dup_originales]

candidatas_typo_taller = [f for f in filas if f["taller"] != "Serigrafía" and f not in dup_originales]
typo_taller_filas = random.sample(candidatas_typo_taller, 4)
TYPOS_TALLER = {
    "Cerámica": "Ceramica Avanzada",
    "Fotografía analógica": "Foto analogica",
    "Yoga": "Yoga (turno tarde)",
    "Costura creativa": "Costura Creativa II",
}
for f in typo_taller_filas:
    original = f["taller"]
    f["_taller_original"] = original
    f["taller_csv_override"] = TYPOS_TALLER.get(original, original + " (copia)")

candidatas_sede = [f for f in filas if f not in typo_taller_filas and f not in dup_originales]
sede_mal_filas = random.sample(candidatas_sede, 7)
for idx, f in enumerate(sede_mal_filas):
    if idx < 4:
        f["sede_csv_override"] = ""
    else:
        f["sede_csv_override"] = f["sede"].replace("Sede ", "").lower()

candidatas_case = [f for f in filas if "taller_csv_override" not in f]
case_filas = random.sample(candidatas_case, 15)
for i, f in enumerate(case_filas):
    t = f["taller"]
    variante = random.choice(["mayus", "minus", "espacio"])
    if variante == "mayus":
        f["taller_csv_override"] = t.upper()
    elif variante == "minus":
        f["taller_csv_override"] = t.lower()
    else:
        f["taller_csv_override"] = t + " "

confirmadas = [f for f in filas if f["estado"] == "Confirmada"]
n_forma_rara = int(len(confirmadas) * 0.55)
forma_rara_filas = random.sample(confirmadas, n_forma_rara)
formas = ["CONFIRMADA", "confirmada", "Confirm."]
for i, f in enumerate(forma_rara_filas):
    f["estado_csv_override"] = formas[i % 3]

candidatas_beca_vacia = [f for f in filas if f["beca_pct"] == 0 and not f.get("_arancel_cero_error")]
beca_vacia_filas = random.sample(candidatas_beca_vacia, min(55, len(candidatas_beca_vacia)))
for f in beca_vacia_filas:
    f["beca_csv_override"] = ""

todas_las_filas_csv = filas + duplicados

def formato_arg(n):
    neg = n < 0
    n = abs(n)
    s = f"{n:,.2f}"
    s = s.replace(",", "TMP").replace(".", ",").replace("TMP", ".")
    return ("-" if neg else "") + s

elegibles_fecha = list(range(len(todas_las_filas_csv)))
random.shuffle(elegibles_fecha)
idx_iso = set(elegibles_fecha[:40])
ids_iso = set(id(todas_las_filas_csv[i]) for i in idx_iso)

def fecha_csv(f):
    fecha = f["fecha"]
    if id(f) in ids_iso:
        return fecha.strftime("%Y-%m-%d")
    return fecha.strftime("%d/%m/%Y")

random.shuffle(todas_las_filas_csv)

os.makedirs(OUT_DIR, exist_ok=True)
csv_path = os.path.join(OUT_DIR, "Inscripciones_LaUsina_202606.csv")
with open(csv_path, "w", encoding="utf-8", newline="") as fh:
    w = csv.writer(fh, delimiter=";")
    w.writerow(["id_inscripcion", "fecha_inscripcion", "taller", "sede", "alumno", "dni",
                "arancel", "beca_pct", "estado", "medio_pago"])
    for f in todas_las_filas_csv:
        taller_out = f.get("taller_csv_override", f["taller"])
        sede_out = f.get("sede_csv_override", f["sede"])
        estado_out = f.get("estado_csv_override", f["estado"])
        beca_out = f.get("beca_csv_override", str(f["beca_pct"]))
        arancel_out = formato_arg(f["arancel_base"] if not f.get("_arancel_negativo") else -f["arancel_base"])
        w.writerow([
            f["id_inscripcion"],
            fecha_csv(f),
            taller_out,
            sede_out,
            f["alumno"],
            f["dni"],
            arancel_out,
            beca_out,
            estado_out,
            f["medio_pago"],
        ])

try:
    from openpyxl import Workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "TALLERES"
    ws.append(["taller", "docente", "sede", "cupo", "arancel_base"])
    for t in TALLERES:
        ws.append([t[0], t[1], t[2], t[3], t[4]])
    wb.save(os.path.join(OUT_DIR, "Catalogo_talleres_2026.xlsx"))

    wb2 = Workbook()
    ws2 = wb2.active
    ws2.title = "DOCENTES"
    ws2.append(["docente", "taller", "fecha_alta", "contacto"])
    for t in TALLERES:
        contacto = t[1].lower().replace(" ", ".") + "@lausina.org.ar"
        ws2.append([t[1], t[0], t[5].strftime("%Y-%m-%d"), contacto])
    wb2.save(os.path.join(OUT_DIR, "Docentes_LaUsina_2026.xlsx"))
    xlsx_ok = True
except ImportError:
    xlsx_ok = False

total_sistema = sum(f["importe_neto_real"] for f in todas_las_filas_csv)

total_estado_exacto = sum(
    f["importe_neto_real"] for f in todas_las_filas_csv
    if f["estado"] == "Confirmada" and "estado_csv_override" not in f
)

total_correcto = sum(
    f["importe_neto_real"] for f in filas
    if f["estado"] == "Confirmada"
    and not f.get("_arancel_negativo")
    and not f.get("_arancel_cero_error")
)

n_confirmadas_correctas = sum(
    1 for f in filas
    if f["estado"] == "Confirmada"
    and not f.get("_arancel_negativo")
    and not f.get("_arancel_cero_error")
)

ticket_promedio = round(total_correcto / n_confirmadas_correctas) if n_confirmadas_correctas else 0

costo_exceso_becas = sum(
    round(f["arancel_base"] * ((f["beca_pct"] - 50) / 100))
    for f in filas if f.get("_exceso_beca")
)

facturacion_sede_sur = sum(
    f["importe_neto_real"] for f in filas
    if f["sede"] == "Sede Sur" and f["estado"] == "Confirmada"
    and not f.get("_arancel_negativo") and not f.get("_arancel_cero_error")
)
pct_sede_sur = round(100 * facturacion_sede_sur / total_correcto, 1) if total_correcto else 0

control = {
    "filas_csv_total": len(todas_las_filas_csv),
    "filas_base_unicas": len(filas),
    "ids_duplicados": len(duplicados),
    "fechas_formato_iso": len(idx_iso),
    "talleres_con_espacio_o_mayusculas": len(case_filas),
    "aranceles_negativos": len(neg_filas),
    "aranceles_cero_error": len(cero_error_filas),
    "estados_forma_no_canonica": len(forma_rara_filas),
    "becas_vacias": len(beca_vacia_filas),
    "filas_taller_no_en_catalogo": len(typo_taller_filas),
    "filas_sede_mal_cargada": len(sede_mal_filas),
    "taller_sin_rotacion": "Percusión",
    "filas_serigrafia_pre_alta_docente": len(pre_alta_filas),
    "filas_beca_excede_politica": len(exceso_beca_filas),
    "total_sistema_bruto_con_duplicados": total_sistema,
    "total_filtro_estado_exacto_confirmada": total_estado_exacto,
    "total_correcto_depurado": total_correcto,
    "operaciones_utilizables": n_confirmadas_correctas,
    "ticket_promedio": ticket_promedio,
    "costo_excesos_beca": costo_exceso_becas,
    "facturacion_sede_sur": facturacion_sede_sur,
    "pct_facturacion_sede_sur": pct_sede_sur,
    "xlsx_generado": xlsx_ok,
    "primeras_20_ids": [f["id_inscripcion"] for f in todas_las_filas_csv[:20]],
}
print(json.dumps(control, ensure_ascii=False, indent=2))
