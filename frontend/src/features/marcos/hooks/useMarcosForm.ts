import { useState } from "react";

import type { MarcosConfig } from "../types";

type Params = {
  config: MarcosConfig;

  setConfig: React.Dispatch<React.SetStateAction<MarcosConfig>>;
};

export function useMarcosForm({
  config,

  setConfig,
}: Params) {
  const [anchoInput, setAnchoInput] = useState(String(config.ancho));

  const [altoInput, setAltoInput] = useState(String(config.alto));

  function updateConfig(values: Partial<MarcosConfig>) {
    setConfig((prev) => ({
      ...prev,

      ...values,
    }));
  }

  function handleAnchoChange(value: string) {
    setAnchoInput(value);

    updateConfig({
      ancho: Number(value),
    });
  }

  function handleAltoChange(value: string) {
    setAltoInput(value);

    updateConfig({
      alto: Number(value),
    });
  }

  return {
    updateConfig,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  };
}
