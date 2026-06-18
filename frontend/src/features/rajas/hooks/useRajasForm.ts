import type { RajasConfig } from "../types";

import { LIMITES_RAJAS } from "../constants";

import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import { useLineaSwitcher } from "@/shared/hooks/useLineaSwitcher";

type Params = {
  config: RajasConfig;

  setConfig: React.Dispatch<React.SetStateAction<RajasConfig>>;
};

export function useRajasForm({ config, setConfig }: Params) {
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

    limits: LIMITES_RAJAS,
  });

  function switchLinea(linea: string) {
    baseSwitchLinea(linea);

    setConfig((prev) => ({
      ...prev,
      linea: linea as RajasConfig["linea"],

      modelo:
        linea === "Herrero" && prev.modelo === "oscilobatiente"
          ? "raja"
          : prev.modelo,
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
