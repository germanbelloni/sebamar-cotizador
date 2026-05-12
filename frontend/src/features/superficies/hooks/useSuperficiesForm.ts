import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import type { superficiesConfig } from "../types";

type Params = {
  config: superficiesConfig;

  setConfig: React.Dispatch<React.SetStateAction<superficiesConfig>>;
};

export function usesuperficiesForm({
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

  return {
    updateConfig,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  };
}
