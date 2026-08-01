# API y Flujo General del Sistema

## Objetivo

Este documento describe cómo se genera una cotización dentro de Sebamar Cotizador.

Su objetivo es explicar el recorrido completo desde que el usuario presiona "Agregar al presupuesto" hasta que el producto queda incorporado al carrito.

También documenta la organización de la API y las responsabilidades de cada capa.

---

# Arquitectura General

El sistema sigue una arquitectura por capas.

```
Frontend

↓

API REST

↓

Controller

↓

Service

↓

Wrapper

↓

Respuesta Comercial

↓

Frontend

↓

Carrito
```

Cada capa posee una única responsabilidad.

---

# Frontend

Cada módulo posee su propio formulario.

Ejemplos:

- Ventanas
- Ventanas de Abrir
- Puertas
- Patagónicas
- Rajas
- Postigos
- Cortinas
- etc.

El formulario únicamente construye la configuración del producto.

Ejemplo:

```ts
{
    linea: "Modena",
    ancho: 120,
    alto: 110,
    color: "blanco",
    tipoVidrio: "4mm",
    mosquitero: true
}
```

No calcula precios.

---

# API

El frontend envía la configuración mediante una petición POST.

Ejemplos:

```
POST /api/ventanas

POST /api/puertas

POST /api/patagonicas

POST /api/rajas

POST /api/postigones

POST /api/cortinas

POST /api/mosquiteros
```

La API únicamente recibe la configuración.

---

# Controller

Cada endpoint posee un Controller.

Ejemplo:

productController.js

Responsabilidades:

- validar request
- determinar el módulo
- resolver perfil del usuario
- llamar al wrapper correcto
- aplicar margen comercial adicional
- ejecutar auditoría
- devolver respuesta

El Controller nunca calcula precios.

---

# Service

El Service contiene el cálculo técnico.

Ejemplos:

- búsqueda del producto
- lectura del catálogo
- cálculo del vidrio
- cálculo del costo
- construcción de items

El resultado del Service es un costo técnico.

Todavía no existen precios comerciales.

---

# Wrapper

El Wrapper transforma el costo técnico en un producto comercial.

Aplica:

- descuento
- flete
- ganancia
- color
- extras
- descripción
- SVG
- configuración

El Wrapper construye la respuesta final.

---

# Respuesta Comercial

Todos los módulos devuelven el mismo formato general.

Ejemplo:

```ts
{
  (descripcion,
    costoBase,
    costo,
    precioProveedor,
    precioLista,
    precioFinal,
    precioVenta,
    items,
    configuracion,
    svg);
}
```

Esto permite que todo el frontend funcione de manera uniforme.

---

# Margen del Usuario

Luego del Wrapper, el Controller puede aplicar un margen adicional según el usuario autenticado.

Flujo:

```
Wrapper

↓

aplicarMargen()

↓

precioFinal
```

Este margen es independiente de los perfiles comerciales.

---

# Auditoría

Antes de responder al frontend se ejecuta el auditor.

```
Wrapper

↓

Auditor

↓

Logs

↓

Respuesta
```

La auditoría nunca modifica la cotización.

---

# Frontend

El frontend recibe la respuesta y construye un BudgetItem.

Ejemplo:

```
Respuesta API

↓

createBudgetItem()

↓

BudgetItem

↓

Carrito
```

El carrito trabaja con un único formato para todos los productos.

---

# Presupuestos

Cuando el usuario guarda un presupuesto, el BudgetItem completo se persiste.

Posteriormente puede:

- editarse
- imprimirse
- exportarse
- enviarse por WhatsApp

sin volver a recalcular precios.

---

# Endpoints principales

Actualmente existen endpoints para:

- /api/ventanas
- /api/ventanas-abrir
- /api/puertas
- /api/puertas/eco
- /api/patagonicas
- /api/rajas
- /api/postigones
- /api/mosquiteros
- /api/placas
- /api/portones
- /api/superficies
- /api/cortinas

Todos siguen exactamente la misma filosofía.

---

# Responsabilidad por capa

## Frontend

Construye configuración.

Nunca calcula precios.

---

## API

Recibe la solicitud.

Nunca calcula precios.

---

## Controller

Orquesta el proceso.

Nunca contiene reglas comerciales.

---

## Service

Calcula el costo técnico.

Nunca aplica perfiles comerciales.

---

## Wrapper

Convierte el costo técnico en precio comercial.

Es la única capa autorizada para aplicar perfiles comerciales.

---

## Auditor

Verifica consistencia.

Nunca modifica resultados.

---

# Principios

Cada capa debe tener una única responsabilidad.

Nunca duplicar cálculos entre capas.

Nunca aplicar reglas comerciales fuera de los Wrappers.

Nunca consultar directamente el Excel desde el Frontend.

Toda la información comercial proviene de los JSON oficiales generados a partir de `catalogo.xlsx`.

---

# Objetivo Final

Mantener una arquitectura clara, desacoplada y consistente, donde cada componente tenga una única responsabilidad y todas las cotizaciones recorran exactamente el mismo flujo de procesamiento.
