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

## Proyecto Andes Sur (Clases 08.1 a 11.1)

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
