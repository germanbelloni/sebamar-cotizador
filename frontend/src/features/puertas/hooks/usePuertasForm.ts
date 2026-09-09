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

  const switchLinea = (linea: PuertasConfig["linea"]) => {
    updateConfig({
      linea,
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
