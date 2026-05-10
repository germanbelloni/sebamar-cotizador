import { SelectableCard } from "@/components/ui/selectable-card";
import { canUsePVC } from "@/features/ventanas/utils/canUsePVC";
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
    <div className="grid grid-cols-2 gap-3">
      <SelectableCard
        selected={cortinaPVC}
        disabled={!canUsePVC(color)}
        onClick={onTogglePVC}
      >
        Cortina PVC
      </SelectableCard>

      <SelectableCard selected={cortinaAluminio} onClick={onToggleAluminio}>
        Cortina Aluminio
      </SelectableCard>
    </div>
  );
}
