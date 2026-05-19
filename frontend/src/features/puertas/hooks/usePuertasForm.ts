import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import type { PuertasConfig } from "../types";

type Props = {
  config: PuertasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function usePuertasForm({ config, setConfig }: Props) {
  const { updateConfig } = useConfigUpdater(setConfig);

  function getDefaultModelo(linea: PuertasConfig["linea"]) {
    if (linea === "eco") {
      return "modelo_1_vr";
    }

    return "modelo_1";
  }

  function getDefaultVidrio(linea: PuertasConfig["linea"]) {
    if (linea === "modena") {
      return "3mm";
    }

    if (linea === "eco") {
      return "3mm";
    }

    return "3mm";
  }

  const switchLinea = (linea: PuertasConfig["linea"]) => {
    updateConfig({
      linea,

      modelo: getDefaultModelo(linea),

      vidrio: getDefaultVidrio(linea),
    });
  };

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

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  };
}
