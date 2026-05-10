import { LineaSelector as SharedLineaSelector } from "@/shared/selectors/LineaSelector";

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
    <SharedLineaSelector
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
  );
}
