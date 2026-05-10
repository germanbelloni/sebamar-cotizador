import { SelectableCard } from "@/components/ui/selectable-card";
import { ToggleCard } from "@/shared/cards/ToggleCard";
type Props = {
  mosquitero: boolean;

  guia: boolean;

  cajonBlock: boolean;

  onToggleMosquitero: () => void;

  onToggleGuia: () => void;

  onToggleCajonBlock: () => void;
};

export function ExtrasSection({
  mosquitero,

  guia,

  cajonBlock,

  onToggleMosquitero,

  onToggleGuia,

  onToggleCajonBlock,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h3
          className="
          text-sm
          font-medium

          text-white/70
        "
        >
          Extras
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <ToggleCard
          active={mosquitero}
          label="Mosquitero"
          onClick={onToggleMosquitero}
        />

        <ToggleCard active={guia} label="Guía" onClick={onToggleGuia} />

        <ToggleCard
          active={cajonBlock}
          label="Cajón Block"
          onClick={onToggleCajonBlock}
        />
      </div>
    </div>
  );
}
