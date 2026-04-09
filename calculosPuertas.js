function calcularPuertaHerrero(body, producto) {
  const { modelo, tipoVidrio, color, tamano, adicionales = [] } = body;

  const productoData = producto.modelos[modelo.toLowerCase()];

  if (!productoData) {
    throw new Error("Modelo no encontrado");
  }

  let total = productoData.base;

  // VIDRIO
  if (!productoData.sinVidrio && tipoVidrio) {
    total += productoData.vidrios[tipoVidrio] || 0;
  }

  // COLOR
  total = total * (1 + (color || 0));

  // TAMAÑO
  const ajuste = producto.ajustes[tamano] || 0;
  total = total * (1 + ajuste);

  // ADICIONALES
  const adicionalesDetalle = {};

  (adicionales || []).forEach((a) => {
    const key = a; // 🔥 YA VIENE FORMATEADO
    const valor = producto.adicionales[key] || 0;

    adicionalesDetalle[key] = valor;
    total += valor;
  });

  total = Math.round(total);

  return {
    total,
    adicionalesDetalle,
  };
}

//MODENA
function calcularPuertaModena(data, producto, perfilData) {
  const modelo = producto.modelos[data.modelo];

  if (!modelo) {
    throw new Error("Modelo no encontrado en modena");
  }

  let precio = modelo.base;

  // COLOR
  precio += modelo.base * (data.color || 0);

  // VIDRIO
  if (data.vidrio === "dvh") {
    precio += (modelo.vidrios["4mm"] || 0) * 2;
    precio += modelo.dvh?.camara || 0;
  } else {
    precio += modelo.vidrios[data.vidrio] || 0;
  }

  return precio;
}

function calcularFinalModena(precioBase, data, producto, perfilData) {
  let precioFinal =
    precioBase *
    (1 - perfilData.descuento) *
    (1 + perfilData.flete) *
    (1 + perfilData.ganancia);

  if (data.ancho === 90) precioFinal *= 1.1;
  if (data.ancho === 70) precioFinal *= 0.93;

  (data.adicionales || []).forEach((a) => {
    precioFinal += producto.adicionales[a] || 0;
  });

  return Math.floor((precioFinal + 2.5) / 5) * 5;
}
module.exports = {
  calcularPuertaHerrero,
  calcularPuertaModena,
  calcularFinalModena,
};
