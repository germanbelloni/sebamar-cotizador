# Frontend - Sebamar Cotizador

## Objetivo

El frontend implementa la interfaz del cotizador comercial de Sebamar.

Su responsabilidad es:

- construir la configuración elegida por el usuario;
- enviarla al backend;
- mostrar el resultado de la cotización;
- administrar el presupuesto;
- generar la experiencia de usuario.

El frontend NO calcula precios.

Toda la lógica comercial pertenece al backend.

---

# Tecnologías

- React
- TypeScript
- Vite
- React Query
- Zustand
- Tailwind CSS
- shadcn/ui

---

# Arquitectura

El frontend está organizado por funcionalidades (feature-based).

Cada módulo contiene su propia estructura.

Ejemplo:

src/

    features/

    ventanas/

    puertas/

    rajas/

    patagonicas/

Cada feature mantiene separados:

- componentes
- hooks
- api
- utilidades
- tipos
- constantes

---

# Flujo

Usuario

↓

Formulario

↓

Configuración

↓

API

↓

Backend

↓

Cotización

↓

BudgetItem

↓

Carrito

↓

PDF / WhatsApp

---

# Reglas

El frontend nunca:

- calcula precios;
- aplica perfiles comerciales;
- modifica descuentos;
- aplica ganancias.

Todas esas responsabilidades pertenecen al backend.

---

# Desarrollo

Instalar dependencias

npm install

Ejecutar

npm run dev

Compilar

npm run build

---

# Objetivo

Mantener una interfaz reutilizable, modular y desacoplada de las reglas comerciales.
