# Importación de Listas de Precios

## Objetivo

Toda la información comercial utilizada por el Sebamar Cotizador proviene de una única fuente oficial.

```
backend/excel/catalogo.xlsx
```

Este archivo contiene los costos de fábrica de todos los productos comercializados por Sebamar.

El sistema nunca utiliza los archivos JSON como fuente original de información.

Los JSON son únicamente una representación generada automáticamente a partir del Excel.

---

# Filosofía

Toda modificación comercial debe comenzar siempre desde el Excel.

Por este motivo:

❌ Nunca deben modificarse manualmente los archivos JSON.

❌ Nunca deben agregarse precios directamente en el código.

❌ Nunca deben mantenerse listas paralelas.

✅ Todo cambio comercial debe realizarse exclusivamente sobre:

```
backend/excel/catalogo.xlsx
```

---

# Fuente Oficial

```
backend/excel/catalogo.xlsx
```

Contiene la totalidad de los costos base utilizados por el sistema.

Entre ellos:

- Ventanas Herrero
- Ventanas Modena
- Ventanas de Abrir
- Puertas Herrero
- Puertas Modena
- Puertas Eco
- Patagónicas
- Postigos
- Rajas
- Mosquiteros
- Puertas Placa
- Portones
- etc.

---

# Flujo General

```
catalogo.xlsx

      │

      ▼

importar.js

      │

      ▼

backend/generated

      │

      ▼

Validación

      │

      ▼

backend/data

      │

      ▼

Cotizador

      │

      ▼

Generador de Listas
```

Todo el sistema consume exactamente los mismos datos.

---

# Proceso de Actualización

Cuando Sebamar entrega una nueva lista de precios, el procedimiento correcto es:

## Paso 1

Abrir:

```
backend/excel/catalogo.xlsx
```

---

## Paso 2

Actualizar únicamente los valores comerciales necesarios.

Nunca modificar la estructura del archivo salvo que exista una actualización planificada.

---

## Paso 3

Guardar el archivo.

---

## Paso 4

Ejecutar:

```bash
node importar.js
```

Este comando reconstruye automáticamente todos los archivos necesarios.

---

# ¿Qué hace importar.js?

`importar.js` es el punto de entrada de todo el pipeline.

Internamente ejecuta tres etapas consecutivas.

---

# Etapa 1 — Importar

Lee todas las hojas del Excel.

Cada hoja es procesada por su correspondiente script de importación.

Como resultado se generan nuevos archivos dentro de:

```
backend/generated
```

En esta etapa todavía no se modifica el sistema.

---

# Etapa 2 — Validar

Una vez generados los archivos temporales, se comparan contra los JSON oficiales.

La validación verifica:

- estructura
- claves
- tipos de datos
- valores
- consistencia general

Si existe cualquier inconsistencia:

- el proceso se detiene;
- no se publica ningún archivo;
- backend/data permanece intacto.

Esta validación protege al sistema frente a errores durante el desarrollo.

---

# Etapa 3 — Publicar

Si toda la validación fue correcta:

Los archivos ubicados en:

```
backend/generated
```

se copian automáticamente a:

```
backend/data
```

A partir de ese momento el cotizador comienza a utilizar la nueva información.

---

# Publicación Forzada

Cuando el objetivo es actualizar una lista de precios, es normal que existan diferencias entre los JSON nuevos y los anteriores.

En esos casos puede utilizarse:

```bash
node importar.js --publish
```

Este modo:

- omite la validación comparativa;
- publica directamente los nuevos JSON.

Debe utilizarse únicamente cuando se desea actualizar oficialmente una lista comercial.

---

# Estructura

```
backend/

│
├── excel/
│      └── catalogo.xlsx
│
├── generated/
│      └── JSON temporales
│
├── data/
│      └── JSON oficiales
│
└── scripts/
       ├── runExcel.js
       ├── compareGenerated.js
       ├── publishGenerated.js
       └── importar.js
```

---

# Responsabilidad de cada Carpeta

## backend/excel

Contiene la única fuente oficial de precios.

---

## backend/generated

Contiene archivos temporales generados automáticamente.

Nunca deben editarse.

---

## backend/data

Contiene los JSON oficiales utilizados por todo el sistema.

Nunca deben editarse manualmente.

---

## backend/scripts

Contiene el pipeline completo de importación.

---

# Reglas Obligatorias

## Nunca editar

```
backend/data
```

---

## Nunca editar

```
backend/generated
```

---

## Siempre editar

```
backend/excel/catalogo.xlsx
```

---

## Siempre ejecutar

```bash
node importar.js
```

o bien

```bash
node importar.js --publish
```

según corresponda.

---

# Pipeline Completo

```
catalogo.xlsx

      │

      ▼

runExcel.js

      │

      ▼

backend/generated

      │

      ▼

compareGenerated.js

      │

      ├──── ERROR
      │          │
      │          └── Se cancela la publicación
      │
      ▼

publishGenerated.js

      │

      ▼

backend/data

      │

      ▼

Cotizador

      │

      ▼

Generador de Listas
```

---

# Principio Fundamental

Los JSON no constituyen una fuente de información.

Son simplemente una representación del contenido del Excel.

Toda modificación comercial comienza y termina en:

```
backend/excel/catalogo.xlsx
```

El resto del sistema únicamente consume esa información de manera consistente.

---

# Objetivo Final

Con un único comando:

```bash
node importar.js
```

el sistema debe ser capaz de:

- importar la nueva lista de precios;
- generar todos los JSON;
- validar la información;
- publicar los datos oficiales;
- dejar listo el cotizador;
- dejar listo el generador de listas.

Sin realizar modificaciones manuales en ningún otro archivo del proyecto.
