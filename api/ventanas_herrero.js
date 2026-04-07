const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const filePath = path.join(
      process.cwd(),
      "data/productos/ventanas_herrero.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const {
      medida,
      color,
      incluirGuia,
      incluirMosquitero,
      tipoVidrio
    } = req.body;

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

    let vidrio = datos.vidrio || 0;

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

    return res.status(200).json({
      ventana: precio,
      guia: precioGuia,
      mosquitero: incluirMosquitero ? precioMosq : null,
      total: precio + (precioGuia || 0) + precioMosq
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};