import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import type { PuertasConfig } from "../types";

type Props = {
  config: PuertasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function usePuertasForm({ config, setConfig }: Props) {
  const updateConfig = useConfigUpdater(setConfig);

  const { anchoInput, altoInput, handleAnchoChange, handleAltoChange } =
    useDimensionsInputs({
      ancho: config.ancho,
      alto: config.alto,

      onChange: ({ ancho, alto }) => {
        updateConfig({
          ancho,
          alto,
        });
      },
    });

  return {
    updateConfig,

    anchoInput,
    altoInput,

    handleAnchoChange,
    handleAltoChange,
  };
}
