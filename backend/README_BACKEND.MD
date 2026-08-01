# Backend - Sebamar Cotizador

## Objetivo

El backend implementa toda la lógica comercial del sistema.

Es el responsable de:

- calcular costos;
- aplicar perfiles comerciales;
- construir respuestas comerciales;
- auditar resultados;
- administrar presupuestos;
- importar listas de precios.

---

# Arquitectura

El flujo general es:

Request

↓

Controller

↓

Service

↓

Wrapper

↓

Auditor

↓

Response

---

# Responsabilidades

## Controllers

Reciben requests y coordinan el proceso.

No contienen reglas comerciales.

---

## Services

Calculan costos técnicos.

No aplican descuentos.

No aplican ganancias.

---

## Wrappers

Aplican:

- descuentos;
- perfiles;
- flete;
- ganancia;
- color;
- extras;
- margen.

Construyen la respuesta final.

---

## Auditor

Verifica automáticamente la consistencia matemática de cada cotización.

Nunca modifica resultados.

---

# Fuente de datos

Toda la información comercial proviene de:

backend/excel/catalogo.xlsx

↓

backend/generated

↓

backend/data

---

# Desarrollo

Ejecutar

npm install

npm start

Actualizar listas

node importar.js

Generar listas comerciales

node listas/generar-listas.js

---

# Filosofía

Toda regla comercial pertenece al backend.

El frontend únicamente consume sus respuestas.
