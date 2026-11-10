"""Genera archivos/Peliculas_2007_2009.csv a partir del dataset abierto movies.json de vega-datasets
(https://github.com/vega/vega-datasets). Recorte: estrenos 2007-2009. Traduce los nombres de columna y de género y completa Genero y Distribuidora faltantes con 'Sin dato' (Presupuesto y Puntaje_IMDB faltantes quedan vacíos).
Uso: python3 gen_dataset_cine.py movies.json Peliculas_2007_2009.csv"""
import json,csv,sys
GEN={"Drama":"Drama","Comedy":"Comedia","Action":"Acción","Thriller/Suspense":"Suspenso","Adventure":"Aventura","Horror":"Terror","Romantic Comedy":"Comedia romántica","Documentary":"Documental","Black Comedy":"Comedia negra","Musical":"Musical","Western":"Western","Concert/Performance":"Concierto"}
MES={m:i+1 for i,m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
d=json.load(open(sys.argv[1],encoding="utf-8"))
rows=[r for r in d if r["Release Date"][-4:] in ("2007","2008","2009")]
with open(sys.argv[2],"w",newline="",encoding="utf-8") as f:
    w=csv.writer(f)
    w.writerow(["Titulo","Anio","Mes","Genero","Distribuidora","Presupuesto","Recaudacion_EEUU","Recaudacion_mundo","Puntaje_IMDB"])
    for r in rows:
        w.writerow([r["Title"],int(r["Release Date"][-4:]),MES[r["Release Date"][:3]],GEN.get(r["Major Genre"],"Sin dato") if r["Major Genre"] else "Sin dato",r["Distributor"] or "Sin dato",
          "" if r["Production Budget"] is None else r["Production Budget"],r["US Gross"],r["Worldwide Gross"],"" if r["IMDB Rating"] is None else r["IMDB Rating"]])
print(len(rows))
