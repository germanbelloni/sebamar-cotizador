import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";
import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import type { CortinaConfig } from "../types";

type Params = {
  config: CortinaConfig;
  setConfig: React.Dispatch<React.SetStateAction<CortinaConfig>>;
};

export function useCortinaForm({ config, setConfig }: Params) {
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

  return {
    updateConfig,

    anchoInput,
    altoInput,

    handleAnchoChange,
    handleAltoChange,
  };
}
