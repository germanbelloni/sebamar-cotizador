# WRAPPER CONTRACT

## Objetivo

Este documento define el contrato oficial que deben cumplir TODOS los wrappers del sistema.

El objetivo es que cualquier módulo (Ventanas, Puertas, Portones, Patagónicas, etc.) devuelva exactamente la misma estructura de datos.

Esto permite:

- simplificar el frontend
- simplificar Presupuestos
- construir el Motor de Validación
- construir la Auditoría
- mantener compatibilidad futura

---

# Flujo oficial

Excel

↓

JSON

↓

Service

↓

Wrapper

↓

Presupuesto

↓

PDF / WhatsApp / Auditoría

---

# Responsabilidades

## Service

Debe:

- leer JSON
- calcular costo base
- devolver items base

Nunca debe:

- aplicar perfiles
- aplicar colores
- aplicar extras comerciales
- conocer usuarios
- conocer MongoDB

---

## Wrapper

Debe:

- validar reglas de negocio
- aplicar recargos
- aplicar color
- aplicar extras
- aplicar perfil
- construir configuración
- construir descripción
- devolver contrato oficial

Nunca debe:

- guardar en Mongo
- generar PDF
- enviar WhatsApp

---

# Contrato oficial

Todos los wrappers deberán devolver:

```ts
{
  (modulo,
    linea,
    costoBase,
    costo,
    precioBase,
    precioProveedor,
    precioLista,
    precioFinal,
    perfilAplicado,
    descuentoAplicado,
    fleteAplicado,
    gananciaAplicada,
    ganancia,
    descripcion,
    items,
    configuracion,
    audit);
}
```

---

# Auditoría

La propiedad audit queda reservada para el Motor de Validación.

Permitirá reconstruir completamente el cálculo realizado por el wrapper.

---

Este documento es la referencia oficial para todos los módulos del sistema.
