const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 📦 cargar producto (SIN categorías por ahora → estabilidad)
function obtenerProducto(nombre) {
  const ruta = path.join(__dirname, "../data/productos", `${nombre}.json`);

  if (!fs.existsSync(ruta)) {
    throw new Error("No existe: " + ruta);
  }

  return JSON.parse(fs.readFileSync(ruta, "utf-8"));
}

// 🔹 TEST
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

// 🔹 MEDIDAS
app.get("/api/medidas", (req, res) => {
  try {
    const producto = req.query.producto;

    console.log("PRODUCTO:", producto); // debug

    const filePath = path.join(
      process.cwd(),
      "data/productos",
      `${producto}.json`,
    );

    console.log("RUTA:", filePath); // debug

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    res.json(Object.keys(data.medidas || {}));
  } catch (e) {
    console.log("ERROR MEDIDAS:", e.message);
    res.status(404).json({ error: e.message });
  }
});

// 🔹 COLORES
app.get("/api/colores", (req, res) => {
  const colores = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/colores.json"), "utf-8"),
  );
  res.json(colores);
});

// 🔹 redondeo tipo Excel
function redondear5(valor) {
  return Math.floor((valor + 2.5) / 5) * 5;
}

// 🔥 CALCULO
app.post("/api/:producto", (req, res) => {
  try {
    const { producto } = req.params;
    const { medida, color, incluirGuia, incluirMosquitero, tipoVidrio } =
      req.body;

    const productoData = obtenerProducto(producto);
    const datos = productoData.medidas[medida];

    if (!datos) {
      return res.json({ error: "Medida no encontrada" });
    }

    const descuento = producto === "modena" ? 0.07 : 0.1;
    const flete = 0.06;
    const ganancia = 0.3;

    const base = datos.base || 0;
    const guia = datos.guia || 0;
    const mosq = datos.mosquitero || 0;

    // 🪟 vidrio compatible
    let vidrio = 0;

    if (datos.vidrios) {
      vidrio = datos.vidrios[tipoVidrio || "3mm"] || 0;
    } else {
      vidrio = datos.vidrio || 0;
    }

    // 🎨 color
    const baseColor = base * (1 + (color || 0));
    const guiaColor = incluirGuia ? guia * (1 + (color || 0)) : 0;

    // 💰 costo
    const subtotal = baseColor + vidrio;
    const costo = subtotal * (1 - descuento);

    // 💥 precio
    let precio = costo;
    precio *= 1 + flete;
    precio *= 1 + ganancia;
    precio = redondear5(precio);

    // 🔹 guía
    let precioGuia = null;

    if (incluirGuia) {
      let g = guiaColor * (1 - descuento);
      g *= 1 + flete;
      g *= 1 + ganancia;
      precioGuia = redondear5(g);
    }

    // 🔹 mosquitero
    let precioMosq = 0;

    if (incluirMosquitero) {
      let m = mosq * (1 + (color || 0));
      m *= 1 - descuento;
      m *= 1 + flete;
      m *= 1 + ganancia;
      precioMosq = redondear5(m);
    }

    res.json({
      ventana: precio,
      guia: precioGuia,
      mosquitero: incluirMosquitero ? precioMosq : null,
      total: precio + (precioGuia || 0) + precioMosq,
    });
  } catch (e) {
    console.log("ERROR CALCULO:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
