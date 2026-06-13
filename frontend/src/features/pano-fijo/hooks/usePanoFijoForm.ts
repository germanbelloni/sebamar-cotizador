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

    const needsVertical = requiereTravesanoVertical(
      nextConfig.ancho,
      nextConfig.tipoVidrio,
    );

    const needsHorizontal = requiereTravesanoHorizontal(nextConfig.alto);

    let travesanoVertical = config.travesanoVertical;
    let travesanoHorizontal = config.travesanoHorizontal;

    // Si pasa a requerir vertical y todavía no estaba activo → activarlo
    if (needsVertical && !config.travesanoVertical) {
      travesanoVertical = true;
    }

    // Si deja de requerir vertical → apagarlo
    if (!needsVertical) {
      travesanoVertical = false;
    }

    // Si pasa a requerir horizontal y todavía no estaba activo → activarlo
    if (needsHorizontal && !config.travesanoHorizontal) {
      travesanoHorizontal = true;
    }

    // Si deja de requerir horizontal → apagarlo
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
    updateConfig, // raw (checkboxes, color, línea)
    updateConfigWithRules, // medidas y vidrio
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  };
}
