
# Guía de Contribución

## Objetivo

Este documento define las reglas que deben respetarse al realizar modificaciones dentro del proyecto Sebamar Cotizador.

No explica cómo funciona el sistema.

Explica cómo debe modificarse.

Su objetivo es preservar la arquitectura, evitar duplicación de código y garantizar que todas las funcionalidades futuras mantengan la misma calidad y consistencia.

---

# Filosofía

Antes de implementar cualquier cambio preguntarse:

¿Existe ya una forma de hacerlo?

El proyecto prioriza:

- reutilizar;
- documentar;
- simplificar;
- mantener consistencia.

Antes de escribir código nuevo, revisar siempre si existe una implementación equivalente.

---

# Regla 1 — Excel como única fuente de verdad

Toda modificación comercial comienza en:

```
backend/excel/catalogo.xlsx
```

Nunca modificar:

```
backend/data
```

Nunca modificar:

```
backend/generated
```

Luego ejecutar:

```
node importar.js
```

o

```
node importar.js --publish
```

según corresponda.

---

# Regla 2 — No duplicar reglas comerciales

Nunca escribir porcentajes directamente en el código.

Toda regla comercial debe provenir de:

```
backend/config/perfiles.js
```

Ejemplos:

- descuentos
- flete
- ganancia
- perfiles

---

# Regla 3 — Respetar la arquitectura

Toda cotización debe recorrer el mismo flujo:

```
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

Auditor

↓

Frontend
```

No agregar lógica comercial fuera de los Wrappers.

---

# Regla 4 — Responsabilidad única

Cada capa tiene una única responsabilidad.

Frontend

Construye configuraciones.

No calcula precios.

---

Controller

Coordina el proceso.

No calcula precios.

---

Service

Calcula costos técnicos.

No aplica perfiles.

---

Wrapper

Aplica reglas comerciales.

Nunca buscar datos directamente desde el Frontend.

---

# Regla 5 — No romper el BudgetItem

Todos los módulos generan un único formato de BudgetItem.

Cualquier cambio debe mantener compatibilidad con:

- carrito;
- presupuestos;
- PDF;
- WhatsApp;
- historial;
- edición.

---

# Regla 6 — Mantener las descripciones

Toda descripción comercial debe seguir:

```
docs/06-descripciones.md
```

No crear formatos alternativos.

No cambiar el orden de las palabras sin actualizar la documentación.

---

# Regla 7 — Todo Wrapper debe ser auditable

Toda respuesta comercial debe ser compatible con:

```
auditarResultado()
```

Ningún Wrapper nuevo debe omitir:

- costoBase
- costo
- precioProveedor
- precioLista
- precioFinal
- items

---

# Regla 8 — No romper el generador de listas

Las listas comerciales deben producir exactamente los mismos precios que el cotizador.

Ante cualquier diferencia:

- revisar Wrapper;
- revisar Transformer;
- revisar reglas comerciales.

Nunca corregir manualmente el Excel generado.

---

# Regla 9 — Reutilizar antes de crear

Antes de crear un helper nuevo verificar si ya existe uno similar.

Ejemplos:

- useBudgetAdder
- updateConfig
- useToggleField
- useDimensionsInputs
- createBudgetItem

Evitar duplicar código.

---

# Regla 10 — Sin código temporal

Antes de finalizar un cambio eliminar:

- console.log
- TODO
- FIXME
- código comentado
- variables sin uso

---

# Regla 11 — Validaciones

Toda validación importante debe existir también en el Backend.

Nunca confiar únicamente en el Frontend.

---

# Regla 12 — Documentar primero

Toda regla comercial nueva debe documentarse antes de implementarse.

Actualizar según corresponda:

- docs/02-reglas-comerciales.md
- docs/06-descripciones.md
- docs/10-decisiones-de-arquitectura.md

---

# Regla 13 — Compilación obligatoria

Antes de realizar un commit ejecutar como mínimo:

```
npm run build
```

No subir cambios con errores de TypeScript.

---

# Regla 14 — Mantener consistencia

Los nuevos módulos deben seguir la misma estructura que los existentes.

Frontend:

```
api/

components/

hooks/

types/

utils/

constants/

ui/
```

Backend:

```
services/

wrappers/

routes/

controllers/
```

---

# Regla 15 — Evitar excepciones

Si una funcionalidad requiere romper una regla existente:

- documentar la decisión;
- justificarla;
- actualizar la documentación correspondiente.

Nunca introducir excepciones silenciosas.

---

# Checklist antes de publicar

Verificar:

□ El proyecto compila correctamente.

□ No existen errores de TypeScript.

□ No existen errores de ESLint.

□ No quedaron console.log.

□ No quedaron TODO o FIXME.

□ El auditor continúa funcionando.

□ Las descripciones respetan el estándar.

□ El PDF continúa mostrando correctamente la información.

□ WhatsApp continúa generando el formato esperado.

□ El BudgetItem mantiene compatibilidad.

□ El generador de listas continúa produciendo los mismos precios que el cotizador.

□ La documentación fue actualizada si el cambio modificó una regla de negocio.

---

# Objetivo Final

Mantener un proyecto consistente, escalable y fácil de mantener, donde todas las modificaciones respeten la arquitectura existente y las reglas de negocio permanezcan centralizadas, documentadas y reutilizables.s
