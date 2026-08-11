import { useDimensionsInputs } from "@/shared/hooks/useDimensionsInputs";

import { useConfigUpdater } from "@/shared/hooks/useConfigUpdater";

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

  function switchLinea(linea: VentanaConfig["linea"]) {
    setConfig((prev) => ({
      ...prev,

      linea: linea as VentanaConfig["linea"],

      ancho: Math.min(prev.ancho, LIMITES_LINEA[linea].anchoMax),
      alto: Math.min(prev.alto, LIMITES_LINEA[linea].altoMax),

      // Al cambiar de línea, no se arrastra ninguna
      // configuración específica de la línea anterior.
      tipoVidrio: "3mm",
      mosquitero: false,
      guia: false,
      cajonBlock: false,
      cortina: null,
      premarco: false,
      contramarco: false,
      vidrioRepartido: false,
      bipuntoIzquierda: "ninguno",
      bipuntoDerecha: "ninguno",
      tipoConstruccion: "2_hojas",
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
