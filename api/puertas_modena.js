const fs = require("fs");
const path = require("path");
const perfiles = require("../config/perfiles");

function redondear5(valor) {
  return Math.floor((valor + 2.5) / 5) * 5;
}

function calcularColor(base, color) {
  return base * (color || 0);
}

function calcularModena(data, producto) {
  const modelo = producto.modelos[data.modelo];

  if (!modelo) {
    throw new Error("Modelo no encontrado en modena");
  }

  let precio = modelo.base;

  // COLOR
  precio += calcularColor(modelo.base, data.color);

  // VIDRIO
  if (data.vidrio === "dvh") {
    precio += (modelo.vidrios["4mm"] || 0) * 2;
    precio += modelo.dvh?.camara || 0;
  } else {
    precio += modelo.vidrios[data.vidrio] || 0;
  }

  return precio;
}

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const filePath = path.join(
      process.cwd(),
      "data/productos/puertas_modena.json"
    );

    const producto = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const {
      modelo,
      color,
      vidrio,
      ancho,
      adicionales = [],
      perfil = "amarilla",
    } = req.body;

    const perfilData =
      perfiles[perfil]?.modena || perfiles["amarilla"].modena;

    let precioBase = calcularModena(
      { modelo, color, vidrio, ancho, adicionales },
      producto
    );

    let precioFinal =
      precioBase *
      (1 - perfilData.descuento) *
      (1 + perfilData.flete) *
      (1 + perfilData.ganancia);

    if (ancho === 90) precioFinal *= 1.1;
    if (ancho === 70) precioFinal *= 0.93;

    adicionales.forEach((a) => {
      precioFinal += producto.adicionales[a] || 0;
    });

    precioFinal = redondear5(precioFinal);

    return res.status(200).json({ total: precioFinal });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};