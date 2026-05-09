import { coloresVentana } from "../../constants";
import { SelectableCard } from "@/components/ui/selectable-card";
import type { ColorVentana } from "../../constants";

type Props = {
  value: ColorVentana;

  onChange: (color: ColorVentana) => void;
};

export function ColorSelector({ value, onChange }: Props) {
  return (
    <div>
      <label
        className="
          mb-3 block text-sm
          text-muted-foreground
        "
      >
        Color
      </label>

      <div
        className="
          flex gap-3
          overflow-x-auto pb-1
        "
      >
        {coloresVentana.map((color) => {
          const selected = value === color.value;

          return (
            <SelectableCard
              key={color.value}
              selected={selected}
              onClick={() => onChange(color.value)}
              className="flex items-center gap-3 px-3 py-2"
              variant="color"
            >
              <div
                className={`
                  h-6 w-6 rounded-full
                  border border-white/20
                  ${color.clase}
                `}
              />

              <span className="text-sm">{color.label}</span>
            </SelectableCard>
          );
        })}
      </div>
    </div>
  );
}
