"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");
const perfiles = require("../../../backend/config/perfiles");
function mostrarMedida(medida) {
  const [ancho, alto] = String(medida).split("x");
  const altoNumero = Number(alto);
  return altoNumero < 100
    ? `${ancho}x0,${altoNumero}`
    : `${ancho}x${altoNumero}`;
}

function transformarVentanasModena(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
    const medida = String(fila.MEDIDA || "").trim();
    const base = Number(fila.BASE);
    const guia = Number(fila.GUIA);
    const mosquitero = Number(fila.MOSQUITERO);
    const vidrio3 = Number(fila["3MM"]);
    const vidrio4 = Number(fila["4MM"]);
    const vidrio5 = Number(fila["5MM"]);
    const vidrio33 = Number(fila["3+3"]);
    const camaraDvh = Number(fila.DVH);
    const valores = [
      base,
      guia,
      mosquitero,
      vidrio3,
      vidrio4,
      vidrio5,
      vidrio33,
      camaraDvh,
    ];
    if (!valores.every(Number.isFinite))
      throw new Error(`La medida ${medida} tiene datos invalidos.`);
    const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

    const perfilMosquiteroBase =
      perfiles[perfil]?.mosquiteros || perfiles.amarilla.mosquiteros;

    const perfilMosquitero = {
      ...perfilMosquiteroBase,
      descuento: perfilModena.descuento,
    };
    return {
      medida: mostrarMedida(medida),
      "3mm": aplicarPerfil(base + vidrio3, perfil, "modena"),
      "4mm": aplicarPerfil(base + vidrio4, perfil, "modena"),
      "5mm": aplicarPerfil(base + vidrio5, perfil, "modena"),
      "3+3": aplicarPerfil(base + vidrio33, perfil, "modena"),
      guia: aplicarPerfil(guia, perfil, "modena"),
      mosquitero: aplicarPerfil(mosquitero, perfilMosquitero),
      dvh: aplicarPerfil(base + vidrio4 * 2 + camaraDvh, perfil, "modena"),
    };
  });

  return {
    nombre: "Ventanas Modena",
    titulo: "VENTANAS MODENA",
    perfil,
    compacta: true,
    columnas: [
      "Medidas",
      "3mm",
      "4mm",
      "5mm",
      "3+3",
      "Guia",
      "Mosquitero",
      "DVH",
    ],
    campos: ["medida", "3mm", "4mm", "5mm", "3+3", "guia", "mosquitero", "dvh"],
    columnWidths: [
      { width: 13 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 11 },
      { width: 14 },
      { width: 13 },
    ],
    filas,
  };
}

module.exports = transformarVentanasModena;
