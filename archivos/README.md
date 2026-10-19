# archivos/ — Datasets de práctica

Archivos que descarga el estudiante. Se publican con el sitio, así que la URL
es estable: `https://marcosxhernandez.github.io/unq-moodle/archivos/<archivo>`.
Desde Qoodle se enlazan, no se vuelven a subir.

## Clase 05 — Combinación de correspondencia

| Archivo | Qué es | Aparece en |
|---|---|---|
| `Contactos_comerciales_2026.xlsx` | Fuente de datos de ejemplo para combinación de correspondencia: 6 contactos inventados, columnas `Nombre`, `Rubro`, `Necesidad detectada` | Sección 07, callout "Para explorar, paso a paso" |

Archivo genérico (no del tema del día — paneles solares, termotanques, aerogeneradores —
que es el de la Actividad 06): sirve para que el paso "Correspondencia → Seleccionar
destinatarios → Usar una lista existente → el archivo con tu tabla" tenga un archivo real
para abrir en el momento, en vez de quedar solo como instrucción abstracta. La Actividad 06
sigue pidiendo que el estudiante arme su propia tabla con datos inventados por una IA — este
archivo no la reemplaza.

## Retrato del curso (Clases 08 a 11 de Sheets) — caso vigente

Encuesta simulada a ingresantes 2026. Un único archivo de Sheets que crece de clase en clase. Datos inventados (no son los de la encuesta real), con proporciones por departamento balanceadas a propósito para que cada selector tenga filas suficientes.

| Archivo | Contenido |
|---|---|
| `Encuesta_ingresantes_2026.csv` | 120 respuestas más 3 duplicadas (123 filas de datos, 124 con encabezado). Separador `;`, UTF-8, fechas `dd/mm/aaaa`. Columnas: ID, Fecha, Carrera, Edad, Trabaja, Horas_estudio, Horas_celular, Viaje_min, Uso_IA, Dominio_Excel, Gasto_mensual |
| `Catalogo_carreras_2026.csv` | 11 carreras y su departamento (DEyA, CS, CyT, EUdA). Para BUSCARV |
| `Practica_encuesta_mini.csv` | Muestra de 11 filas con cada defecto una sola vez (texto en Edad, texto en Gasto, espacios en Carrera, un vacío en Viaje y una fila repetida). Para los micro ejercicios de la Clase 08 |

Generador: `scripts/gen_dataset_encuesta.py` (semilla 20260609). No editar los CSV a mano.

### Defectos intencionales (se limpian en la Clase 08)

| Defecto | Cantidad | Herramienta |
|---|---|---|
| Carrera con espacios de más o mayúsculas/minúsculas mezcladas | 10 filas (6 con espacios) | Recortar espacio en blanco (las mayúsculas no se tocan) |
| Edad con texto (`21 años`) | 4 | Buscar y reemplazar |
| Gasto con texto (`114000 pesos`) | 4 | Buscar y reemplazar |
| Viaje_min vacío | 5 | Se dejan vacíos (decisión didáctica: vacío no es cero) |
| Filas duplicadas exactas (al final, filas 122 a 124) | 3 | Quitar duplicados |

### Micro ejercicios: cifras de control

- Muestra mini (Clase 08): 11 filas, 12 con encabezado. Tras limpiar quedan 10 filas: suma de Edad 260, suma de Gasto 1.050.000.
- Primeras 8 respuestas de DATOS (Clases 09 a 11): Edad promedio 26,75. Gasto: suma 848.000, promedio 106.000, máximo 180.000, mínimo 53.000. Viaje promedio 62,5. Trabajan 5. Atención (trabaja y estudia menos de 5 h) 2. IA frecuente 5. Nivel_Excel: 6 Inicial y 2 Intermedio. Viajes de más de 90 min: 2; de más de 60: 4. Por departamento: DEyA 5 (gasto promedio 114.200, 80% trabaja), CyT 2 (60.000, 0%), EUdA 1 (157.000, 100%), CS 0. Fechas: 11/08/2026 a 23/08/2026 (12 días).

### Cifras de control (sobre los datos limpios: 120 filas)

- Respuestas 120. Con dato de viaje 115. Edad promedio 24,24 (17 a 42). Gasto promedio $ 127.016,67 (mínimo $ 30.000, máximo $ 220.000), total $ 15.242.000. Viaje promedio 55,48 (53,17 si los vacíos se cargaran como 0).
- Horas de celular promedio 5,10. Horas de estudio promedio 6,98. Trabajan 73 (60,83%). Viajes de más de 90 min: 13. Horas de estudio menores a 4: 16.
- Nivel_Excel (1-2 Inicial, 3-4 Intermedio, 5 Avanzado): 65 / 49 / 6. Riesgo_carga (trabaja y estudia menos de 5 h): 27. IA frecuente (Seguido o Todos los días): 65.
- Gasto proyectado promedio a 6 meses con 3% mensual (18% en total): $ 149.879,67. Escenarios (gasto promedio + gasto promedio × aumento mensual × meses): 3% a 6 meses $ 149.879,67, igual que el anterior.
- Fechas: primera respuesta 03/08/2026, última 23/08/2026 (20 días).
- Uso de IA (Nunca / A veces / Seguido / Todos los días): 9 / 46 / 30 / 35.
- Trabaja y viaja más de 60 min: 29. Viajan más de 60 min: 48.
- Por carrera (respuestas; gasto promedio): Administración 27, $ 132.740,74. Comercio Internacional 13, $ 111.846,15. Contador Público 14, $ 143.357,14. Comunicación Social 15, $ 112.133,33. Educación 4, $ 135.750,00. Trabajo Social 11, $ 137.181,82. Programación 11, $ 117.545,45. Ingeniería en Alimentos 9, $ 128.000,00. Biotecnología 5, $ 115.400,00. Artes Electrónicas 7, $ 131.000,00. Música y Tecnología 4, $ 131.000,00.
- Por departamento (n; % trabaja; gasto promedio; viaje promedio; IA Nunca/A veces/Seguido/Todos): DEyA 54; 66,7%; $ 130.462,96; 54,18; 5/18/13/18. CS 30; 50,0%; $ 124.466,67; 58,77; 4/12/6/8. CyT 25; 60,0%; $ 120.880,00; 53,17; 0/12/8/5. EUdA 11; 63,6%; $ 131.000,00; 57,80; 0/4/3/4.

### Clave de la entrega final (uso docente, Clase 11)

- DEyA: gasto promedio con trabajo $ 144.694 y sin trabajo $ 102.000 (en DEyA); proyección a 12 meses con el aumento mensual de PARAMETROS.
- CS: trabaja y viaja más de 60 min: 13 (DEyA), 7 (CS), 7 (CyT), 2 (EUdA), 29 en total.
- CyT: correlación entre Horas_celular y Horas_estudio -0,165 (casi nula). Promedio de horas de estudio por grupo de uso de celular (Bajo hasta 3 h, Medio 4 a 6, Alto 7 o más), con las 120 respuestas: Bajo 8,00 (21 personas), Medio 6,97 (76), Alto 6,09 (23); solo con CyT: Bajo 6,25 (4), Medio 6,82 (17), Alto 6,25 (4).
- EUdA: uso de IA por nivel de Excel con `CONTAR.SI.CONJUNTO`; la consigna es de comunicación, no tiene cifra única.

### Reproducibilidad

```
python3 scripts/gen_dataset_encuesta.py archivos
```

Imprime en JSON las cifras de control del generador. Si se cambia la semilla o el diseño, regenerar los CSV y actualizar esta sección y las guías.

## Centro Cultural La Usina (Clases 08 a 11) — caso de la versión v1 de Sheets, reemplazado por Retrato del curso

| Archivo | Qué es | Aparece en |
|---|---|---|
| `Inscripciones_LaUsina_202606.csv` | Exportación "sucia" del sistema de inscripciones a talleres: 336 filas (incluye 8 duplicadas) a junio 2026 | Clase 08 |
| `Catalogo_talleres_2026.xlsx` | Maestro de talleres: taller, docente, sede, cupo, arancel base | Clase 10 |
| `Docentes_LaUsina_2026.xlsx` | Maestro de docentes: nombre, taller, fecha de alta, contacto | Clase 10 |

Centro Cultural La Usina es un centro cultural comunitario ficticio con tres sedes (Centro, Norte, Sur) que dicta ocho talleres: Cerámica, Guitarra, Fotografía analógica, Yoga, Huerta orgánica, Serigrafía, Percusión y Costura creativa. El archivo sucio es la exportación de inscripciones del primer cuatrimestre (marzo-junio 2026) tal como la entrega el sistema viejo de la asociación civil que gestiona el centro.

### El CSV está sucio a propósito

El CSV tiene **10 columnas**: `id_inscripcion`, `fecha_inscripcion`, `taller`, `sede`, `alumno`, `dni`, `arancel`, `beca_pct`, `estado`, `medio_pago`. Está desordenado (no ordenado por id). Separador **`;`**, aranceles con formato argentino (`14.000,00`) y codificación UTF-8. No "arreglar" nada de esta lista: cada punto es una actividad.

| # | Defecto | Casos | Se trabaja en |
|---|---|---|---|
| 1 | Aranceles como texto (formato argentino) | toda la columna | 08 · configuración regional |
| 2 | Fechas en dos formatos (`dd/mm/aaaa` y `aaaa-mm-dd`) | 40 | 08 · limpieza |
| 3 | `id_inscripcion` duplicado por doble carga | 8 ids | 08 · formato condicional |
| 4 | `taller` con espacio final o en mayúsculas/minúsculas inconsistentes | 15 | 08 · `MAYUSC(ESPACIOS())` |
| 5 | Arancel negativo (baja/reintegro sin marcar) | 5 | 08 y 09 |
| 6 | `arancel` en cero por error de carga (no por beca) | 6 | 08 · auditoría |
| 7 | `estado` con cuatro escrituras (`Confirmada`, `CONFIRMADA`, `confirmada`, `Confirm.`) | 140 filas fuera de la forma canónica | 08 y 09 · `Y`/`O` |
| 8 | `beca_pct` vacío | 55 | 09 · vacío ≠ cero |
| 9 | Taller que no está en el catálogo (typo) | 4 operaciones | 10 · huérfanos |
| 10 | `sede` vacía o mal escrita | 7 | 10 · control de carga |
| 11 | Percusión: está en el catálogo y nunca tuvo una inscripción | — | 10 · sin rotación |
| 12 | Serigrafía con inscripciones anteriores al alta de su docente (Julieta Campos, alta 04/05/2026) | 29 filas con fecha anterior (16 Válidas) | 10 · control interno |
| 13 | Becas por encima del 50% autorizado (concentradas en Guitarra) | 10 | 11 · costo del exceso |

### Cifras de control (uso docente)

Todas calculadas por `scripts/gen_dataset_usina.py` sobre el CSV publicado — correrlo de nuevo con la misma semilla reproduce el archivo byte a byte.

| Concepto | Valor |
|---|---|
| Filas en el CSV (con las 8 duplicadas) | 336 |
| Filas base únicas | 328 |
| Total que informa el sistema (bruto, con duplicados) | $3.525.000 |
| Total con `SUMAR.SI(estado;"Confirmada";...)` en Sheets/Excel (no distingue mayúsculas; deja afuera las 46 filas "Confirm.") | $2.277.700 (215 filas) |
| **Total correcto, depurado** | **$2.696.800** |
| Inscripciones utilizables (depuradas) | 248 |
| Arancel promedio | $12.009 (suma 4.035.000; máx 16.000; mín -14.000) |
| Situación (Válida / No cuenta / Revisar / Duplicada) | 248 / 72 / 8 / 8 |
| Neto de costo administrativo ($500 × 248) | $2.572.800 |
| Subtotales por sede (sede completada desde el catálogo) | Centro $1.384.300 · Norte $915.500 · Sur $397.000 |
| Por mes (válidas) | Mar $745.000 · Abr $881.800 · May $877.600 · Jun $192.400 |
| Cerámica sobre el total | 28,2% ($760.200) |
| Costo de los excesos de beca (por encima del 50%) | $19.800 |
| Facturación de Sede Sur | $397.000 (14,7%) |

Ninguno de los dos números que circulan en el centro es el correcto: el sistema cuenta de más (duplicados, algún arancel cargado en negativo) y la suma condicional por `estado = "Confirmada"` cuenta de menos (en Sheets y Excel la comparación no distingue mayúsculas, pero se le escapan las 46 filas escritas "Confirm."). Esa es la reconstrucción que el estudiante tiene que poder hacer y explicar en la Clase 08.

### Reproducibilidad

El dataset se genera con `scripts/gen_dataset_usina.py`, con semilla fija (`random.seed(20260608)`): correrlo de nuevo produce el mismo archivo byte a byte. Si hace falta cambiar algo, se edita el script y se regenera — no se edita el CSV a mano, o las cifras de control de arriba dejan de valer.


---

## Textiles_Ventas.xlsx y bases de Access (Clases 13-15)

Caso: emprendimiento familiar de textiles para el hogar (adaptación del ejercicio Barbijos). Datos ficticios; los mails de los clientes son inventados.

- `Textiles_Ventas.xlsx`: hoja `Ventas`, columnas `IdVenta`, `IdCliente`, `IdProducto`, `Fecha` (celdas de fecha reales), `Cantidad`. 36 filas, del 02/03/2026 al 28/05/2026. Se importa a Access en la clase 14. Generado con `scripts/gen_dataset_textiles.py` (semilla `2026`): correrlo de nuevo produce el mismo contenido.
- `Clinica_Veterinaria.mdb` y `Universidad2022.mdb`: bases de la cátedra, tal como están en `Unidad 6: Base de Datos/` (versiones limpias, sin consultas resueltas). No se generan con script.
- Productos (13) y Clientes (8) se cargan a mano en las clases 13 y 14; las tablas están en las guías.

**Cifras de control Textiles (Productos 13, Clientes 8, Ventas 36):** cocina 6 productos; precio mayor a 10.000: 5; entre 4.000 y 7.000: 4; nombre empieza con T: 3; cocina y más de 5.000: 4; cocina o baño: 9; no cuidado personal: 9. Ventas: Entre 13/04/2026 y 30/04/2026: 7 (todo abril: 11); clientes de Bernal: 4; importe de 50.000 o más: 13; cantidad 5 o más: 19; mayor importe 126.000 (venta 6). Informe por rubro (unidades; importe): cuidado personal 39; 143.100. Cocina 60; 453.700. Baño 56; 1.145.500. Total 155 unidades; 1.742.300. El cliente 3 (Sosa) no tiene compras.

**Cifras de control Clínica Veterinaria:** Mascotas 66 (Canino 34, Felino 26; sexo H 32, M 34; caninas hembra 17), Veterinarias 5, Tipos Tratamiento 6. Dato sucio a propósito: Especie tiene `Totuga` y `Tortuga`.

**Cifras de control Universidad2022:** Alumnos 150, Materias 36, Alumnoxmateria 28. Femenino 105; LE o LC 12; fuera de CAPITAL FEDERAL 102; mujeres de CAPITAL FEDERAL 36; nacidos 1960-1969: 52; varones nacidos desde 1970: 4; apellido con A: 10; materias de más de 10 créditos: 10; materias con Taller: 3; inscripciones con tres tablas: 28; con créditos mayores a 10: 11.
