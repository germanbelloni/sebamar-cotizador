import type { VentanaConfig, VentanaItem } from "../types";
import { buildVentanaDescription } from "./buildVentanaDescription";

export function buildVentanaItem(config: VentanaConfig): VentanaItem {
  const description = buildVentanaDescription(config);
  const superficie = (config.ancho * config.alto) / 10000;

  let subtotal = superficie * 1000;
  if (config.mosquitero) {
    subtotal += 120;
  }

  if (config.guia) {
    subtotal += 180;
  }

  if (config.cajonBlock) {
    subtotal += 250;
  }

  if (config.cortinaPVC) {
    subtotal += 220;
  }

  if (config.cortinaAluminio) {
    subtotal += 350;
  }

  if (config.premarco) {
    subtotal += 90;
  }

  if (config.contramarco) {
    subtotal += 80;
  }
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
    subtotal: Math.round(subtotal),
  };
}
