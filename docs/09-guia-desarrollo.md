# Guía de Desarrollo

## Objetivo

Este documento define las reglas que deben seguirse al desarrollar nuevas funcionalidades dentro de Sebamar Cotizador.

Su propósito es mantener una arquitectura consistente, evitar duplicación de código y garantizar que todos los módulos funcionen de la misma manera.

No describe reglas comerciales.

Describe únicamente la forma correcta de desarrollar dentro del proyecto.

---

# Filosofía

Antes de escribir una línea de código preguntarse:

¿Ya existe algo parecido?

En la mayoría de los casos la respuesta será sí.

El proyecto prioriza reutilizar antes que crear.

---

# Principios

Todo módulo nuevo debe respetar las mismas capas del sistema.

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

Respuesta
```

Nunca deben mezclarse responsabilidades.

---

# Cómo agregar un módulo nuevo

Todo módulo comercial debería seguir la siguiente estructura.

Frontend

```
features/

nuevoModulo/

    api/

    components/

    constants/

    hooks/

    types/

    ui/

    utils/
```

Backend

```
services/

nuevoModulo/

wrappers/

nuevoModulo/

routes/

controller
```

---

# Controllers

Responsabilidad:

- recibir requests
- validar parámetros
- elegir wrapper
- devolver respuesta

Nunca:

- calcular precios
- aplicar descuentos
- buscar productos

---

# Services

Responsabilidad:

- leer JSON
- buscar productos
- calcular costos
- construir items

Nunca:

- aplicar perfiles
- aplicar descuentos
- aplicar colores
- construir descripción comercial

---

# Wrappers

Responsabilidad:

transformar un costo técnico en un producto comercial.

Aplican:

- descuentos
- flete
- ganancia
- color
- descripción
- SVG
- configuración

Toda regla comercial pertenece aquí.

---

# Frontend

Cada módulo debe tener:

ConfigForm

↓

Mutation

↓

createBudgetItem

↓

Budget

Nunca calcular precios.

---

# Tipos

Todo módulo debe definir sus propios tipos.

Ejemplo:

```
VentanaConfig

PuertaConfig

PatagonicaConfig
```

Evitar utilizar objetos genéricos.

---

# Hooks

Los hooks deben contener únicamente lógica de interfaz.

Ejemplos:

- cambios de formulario
- validaciones
- handlers

Nunca deben calcular precios.

---

# Componentes

Separar componentes reutilizables.

Ejemplo:

Selector

↓

Card

↓

Section

↓

Layout

Evitar componentes gigantes.

---

# BudgetItem

Todos los módulos terminan generando un BudgetItem.

Debe contener información suficiente para:

- editar
- imprimir
- guardar
- exportar
- enviar por WhatsApp

---

# JSON

Nunca editar:

```
backend/data
```

Nunca editar:

```
backend/generated
```

Toda modificación comienza en:

```
backend/excel/catalogo.xlsx
```

---

# Reglas comerciales

Nunca escribir porcentajes en el código.

Siempre utilizar:

```
backend/config/perfiles.js
```

---

# Descripciones

Toda descripción debe seguir:

```
docs/06-descripciones.md
```

Nunca inventar nuevos formatos.

---

# Auditoría

Todo wrapper nuevo debe pasar por el auditor.

Toda respuesta debe ser compatible con:

```
auditarResultado()
```

---

# Listas comerciales

Nunca duplicar cálculos.

El generador de listas debe producir exactamente los mismos precios que el cotizador.

---

# Código reutilizable

Antes de crear un helper nuevo verificar si existe uno similar.

Ejemplos:

- updateConfig
- useToggleField
- useBudgetAdder
- useDimensionsInputs
- createBudgetItem

Reutilizar siempre que sea posible.

---

# Validaciones

Las validaciones deben realizarse lo más cerca posible del origen.

Frontend

↓

UX

Backend

↓

Seguridad

Nunca confiar únicamente en el frontend.

---

# Manejo de errores

Los errores esperados deben devolver mensajes claros.

Los errores inesperados deben registrarse y responder con error interno.

Nunca exponer detalles internos al usuario.

---

# Checklist antes de hacer commit

Antes de finalizar un cambio verificar:

□ npm run build

□ Sin errores TypeScript

□ Sin errores ESLint

□ Auditoría correcta

□ Sin TODO

□ Sin FIXME

□ Sin console.log

□ Sin código muerto

□ Descripciones correctas

□ BudgetItem correcto

□ PDF correcto

□ WhatsApp correcto

□ Persistencia correcta

---

# Qué evitar

No duplicar lógica.

No copiar código entre módulos.

No escribir constantes comerciales en el código.

No consultar directamente el Excel.

No modificar JSON manualmente.

No crear excepciones para un único módulo.

---

# Objetivo Final

Mantener un código uniforme, reutilizable y fácil de mantener, donde todos los módulos compartan la misma arquitectura y cualquier nueva funcionalidad pueda integrarse sin romper el comportamiento existente del sistema.
