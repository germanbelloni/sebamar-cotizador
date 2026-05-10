import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import { useLineaSwitcher } from "@/shared/hooks/useLineaSwitcher";

import { LIMITES_PATAGONICAS } from "../constants";

import type { PatagonicasConfig } from "../types";

type Params = {
  config: PatagonicasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PatagonicasConfig>>;
};

export function usePatagonicasForm({
  config,

  setConfig,
}: Params) {
  const { updateConfig } = useConfigUpdater(setConfig);

  const {
    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = useDimensionsInputs({
    ancho: config.ancho,

    alto: config.alto,

    onChange: ({
      ancho,

      alto,
    }) =>
      updateConfig({
        ancho,

        alto,
      }),
  });

  const { switchLinea } = useLineaSwitcher({
    setConfig,

    limits: LIMITES_PATAGONICAS,
  });

  return {
    updateConfig,

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  };
}
