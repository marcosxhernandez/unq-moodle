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

## Proyecto Andes Sur (Clases 08.1 a 11.1) — dataset armado, ya no usado por la Guía Visual

**Superado (set. 2026):** la Guía Visual de Clases 08-11 nunca terminó de usar este caso (escribió su propio encargo genérico en su lugar) y, en la auditoría de set. 2026, Marcos decidió reemplazarlo por un caso nuevo desde cero — ver "Centro Cultural La Usina" más abajo, que es el que usan las Clases 08-11 desde esta fecha. Estos archivos y cifras se dejan documentados tal cual (no se borran) por si sirven para otra cosa más adelante, pero ninguna clase vigente los cita.


| Archivo | Qué es | Aparece en |
|---|---|---|
| `SIGMA_export_ventas_202606.csv` | Exportación "sucia" del ERP: 412 filas de operaciones de junio 2026 | Semana 1 (Clase 08.1) |
| `Catalogo_productos_2026.xlsx` | Maestro de productos, hoja `PRODUCTOS` | Semana 3 (Clase 10.1) |
| `Cartera_clientes_2026.xlsx` | Maestro de clientes, hoja `CLIENTES` | Semana 3 (Clase 10.1) |
| `Nomina_vendedores_2026.xlsx` | Maestro de vendedores, hoja `VENDEDORES` | Semana 3 (Clase 10.1) |

### El CSV está sucio a propósito

Separador **`;`**, importes con formato argentino (`8.450,00`) y codificación
UTF-8. No "arreglar" nada de esta lista: cada punto es una actividad.

| # | Defecto | Casos | Se trabaja en |
|---|---|---|---|
| 1 | Importes como texto (formato argentino) | toda la columna | 08.1 · configuración regional |
| 2 | Fechas en dos formatos (`dd/mm/aaaa` y `aaaa-mm-dd`) | 30 | 08.1 · limpieza |
| 3 | `id_operacion` duplicado por doble carga | 7 ids | 08.1 · formato condicional |
| 4 | `cod_producto` con espacio final o en minúscula | 12 | 08.1 · `MAYUSC(ESPACIOS())` |
| 5 | Cantidad negativa (devolución sin marcar) | 4 | 08.1 y 09.1 |
| 6 | `precio_unitario` en cero | 5 | 08.1 · auditoría |
| 7 | `estado` con cuatro escrituras (`Entregado`, `ENTREGADO`, `entregado`, `Entreg.`) | 67 filas fuera de la forma canónica | 08.1 y 09.1 · `Y`/`O` |
| 8 | `descuento_pct` vacío | 57 | 08.1 · vacío ≠ cero |
| 9 | `CLI-1044`: cliente que no está en la cartera | 4 operaciones | 10.1 · huérfanos |
| 10 | `PRD-660`: producto que no está en el catálogo | 2 operaciones | 10.1 · huérfanos |
| 11 | `PRD-505` (Yerba mate): está en el catálogo y no se vendió nunca | — | 10.1 · sin rotación |
| 12 | `VEN-07` con operaciones anteriores a su fecha de ingreso | 3 | 10.1 · control interno |
| 13 | Descuentos por encima de la escala autorizada | 11 (8 de `VEN-04`) | 10.1 y 11.1 |

### Cifras de control (uso docente)

Todas calculadas sobre el CSV publicado. Sirven para corregir sin rehacer el
trabajo, y son las que cita el relato de las clases.

| Concepto | Valor |
|---|---|
| Filas de datos | 412 |
| Total que informa el sistema (todo lo entregado, con duplicados) | $21.609.753 |
| Total del detalle de Lucía (filtro exacto `estado = "Entregado"`) | $17.355.854 |
| **Total correcto, depurado** | **$20.994.066** |
| Operaciones utilizables | 339 |
| Ticket promedio | $61.929 |
| Costo de los excesos de descuento | $109.698 |
| Facturación de Lanús | $1.553.195 (7,4%) |

Ninguno de los dos números que circulan en la empresa es el correcto: el
sistema cuenta de más (duplicados por $805.759, devoluciones, una operación a
precio cero) y el detalle cuenta de menos (se le escapan las 67 filas donde el
estado está escrito distinto). Esa es la respuesta que el estudiante tiene que
poder construir y explicar en la semana 1.

### Reproducibilidad

El dataset se genera con `scripts/gen_dataset.py`, con semilla fija: correrlo
de nuevo produce el mismo archivo byte a byte. Si hace falta cambiar algo, se
edita el script y se regenera — no se edita el CSV a mano, o las cifras de
control de arriba dejan de valer.

Las primeras veinte operaciones (`OP-10021` a `OP-10039`) son exactamente las
que la Guía Visual de la Clase 08.1 publica como muestra: el estudiante tiene
que poder cargarlas a mano y encontrar las mismas filas en el archivo completo.

## Centro Cultural La Usina (Clases 08 a 11) — caso vigente

| Archivo | Qué es | Aparece en |
|---|---|---|
| `Inscripciones_LaUsina_202606.csv` | Exportación "sucia" del sistema de inscripciones a talleres: 336 filas (incluye 8 duplicadas) a junio 2026 | Clase 08 |
| `Catalogo_talleres_2026.xlsx` | Maestro de talleres: taller, docente, sede, cupo, arancel base | Clase 10 |
| `Docentes_LaUsina_2026.xlsx` | Maestro de docentes: nombre, taller, fecha de alta, contacto | Clase 10 |

Centro Cultural La Usina es un centro cultural comunitario ficticio con tres sedes (Centro, Norte, Sur) que dicta ocho talleres: Cerámica, Guitarra, Fotografía analógica, Yoga, Huerta orgánica, Serigrafía, Percusión y Costura creativa. El archivo sucio es la exportación de inscripciones del primer cuatrimestre (marzo-junio 2026) tal como la entrega el sistema viejo de la asociación civil que gestiona el centro.

### El CSV está sucio a propósito

Separador **`;`**, aranceles con formato argentino (`14.000,00`) y codificación UTF-8. No "arreglar" nada de esta lista: cada punto es una actividad.

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
| 12 | Serigrafía con inscripciones anteriores al alta de su docente (Julieta Campos, alta 04/05/2026) | 9 | 10 · control interno |
| 13 | Becas por encima del 50% autorizado (concentradas en Guitarra) | 10 | 11 · costo del exceso |

### Cifras de control (uso docente)

Todas calculadas por `scripts/gen_dataset_usina.py` sobre el CSV publicado — correrlo de nuevo con la misma semilla reproduce el archivo byte a byte.

| Concepto | Valor |
|---|---|
| Filas en el CSV (con las 8 duplicadas) | 336 |
| Filas base únicas | 328 |
| Total que informa el sistema (bruto, con duplicados) | $3.525.000 |
| Total con filtro exacto `estado = "Confirmada"` | $1.270.000 |
| **Total correcto, depurado** | **$2.696.800** |
| Inscripciones utilizables (depuradas) | 248 |
| Arancel promedio | $10.874 |
| Costo de los excesos de beca (por encima del 50%) | $19.800 |
| Facturación de Sede Sur | $397.000 (14,7%) |

Ninguno de los dos números que circulan en el centro es el correcto: el sistema cuenta de más (duplicados, algún arancel cargado en negativo) y el filtro exacto por `estado = "Confirmada"` cuenta de mucho menos (se le escapan las 140 filas donde "confirmada" está escrito de otra forma). Esa es la reconstrucción que el estudiante tiene que poder hacer y explicar en la Clase 08.

### Reproducibilidad

El dataset se genera con `scripts/gen_dataset_usina.py`, con semilla fija (`random.seed(20260608)`): correrlo de nuevo produce el mismo archivo byte a byte. Si hace falta cambiar algo, se edita el script y se regenera — no se edita el CSV a mano, o las cifras de control de arriba dejan de valer.
