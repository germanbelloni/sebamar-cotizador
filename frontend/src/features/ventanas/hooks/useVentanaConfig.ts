import { LIMITES_LINEA } from "../constants";

import type { VentanaConfig } from "../types";

type Params = {
  config: VentanaConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanaConfig>>;
};

export function useVentanaConfig({ config, setConfig }: Params) {
  const updateConfig = (updates: Partial<VentanaConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const toggleField = (
    field: keyof Pick<
      VentanaConfig,
      | "mosquitero"
      | "guia"
      | "cajonBlock"
      | "cortinaPVC"
      | "cortinaAluminio"
      | "premarco"
      | "contramarco"
    >,
  ) => {
    updateConfig({
      [field]: !config[field],
    });
  };

  const handleSelectHerrero = () => {
    setConfig((prev) => ({
      ...prev,

      linea: "Herrero",

      ancho: Math.min(prev.ancho, LIMITES_LINEA.Herrero.anchoMax),

      alto: Math.min(prev.alto, LIMITES_LINEA.Herrero.altoMax),
    }));
  };

  const handleSelectModena = () => {
    setConfig((prev) => ({
      ...prev,

      linea: "Modena",

      ancho: Math.min(prev.ancho, LIMITES_LINEA.Modena.anchoMax),

      alto: Math.min(prev.alto, LIMITES_LINEA.Modena.altoMax),
    }));
  };

  return {
    updateConfig,

    toggleField,

    handleSelectHerrero,

    handleSelectModena,
  };
}
