# Glosario

## Objetivo

Este documento reúne los términos utilizados dentro del proyecto Sebamar Cotizador.

Su propósito es mantener un vocabulario único entre la documentación, el código y el negocio.

---

# Excel

Archivo oficial que contiene los costos de fábrica.

Ubicación:

backend/excel/catalogo.xlsx

Es la única fuente de verdad del sistema.

---

# JSON Oficial

Archivos ubicados en:

backend/data

Representan la información publicada utilizada por el sistema.

Nunca se editan manualmente.

---

# JSON Generado

Archivos ubicados en:

backend/generated

Son temporales y se generan automáticamente durante la importación.

---

# Service

Capa encargada del cálculo técnico.

Calcula costos.

No aplica reglas comerciales.

---

# Wrapper

Capa encargada de transformar un costo técnico en un producto comercial.

Aplica:

- descuentos;
- fletes;
- ganancias;
- colores;
- extras;
- descripciones.

---

# Controller

Recibe la solicitud de la API y coordina el proceso de cálculo.

No contiene reglas comerciales.

---

# Perfil Comercial

Conjunto de reglas utilizadas para transformar un costo en un precio de venta.

Se definen en:

backend/config/perfiles.js

---

# Costo Base

Costo técnico del producto antes de aplicar reglas comerciales.

---

# Costo

Costo luego de aplicar descuentos internos.

---

# Precio Proveedor

Costo luego de aplicar el flete.

Representa el precio utilizado como referencia comercial.

---

# Precio Lista

Precio luego de aplicar la ganancia del perfil.

Es el precio comercial del producto.

---

# Precio Final

Precio Lista más el margen adicional del usuario, si corresponde.

Es el valor que recibe el frontend.

---

# Precio Venta

Campo utilizado por el frontend para mostrar el valor comercial.

Generalmente coincide con Precio Final.

---

# Margen

Porcentaje adicional configurable por usuario.

Se aplica después del Wrapper.

No forma parte de los perfiles comerciales.

---

# Perfil

Configuración comercial que determina:

- descuento;
- flete;
- ganancia.

Ejemplos:

- Amarilla
- Azul
- Verde
- Papu

---

# BudgetItem

Objeto unificado utilizado por el carrito, los presupuestos, el PDF y WhatsApp.

Todos los módulos generan este formato.

---

# Auditor

Sistema encargado de verificar la consistencia matemática y estructural de una cotización.

No modifica resultados.

No bloquea operaciones.

---

# Importación

Proceso que convierte el Excel oficial en los JSON utilizados por el sistema.

---

# Publicación

Proceso que reemplaza los JSON oficiales por una nueva versión generada.

---

# Transformador

Componente del generador de listas encargado de convertir un JSON oficial en una estructura comercial para Excel.

Cada módulo posee su propio transformador.

---

# Generador de Listas

Sistema que construye automáticamente las listas comerciales a partir de los JSON oficiales.

No consulta directamente el Excel.

---

# Comparador

Herramienta que verifica la consistencia entre los JSON generados y los oficiales.

Se utiliza durante la importación y en la validación de listas.

---

# PDF Comercial

Documento generado automáticamente a partir de un presupuesto.

Utiliza la misma información que el carrito.

No recalcula precios.

---

# Descripción Comercial

Texto que identifica un producto dentro del sistema.

Se utiliza en:

- carrito;
- PDF;
- WhatsApp;
- presupuestos;
- historial.

Debe seguir el formato definido en:

docs/06-descripciones.md

---

# Cotización

Resultado completo generado por un Wrapper.

Incluye:

- descripción;
- precios;
- items;
- configuración;
- SVG.

---

# Fuente de Verdad

Concepto fundamental del proyecto.

Toda la información comercial proviene de:

backend/excel/catalogo.xlsx

Cualquier diferencia entre el código y esta fuente debe resolverse modificando el Excel, nunca el código ni los JSON.

---

# Objetivo Final

Mantener un lenguaje común para desarrolladores, usuarios técnicos y responsables comerciales, facilitando el mantenimiento y la evolución del sistema.
