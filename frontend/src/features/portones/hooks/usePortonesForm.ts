import type { PortonesConfig } from "../types";

import { LIMITES_PORTONES } from "../constants";
import { useEffect } from "react";
import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";
import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";
import { useLineaSwitcher } from "@/shared/hooks/useLineaSwitcher";

type Params = {
  config: PortonesConfig;
  setConfig: React.Dispatch<React.SetStateAction<PortonesConfig>>;
};

export function usePortonesForm({ config, setConfig }: Params) {
  const { updateConfig } = useConfigUpdater(setConfig);

  const { anchoInput, altoInput, handleAnchoChange, handleAltoChange } =
    useDimensionsInputs({
      ancho: config.ancho,
      alto: config.alto,
      onChange: ({ ancho, alto }) => {
        const hojasDisponibles = getHojasDisponibles(ancho);

        updateConfig({
          ancho,
          alto,
          hojas: hojasDisponibles.includes(config.hojas)
            ? config.hojas
            : hojasDisponibles[0] || 3,
        });
      },
    });

  const { switchLinea } = useLineaSwitcher({
    setConfig,
    limits: LIMITES_PORTONES,
  });

  function getHojasDisponibles(ancho: number) {
    const posibles = [3, 4, 5, 6] as const;

    return posibles.filter((hojas) => {
      const anchoPorHoja = ancho / hojas;
      return anchoPorHoja >= 60 && anchoPorHoja <= 90;
    });
  }

  const hojasDisponibles = getHojasDisponibles(config.ancho);
  useEffect(() => {
    if (!hojasDisponibles.includes(config.hojas)) {
      updateConfig({
        hojas: hojasDisponibles[0] || 3,
      });
    }
  }, [config.hojas, hojasDisponibles, updateConfig]);

  return {
    updateConfig,
    switchLinea,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
    hojasDisponibles,
  };
}
