import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";
import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";
import { calcularHojasPorton } from "../utils/calcularHojasPorton";
import type { PuertasConfig } from "../types";

type Props = {
  config: PuertasConfig;
  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function usePuertasForm({ config, setConfig }: Props) {
  const { updateConfig } = useConfigUpdater(setConfig);

  function getDefaultModelo(linea: PuertasConfig["linea"]) {
    if (linea === "eco") {
      return "modelo_4";
    }

    return "modelo_4";
  }

  function getDefaultVidrio(linea: PuertasConfig["linea"]) {
    if (linea === "eco") {
      return "3mm";
    }

    if (linea === "modena") {
      return "3mm";
    }

    return "3mm";
  }
  const switchLinea = (linea: PuertasConfig["linea"]) => {
    updateConfig({
      linea,
      modelo: getDefaultModelo(linea),
      vidrio: getDefaultVidrio(linea) as PuertasConfig["vidrio"],
      extras: {
        barralRecto: 0,
        barralCurvo: 0,
        mediaManija: false,
        picaporte: false,
      },
    });
  };

  const { anchoInput, altoInput, handleAnchoChange, handleAltoChange } =
    useDimensionsInputs({
      ancho: config.ancho,
      alto: config.alto,
      onChange: ({ ancho, alto }) => {
        const updates: Partial<PuertasConfig> = {
          ancho,
          alto,
        };

        if (config.tipoConfiguracion === "porton") {
          updates.hojas = calcularHojasPorton(ancho);
        }

        updateConfig(updates);
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
