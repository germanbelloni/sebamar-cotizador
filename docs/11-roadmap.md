# Roadmap del Proyecto

## Objetivo

Este documento registra la evolución del proyecto Sebamar Cotizador.

No describe el funcionamiento del sistema.

Describe el estado del proyecto, las versiones publicadas y las funcionalidades previstas.

Debe actualizarse al finalizar cada versión importante.

---

# Filosofía

El roadmap representa la planificación del proyecto.

No reemplaza al control de versiones (Git).

No reemplaza la documentación técnica.

Su objetivo es mostrar la evolución funcional del sistema.

---

# Estado actual

Versión

V1

Estado

En etapa final de estabilización.

La arquitectura principal se encuentra finalizada.

---

# Funcionalidades implementadas

## Productos

- Ventanas Herrero
- Ventanas Modena
- Ventanas de Abrir
- Puertas Herrero
- Puertas Modena
- Puertas Eco
- Patagónicas
- Rajas
- Postigos
- Mosquiteros
- Portones
- Paños Fijos
- Puertas Placa
- Cortinas

---

## Sistema Comercial

- Perfiles comerciales parametrizados
- Colores parametrizados
- Presupuestos
- PDF
- WhatsApp
- Historial
- Edición de presupuestos
- Auditor automático
- Generador de listas comerciales

---

## Automatización

- Importación automática desde Excel
- Validación de JSON
- Publicación automática
- Auditor masivo
- Comparador de listas
- Script único de generación

---

# Cambios importantes de V1

Durante el desarrollo de V1 se tomaron decisiones estructurales importantes.

Entre ellas:

- Unificación de BudgetItem
- Separación Service / Wrapper
- Excel como única fuente de verdad
- Auditor automático
- Perfiles parametrizados
- Eliminación de lógica duplicada
- Generador automático de listas comerciales

---

# Objetivos de V2

Las siguientes funcionalidades fueron identificadas como mejoras futuras.

## Funcionales

- Multiempresa avanzado
- Gestión de clientes
- Reportes comerciales
- Dashboard de ventas
- Historial de precios
- Estadísticas avanzadas

---

## Técnicos

- Caché inteligente
- Optimización de rendimiento
- Mejoras de UX
- Optimización móvil
- Mayor cobertura de pruebas

---

## Infraestructura

- Backups automáticos
- Monitoreo
- Métricas
- Logs centralizados
- Alertas

---

# Cambios futuros

Toda nueva funcionalidad importante deberá agregarse a este documento.

Debe incluir:

- objetivo;
- estado;
- prioridad;
- versión prevista.

---

# Versionado

## V1

Objetivo:

Finalizar el cotizador completo con generación automática de listas comerciales.

Estado:

En cierre.

---

## V2

Objetivo:

Expandir funcionalidades comerciales sin modificar la arquitectura principal.

Estado:

Planificada.

---

## V3

Sin definir.

---

# Política de cambios

Una versión sólo puede considerarse finalizada cuando:

- todas las auditorías estén aprobadas;
- no existan bugs críticos abiertos;
- la documentación esté actualizada;
- las listas comerciales coincidan con el cotizador.

---

# Objetivo Final

Mantener un historial claro de la evolución funcional del proyecto y facilitar la planificación de futuras versiones.
