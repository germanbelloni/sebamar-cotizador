# Generador de Listas Comerciales

## Objetivo

El Generador de Listas Comerciales construye automáticamente las listas de venta utilizadas por Sebamar.

Su función es transformar la información comercial oficial del sistema en archivos Excel listos para entregar a clientes o convertir posteriormente a PDF.

El generador no reemplaza al cotizador.

No modifica precios.

No mantiene información propia.

Únicamente interpreta la información oficial del sistema y genera las listas comerciales.

---

# Filosofía

El generador fue construido siguiendo el mismo principio que el resto del proyecto:

> Existe una única fuente de verdad.

Por este motivo:

- nunca posee precios propios;
- nunca calcula valores manualmente;
- nunca mantiene listas paralelas;
- nunca duplica reglas comerciales.

Si cambia una lista de precios:

```
catalogo.xlsx

↓

JSON

↓

Cotizador

↓

Generador de Listas
```

Todo cambia automáticamente.

---

# Fuente Oficial

El generador consume exclusivamente:

```
backend/data
```

Los archivos ubicados allí son generados automáticamente mediante:

```
node importar.js
```

Nunca lee directamente:

```
catalogo.xlsx
```

La responsabilidad del Excel termina una vez publicados los JSON oficiales.

---

# Flujo General

```
catalogo.xlsx

      │

      ▼

importar.js

      │

      ▼

backend/data

      │

      ▼

Transformadores

      │

      ▼

Motor Comercial

      │

      ▼

Excel Comercial

      │

      ▼

PDF Comercial
```

---

# Objetivo Principal

El objetivo del generador es producir exactamente los mismos precios que devuelve el cotizador.

Para cualquier producto debe cumplirse:

```
Cotizador

=

Lista Comercial
```

Si existe cualquier diferencia:

el problema está en:

- un transformer

o

- un wrapper

Nunca deben coexistir dos cálculos distintos.

---

# Arquitectura

El generador está dividido en capas.

```
Configuración

↓

Transformadores

↓

Motor Comercial

↓

Exportador Excel

↓

Salida
```

Cada capa posee una única responsabilidad.

---

# Configuración

La configuración define:

- perfiles disponibles;
- colores;
- hojas;
- orden de impresión;
- formato comercial.

No contiene precios.

---

# Transformadores

Cada módulo posee un transformador independiente.

Ejemplos:

- Ventanas Herrero
- Ventanas Modena
- Ventanas de Abrir
- Puertas Herrero
- Puertas Modena
- Puertas Eco
- Patagónicas
- Postigos
- Rajas
- Mosquiteros
- Puertas Placa
- Portones
- Cortinas

Cada transformador conoce únicamente cómo convertir su JSON al formato comercial.

Nunca calcula perfiles.

Nunca modifica reglas.

---

# Motor Comercial

El motor comercial aplica:

- perfil correspondiente;
- descuentos;
- fletes;
- ganancias;
- colores;
- redondeos.

Utiliza exactamente las mismas reglas que el cotizador.

---

# Exportador Excel

Responsable de construir el archivo final.

Define únicamente:

- hojas;
- tablas;
- estilos;
- bordes;
- colores;
- imágenes;
- formatos de impresión.

Nunca modifica precios.

---

# Salida

Actualmente el sistema genera automáticamente:

- Lista Amarilla.xlsx
- Lista Azul.xlsx
- Lista Verde.xlsx
- Lista Papu.xlsx

Dentro de:

```
listas/output/
```

Estos archivos constituyen las listas comerciales oficiales.

---

# Relación con el Cotizador

El cotizador y el generador siguen caminos distintos.

```
backend/data

     │

     ├──────────────┐

     ▼              ▼

Cotizador      Generador

     │              │

     ▼              ▼

Precio       Lista Comercial
```

Ambos deben producir exactamente el mismo resultado.

---

# Validación

Durante el desarrollo se comparó módulo por módulo:

```
JSON

↓

Transformer

↓

Lista Comercial
```

contra

```
JSON

↓

Service

↓

Wrapper

↓

Cotizador
```

Si existía una diferencia:

se corregía el transformer o el wrapper.

Nunca se aceptaron dos resultados distintos.

---

# Auditor General

El proyecto incorpora un auditor de listas comerciales.

Su objetivo es verificar que:

- los precios coincidan;
- los perfiles sean correctos;
- los recargos sean correctos;
- las fórmulas sean consistentes;
- las listas reflejen exactamente las reglas comerciales oficiales.

Este auditor es independiente del auditor de cotizaciones.

---

# Principios Fundamentales

El generador nunca debe:

- mantener precios propios;
- copiar información manualmente;
- duplicar cálculos;
- modificar perfiles;
- inventar reglas comerciales.

Siempre debe consumir la información oficial del sistema.

---

# Integración con PDF

El generador produce archivos Excel.

Posteriormente esos archivos pueden exportarse a PDF.

El PDF tiene una única responsabilidad:

representar visualmente la lista comercial.

Nunca modifica:

- precios;
- cálculos;
- reglas comerciales.

---

# Beneficios

Gracias a esta arquitectura:

- el Excel sigue siendo la fuente oficial;
- el cotizador utiliza los mismos datos;
- las listas comerciales utilizan los mismos datos;
- no existen diferencias entre ambos;
- actualizar una lista requiere únicamente modificar el Excel.

---

# Objetivo Final

Modificar:

```
backend/excel/catalogo.xlsx
```

↓

Ejecutar:

```bash
node importar.js
```

↓

Ejecutar:

```bash
node listas/generar-listas.js
```

↓

Obtener automáticamente:

- JSON oficiales.
- Cotizador actualizado.
- Listas comerciales actualizadas.
- Excel listos para imprimir.
- PDF comerciales consistentes.

Sin modificar una sola línea de código.
