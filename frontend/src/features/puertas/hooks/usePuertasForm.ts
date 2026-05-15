import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import type { PuertasConfig } from "../types";

type Props = {
  config: PuertasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function usePuertasForm({ config, setConfig }: Props) {
  const { updateConfig } = useConfigUpdater(setConfig);

  const switchLinea = (linea: PuertasConfig["linea"]) => {
    updateConfig({
      linea,

      modelo: linea === "eco" ? "modelo 1 vr" : "modelo 1",

      vidrio: linea === "eco" ? "4mm" : "3mm",
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
