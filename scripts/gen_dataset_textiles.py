#!/usr/bin/env python3
"""Genera archivos/Textiles_Ventas.xlsx (clase 14) con datos ficticios y semilla fija.
Productos (IdProducto 1-13) y Clientes (IdCliente 1-8) se cargan a mano en las clases 13-14.
Uso: python3 scripts/gen_dataset_textiles.py
"""
import random, datetime, collections, os
from openpyxl import Workbook

random.seed(2026)
PRECIOS = {1:3500,2:3500,3:3800,4:3800,5:12000,6:12500,7:4500,8:4800,9:6500,10:6900,11:15000,12:21000,13:23500}
RUBRO = {1:'cuidado personal',2:'cuidado personal',3:'cuidado personal',4:'cuidado personal',
         5:'cocina',6:'cocina',7:'cocina',8:'cocina',9:'cocina',10:'cocina',11:'baño',12:'baño',13:'baño'}
filas = []
for i in range(1, 37):
    d = datetime.date(2026,3,1) + datetime.timedelta(days=random.randint(0,89))
    filas.append((random.randint(1,8), random.randint(1,13), d, random.randint(1,6)))
filas.sort(key=lambda f: f[2])
wb = Workbook(); ws = wb.active; ws.title = 'Ventas'
ws.append(['IdVenta','IdCliente','IdProducto','Fecha','Cantidad'])
for n,(c,p,d,q) in enumerate(filas,1):
    ws.append([n,c,p,d,q]); ws.cell(row=n+1,column=4).number_format='dd/mm/yyyy'
for col,w in zip('ABCDE',(10,11,12,12,10)): ws.column_dimensions[col].width=w
out = os.path.join(os.path.dirname(__file__),'..','archivos','Textiles_Ventas.xlsx')
wb.save(out)
# cifras de control
print('filas', len(filas))
print('total unidades', sum(f[3] for f in filas))
print('importe total', sum(PRECIOS[f[1]]*f[3] for f in filas))
rub = collections.Counter()
for c,p,d,q in filas: rub[RUBRO[p]] += PRECIOS[p]*q
print('por rubro', dict(rub))
print('cant>=4', sum(1 for f in filas if f[3]>=4))
print('abril', sum(1 for f in filas if f[2].month==4))
print('cliente 3', sum(1 for f in filas if f[0]==3))
print('barbijos (prod 1-4)', sum(1 for f in filas if f[1]<=4))
