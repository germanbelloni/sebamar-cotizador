import type { MosquiterosConfig } from "../types";

import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

type Params = {
  config: MosquiterosConfig;

  setConfig: React.Dispatch<React.SetStateAction<MosquiterosConfig>>;
};

export function useMosquiterosForm({
  config,

  setConfig,
}: Params) {
  const { updateConfig } = useConfigUpdater(setConfig);

  const {
    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,

    syncInputs,
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

  return {
    updateConfig,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,

    syncInputs,
  };
}
