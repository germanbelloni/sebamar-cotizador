# Historia del Proyecto

## Objetivo

Este documento registra la evolución del proyecto Sebamar Cotizador.

No describe el funcionamiento interno del sistema.

No documenta reglas comerciales.

Su propósito es conservar el contexto histórico que llevó a la arquitectura actual, evitando que decisiones importantes se pierdan con el tiempo.

---

# El comienzo

El proyecto nació con un objetivo muy simple:

Construir un cotizador comercial para Sebamar que reemplazara el cálculo manual de presupuestos.

Inicialmente el sistema solamente debía calcular algunos productos de aluminio.

Con el tiempo comenzaron a incorporarse nuevos módulos, nuevas reglas comerciales y nuevos perfiles de clientes.

El crecimiento del proyecto hizo evidente la necesidad de reorganizar completamente la arquitectura.

---

# Primera etapa

Durante las primeras versiones:

- existía código duplicado;
- varios módulos resolvían el mismo problema de maneras distintas;
- algunas reglas comerciales estaban distribuidas entre frontend y backend;
- los porcentajes aparecían escritos directamente en el código.

Aunque el sistema funcionaba, su mantenimiento comenzaba a ser cada vez más complejo.

---

# Separación por capas

La primera gran decisión arquitectónica fue dividir el sistema en capas claramente diferenciadas.

Se estableció la siguiente estructura:

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

Respuesta Comercial

Cada capa pasó a tener una única responsabilidad.

Esta decisión simplificó enormemente el mantenimiento.

---

# Services y Wrappers

Originalmente los cálculos comerciales y técnicos convivían en el mismo lugar.

Con la nueva arquitectura se decidió separar ambos conceptos.

Los Services quedaron encargados únicamente del cálculo técnico.

Los Wrappers pasaron a aplicar todas las reglas comerciales.

Esta separación permitió reutilizar cálculos sin duplicar lógica.

---

# Excel como única fuente de verdad

Otra decisión fundamental fue establecer una única fuente oficial de información.

Se definió que:

backend/excel/catalogo.xlsx

sería el origen de todos los precios del sistema.

Los JSON dejaron de ser editables manualmente.

Desde ese momento:

Excel

↓

JSON

↓

Todo el sistema

---

# Automatización de la importación

Para evitar errores manuales se desarrolló un pipeline automático.

catalogo.xlsx

↓

Importar

↓

Validar

↓

Publicar

↓

backend/data

Esto eliminó completamente la necesidad de modificar archivos JSON manualmente.

---

# Perfiles comerciales

En versiones anteriores existían porcentajes escritos directamente en distintos módulos.

Posteriormente se creó:

backend/config/perfiles.js

Centralizando:

- descuentos;
- fletes;
- ganancias;
- perfiles comerciales.

Desde entonces todos los módulos utilizan exactamente la misma configuración.

---

# Unificación del BudgetItem

Originalmente cada módulo devolvía información diferente.

Esto dificultaba:

- editar presupuestos;
- generar PDFs;
- exportar por WhatsApp;
- guardar información.

Se decidió crear un único formato:

BudgetItem

Todos los módulos comenzaron a generar exactamente la misma estructura.

Esta fue una de las decisiones más importantes del proyecto.

---

# Auditor automático

Con el crecimiento del sistema comenzaron a aparecer errores difíciles de detectar.

Para resolverlo se creó el Sistema de Auditoría.

Cada Wrapper pasó a validar automáticamente:

- consistencia matemática;
- estructura;
- pasos de cálculo;
- precios.

La auditoría nunca modifica resultados.

Únicamente registra información para facilitar futuras investigaciones.

---

# Generador de listas comerciales

Inicialmente las listas comerciales eran independientes del cotizador.

Esto implicaba un alto riesgo de inconsistencias.

Posteriormente se desarrolló un generador automático que utiliza exactamente la misma información que el cotizador.

El flujo quedó definido como:

catalogo.xlsx

↓

JSON

↓

Cotizador

↓

Generador de listas

De esta manera ambos caminos producen exactamente los mismos precios.

---

# Comparadores y validadores

A medida que el sistema creció se incorporaron herramientas automáticas para verificar:

- JSON generados;
- listas comerciales;
- consistencia matemática;
- auditorías masivas.

Estas herramientas permitieron detectar errores antes de llegar a producción.

---

# Refactorización general

Durante el desarrollo de V1 se realizó una revisión completa del proyecto.

Entre otras tareas:

- eliminación de código duplicado;
- eliminación de TODO;
- eliminación de FIXME;
- limpieza de warnings;
- unificación de componentes;
- estandarización de hooks;
- centralización de reglas comerciales.

El objetivo fue llegar a una versión estable y mantenible.

---

# Cierre de V1

La versión V1 representa la consolidación de la arquitectura del sistema.

Sus principales características son:

- arquitectura por capas;
- Excel como fuente única;
- perfiles parametrizados;
- auditor automático;
- importación automatizada;
- generador de listas comerciales;
- documentación técnica completa;
- BudgetItem unificado;
- separación clara entre cálculo técnico y reglas comerciales.

La prioridad dejó de ser agregar funcionalidades y pasó a ser garantizar estabilidad, consistencia y facilidad de mantenimiento.

---

# Filosofía del proyecto

Durante todo el desarrollo se mantuvieron algunos principios fundamentales.

## Una única fuente de verdad

Toda información comercial proviene del Excel.

---

## No duplicar reglas

Cada regla comercial existe una única vez.

---

## Responsabilidad única

Cada capa cumple una función específica.

---

## Automatizar

Todo proceso repetitivo debe automatizarse siempre que sea posible.

---

## Documentar

Toda decisión importante debe quedar documentada.

El conocimiento del sistema no debe depender únicamente de quienes participaron en su desarrollo.

---

# Mirando hacia el futuro

La arquitectura actual fue diseñada para facilitar la incorporación de nuevas funcionalidades sin modificar las bases del sistema.

Las futuras versiones podrán agregar:

- nuevos productos;
- nuevos perfiles comerciales;
- nuevos canales de venta;
- nuevas integraciones;
- aplicaciones móviles;
- paneles administrativos.

Todo ello reutilizando la misma estructura definida durante V1.

---

# Agradecimiento

Sebamar Cotizador es el resultado de un proceso continuo de análisis, refactorización y mejora.

Más allá del código, el verdadero objetivo del proyecto fue construir una base sólida, documentada y sostenible en el tiempo.

La arquitectura actual no es el resultado de una única decisión, sino de cientos de pequeñas mejoras realizadas con un mismo criterio: mantener el sistema simple, consistente y preparado para evolucionar.
