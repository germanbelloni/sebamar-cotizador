# Decisiones de Arquitectura

## Objetivo

Este documento registra las principales decisiones arquitectónicas tomadas durante el desarrollo de Sebamar Cotizador.

No explica cómo funciona el sistema.

Explica por qué funciona de esa manera.

Registrar estas decisiones evita que en el futuro se reviertan cambios importantes por desconocimiento del contexto.

---

# Filosofía

Una decisión arquitectónica sólo se documenta cuando:

- cambia la estructura del sistema;
- afecta múltiples módulos;
- modifica la forma de desarrollar;
- impacta en el mantenimiento futuro.

---

# ADR-001 — Excel como única fuente de verdad

## Decisión

Toda la información comercial proviene de:

```
backend/excel/catalogo.xlsx
```

Los JSON nunca son editados manualmente.

---

## Motivo

Mantener una única fuente de información evita inconsistencias entre:

- cotizador
- listas comerciales
- PDFs
- futuras integraciones

---

## Consecuencia

Toda modificación comercial comienza en:

```
catalogo.xlsx
```

---

# ADR-002 — JSON oficiales

## Decisión

El sistema utiliza únicamente los JSON ubicados en:

```
backend/data
```

---

## Motivo

Permite desacoplar el sistema del Excel durante la ejecución.

El Excel sólo participa durante el proceso de importación.

---

# ADR-003 — Services calculan costos

## Decisión

Los Services calculan únicamente el costo técnico.

Nunca generan precios comerciales.

---

## Motivo

Separar:

cálculo técnico

de

reglas comerciales.

---

# ADR-004 — Wrappers aplican reglas comerciales

## Decisión

Toda regla comercial vive exclusivamente en los Wrappers.

Ejemplos:

- descuentos
- flete
- ganancia
- colores
- extras
- descripciones
- SVG

---

## Motivo

Centralizar todas las reglas comerciales en una única capa.

---

# ADR-005 — Perfiles parametrizados

## Decisión

Los porcentajes comerciales nunca se escriben directamente en el código.

Todos provienen de:

```
backend/config/perfiles.js
```

---

## Beneficio

Modificar un perfil no requiere cambiar código.

---

# ADR-006 — BudgetItem unificado

## Decisión

Todos los módulos generan exactamente el mismo tipo de BudgetItem.

---

## Motivo

Permite que:

- carrito
- PDF
- WhatsApp
- persistencia
- edición

funcionen de manera uniforme.

---

# ADR-007 — Auditoría automática

## Decisión

Toda cotización pasa automáticamente por el auditor.

---

## Motivo

Detectar inconsistencias matemáticas sin afectar al usuario.

---

# ADR-008 — Auditoría no bloqueante

## Decisión

El auditor nunca impide devolver una cotización.

---

## Motivo

Priorizar la continuidad operativa del sistema.

Los problemas quedan registrados para análisis posterior.

---

# ADR-009 — Generador de listas desacoplado

## Decisión

El generador de listas nunca consulta el Excel.

Trabaja únicamente sobre:

```
backend/data
```

---

## Motivo

Garantizar que:

Cotizador

↓

Listas comerciales

utilicen exactamente la misma información.

---

# ADR-010 — Comparador independiente

## Decisión

La validación de listas comerciales se realiza mediante un comparador independiente.

No forma parte del cotizador.

---

## Motivo

Permite validar la consistencia sin modificar la lógica comercial.

---

# ADR-011 — Arquitectura por capas

El sistema está dividido en:

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

Respuesta

Cada capa posee una única responsabilidad.

---

# ADR-012 — Importación en tres etapas

El proceso de actualización comercial se divide en:

Importar

↓

Validar

↓

Publicar

---

## Motivo

Reducir el riesgo de publicar información inconsistente.

---

# ADR-013 — Documentación primero

Toda regla comercial debe documentarse antes de implementarse en código.

La documentación es la referencia funcional del proyecto.

---

# ADR-014 — Sin duplicación de reglas

Una regla comercial debe existir en un único lugar.

Nunca duplicar:

- porcentajes;
- fórmulas;
- recargos;
- descuentos.

---

# ADR-015 — Consistencia entre módulos

Todos los módulos deben compartir la misma arquitectura.

No deben existir excepciones salvo que la regla comercial lo requiera expresamente.

---

# ADR-016 — Frontend sin lógica comercial

El Frontend únicamente construye configuraciones.

Nunca calcula precios.

Nunca aplica descuentos.

Nunca interpreta perfiles.

---

# ADR-017 — Backend responsable del cálculo

Todo cálculo económico pertenece exclusivamente al Backend.

Esto garantiza que cualquier cliente del sistema (Web, App móvil o futuras integraciones) obtenga exactamente el mismo resultado.

---

# ADR-018 — Evolución del sistema

Toda nueva funcionalidad debe adaptarse a la arquitectura existente.

Si una funcionalidad requiere romper una decisión documentada en este archivo, deberá justificarse mediante una nueva ADR.

Las decisiones anteriores no deben modificarse silenciosamente.

---

# Objetivo Final

Conservar el conocimiento arquitectónico del proyecto para que las decisiones importantes no dependan únicamente de la memoria de quienes participaron en el desarrollo.
