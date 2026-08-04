import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";
import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import type { PanoFijoConfig } from "../types";

import {
  requiereTravesanoVertical,
  requiereTravesanoHorizontal,
} from "../utils/travesanos";

type Params = {
  config: PanoFijoConfig;
  setConfig: React.Dispatch<React.SetStateAction<PanoFijoConfig>>;
};

export function usePanoFijoForm({ config, setConfig }: Params) {
  const { updateConfig } = useConfigUpdater(setConfig);

  function updateConfigWithRules(partial: Partial<PanoFijoConfig>) {
    const nextConfig = {
      ...config,
      ...partial,
    };

    const needsVertical = requiereTravesanoVertical(nextConfig.ancho);

    const needsHorizontal = requiereTravesanoHorizontal(nextConfig.alto);

    let travesanoVertical = config.travesanoVertical;
    let travesanoHorizontal = config.travesanoHorizontal;

    // Si deja de ser obligatorio, se apaga.
    if (!needsVertical) {
      travesanoVertical = false;
    }

    if (!needsHorizontal) {
      travesanoHorizontal = false;
    }

    updateConfig({
      ...partial,
      travesanoVertical,
      travesanoHorizontal,
    });
  }

  const { anchoInput, altoInput, handleAnchoChange, handleAltoChange } =
    useDimensionsInputs({
      ancho: config.ancho,
      alto: config.alto,
      onChange: ({ ancho, alto }) =>
        updateConfigWithRules({
          ancho,
          alto,
        }),
    });

  return {
    updateConfig,
    updateConfigWithRules,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  };
}
