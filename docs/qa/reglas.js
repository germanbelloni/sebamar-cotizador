/*
====================================================

REGLAS QA SEBAMAR

Este archivo define únicamente las reglas de
compatibilidad entre opciones.

NO calcula precios.

NO reemplaza wrappers.

Su único objetivo es evitar generar casos inválidos.

====================================================
*/

module.exports = {
  ventanasHerrero: {
    requiere: {
      cortina: "guia",
    },

    incompatibles: [["guia", "cajonBlock"]],
  },

  ventanasModena: {
    requiere: {
      contramarco: "premarco",
    },

    incompatibles: [],
  },

  ventanasAbrirHerrero: {
    requiere: {},

    incompatibles: [],
  },

  ventanasAbrirModena: {
    requiere: {
      contramarco: "premarco",
    },

    incompatibles: [],
  },

  puertasHerrero: {
    requiere: {},

    incompatibles: [["barral", "picaporte"]],
  },

  puertasModena: {
    requiere: {},

    incompatibles: [["barral", "picaporte"]],
  },

  puertasEco: {
    requiere: {},

    incompatibles: [["barral", "picaporte"]],
  },

  portones: {
    requiere: {},

    incompatibles: [],
  },

  rajasHerrero: {
    requiere: {},

    incompatibles: [],
  },

  rajasModena: {
    requiere: {
      contramarco: "premarco",
    },

    incompatibles: [],
  },

  patagonicasHerrero: {
    requiere: {},

    incompatibles: [],
  },

  patagonicasModena: {
    requiere: {
      contramarco: "premarco",
    },

    incompatibles: [],
  },

  postigones: {
    requiere: {},

    incompatibles: [],
  },

  mosquiteros: {
    requiere: {},

    incompatibles: [],
  },

  panosFijos: {
    requiere: {
      contramarco: "premarco",
    },

    incompatibles: [],
  },

  marcos: {
    requiere: {},

    incompatibles: [],
  },
};
