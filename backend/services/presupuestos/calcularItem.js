// =========================
// WRAPPERS
// =========================

const calcularMosquitero = require("../../wrappers/mosquiteros/calcularMosquiteroVentana");

const calcularPuerta = require("../../wrappers/puertas/calcularPuerta");

const calcularVentanaHerrero = require("../../wrappers/ventanas/calcularVentanaHerrero");
const calcularVentanaModena = require("../../wrappers/ventanas/calcularVentanaModena");

const calcularRajaHerrero = require("../../wrappers/rajas/calcularRajaHerrero");
const calcularRajaModena = require("../../wrappers/rajas/calcularRajaModena");

const calcularPostigones = require("../../wrappers/postigones/calcularPostigones");

const calcularPatagonicaHerrero = require("../../wrappers/patagonicas/calcularPatagonicaHerrero");
const calcularPatagonicaModena = require("../../wrappers/patagonicas/calcularPatagonicaModena");

const calcularporton = require("../../wrappers/portones/calcularporton");

const calcularsuperficies = require("../../wrappers/superficies/calcularSuperficies");

const calcularPuertaPlaca = require("../../wrappers/placas/calcularPuertaPlaca");

const calcularPuertaEco = require("../../wrappers/puertas/calcularPuertaEco");

const calcularPuertaMosquitera = require("../../wrappers/mosquiteros/calcularPuertaMosquitera");

const sanitizarCotizacion = require("../utils/pricing/sanitizarCotizacion");

function calcularItem(item, perfil) {
  const tipoMap = {
    rajas: "raja",
    ventanas: "ventana",
    puertas: "puerta",
    patagonicas: "patagonica",
    portones: "porton",
    postigones: "postigon",
    superficies: "superficie",
    "puertas-placa": "placa",
    mosquiteros: "mosquitero",
  };

  const tipo = tipoMap[item.modulo] || item.tipo;
  console.log("TIPO:", tipo);
  console.log("MODULO:", item.modulo);
  console.log("LINEA:", item.metadata?.linea);
  switch (tipo) {
    case "puerta":
      return calcularPuerta({
        ...item,
        perfil,
      });

    case "puertaEco":
      return calcularPuertaEco({
        ...item,
        perfil,
      });

    case "mosquitero":
      return calcularMosquitero({
        ...item,
        perfil,
      });

    case "puertaMosquitera":
      return calcularPuertaMosquitera({
        ...item,
        perfil,
      });

    case "ventana":
      {
        console.log("ENTRO A VENTANA");
        const linea = (
          item.linea ||
          item.configuracion?.linea ||
          item.metadata?.linea ||
          ""
        ).toLowerCase();
        console.log("LINEA DETECTADA:", linea);

        const payload = {
          ...item.configuracion,
          perfil,
        };

        console.log("PAYLOAD:");
        console.log(JSON.stringify(payload, null, 2));
        if (linea === "modena") {
          return calcularVentanaModena(payload);
        }

        return calcularVentanaHerrero(payload);
      }

      return calcularVentanaHerrero({
        ...item,
        perfil,
      });

    case "raja":
      if (
        String(item.linea || item.configuracion?.linea || "").toLowerCase() ===
        "modena"
      ) {
        return calcularRajaModena({
          ...item,
          perfil,
        });
      }

      return calcularRajaHerrero({
        ...item,
        perfil,
      });

    case "postigon":
      return calcularPostigones({
        ...item,
        perfil,
      });

    case "patagonica":
      if (
        String(item.linea || item.configuracion?.linea || "").toLowerCase() ===
        "modena"
      ) {
        return calcularPatagonicaModena({
          ...item,
          perfil,
        });
      }

      return calcularPatagonicaHerrero({
        ...item,
        perfil,
      });

    case "porton":
      return calcularporton({
        ...item,
        perfil,
      });

    case "superficie":
      return calcularsuperficies({
        ...item,
        perfil,
      });

    case "placa":
      return calcularPuertaPlaca({
        ...item,
        perfil,
      });

    default:
      return null;
  }
}
module.exports = calcularItem;
