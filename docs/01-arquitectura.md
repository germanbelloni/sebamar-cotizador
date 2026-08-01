# Arquitectura del Sistema

## Objetivo

Este documento describe la arquitectura general del Sebamar Cotizador.

Su propósito es explicar cómo fluye la información dentro del sistema, cuál es la responsabilidad de cada capa y cuáles son las reglas arquitectónicas que deben respetarse durante el desarrollo.

Este documento no describe reglas comerciales. Dichas reglas se encuentran en:

```
02-reglas-comerciales.md
```

---

# Filosofía

El proyecto fue diseñado siguiendo algunos principios fundamentales.

- Una única fuente de verdad.
- Separación entre cálculo y presentación.
- Responsabilidad única por capa.
- Reutilización de lógica.
- Ausencia de reglas comerciales duplicadas.
- Automatización de procesos repetitivos.
- Auditoría permanente.

Cada componente del sistema posee una única responsabilidad.

---

# Arquitectura General

```
                 catalogo.xlsx
                        │
                        ▼
                 importar.js
                        │
                        ▼
             backend/generated
                        │
                 Validación
                        │
                        ▼
                 backend/data
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
     Cotizador                 Generador de Listas
         │                             │
         ▼                             ▼
   Presupuestos               Excel Comerciales
                                        │
                                        ▼
                                   PDF Comercial
```

Todo el sistema consume exactamente los mismos datos.

Nunca existen fuentes paralelas.

---

# Organización General

El proyecto está dividido en cuatro grandes bloques.

```
Frontend

Backend

Generador de Listas

Documentación
```

Cada bloque posee responsabilidades claramente definidas.

---

# Frontend

Responsable de:

- interfaz gráfica;
- configuración del producto;
- validación visual;
- administración del presupuesto;
- comunicación con la API.

El frontend nunca calcula precios.

Nunca aplica perfiles.

Nunca modifica reglas comerciales.

Únicamente envía la configuración elegida por el usuario.

---

# Backend

Responsable de:

- cálculo comercial;
- aplicación de perfiles;
- autenticación;
- persistencia;
- auditoría;
- generación de respuestas.

Toda la lógica de negocio vive aquí.

---

# Flujo de una Cotización

```
Usuario

↓

Formulario

↓

API

↓

Controller

↓

Wrapper

↓

Service

↓

JSON

↓

Wrapper

↓

Auditor

↓

Respuesta

↓

Frontend
```

Cada etapa cumple una función específica.

---

# Controllers

Los controllers reciben las solicitudes provenientes del frontend.

Responsabilidades:

- validar el request;
- seleccionar el wrapper correspondiente;
- devolver la respuesta.

Los controllers nunca realizan cálculos comerciales.

---

# Wrappers

Los wrappers representan la capa comercial del sistema.

Responsabilidades:

- seleccionar el perfil;
- aplicar descuentos;
- aplicar fletes;
- aplicar ganancias;
- aplicar colores;
- construir la respuesta final.

Los wrappers nunca leen Excel.

Nunca consultan Mongo.

Nunca contienen información propia.

---

# Services

Los services contienen el cálculo técnico del producto.

Responsabilidades:

- leer los JSON oficiales;
- calcular costos;
- construir los items;
- devolver el costo base.

Los services nunca aplican perfiles comerciales.

---

# JSON Oficiales

Los JSON ubicados en:

```
backend/data
```

constituyen la base de datos comercial del sistema.

Estos archivos son generados automáticamente.

Nunca deben modificarse manualmente.

---

# Excel

Toda la información comercial nace en:

```
backend/excel/catalogo.xlsx
```

Este archivo constituye la única fuente oficial de precios del sistema.

---

# Motor Comercial

El cálculo siempre sigue el siguiente recorrido:

```
Costo Base

↓

Extras

↓

Color

↓

Perfil Comercial

↓

Margen Cliente

↓

Precio Final
```

Cada módulo implementa este flujo respetando las reglas definidas en:

```
02-reglas-comerciales.md
```

---

# Auditoría

Una vez calculada la cotización:

```
Wrapper

↓

Auditor

↓

Log

↓

Respuesta
```

La auditoría verifica la consistencia matemática de la cotización.

Nunca modifica el resultado.

---

# Presupuestos

Los presupuestos almacenan la respuesta completa devuelta por el wrapper.

Esto permite reconstruir exactamente la cotización original.

---

# Generador de Listas

El generador de listas comerciales no utiliza el Excel directamente.

Consume los mismos JSON utilizados por el cotizador.

```
backend/data

↓

Transformers

↓

Motor Comercial

↓

Excel

↓

PDF
```

De esta forma el cotizador y las listas comerciales producen exactamente los mismos valores.

---

# Responsabilidad de cada Capa

## Frontend

- interfaz
- validaciones visuales
- experiencia del usuario

---

## Controller

- recibe requests
- selecciona módulo
- devuelve respuesta

---

## Wrapper

- aplica reglas comerciales
- aplica perfiles
- construye respuesta

---

## Service

- calcula costos
- arma items
- consulta JSON

---

## Auditor

- verifica consistencia
- registra errores
- nunca modifica resultados

---

## Generador de Listas

- interpreta JSON
- aplica perfiles
- construye Excel

---

# Reglas Arquitectónicas

Durante el desarrollo deben respetarse las siguientes reglas.

## Nunca

- calcular precios en el frontend;
- duplicar lógica comercial;
- modificar JSON manualmente;
- leer el Excel desde los wrappers;
- aplicar perfiles dentro de los services.

---

## Siempre

- utilizar los JSON oficiales;
- reutilizar services;
- mantener una única fuente de verdad;
- respetar la separación entre capas;
- registrar auditorías.

---

# Diagrama General

```
Excel
   │
   ▼
Importador
   │
   ▼
JSON Oficiales
   │
   ├──────────────┐
   │              │
   ▼              ▼
Cotizador     Generador
   │              │
   ▼              ▼
Presupuesto   Excel Comercial
   │              │
   └──────┬───────┘
          ▼
         PDF
```

---

# Objetivo Final

Toda modificación comercial realizada en:

```
backend/excel/catalogo.xlsx
```

debe reflejarse automáticamente en:

- cotizador;
- presupuestos;
- listas comerciales;
- PDF;
- WhatsApp;
- impresión.

Sin modificar una sola línea de código.
