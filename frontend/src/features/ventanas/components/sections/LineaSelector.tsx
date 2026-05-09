import { SegmentedControl } from "@/components/ui/segmented-control";

type Props = {
  linea: "Herrero" | "Modena";

  onSelectHerrero: () => void;

  onSelectModena: () => void;
};

export function LineaSelector({
  linea,

  onSelectHerrero,

  onSelectModena,
}: Props) {
  return (
    <div>
      <label
        className="
          mb-3 block text-center
          text-sm text-muted-foreground
        "
      >
        Línea
      </label>

      <div className="flex justify-center">
        <SegmentedControl
          value={linea}
          onChange={(value) => {
            if (value === "Herrero") {
              onSelectHerrero();
            }

            if (value === "Modena") {
              onSelectModena();
            }
          }}
          options={[
            {
              label: "Herrero",
              value: "Herrero",
            },

            {
              label: "Modena",
              value: "Modena",
            },
          ]}
        />
      </div>
    </div>
  );
}
