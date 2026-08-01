# README.md

**¿Qué es?**

Es la puerta de entrada del proyecto.

**Sirve para:**

- entender qué es Sebamar Cotizador;
- ver cómo está organizada la documentación;
- saber por dónde empezar a leer.

> Si mañana entra otro programador, este es el primer archivo que abre.

---

# 01-arquitectura.md

**¿Qué explica?**

Cómo está construido el sistema.

Explica cosas como:

<pre class="overflow-visible! px-0!" data-start="522" data-end="599"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-(--code-block-surface) corner-superellipse/1.1 overflow-clip rounded-3xl [--code-block-surface:var(--bg-elevated-secondary)] dark:[--code-block-surface:var(--composer-surface-primary)] lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>Frontend

↓

API

↓

Controller

↓

Service

↓

Wrapper

↓

Respuesta</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Sirve para entender:

> "¿Por dónde pasa una cotización?"

---

# 02-reglas-comerciales.md

Este probablemente sea el documento **más importante del proyecto** .

No habla de código.

Habla del negocio.

Explica:

- cómo se calcula cada módulo;
- qué perfil usa;
- de dónde sale el precio;
- cuándo aplica descuento;
- cuándo aplica flete;
- cuándo aplica ganancia.

Es prácticamente el "manual del cotizador".

---

# 03-importacion-precios.md

Explica cómo actualizar una lista de precios.

En vez de decir:

"modificá este JSON"

dice:

<pre class="overflow-visible! px-0!" data-start="1140" data-end="1198"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-(--code-block-surface) corner-superellipse/1.1 overflow-clip rounded-3xl [--code-block-surface:var(--bg-elevated-secondary)] dark:[--code-block-surface:var(--composer-surface-primary)] lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>Abrí catalogo.xlsx

↓

Guardá

↓

node importar.js</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Y explica qué hace el sistema internamente.

Es el manual para actualizar precios.

---

# 04-generador-listas.md

Explica el generador de listas comerciales.

Responde preguntas como:

- ¿de dónde salen?
- ¿cómo se generan?
- ¿por qué coinciden con el cotizador?
- ¿qué archivos usan?

Es el manual del generador.

---

# 05-auditoria.md

Explica el sistema de auditoría.

No explica código.

Explica:

- cuándo corre;
- qué revisa;
- qué guarda;
- qué pasa cuando falla.

Es el manual del auditor.

---

# 06-descripciones.md

Define el formato oficial de las descripciones.

Por ejemplo:

<pre class="overflow-visible! px-0!" data-start="1792" data-end="1850"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-(--code-block-surface) corner-superellipse/1.1 overflow-clip rounded-3xl [--code-block-surface:var(--bg-elevated-secondary)] dark:[--code-block-surface:var(--composer-surface-primary)] lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>Ventana 120x110 aluminio blanco Herrero vidrio DVH</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

o

<pre class="overflow-visible! px-0!" data-start="1855" data-end="1884"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-(--code-block-surface) corner-superellipse/1.1 overflow-clip rounded-3xl [--code-block-surface:var(--bg-elevated-secondary)] dark:[--code-block-surface:var(--composer-surface-primary)] lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>Patagonica 200x150...</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Sirve para que:

- WhatsApp;
- PDF;
- presupuesto;
- historial;

usen exactamente el mismo formato.

---

# 07-api-y-flujo.md

Explica todo el recorrido de una cotización.

Desde que el usuario hace clic hasta que vuelve el precio.

Algo así:

<pre class="overflow-visible! px-0!" data-start="2130" data-end="2228"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-(--code-block-surface) corner-superellipse/1.1 overflow-clip rounded-3xl [--code-block-surface:var(--bg-elevated-secondary)] dark:[--code-block-surface:var(--composer-surface-primary)] lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>Usuario

↓

React

↓

API

↓

Controller

↓

Service

↓

Wrapper

↓

Auditor

↓

Respuesta</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Es ideal para debuggear.

---

# 08-estructura-del-proyecto.md

Es un mapa del proyecto.

Explica:

<pre class="overflow-visible! px-0!" data-start="2330" data-end="2389"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-(--code-block-surface) corner-superellipse/1.1 overflow-clip rounded-3xl [--code-block-surface:var(--bg-elevated-secondary)] dark:[--code-block-surface:var(--composer-surface-primary)] lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>frontend/

backend/

docs/

listas/

scripts/

etc.</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Sirve para saber dónde vive cada cosa.

Muy útil cuando alguien nuevo entra al proyecto.

---

# 09-guia-desarrollo.md

Es el manual para programar dentro del proyecto.

Explica:

- cómo crear un módulo;
- cómo crear un wrapper;
- cómo crear un service;
- cómo seguir el estilo del proyecto.

Es el "manual del desarrollador".

---

# 10-decisiones-de-arquitectura.md

Este es muy importante.

No explica cómo funciona.

Explica **por qué** funciona así.

Por ejemplo:

¿Por qué existen Services y Wrappers separados?

¿Por qué Excel es la única fuente?

¿Por qué existe BudgetItem?

¿Por qué existe el auditor?

Es el documento que evita que alguien diga:

"esto se puede hacer más fácil"

...y rompa toda la arquitectura.

---

# 11-roadmap.md

Es la hoja de ruta.

Qué se hizo.

Qué falta.

Qué quedó para V2.

Es el estado del proyecto.

---

# 12-glosario.md

Es un diccionario.

Explica términos como:

- Wrapper
- Service
- BudgetItem
- Perfil
- Lista Comercial
- Catálogo
- Cotización
- costoBase
- precioProveedor
- precioLista

Ideal para alguien nuevo.

---

# CONTRIBUCION.md

Es el reglamento para programar.

No explica el sistema.

Explica cómo trabajar sin romperlo.

Ejemplos:

✅ no tocar backend/data

✅ no duplicar reglas

✅ no escribir porcentajes

✅ compilar antes del commit

✅ documentar cambios

Es el "manual del programador".

---

# HISTORIA_DEL_PROYECTO.md

Mi favorito.

No es técnico.

Cuenta cómo nació el proyecto.

Qué problemas hubo.

Por qué se hicieron los cambios.

Cómo evolucionó la arquitectura.

Es el contexto histórico.

Dentro de 5 años probablemente sea el documento más valioso.

---

## Si los agrupara por función, quedarían así:

### 📖 Para entender el sistema

- README
- 01 Arquitectura
- 07 Flujo
- 08 Estructura
- 12 Glosario

---

### 💼 Para entender el negocio

- 02 Reglas Comerciales
- 06 Descripciones

---

### ⚙️ Para operar el sistema

- 03 Importación
- 04 Generador de listas
- 05 Auditoría

---

### 👨‍💻 Para desarrollar

- 09 Guía de desarrollo
- CONTRIBUCION
- 10 Decisiones de arquitectura

---

### 📈 Para la evolución del proyecto

- 11 Roadmap
- HISTORIA_DEL_PROYECTO
