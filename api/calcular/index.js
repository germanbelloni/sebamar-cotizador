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
  // 📏 MEDIDAS
  // =========================
  if (url.startsWith("/api/medidas/")) {
    const producto = url.split("/").pop();
    const data = obtenerProducto(producto);
    return res.json(Object.keys(data.medidas || {}));
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
      const modeloData = data.modelos[modelo.toLowerCase()];

      if (!modeloData) {
        return res.json({ error: "Modelo no encontrado" });
      }

      // 🔹 BASE
      let total = modeloData.base || 0;

      // 🔹 COLOR (PRIMERO)
      total *= (1 + (color || 0));

      // 🔹 VIDRIO (DESPUÉS)
      if (tipoVidrio && modeloData.vidrios) {
        const vidrioValor = modeloData.vidrios[tipoVidrio];
        if (typeof vidrioValor === "number") {
          total += vidrioValor;
        }
      }

      // 🔹 DESCUENTO
      const descuento = 0.10;
      total *= (1 - descuento);

      // 🔹 FLETE
      const flete = 0.06;
      total *= (1 + flete);

      // 🔹 GANANCIA
      const ganancia = 0.30;
      total *= (1 + ganancia);

      // 🔹 TAMAÑO
      const ajuste = data.ajustes[tamano] || 0;
      total *= (1 + ajuste);

      // 🔹 ADICIONALES
      adicionales.forEach(a => {
        total += data.adicionales[a] || 0;
      });

      // 🔹 REDONDEO
      total = redondear5(total);

      return res.json({ total });
    }

    // =========================
    // 🪟 VENTANAS (NO TOCAR)
    // =========================
    const { medida, color, incluirGuia, incluirMosquitero, tipoVidrio } = req.body;

    const productoData = obtenerProducto(producto);
    const datos = productoData.medidas?.[medida];

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

  return res.status(404).send("Not found");
};