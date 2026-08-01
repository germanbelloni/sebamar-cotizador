# Estructura del Proyecto

## Objetivo

Este documento describe la organización física del proyecto Sebamar Cotizador.

Su propósito es facilitar el mantenimiento, evitar duplicación de código y ayudar a localizar rápidamente cada componente del sistema.

La estructura está organizada por responsabilidades y no por tecnologías.

---

# Estructura General

```
sebamarapp/

├── backend/
├── frontend/
├── listas/
├── docs/
├── package.json
└── README.md
```

Cada carpeta posee una responsabilidad específica.

---

# backend/

Contiene toda la lógica de negocio del sistema.

Aquí viven los cálculos comerciales, la API, la autenticación y la persistencia.

```
backend/

├── config/
├── controllers/
├── data/
├── generated/
├── excel/
├── middleware/
├── models/
├── routes/
├── services/
├── wrappers/
├── auditor/
├── logs/
├── scripts/
├── utils/
├── pdf/
└── server.js
```

---

# config/

Configuración general del sistema.

Ejemplos:

- perfiles.js

Nunca contiene lógica de negocio.

---

# controllers/

Controladores de la API.

Responsabilidades:

- recibir requests
- validar datos
- resolver usuarios
- llamar wrappers
- devolver respuestas

Nunca realizan cálculos.

---

# services/

Contienen el cálculo técnico.

Responsabilidades:

- leer JSON
- buscar productos
- calcular costos
- construir items

Nunca aplican perfiles comerciales.

---

# wrappers/

Transforman un costo técnico en un producto comercial.

Aplican:

- descuentos
- fletes
- ganancias
- colores
- extras
- descripciones
- SVG
- configuración

Toda regla comercial vive aquí.

---

# routes/

Define todos los endpoints disponibles.

Ejemplo:

```
/api/ventanas
/api/puertas
/api/patagonicas
```

---

# middleware/

Funciones reutilizables ejecutadas antes de los controllers.

Ejemplos:

- autenticación
- autorización
- validaciones

---

# models/

Modelos de MongoDB.

Ejemplos:

- User
- Presupuesto

---

# data/

JSON oficiales utilizados por el sistema.

Nunca deben editarse manualmente.

Siempre son generados automáticamente.

---

# generated/

JSON temporales producidos por la importación del Excel.

Su contenido puede eliminarse y regenerarse.

---

# excel/

Contiene la fuente oficial del sistema.

```
catalogo.xlsx
```

Toda modificación comercial comienza aquí.

---

# scripts/

Procesos auxiliares.

Ejemplos:

- importar.js
- compareGenerated.js
- publishGenerated.js
- runExcel.js

---

# auditor/

Sistema de auditoría automática.

Verifica consistencia matemática y estructural.

---

# logs/

Registros del sistema.

Ejemplos:

- auditorías
- errores
- eventos

---

# pdf/

Generación de presupuestos PDF.

Aquí viven:

- renderer
- templates
- estilos
- puppeteer

---

# utils/

Funciones reutilizables.

Ejemplos:

- aplicarMargen
- sanitizarCotizacion
- helpers

Nunca contienen reglas específicas de un módulo.

---

# frontend/

Interfaz del usuario.

Está organizada por funcionalidades.

```
frontend/

src/

    app/

    components/

    features/

    hooks/

    lib/

    routes/

    shared/

    styles/

    types/
```

---

# features/

Cada módulo comercial posee su propia carpeta.

Ejemplos:

```
ventanas/

puertas/

rajas/

patagonicas/

postigones/

cortinas/

placas/
```

Cada módulo contiene normalmente:

- componentes
- hooks
- api
- types
- utils
- constants
- ui

---

# shared/

Componentes reutilizados por múltiples módulos.

Ejemplos:

- botones
- selectores
- layouts
- budget
- validaciones

---

# lib/

Configuraciones compartidas.

Ejemplo:

cliente Axios.

---

# app/

Configuración general de React.

---

# routes/

Definición de navegación.

---

# components/

Componentes completamente genéricos.

No contienen lógica comercial.

---

# listas/

Generador de listas comerciales.

Su responsabilidad es construir los Excel comerciales a partir de los JSON oficiales.

```
listas/

config/

transformers/

templates/

utils/

output/

generar-listas.js

validar-listas.js
```

Nunca consulta directamente el Excel.

Siempre trabaja sobre backend/data.

---

# docs/

Documentación técnica oficial del proyecto.

Toda regla de negocio debe documentarse aquí antes de implementarse en código.

---

# Flujo entre carpetas

```
catalogo.xlsx

↓

backend/generated

↓

backend/data

↓

backend/services

↓

backend/wrappers

↓

API

↓

Frontend

↓

Budget

↓

PDF
```

---

# Dependencias

Cada capa solamente puede depender de la inmediatamente inferior.

Ejemplo:

Frontend

↓

API

↓

Controller

↓

Service

↓

Wrapper

↓

Data

Nunca al revés.

---

# Regla Fundamental

Cada carpeta tiene una única responsabilidad.

Si un archivo comienza a asumir responsabilidades de otra carpeta, debe refactorizarse.

Esta separación permite mantener el proyecto escalable y facilita el mantenimiento a largo plazo.

---

# Objetivo Final

Mantener una estructura clara, predecible y consistente, donde cualquier desarrollador pueda localizar rápidamente la lógica correspondiente a cada funcionalidad y comprender el recorrido completo de una cotización.
