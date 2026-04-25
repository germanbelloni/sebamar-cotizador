# Arquitectura

El proyecto queda separado en dos superficies principales:

- `backend`: aplicacion Express, controladores, rutas, modelos, servicios de calculo, wrappers, scripts de importacion y utilidades internas.
- `frontend`: HTML, paginas, modulos JavaScript, configuracion cliente, datos JSON y assets estaticos.

## Backend MVC

- `backend/app.js`: configura middleware, estaticos y monta `/api`.
- `backend/server.js`: arranque local del servidor.
- `backend/routes`: define las rutas por dominio.
- `backend/controllers`: contiene la logica HTTP de cada dominio.
- `backend/models`: modelos de Mongoose.
- `backend/services`: logica de negocio y calculo, sin depender de Express.
- `backend/wrappers`: adaptadores de calculo especificos.
- `backend/utils`: helpers compartidos del backend.

`backend/api/index.js` existe solo como entrada serverless para Vercel y delega en `backend/app.js`.
