import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import { useLineaSwitcher } from "@/shared/hooks/useLineaSwitcher";

import { LIMITES_PATAGONICAS } from "../constants";

import type { PatagonicasConfig } from "../types";

type Params = {
  config: PatagonicasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PatagonicasConfig>>;
};

export function usePatagonicasForm({
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

  const { switchLinea } = useLineaSwitcher({
    setConfig,

    limits: LIMITES_PATAGONICAS,
  });

  function handleToggleGuia() {
    setConfig((prev) => {
      const nuevaGuia = !prev.guia;

      return {
        ...prev,

        guia: nuevaGuia,

        cajonBlock: false,

        cortina: nuevaGuia ? prev.cortina : null,
      };
    });
  }

  function handleToggleCajonBlock() {
    setConfig((prev) => ({
      ...prev,

      cajonBlock: !prev.cajonBlock,

      guia: false,

      cortina: null,
    }));
  }

  function handleTogglePremarco() {
    setConfig((prev) => {
      const nuevoPremarco = !prev.premarco;

      return {
        ...prev,

        premarco: nuevoPremarco,

        contramarco: nuevoPremarco ? true : prev.contramarco,
      };
    });
  }

  return {
    updateConfig,

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,

    handleToggleGuia,

    handleToggleCajonBlock,

    handleTogglePremarco,
  };
}
