const { fromRoot } = require("../../backend/utils/path");

const calcularMosquitero = require(
  fromRoot("services/mosquiteros/calcularMosquitero"),
);

const perfiles = require(fromRoot("config/perfiles"));

const mosquiterosData = require(
  fromRoot("frontend/data/productos/mosquiteros.json"),
);

// 🔍 lookup
function buscarMedidaValida(anchoInput, altoInput) {
  const medidas = Object.keys(mosquiterosData.medidas).map((k) => {
    const [a, b] = k.split("x").map(Number);
    return { key: k, ancho: a, alto: b };
  });

  const candidatas = medidas
    .filter((m) => m.ancho >= anchoInput && m.alto >= altoInput)
    .sort((a, b) => a.ancho * a.alto - b.ancho * b.alto);

  if (!candidatas.length) throw new Error("No hay medida válida");

  return candidatas[0];
}

// 🧠 MAIN
function calcularMosquiteroVentana(dataInput) {
  const { ancho, alto, color, perfil = "amarilla" } = dataInput;

  const medidaValida = buscarMedidaValida(ancho, alto);

  const base = calcularMosquitero({
    medida: medidaValida.key,
    color,
  });

  const costoBase = base.costoBase;

  // 💰 PERFIL (moscas)
  const perfilData = perfiles[perfil]?.moscas || perfiles.amarilla.moscas;

  let totalCosto = costoBase;

  totalCosto *= 1 + perfilData.aumento1;
  totalCosto *= 1 + perfilData.aumento2;

  const venta = totalCosto * (1 + perfilData.ganancia);

  return {
    costoBase: Math.round(costoBase),
    costo: Math.round(totalCosto),
    precioProveedor: Math.round(totalCosto),
    precioVenta: Math.round(venta),
    ganancia: Math.round(venta - totalCosto),
    items: [
      {
        tipo: "mosquitero",
        descripcion: `${medidaValida.key}`,
        precio: Math.round(costoBase),
      },
    ],
    descripcion: `Mosquitero ventana ${ancho}x${alto} ${color || ""}`.trim(),
    configuracion: {
      ancho,
      alto,
      medidaUsada: medidaValida.key,
      color,
    },
  };
}

module.exports = calcularMosquiteroVentana;
