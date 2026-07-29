IMPORTACIÓN DE LISTAS DE PRECIOS
Sebamar Cotizador
Objetivo

Toda la información comercial utilizada por el sistema tiene una única fuente de verdad:

backend/excel/catalogo.xlsx

Este archivo contiene los costos de fábrica de todos los productos comercializados por Sebamar.

El sistema no utiliza los JSON como fuente de datos.

Los archivos ubicados en backend/data son únicamente una representación generada automáticamente a partir del Excel.

Por este motivo:

❌ Nunca deben modificarse los JSON manualmente.
❌ Nunca deben agregarse precios directamente en el código.
✅ Toda modificación comercial debe realizarse exclusivamente sobre catalogo.xlsx.

Una vez actualizado el Excel, el sistema reconstruye automáticamente todos los archivos necesarios.

Arquitectura

El proceso completo de importación está dividido en tres etapas independientes.

catalogo.xlsx
      │
      ▼
IMPORTAR
      │
      ▼
VALIDAR
      │
      ▼
PUBLICAR
      │
      ▼
backend/data

Cada etapa tiene una responsabilidad específica.

Flujo de trabajo

Cuando Sebamar entrega una nueva lista de precios, el procedimiento correcto es:

Abrir:
backend/excel/catalogo.xlsx
Actualizar únicamente los valores necesarios.
Guardar el archivo.
Ejecutar:
node importar.js

Todo el proceso está centralizado en importar.js.

No es necesario modificar ningún JSON ni ejecutar scripts individuales.

¿Qué hace importar.js?

importar.js es el punto de entrada de todo el proceso.

Internamente ejecuta tres etapas consecutivas.

1. Importar

Se ejecutan todos los scripts encargados de leer las distintas hojas del Excel.

Cada uno genera su correspondiente archivo JSON dentro de:

backend/generated

En esta etapa todavía no se modifica el sistema.

2. Validar

Una vez generados todos los archivos, se comparan con los JSON actualmente publicados.

La comparación verifica:

estructura
claves
tipos de datos
valores

Si existe cualquier diferencia, el proceso finaliza con error y los archivos oficiales no son reemplazados.

Esta etapa está pensada como un mecanismo de control durante el desarrollo.

3. Publicar

Si la validación fue correcta, los JSON de:

backend/generated

se copian automáticamente a:

backend/data

Desde ese momento el cotizador utiliza la nueva información.

Publicación forzada

Cuando el objetivo es actualizar una lista de precios, es normal que existan diferencias entre los JSON generados y los publicados.

En esos casos puede utilizarse:

node importar.js --publish

Este modo omite la validación y publica directamente los nuevos archivos.

Estructura
backend/
│
├── excel/
│   └── catalogo.xlsx
│
├── generated/
│   └── JSON temporales
│
├── data/
│   └── JSON oficiales
│
└── scripts/
    ├── runExcel.js
    ├── compareGenerated.js
    ├── publishGenerated.js
    └── importar.js
Reglas
Nunca editar
backend/data

Los JSON son generados automáticamente.

Nunca editar
backend/generated

Es un directorio temporal.

Siempre editar
backend/excel/catalogo.xlsx

Toda modificación comercial comienza aquí.

Siempre ejecutar
node importar.js

o

node importar.js --publish

según corresponda.

Nunca copiar archivos manualmente.

Pipeline
catalogo.xlsx
      │
      ▼
runExcel.js
      │
      ▼
backend/generated
      │
      ▼
compareGenerated.js
      │
      ├── Error
      │      │
      │      └── Se cancela la publicación
      │
      ▼
publishGenerated.js
      │
      ▼
backend/data
GENERACIÓN DE LISTAS COMERCIALES
Sebamar Cotizador
Objetivo

Una vez generados los JSON oficiales, el sistema construye automáticamente las listas comerciales que reciben los clientes.

Estas listas no se generan desde el Excel original, sino desde los JSON publicados.

De esta manera existe una única fuente de información para todo el sistema:

catalogo.xlsx
        │
        ▼
backend/data
        │
        ├── Cotizador
        │
        └── Generador de Listas

Esto garantiza que el cotizador y las listas comerciales utilicen exactamente los mismos datos.

Filosofía

El generador de listas no contiene precios propios.

No calcula valores manualmente.

No mantiene listas independientes.

Simplemente interpreta los JSON oficiales y aplica las reglas comerciales correspondientes para construir las listas de venta.

Por este motivo:

si cambia el Excel;
se regeneran los JSON;
las listas comerciales también cambian automáticamente.
Flujo
catalogo.xlsx
      │
      ▼
importar.js
      │
      ▼
backend/data
      │
      ▼
Generador de Listas
      │
      ▼
Excel comerciales
      │
      ▼
PDF comerciales
Arquitectura

El generador está dividido en capas.

Configuración

↓

Transformadores

↓

Motor de perfiles

↓

Exportador Excel

↓

PDF

Cada módulo tiene un transformador propio.

Por ejemplo:

Ventanas Herrero
Ventanas Módena
Puertas Herrero
Puertas Módena
Puertas Eco
Postigones
Rajas
Mosquiteros
Patagónicas

Cada transformador conoce únicamente cómo convertir su JSON al formato comercial.

Regla más importante

Las listas comerciales deben producir exactamente los mismos precios que devuelve el cotizador para un mismo perfil.

Ese fue el objetivo principal del desarrollo del generador.

Durante la implementación se revisó módulo por módulo comparando:

JSON
      │
      ▼
Transformer
      │
      ▼
Lista Comercial

══════════════

JSON
      │
      ▼
Service
      │
      ▼
Wrapper
      │
      ▼
Cotizador

Ambos caminos deben producir el mismo resultado.

Si existe una diferencia, debe corregirse el transformador o el wrapper hasta lograr consistencia.

Fuente única de verdad

La regla principal del proyecto es:

Excel

↓

JSON

↓

Todo el sistema

Nunca deben existir precios duplicados.

Nunca deben mantenerse listas manualmente.

Nunca deben existir cálculos distintos entre el cotizador y las listas comerciales.

El Excel es la única fuente de información.

Los JSON representan esa información.

El cotizador y las listas comerciales simplemente la consumen.

