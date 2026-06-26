import type { PortonesConfig } from "../types";

import { LIMITES_PORTONES } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePortonesValidation(config: PortonesConfig) {
  const limites = LIMITES_PORTONES[config.linea];

  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: limites,
  });

  const anchoPorHoja = config.ancho / config.hojas;

  const hojasValidas =
    config.hojas >= 3 &&
    config.hojas <= 6 &&
    anchoPorHoja >= 60 &&
    anchoPorHoja <= 90;

  const sistemaValido = !(config.alto > 210 && config.sistema === "abrir");

  return {
    limites,
    anchoValido,
    altoValido,
    hojasValidas,
    sistemaValido,
    medidasValidas: medidasValidas && hojasValidas && sistemaValido,
    medidasInvalidas: !(medidasValidas && hojasValidas && sistemaValido),
  };
}
