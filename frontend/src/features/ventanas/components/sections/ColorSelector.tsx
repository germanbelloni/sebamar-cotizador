import { ColorSelector as SharedColorSelector } from "@/shared/selectors/ColorSelector";

import type { ColorVentana } from "../../constants";

type Props = {
  value: ColorVentana;

  onChange: (color: ColorVentana) => void;
};

export function ColorSelector({
  value,

  onChange,
}: Props) {
  return (
    <SharedColorSelector
      value={value}
      onChange={(value) => onChange(value as ColorVentana)}
    />
  );
}
