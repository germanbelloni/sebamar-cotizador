const fs = require("fs");
const path = require("path");

function redondear5(valor) {
  return Math.floor((valor + 2.5) / 5) * 5;
}

function obtenerProducto(nombre) {
  const ruta = path.join(process.cwd(), "data/productos", `${nombre}.json`);
  return JSON.parse(fs.readFileSync(ruta, "utf-8"));
}

module.exports = async (req, res) => {
  const { url, method } = req;

  // =========================
  // 📏 MEDIDAS (VENTANAS)
  // =========================
  if (url.startsWith("/api/medidas/")) {
    const producto = url.split("/").pop();
    const data = obtenerProducto(producto);
    return res.json(Object.keys(data.medidas));
  }

  // =========================
  // 🎨 COLORES
  // =========================
  if (url === "/api/colores") {
    const colores = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data/colores.json"), "utf-8")
    );
    return res.json(colores);
  }

  // =========================
  // 💰 CALCULAR
  // =========================
  if (url.startsWith("/api/calcular/") && method === "POST") {
    const producto = url.split("/").pop();

    // =========================
    // 🚪 PUERTAS HERRERO
    // =========================
    if (producto === "puertas_herrero") {
      const { modelo, color, tipoVidrio, tamano, adicionales = [] } = req.body;

      const data = obtenerProducto(producto);

      const modeloData = data.modelos.find(m => m.nombre === modelo);
      if (!modeloData) {
        return res.json({ error: "Modelo no encontrado" });
      }

      // base
      let subtotal = modeloData.precio_base;

      // color (igual que ventanas)
      subtotal *= (1 + (color || 0));

      // vidrio (solo si aplica)
      if (modeloData.usa_vidrio) {
        const vidrioData = data.vidrios.find(v => v.nombre === tipoVidrio);
        if (vidrioData) {
          subtotal += vidrioData.precio;
        }
      }

      // tamaño (factor)
      const tam = data.tamanos.find(t => t.nombre === tamano);
      const factor = tam ? tam.factor : 1;

      subtotal *= factor;

      const { descuento, flete, ganancia } = data.config;

      // cálculo principal
      let precio = subtotal * (1 - descuento);
      precio *= (1 + flete);
      precio *= (1 + ganancia);

      // adicionales (SIN descuento, CON ganancia)
      let totalAdicionales = 0;

      adicionales.forEach(nombre => {
        const ad = data.adicionales.find(a => a.nombre === nombre);
        if (ad) {
          let val = ad.precio;
          val *= (1 + ganancia);
          totalAdicionales += val;
        }
      });

      precio += totalAdicionales;

      precio = redondear5(precio);

      return res.json({
        total: precio
      });
    }

    // =========================
    // 🪟 VENTANAS (ORIGINAL)
    // =========================

    const { medida, color, incluirGuia, incluirMosquitero, tipoVidrio } = req.body;

    const productoData = obtenerProducto(producto);
    const datos = productoData.medidas[medida];

    if (!datos) return res.json({ error: "Medida no encontrada" });

    const descuento = producto === "modena" ? 0.07 : 0.10;
    const flete = 0.06;
    const ganancia = 0.30;

    const base = datos.base || 0;
    const guia = datos.guia || 0;
    const mosq = datos.mosquitero || 0;

    let vidrio = datos.vidrio || 0;
    if (datos.vidrios) {
      vidrio = datos.vidrios[tipoVidrio || "3mm"] || 0;
    }

    const baseColor = base * (1 + (color || 0));
    const guiaColor = incluirGuia ? guia * (1 + (color || 0)) : 0;

    const subtotal = baseColor + vidrio;
    const costo = subtotal * (1 - descuento);

    let precio = costo * (1 + flete) * (1 + ganancia);
    precio = redondear5(precio);

    let precioGuia = null;
    if (incluirGuia) {
      let g = guiaColor * (1 - descuento);
      g *= (1 + flete);
      g *= (1 + ganancia);
      precioGuia = redondear5(g);
    }

    let precioMosq = 0;
    if (incluirMosquitero) {
      let m = mosq * (1 + (color || 0));
      m *= (1 - descuento);
      m *= (1 + flete);
      m *= (1 + ganancia);
      precioMosq = redondear5(m);
    }

    return res.json({
      ventana: precio,
      guia: precioGuia,
      mosquitero: incluirMosquitero ? precioMosq : null,
      total: precio + (precioGuia || 0) + precioMosq
    });
  }

  // =========================
  // ❌ NOT FOUND
  // =========================
  return res.status(404).send("Not found");
};