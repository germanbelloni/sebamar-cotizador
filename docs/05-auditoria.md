# Sistema de Auditoría

## Objetivo

El Sistema de Auditoría verifica automáticamente que todas las cotizaciones generadas por el sistema sean internamente consistentes.

Su objetivo no es comparar contra el Excel.

Su objetivo es detectar errores de programación antes de que lleguen al cliente.

El auditor se ejecuta automáticamente al finalizar cada cotización.

No modifica resultados.

No bloquea al usuario.

Únicamente registra información para facilitar el diagnóstico de errores.

---

# Filosofía

El auditor responde una única pregunta:

> ¿La cotización generada es coherente con las reglas internas del sistema?

No intenta responder:

> ¿El precio coincide con el Excel?

Esa responsabilidad pertenece al proceso de importación y al generador de listas.

---

# Momento de ejecución

El auditor se ejecuta inmediatamente después de que un wrapper termina de construir la respuesta comercial.

Flujo:

```
Request

↓

Controller

↓

Service

↓

Wrapper

↓

buildWrapperResponse()

↓

auditarResultado()

↓

Respuesta al cliente
```

El usuario recibe la cotización normalmente, incluso si el auditor encuentra advertencias o errores.

---

# Alcance

Actualmente todos los módulos comerciales pasan por el auditor.

Ejemplos:

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

Cada módulo puede agregar validaciones específicas además de las generales.

---

# Validaciones generales

El auditor verifica automáticamente la existencia y consistencia de los campos obligatorios.

Por ejemplo:

- costoBase
- costo
- precioProveedor
- precioLista
- precioFinal
- precioVenta
- items
- configuracion
- pasos de auditoría

---

# Validaciones matemáticas

También controla que todos los cálculos sean consistentes.

Ejemplos:

✓ la suma de los items coincide con el costoBase

✓ el costo coincide con el perfil aplicado

✓ el proveedor coincide con el flete

✓ el precioLista coincide con la ganancia

✓ el precioFinal coincide con el margen adicional

✓ ningún importe obligatorio quedó en cero

✓ ningún importe obligatorio es negativo

---

# Validaciones funcionales

Cada módulo puede incorporar reglas propias.

Ejemplos:

Ventanas

- guía presente
- mosquitero presente
- vidrio repartido
- premarco
- contramarco
- bipuntos

Patagónicas

- composición correcta
- cantidad de rajas
- perfiles de acople

Mosquiteros

- tipo correcto
- línea válida

Cortinas

- PVC
- aluminio
- cajón block

Estas validaciones evolucionan junto con cada módulo.

---

# Registro de resultados

Cuando el auditor detecta un problema genera un registro completo.

Ubicación:

```
backend/logs/auditor/
```

Cada archivo utiliza formato JSON Lines (.jsonl).

Cada línea representa una auditoría independiente.

---

# Información registrada

Cada registro contiene:

- fecha
- módulo
- usuario
- empresa
- perfil
- request recibido
- resultado generado
- pasos de auditoría
- advertencias
- errores
- resultado final

Ejemplo simplificado:

```json
{
  "modulo": "VENTANAS MODENA",
  "usuario": "admin",
  "request": {},
  "resultado": {},
  "auditoria": {
    "valido": true,
    "errores": [],
    "advertencias": [],
    "ok": []
  }
}
```

---

# Tipos de resultado

Cada auditoría puede finalizar como:

## Correcta

No existen errores.

La cotización es consistente.

---

## Con advertencias

La cotización es válida.

Pero existe algún aspecto que merece revisión.

Ejemplo:

- campo opcional ausente
- paso no registrado
- información incompleta

---

## Con errores

Existe una inconsistencia matemática o estructural.

La respuesta igualmente se devuelve al usuario.

El problema queda registrado para investigación.

---

# Qué NO valida

El auditor no compara:

- Excel
- JSON históricos
- listas comerciales
- PDFs

Tampoco verifica si un precio es "caro" o "barato".

Únicamente verifica consistencia interna.

---

# Beneficios

El auditor permite detectar automáticamente errores como:

- items faltantes
- costos inconsistentes
- perfiles incorrectos
- descuentos omitidos
- fletes incorrectos
- ganancias mal aplicadas
- wrappers incompletos
- campos obligatorios ausentes
- respuestas incompatibles con el frontend

Todo queda registrado para facilitar la reproducción del problema.

---

# Relación con otros procesos

El sistema de auditoría trabaja en conjunto con:

- importación del Excel
- generador de listas
- validadores comerciales
- wrappers
- controllers

Cada uno controla una responsabilidad distinta.

---

# Principios

El auditor nunca:

- modifica precios;
- corrige resultados;
- reemplaza cálculos;
- bloquea cotizaciones.

Su única responsabilidad es observar, validar y registrar.

---

# Objetivo Final

Garantizar que toda cotización generada por el sistema sea matemáticamente consistente y que cualquier desviación quede registrada para su análisis posterior, sin afectar la experiencia del usuario.
