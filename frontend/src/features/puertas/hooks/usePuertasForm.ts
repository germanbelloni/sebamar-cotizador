import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import { useLineaSwitcher } from "@/shared/hooks/useLineaSwitcher";

import { LIMITES_PUERTAS } from "../constants";

import type { PuertasConfig } from "../types";

type Params = {
  config: PuertasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function usePuertasForm({
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

    limits: LIMITES_PUERTAS,
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
