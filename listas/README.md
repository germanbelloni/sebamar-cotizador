# Generador de Listas Comerciales - Sebamar

## Objetivo

Este módulo genera automáticamente las listas comerciales de Sebamar a partir de las fuentes oficiales del sistema.

No reemplaza al cotizador.

No modifica precios.

No guarda datos.

Únicamente consume información existente y genera archivos Excel listos para imprimir o exportar a PDF.

---

# Fuentes oficiales

El generador NO posee datos propios.

Toda la información proviene del proyecto principal.

## Catálogo

backend/excel/catalogo.xlsx

Contiene:

- Ventanas Herrero
- Ventanas Modena
- Puertas
- Media Puertas
- Rajas
- Patagónicas
- Postigones
- Livianas
- Placas
- etc.

---

## Perfiles

backend/config/perfiles.js

Contiene las reglas comerciales de cada perfil.

Ejemplo:

- Herrero
- Modena
- Moscas
- Placas
- Cortinas

---

## Superficies

backend/data/superficies.json

Contiene:

- Cortinas
- Recargos
- Vidrios por superficie
- Otros productos comerciales

---

# Arquitectura

Fuentes oficiales

↓

Reglas comerciales

↓

Datos comerciales

↓

Render Excel

↓

Lista Comercial

---

# Regla principal

Este módulo nunca modifica las fuentes.

Las fuentes son la única verdad del sistema.

Si existe una diferencia entre el código y una fuente oficial:

SIEMPRE GANA LA FUENTE OFICIAL.

---

# Prioridad de verdad

1. catalogo.xlsx
2. superficies.json
3. perfiles.js

El PDF comercial únicamente define el diseño visual.

Nunca las fórmulas.

---

# Salida

El generador produce:

Lista Amarilla.xlsx

Lista Azul.xlsx

Lista Verde.xlsx

Lista Papu.xlsx

Dentro de:

listas/output/

---

# Ejecución

node listas/generar-listas.js

---

# Filosofía

Las reglas comerciales viven en:

REGLAS_COMERCIALES.md

El código solamente implementa dichas reglas.

Nunca deben existir reglas de negocio ocultas dentro del código.
