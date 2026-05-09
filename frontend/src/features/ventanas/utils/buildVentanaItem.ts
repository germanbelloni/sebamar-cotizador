import type { VentanaConfig, VentanaItem } from "../types";

import { buildVentanaDescription } from "./buildVentanaDescription";

export function buildVentanaItem(config: VentanaConfig): VentanaItem {
  const description = buildVentanaDescription(config);

  const superficie = (config.ancho * config.alto) / 10000;

  /*
    BASE POR LÍNEA
  */

  const precioBaseLinea = {
    Herrero: 95000,
    Modena: 145000,
  };

  let subtotal = superficie * precioBaseLinea[config.linea];

  /*
    RECARGO COLOR
  */

  const recargoColor = {
    Blanco: 1,
    Negro: 1.12,
    "Bronce Colonial": 1.18,
    "Simil Madera": 1.25,
  };

  subtotal *= recargoColor[config.color];

  /*
    EXTRAS
  */

  if (config.mosquitero) {
    subtotal += superficie * 18000;
  }

  if (config.guia) {
    subtotal += superficie * 22000;
  }

  if (config.cajonBlock) {
    subtotal += superficie * 32000;
  }

  if (config.cortinaPVC) {
    subtotal += superficie * 28000;
  }

  if (config.cortinaAluminio) {
    subtotal += superficie * 45000;
  }

  /*
    MODENA
  */

  if (config.premarco) {
    subtotal += superficie * 12000;
  }

  if (config.contramarco) {
    subtotal += superficie * 9000;
  }

  /*
    REDONDEO COMERCIAL
  */

  subtotal = Math.round(subtotal / 1000) * 1000;

  return {
    tipo: "ventana",

    cantidad: 1,

    linea: config.linea,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description,

    color: config.color,

    extras: {
      mosquitero: config.mosquitero,

      guia: config.guia,

      cajonBlock: config.cajonBlock,

      cortinaPVC: config.cortinaPVC,

      cortinaAluminio: config.cortinaAluminio,

      premarco: config.premarco,

      contramarco: config.contramarco,
    },

    subtotal,
  };
}
