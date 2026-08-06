# 🛠 SCRIPTS Y COMANDOS DEL PROYECTO

Este documento reúne los comandos más utilizados durante el desarrollo del cotizador Sebamar.

---

# 📁 Estructura del proyecto

```
sebamarcotizador/
│
├── backend/
├── frontend/
├── listas/
├── docs/
└── catalogo.xlsx
```

---

# 📦 IMPORTAR EL EXCEL

Cada vez que se modifica el catálogo Excel es obligatorio volver a importar los datos.

Ubicación:

```
backend/
```

Comando:

```bash
node importar.js
```

Este script:

- Lee `catalogo.xlsx`
- Regenera todos los JSON
- Actualiza los precios del sistema

---

# 🚀 LEVANTAR EL BACKEND

Ubicación:

```
backend/
```

Comando:

```bash
npm run dev
```

---

# 💻 LEVANTAR EL FRONTEND

Ubicación:

```
frontend/
```

Comando:

```bash
npm run dev
```

---

# 🏗 GENERAR BUILD

Ubicación:

```
frontend/
```

Comando:

```bash
npm run build
```

Debe ejecutarse antes de hacer deploy.

---

# 📋 GENERAR LISTAS COMERCIALES

Ubicación:

```
listas/
```

Comando:

```bash
node generar-listas.js
```

Genera automáticamente:

- Lista Amarilla
- Lista Azul
- Lista Verde
- Lista Papu

Los archivos quedan en:

```
listas/output/
```

---

# ✅ VALIDAR LISTAS

Ubicación:

```
listas/
```

Comando:

```bash
node validar-listas.js
```

El validador:

- Lee las listas generadas.
- Ejecuta todos los wrappers.
- Compara lista vs sistema.
- Detecta diferencias.

Valida:

- Ventanas Herrero
- Ventanas Modena
- Puertas Herrero
- Puertas Modena
- Puertas Eco
- Rajas Herrero
- Rajas Modena
- Postigones
- Patagónicas
- Mosquiteros
- Puertas Placa

para los perfiles:

- Amarilla
- Azul
- Verde
- Papu

Si todo está correcto aparecerá:

```
[OK] TODAS LAS LISTAS COINCIDEN CON EL SISTEMA
```

Los reportes quedan en:

```
docs/validaciones/
```

---

# 🔄 FLUJO CUANDO SE MODIFICA UN MÓDULO

Si el cambio afecta cálculos:

Modificar el código.

↓

Probar manualmente el módulo.

↓

Generar listas.

```bash
node generar-listas.js
```

↓

Validar listas.

```bash
node validar-listas.js
```

↓

Si todas coinciden:

```
[OK] TODAS LAS LISTAS COINCIDEN CON EL SISTEMA
```

El módulo quedó sincronizado con las listas comerciales.

---

# ⚠ FLUJO CUANDO CAMBIA EL EXCEL

Modificar Excel.

↓

Importar Excel.

```bash
node importar.js
```

↓

Generar listas.

```bash
node generar-listas.js
```

↓

Validar listas.

```bash
node validar-listas.js
```

---

# 🚀 CHECKLIST ANTES DE HACER DEPLOY

Backend

- [ ] No hay errores en consola.

Frontend

- [ ] `npm run build`

Listas

- [ ] `node generar-listas.js`
- [ ] `node validar-listas.js`

QA

- [ ] Probar manualmente el módulo modificado.
- [ ] Verificar que no haya roto otros módulos.

Git

- [ ] Commit
- [ ] Push

Deploy

- [ ] Render
- [ ] Vercel

---

# 📂 CARPETAS IMPORTANTES

Backend

```
backend/
```

Frontend

```
frontend/
```

Wrappers

```
wrappers/
```

Servicios

```
services/
```

Listas

```
listas/
```

Salida de listas

```
listas/output/
```

Validaciones

```
docs/validaciones/
```

Excel maestro

```
catalogo.xlsx
```

---

# 📌 REGLAS IMPORTANTES DEL PROYECTO

- El Excel es la fuente de verdad.
- Nunca editar precios directamente en los JSON.
- Los JSON se regeneran con `node importar.js`.
- Los wrappers aplican perfiles comerciales.
- Los services calculan únicamente el costo base.
- Antes de deploy siempre generar y validar listas.
- Si el validador dice que todas las listas coinciden, el sistema quedó sincronizado con las listas comerciales.

---

# 📝 RECORDATORIO

Cuando aparezca un bug:

1. Reproducir.
2. Encontrar el módulo.
3. Corregir.
4. Probar manualmente.
5. Generar listas.
6. Validar listas.
7. Recién después hacer deploy.

Nunca hacer deploy sin validar.
