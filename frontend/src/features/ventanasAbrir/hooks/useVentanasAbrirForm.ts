import type { VentanasAbrirConfig } from "../types";

import { LIMITES_VENTANAS_ABRIR } from "../constants";

import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";
import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";
import { useLineaSwitcher } from "@/shared/hooks/useLineaSwitcher";

type Params = {
  config: VentanasAbrirConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanasAbrirConfig>>;
};

export function useVentanasAbrirForm({ config, setConfig }: Params) {
  const { updateConfig } = useConfigUpdater(setConfig);

  const { anchoInput, altoInput, handleAnchoChange, handleAltoChange } =
    useDimensionsInputs({
      ancho: config.ancho,
      alto: config.alto,
      onChange: ({ ancho, alto }) =>
        updateConfig({
          ancho,
          alto,
        }),
    });

  const { switchLinea: baseSwitchLinea } = useLineaSwitcher({
    setConfig,
    limits: LIMITES_VENTANAS_ABRIR,
  });

  function switchLinea(linea: string) {
    baseSwitchLinea(linea);

    setConfig((prev) => ({
      ...prev,
      linea: linea as VentanasAbrirConfig["linea"],
    }));
  }

  return {
    updateConfig,
    switchLinea,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  };
}
