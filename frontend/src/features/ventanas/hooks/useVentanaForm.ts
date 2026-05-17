import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

import { useLineaSwitcher } from "@/shared/hooks/useLineaSwitcher";

import { useToggleField } from "@/shared/hooks/useToggleField";

import { LIMITES_LINEA } from "../constants";

import type { VentanaConfig } from "../types";

type Params = {
  config: VentanaConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanaConfig>>;
};

export function useVentanaForm({
  config,

  setConfig,
}: Params) {
  const { updateConfig } = useConfigUpdater(setConfig);

  const { switchLinea: baseSwitchLinea } = useLineaSwitcher({
    setConfig,

    limits: LIMITES_LINEA,
  });

  function switchLinea(linea: string) {
    baseSwitchLinea(linea);

    setConfig((prev) => ({
      ...prev,

      linea: linea as VentanaConfig["linea"],

      tipoVidrio: "3mm",
    }));
  }

  const { toggleField } = useToggleField({
    config,

    updateConfig,
  });

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

    toggleField,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,

    handleToggleGuia,

    handleToggleCajonBlock,

    handleTogglePremarco,
  };
}
