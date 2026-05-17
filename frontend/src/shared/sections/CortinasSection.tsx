import { SelectableCard } from "@/components/ui/selectable-card";

import { canUsePVC } from "@/features/ventanas/utils/canUsePVC";

type Props = {
  color: string;

  cortina: "pvc" | "aluminio" | null;

  onTogglePVC: () => void;

  onToggleAluminio: () => void;
};

export function CortinasSection({
  color,

  cortina,

  onTogglePVC,

  onToggleAluminio,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SelectableCard
        selected={cortina === "pvc"}
        disabled={!canUsePVC(color)}
        onClick={onTogglePVC}
      >
        Cortina PVC
      </SelectableCard>

      <SelectableCard
        selected={cortina === "aluminio"}
        onClick={onToggleAluminio}
      >
        Cortina Aluminio
      </SelectableCard>
    </div>
  );
}
