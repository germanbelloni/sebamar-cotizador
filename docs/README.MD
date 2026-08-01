# Sebamar Cotizador

Sistema integral de cotización, administración de presupuestos y generación automática de listas comerciales desarrollado para Sebamar.

El proyecto centraliza toda la lógica comercial de la empresa en una única plataforma, garantizando que el cotizador, las listas comerciales y los presupuestos utilicen exactamente la misma información.

---

# Objetivos

El sistema fue diseñado con los siguientes objetivos:

- Centralizar toda la lógica comercial.
- Mantener una única fuente oficial de precios.
- Eliminar duplicación de datos.
- Automatizar la generación de listas comerciales.
- Garantizar consistencia entre el cotizador y las listas.
- Facilitar el mantenimiento mediante una arquitectura desacoplada.

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
       ┌───────────────┴───────────────┐
       │                               │
       ▼                               ▼
 Cotizador                     Generador de Listas
       │                               │
       ▼                               ▼
 Presupuestos                Excel Comerciales
                                       │
                                       ▼
                                 PDF Comercial
```

Todo el sistema utiliza una única fuente de información.

---

# Stack Tecnológico

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Query
- Zustand

## Backend

- Node.js
- Express
- MongoDB
- Mongoose

## Utilidades

- ExcelJS
- XLSX
- Puppeteer
- JWT

---

# Filosofía del Proyecto

El sistema fue construido siguiendo algunos principios fundamentales.

- Una única fuente de verdad.
- Sin lógica comercial duplicada.
- Separación estricta entre cálculo y presentación.
- Arquitectura por capas.
- Servicios reutilizables.
- Wrappers responsables únicamente del perfil comercial.
- Auditoría automática de todas las cotizaciones.
- Validación automática de listas comerciales.

---

# Flujo General

```
Frontend

↓

API

↓

Controller

↓

Wrapper

↓

Service

↓

JSON Oficiales

↓

Resultado Comercial

↓

Auditor

↓

Respuesta
```

Cada capa posee una única responsabilidad.

---

# Fuente Oficial de Datos

Toda modificación comercial comienza siempre en:

```
backend/excel/catalogo.xlsx
```

Luego se ejecuta:

```
node importar.js
```

Este proceso reconstruye automáticamente todos los archivos utilizados por el sistema.

Nunca deben modificarse manualmente:

```
backend/data
backend/generated
```

---

# Estructura del Proyecto

```
backend/

    config/
    controllers/
    data/
    excel/
    generated/
    middleware/
    models/
    routes/
    scripts/
    services/
    utils/
    wrappers/

frontend/

    src/
        app/
        components/
        features/
        shared/
        lib/

listas/

docs/
```

---

# Documentación

Toda la documentación técnica se encuentra dentro de la carpeta:

```
docs/
```

## Índice

### Arquitectura

- **01-arquitectura.md**
  Arquitectura completa del sistema, responsabilidades de cada capa y flujo general.

---

### Reglas de negocio

- **02-reglas-comerciales.md**
  Reglas comerciales oficiales utilizadas por el cotizador y el generador de listas.

---

### Importación de listas

- **03-importacion-precios.md**
  Pipeline completo para importar una nueva lista de precios desde `catalogo.xlsx`.

---

### Generador de listas comerciales

- **04-generador-listas.md**
  Arquitectura y funcionamiento del motor que construye automáticamente las listas comerciales.

---

### Auditoría

- **05-auditoria.md**
  Funcionamiento del sistema de auditoría automática de cotizaciones.

---

### Flujo del cotizador

- **06-flujo-cotizacion.md**
  Explicación completa del recorrido de una cotización desde el Frontend hasta el resultado final.

---

### API

- **07-api.md**
  Organización general de endpoints, controllers, wrappers y services.

---

### Despliegue

- **08-deploy.md**
  Configuración de producción, variables de entorno y proceso de despliegue.

---

### Formato de descripciones

- **09-formato-descripciones.md**
  Convención oficial para construir las descripciones comerciales utilizadas en presupuestos, PDF, WhatsApp y almacenamiento.

---

### Roadmap

- **10-roadmap-v2.md**
  Mejoras futuras, funcionalidades previstas y evolución del proyecto.

---

### Convenciones de desarrollo

- **11-convenciones-desarrollo.md**
  Reglas obligatorias para mantener la arquitectura, evitar duplicación de lógica y preservar la consistencia del sistema.

---

# Estado del Proyecto

Versión actual:

**Sebamar Cotizador V1**

Estado actual:

- ✅ Arquitectura finalizada.
- ✅ Motor comercial finalizado.
- ✅ Generador de listas implementado.
- ✅ Auditoría automática implementada.
- ✅ Pipeline de importación automatizado.
- 🔄 QA final.

---

# Licencia

Proyecto desarrollado exclusivamente para Sebamar.

Uso interno.
