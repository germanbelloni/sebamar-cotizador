const express = require("express");
const path = require("path");
const fs = require("fs");
const { calcularPuertaHerrero } = require("./calculosPuertas");
const {
  calcularPuertaModena,
  calcularFinalModena,
} = require("./calculosPuertas");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   📏 MEDIDAS
========================= */
app.get("/api/medidas", (req, res) => {
  try {
    const producto = req.query.producto;

    const filePath = path.join(__dirname, "data/productos", `${producto}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    res.json(Object.keys(data.medidas || {}));
  } catch (e) {
    console.log("ERROR MEDIDAS:", e.message);
    res.status(404).json({ error: e.message });
  }
});

/* =========================
   🎨 COLORES
========================= */
app.get("/api/colores", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data/colores.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error colores" });
  }
});

/* =========================
   🚪 PUERTAS HERRERO (FIX)
========================= */
app.post("/api/puertas_herrero", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "data/productos/puertas_herrero.json",
    );

    const producto = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const resultadoBase = calcularPuertaHerrero(req.body, producto);

    const multiplicador = req.body.multiplicador || 1;

    const resultadoFinal = {
      total: Math.round(resultadoBase.total * multiplicador),
      adicionalesDetalle: resultadoBase.adicionalesDetalle,
    };

    res.json(resultadoFinal);
  } catch (e) {
    console.log("ERROR PUERTAS:", e.message);
    res.status(500).json({ error: "Error cálculo" });
  }
});

/* =========================
   🪟 VENTANAS HERRERO
========================= */
app.post("/api/ventanas_herrero", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "data/productos/ventanas_herrero.json",
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const { medida, color, incluirGuia, incluirMosquitero } = req.body;

    const datos = data.medidas?.[medida];

    if (!datos) {
      return res.status(400).json({ error: "Medida no encontrada" });
    }

    const descuento = 0.1;
    const flete = 0.06;
    const ganancia = 0.3;

    const base = datos.base || 0;
    const guia = datos.guia || 0;
    const mosq = datos.mosquitero || 0;
    const vidrio = datos.vidrio || 0;

    const baseColor = base * (1 + (color || 0));
    const guiaColor = incluirGuia ? guia * (1 + (color || 0)) : 0;

    const subtotal = baseColor + vidrio;
    const costo = subtotal * (1 - descuento);

    let precio = costo * (1 + flete) * (1 + ganancia);
    precio = Math.round(precio);

    let precioGuia = null;
    if (incluirGuia) {
      let g = guiaColor * (1 - descuento);
      g *= 1 + flete;
      g *= 1 + ganancia;
      precioGuia = Math.round(g);
    }

    let precioMosq = 0;
    if (incluirMosquitero) {
      let m = mosq * (1 + (color || 0));
      m *= 1 - descuento;
      m *= 1 + flete;
      m *= 1 + ganancia;
      precioMosq = Math.round(m);
    }

    return res.json({
      ventana: precio,
      guia: precioGuia,
      mosquitero: incluirMosquitero ? precioMosq : null,
      total: precio + (precioGuia || 0) + precioMosq,
    });
  } catch (e) {
    console.log("ERROR VENTANAS:", e.message);
    res.status(500).json({ error: "Error cálculo ventanas" });
  }
});

/* =========================
   🪟 VENTANAS MODENA
========================= */
app.post("/api/ventanas_modena", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "data/productos/ventanas_modena.json",
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const { medida, color, incluirGuia, incluirMosquitero, tipoVidrio } =
      req.body;

    const datos = data.medidas?.[medida];

    if (!datos) {
      return res.status(400).json({ error: "Medida no encontrada" });
    }

    const descuento = 0.07;
    const flete = 0.06;
    const ganancia = 0.3;

    const base = datos.base || 0;
    const guia = datos.guia || 0;
    const mosq = datos.mosquitero || 0;

    let vidrio = 0;

    if (datos.vidrios) {
      if (tipoVidrio === "dvh") {
        vidrio = (datos.vidrios["4mm"] || 0) * 2 + (datos.camara || 0);
      } else {
        vidrio = datos.vidrios[tipoVidrio] || 0;
      }
    }

    const baseColor = base * (1 + (color || 0));
    const guiaColor = incluirGuia ? guia * (1 + (color || 0)) : 0;

    const subtotal = baseColor + vidrio;
    const costo = subtotal * (1 - descuento);

    let precio = costo * (1 + flete) * (1 + ganancia);
    precio = Math.round(precio);

    let precioGuia = null;
    if (incluirGuia) {
      let g = guiaColor * (1 - descuento);
      g *= 1 + flete;
      g *= 1 + ganancia;
      precioGuia = Math.round(g);
    }

    let precioMosq = 0;
    if (incluirMosquitero) {
      let m = mosq * (1 + (color || 0));
      m *= 1 - descuento;
      m *= 1 + flete;
      m *= 1 + ganancia;
      precioMosq = Math.round(m);
    }

    return res.json({
      ventana: precio,
      guia: precioGuia,
      mosquitero: incluirMosquitero ? precioMosq : null,
      total: precio + (precioGuia || 0) + precioMosq,
    });
  } catch (e) {
    console.log("ERROR MODENA:", e.message);
    res.status(500).json({ error: "Error cálculo modena" });
  }
});

/* =========================
   🚪 PUERTAS MODENA
========================= */
app.post("/api/puertas_modena", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data/productos/puertas_modena.json");

    const producto = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const perfiles = require("./config/perfiles");

    const {
      modelo,
      color,
      vidrio,
      ancho,
      adicionales = [],
      perfil = "amarilla",
      multiplicador,
    } = req.body;

    const perfilData = perfiles[perfil]?.modena || perfiles["amarilla"].modena;

    const precioBase = calcularPuertaModena(
      { modelo, color, vidrio, ancho, adicionales },
      producto,
    );

    let total = calcularFinalModena(
      precioBase,
      { modelo, color, vidrio, ancho, adicionales },
      producto,
      perfilData,
    );

    // 👇 MULTIPLICADOR
    const mult = multiplicador || 1;
    total = Math.round(total * mult);

    res.json({ total });
  } catch (e) {
    console.log("ERROR MODENA:", e.message);
    res.status(500).json({ error: "Error cálculo modena" });
  }
});

/* =========================
   🧠 FIX CLAVE SPA (IMPORTANTE)
========================= */
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Dev server corriendo en http://localhost:${PORT}`);
});
