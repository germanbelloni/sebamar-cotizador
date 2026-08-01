# Reglas Comerciales

## Objetivo

Este documento define todas las reglas de negocio utilizadas por el Sebamar Cotizador y por el Generador de Listas Comerciales.

Las reglas aquí descritas constituyen la especificación funcional oficial del proyecto.

El código únicamente implementa estas reglas.

Nunca deben existir reglas comerciales ocultas dentro del código.

---

# Filosofía

Todo el sistema fue construido bajo un único principio:

> Existe una sola forma correcta de calcular un producto.

Por este motivo:

- El cotizador utiliza estas reglas.
- El generador de listas utiliza estas reglas.
- Los presupuestos almacenan resultados obtenidos mediante estas reglas.
- La auditoría valida resultados obtenidos mediante estas reglas.

---

# Fuente Oficial de Información

El sistema nunca inventa datos.

Toda la información proviene exclusivamente de las siguientes fuentes.

## 1) Catálogo

```
backend/excel/catalogo.xlsx
```

Contiene los costos base de los productos.

Ejemplos:

- Ventanas Herrero
- Ventanas Modena
- Puertas
- Media Puertas
- Patagónicas
- Postigos
- Rajas
- Puertas Livianas
- Puertas Placa
- Mosquiteros
- etc.

Es la fuente oficial para todos los productos provenientes del catálogo.

---

## 2) Superficies

```
backend/data/superficies.json
```

Contiene productos definidos por superficie.

Ejemplos:

- Cortinas
- Recargos
- Vidrios por superficie
- Productos especiales

---

## 3) Perfiles

```
backend/config/perfiles.js
```

Define todas las reglas comerciales.

Nunca deben existir porcentajes duplicados dentro del código.

---

# Orden de Prioridad

Si existe cualquier diferencia entre archivos:

1. catalogo.xlsx

↓

2. superficies.json

↓

3. perfiles.js

El PDF comercial únicamente define la presentación visual.

Nunca modifica fórmulas.

---

# Flujo Comercial General

Todos los módulos respetan el siguiente recorrido.

```
Costo Base

↓

Extras

↓

Color

↓

Perfil Comercial

↓

Margen Cliente

↓

Precio Final
```

---

# Perfiles Comerciales

## Herrero

```
Costo

↓

Descuento

↓

Flete

↓

Ganancia
```

---

## Modena

```
Costo

↓

Descuento

↓

Flete

↓

Ganancia
```

---

## Mosquiteros

```
Costo

↓

Aumento

↓

Ganancia
```

---

## Recargos

```
Costo

↓

Flete

↓

Ganancia
```

No aplica descuento.

---

## Placas

Utiliza su perfil específico.

---

## Cortinas

Utiliza su perfil específico.

---

# Reglas por Módulo

## Ventanas Herrero

Fuente:

catalogo.xlsx

Perfil:

Herrero

### Vidrio Entero

```
BASE + VIDRIO

↓

Perfil Herrero
```

### Con Guía

```
BASE + GUÍA + VIDRIO

↓

Perfil Herrero
```

### Mosquitero

```
MOSQUITERO

↓

Perfil Mosquiteros
```

### Vidrio Repartido

```
(BASE + VIDRIO) +30%

↓

Perfil Herrero
```

---

## Ventanas Modena

Fuente:

catalogo.xlsx

Perfil:

Modena

Para todos los tipos de vidrio:

```
BASE + VIDRIO

↓

Perfil Modena
```

Tipos soportados:

- 3 mm
- 4 mm
- 5 mm
- Laminado
- DVH

Extras:

- guía
- mosquitero
- premarco
- contramarco
- bipuntos

---

## Ventanas de Abrir

Utilizan exactamente la misma lógica comercial de la línea correspondiente.

La diferencia es únicamente constructiva.

Extras disponibles:

- mosquitero
- premarco
- contramarco
- herrajes blancos

---

## Puertas

Herrero y Modena siguen la misma lógica.

```
BASE + VIDRIO

↓

Perfil correspondiente
```

Extras:

- barrales
- picaporte
- media manija
- doble travesaño

---

## Media Puertas

```
BASE + VIDRIO

↓

Perfil correspondiente
```

---

## Portones

```
BASE + VIDRIO

↓

Perfil correspondiente
```

---

## Rajas

```
BASE + VIDRIO

↓

Perfil correspondiente
```

Utilizan imágenes propias.

---

## Patagónicas

Construidas mediante composición.

Componentes posibles:

- Raja
- Paño fijo
- Perfil de acople

Cada componente se calcula individualmente.

Luego se construye el costo total.

Finalmente se aplica el perfil comercial.

---

## Postigos

Tipos:

- corredizo
- abrir

Perfil:

Herrero

---

## Mosquiteros

No utilizan perfil Herrero ni Modena.

Siempre utilizan:

Perfil Mosquiteros.

---

## Puertas Placa

Utilizan exclusivamente:

Perfil Placas.

---

## Cortinas

Fuente:

superficies.json

Utilizan:

Perfil Cortinas.

---

## Recargos

Fuente:

superficies.json

Aplican:

- flete
- ganancia

Nunca descuento.

---

# Colores

Los colores nunca modifican el costo.

Aplican un recargo comercial definido en:

```
backend/data/colores.json
```

---

# Margen del Cliente

El margen personalizado se aplica siempre al final del cálculo.

Nunca modifica:

- costo
- costo base
- precio proveedor
- precio lista

Únicamente genera:

```
precioFinal
```

---

# Auditoría

Toda cotización calculada debe ser consistente.

La auditoría verifica:

- costos
- items
- pasos
- perfiles
- respuesta

La auditoría nunca modifica precios.

---

# Regla Fundamental

El sistema nunca debe contener dos formas distintas de calcular un mismo producto.

Si un cálculo existe en:

- Wrapper
- Service
- Generador de Listas

todos deben producir exactamente el mismo resultado.

---

# Objetivo Final

Una modificación realizada en:

```
backend/excel/catalogo.xlsx
```

debe reflejarse automáticamente en:

- Cotizador
- Presupuestos
- Generador de Listas
- PDF Comercial
- WhatsApp
- Impresión

sin modificar el código fuente.
