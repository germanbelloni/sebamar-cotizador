const { fromRoot } = require("../../backend/utils/path");

const perfiles = require(fromRoot("config/perfiles"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

function calcularPuertaMosquitera(dataInput) {
  const { ancho, alto, perfil = "amarilla" } = dataInput;

  if (ancho < 70 || ancho > 100) throw new Error("Ancho fuera de rango");
  if (alto < 180 || alto > 210) throw new Error("Alto fuera de rango");

  const m2 = (ancho * alto) / 10000;

  const base = superficies.puertas_mosquitero["80"] || 100000;

  let costo = base * m2;

  const perfilData = perfiles[perfil]?.moscas || perfiles.amarilla.moscas;

  costo *= 1 + perfilData.aumento1;
  costo *= 1 + perfilData.aumento2;

  const venta = costo * (1 + perfilData.ganancia);

  return {
    costoBase: Math.round(base),
    costo: Math.round(costo),
    precioProveedor: Math.round(costo),
    precioVenta: Math.round(venta),
    ganancia: Math.round(venta - costo),
    items: [
      {
        tipo: "estructura",
        descripcion: `${ancho}x${alto}`,
        precio: Math.round(base * m2),
      },
    ],
    descripcion: `Puerta mosquitera ${ancho}x${alto}`,
    configuracion: { ancho, alto },
  };
}

module.exports = calcularPuertaMosquitera;
