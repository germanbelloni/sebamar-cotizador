const { fromRoot } = require("../../utils/path");

// =========================
// WRAPPERS
// =========================

const calcularMosquitero = require(
  fromRoot("wrappers/mosquiteros/calcularMosquiteroVentana"),
);

const calcularPuerta = require(fromRoot("wrappers/puertas/calcularPuerta"));

const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const calcularRajaModena = require(
  fromRoot("wrappers/rajas/calcularRajaModena"),
);

const calcularPostigones = require(
  fromRoot("wrappers/postigones/calcularPostigones"),
);

const calcularPatagonicaHerrero = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

const calcularPatagonicaModena = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

const calcularPorton = require(fromRoot("wrappers/portones/calcularporton"));

const calcularSuperficies = require(
  fromRoot("wrappers/superficies/calcularSuperficies"),
);

const calcularPuertaPlaca = require(
  fromRoot("wrappers/placas/calcularPuertaPlaca"),
);

const calcularPuertaEco = require(
  fromRoot("wrappers/puertas/calcularPuertaEco"),
);

const calcularPuertaMosquitera = require(
  fromRoot("wrappers/mosquiteros/calcularPuertaMosquitera"),
);

// =========================
// CALCULADOR GLOBAL
// =========================

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

    case "ventana": {
      const linea = (
        item.linea ||
        item.configuracion?.linea ||
        item.metadata?.linea ||
        ""
      ).toLowerCase();

      const payload = {
        ...item.configuracion,
        perfil,
      };

      if (linea === "modena") {
        return calcularVentanaModena(payload);
      }

      return calcularVentanaHerrero(payload);
    }

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
      return calcularPorton({
        ...item,
        perfil,
      });

    case "superficie":
      return calcularSuperficies({
        ...item,
        perfil,
      });

    case "placa":
      return calcularPuertaPlaca({
        ...item,
        perfil,
      });

    default:
      throw new Error(`Tipo de producto no soportado: ${tipo}`);
  }
}

module.exports = calcularItem;
