# REGLAS COMERCIALES - SEBAMAR

---

# Objetivo

Este documento define todas las reglas de negocio utilizadas para generar las listas comerciales de Sebamar.

El código del generador debe limitarse a implementar estas reglas.

Las reglas nunca deben quedar ocultas dentro del código.

---

# FUENTES OFICIALES

El generador no posee datos propios.

Toda la información proviene de las siguientes fuentes.

## 1) Catálogo

backend/excel/catalogo.xlsx

Contiene:

- Ventanas Herrero
- Ventanas Modena
- Rajas
- Puertas
- Media Puertas
- Patagónicas
- Postigones
- Puertas Livianas
- Puertas Placa
- etc.

Es la fuente oficial para todos los productos provenientes del catálogo.

---

## 2) Superficies

backend/data/superficies.json

Contiene:

- Cortinas
- Recargos
- Superficies
- Vidrios por superficie
- Otros productos especiales

Es la fuente oficial para todos los productos definidos por superficie.

---

## 3) Perfiles

backend/config/perfiles.js

Define las reglas comerciales.

Nunca deben duplicarse porcentajes dentro del generador.

---

# ORDEN DE PRIORIDAD

Ante cualquier diferencia:

1. catalogo.xlsx
2. superficies.json
3. perfiles.js

El PDF comercial solamente define el diseño visual.

Nunca modifica una fórmula.

---

# PERFILES COMERCIALES

## Herrero

Costo

↓

Descuento

↓

Flete

↓

Ganancia

---

## Modena

Costo

↓

Descuento

↓

Flete

↓

Ganancia

---

## Mosquiteros

Costo

↓

Aumento 1

↓

Aumento 2

↓

Ganancia

---

## Recargos

Costo

↓

Flete

↓

Ganancia

(No aplica descuento)

---

## Placas

Utiliza su perfil específico definido en perfiles.js.

---

## Cortinas

Utiliza su perfil específico definido en perfiles.js.

---

# MÓDULOS

---

## Ventanas Herrero

Fuente

catalogo.xlsx

Perfil

Herrero

Columnas comerciales

Vidrio Entero

= BASE + VIDRIO

↓

Perfil Herrero

---

Ventana con Guía

= BASE + GUIA + VIDRIO

↓

Perfil Herrero

---

Mosquitero

= MOSQUITERO

↓

Perfil Mosquiteros

---

Vidrio Repartido

= (BASE + VIDRIO) +30%

↓

Perfil Herrero

---

## Rajas Herrero

Fuente

catalogo.xlsx

Perfil

Herrero

Para cada vidrio

BASE + VIDRIO

↓

Perfil Herrero

Utiliza imagen.

---

## Puertas Herrero

Fuente

catalogo.xlsx

Perfil

Herrero

Para cada vidrio

BASE + VIDRIO

↓

Perfil Herrero

Utiliza imagen.

---

## Media Puertas

Fuente

catalogo.xlsx

Perfil

Herrero

BASE + VIDRIO

↓

Perfil Herrero

---

## Ventanas Modena

Fuente

catalogo.xlsx

Perfil

Modena

3 mm

BASE + 3MM

↓

Perfil Modena

---

4 mm

BASE + 4MM

↓

Perfil Modena

---

5 mm

BASE + 5MM

↓

Perfil Modena

---

3+3

BASE + 3+3

↓

Perfil Modena

---

DVH

BASE + 4MM + 4MM + CAMARA

↓

Perfil Modena

---

Guía

GUIA

↓

Perfil Modena

---

Mosquitero

MOSQUITERO

↓

Perfil Mosquiteros

---

## Rajas Modena

Fuente

catalogo.xlsx

Perfil

Modena

4 mm

BASE + 4MM

↓

Perfil Modena

---

3+3

BASE + 3+3

↓

Perfil Modena

---

DVH

BASE + 4MM + 4MM + CAMARA

↓

Perfil Modena

Utiliza imagen.

---

## Puertas Modena

Fuente

catalogo.xlsx

Perfil

Modena

Misma lógica que Puertas Herrero.

Utiliza imagen.

---

## Patagónicas

Fuente

catalogo.xlsx

Perfil

Modena

4 mm

BASE + 4MM

↓

Perfil Modena

---

3+3

BASE + 3+3

↓

Perfil Modena

---

DVH

BASE + 4MM + 4MM + CAMARA

↓

Perfil Modena

---

## Postigones

Fuente

catalogo.xlsx

Perfil

Herrero

Corredizo

CORREDIZO

↓

Perfil Herrero

---

De Abrir

DE_ABRIR +5%

↓

Perfil Herrero

---

## Puertas Livianas

Fuente

catalogo.xlsx

Perfil

Herrero

BASE + VIDRIO

↓

Perfil Herrero

Utiliza imagen.

---

## Mosquiteros

Fuente

catalogo.xlsx

Perfil

Mosquiteros

MOSQUITERO

↓

Perfil Mosquiteros

---

## Puertas Placa

Fuente

catalogo.xlsx

Perfil

Placas

Precio catálogo

↓

Perfil Placas

---

## Cortinas

Fuente

superficies.json

Perfil

Cortinas

Precio superficie

↓

Perfil Cortinas

---

## Recargos

Fuente

superficies.json

Perfil

Recargos

Precio

↓

Flete

↓

Ganancia

(No aplica descuento)

---

# REGLAS DE PRESENTACIÓN

Las listas comerciales deben mantener la estética del PDF oficial.

Se deben respetar:

- Orden de hojas.
- Colores.
- Bordes.
- Encabezados.
- Títulos.
- Imágenes.
- Márgenes.
- Espaciados.
- Tamaños de tablas.

El PDF oficial es la referencia visual.

---

# OBJETIVO FINAL

La impresión en PDF de los Excel generados debe ser visualmente equivalente a la lista comercial oficial de Sebamar.
