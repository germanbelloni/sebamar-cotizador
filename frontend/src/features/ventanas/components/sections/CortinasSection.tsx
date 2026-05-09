import { SelectableCard } from "@/components/ui/selectable-card";
type Props = {
  color: string;

  cortinaPVC: boolean;

  cortinaAluminio: boolean;

  onTogglePVC: () => void;

  onToggleAluminio: () => void;
};

export function CortinasSection({
  color,

  cortinaPVC,

  cortinaAluminio,

  onTogglePVC,

  onToggleAluminio,
}: Props) {
  return (
    <div className="space-y-3">
      <h4
        className="
          text-sm font-medium
          text-muted-foreground
        "
      >
        Cortina
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <SelectableCard
          selected={cortinaPVC}
          disabled={color !== "blanco"}
          onClick={onTogglePVC}
        >
          PVC
        </SelectableCard>

        <SelectableCard selected={cortinaAluminio} onClick={onToggleAluminio}>
          Aluminio
        </SelectableCard>
      </div>

      {color !== "blanco" && (
        <p
          className="
            text-xs
            text-muted-foreground
          "
        >
          PVC disponible únicamente en Blanco
        </p>
      )}
    </div>
  );
}
