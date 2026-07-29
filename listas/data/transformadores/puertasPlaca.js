"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

function transformarPuertasPlaca(filasCatalogo, perfil) {
  const filas = filasCatalogo
    .filter((fila) => {
      const precios = [fila.MARCO_10, fila.MARCO_15, fila.ALUMINIO].map(Number);
      return fila.TIPO && precios.some((precio) => Number.isFinite(precio) && precio > 1);
    })
    .map((fila) => {
      const precio = (valor) => Number(valor) > 1 ? aplicarPerfil(Number(valor), perfil, "placa") : "-";
      return {
        tipo: String(fila.TIPO).trim(),
        modelo: String(fila.MODELO).replace(/_/g, " "),
        medida: String(fila.MEDIDA),
        marco10: precio(fila.MARCO_10),
        marco15: precio(fila.MARCO_15),
        aluminio: precio(fila.ALUMINIO),
      };
    });
  return {
    nombre: "Puertas Placa", titulo: "PUERTAS PLACA", perfil, compacta: true,
    columnas: ["Tipo", "Modelo", "Medida", "Marco 10", "Marco 15", "Aluminio"],
    campos: ["tipo", "modelo", "medida", "marco10", "marco15", "aluminio"],
    columnWidths: [{ width: 12 }, { width: 22 }, { width: 12 }, { width: 13 }, { width: 13 }, { width: 14 }], filas,
  };
}
module.exports = transformarPuertasPlaca;
