import { useState } from "react";

type Params = {
  ancho: number;

  alto: number;

  onChange: (values: {
    ancho: number;

    alto: number;
  }) => void;
};

export function useDimensionsInputs({
  ancho,

  alto,

  onChange,
}: Params) {
  const [anchoInput, setAnchoInput] = useState(String(ancho));

  const [altoInput, setAltoInput] = useState(String(alto));

  function handleAnchoChange(value: string) {
    setAnchoInput(value);

    onChange({
      ancho: value === "" ? 0 : Number(value),

      alto: altoInput === "" ? 0 : Number(altoInput),
    });
  }

  function handleAltoChange(value: string) {
    setAltoInput(value);

    onChange({
      ancho: anchoInput === "" ? 0 : Number(anchoInput),

      alto: value === "" ? 0 : Number(value),
    });
  }

  return {
    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  };
}
