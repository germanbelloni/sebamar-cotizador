import { SelectableCard } from "@/components/ui/selectable-card";
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
      <h4
        className="
          text-sm font-medium
          text-muted-foreground
        "
      >
        Extras
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <SelectableCard selected={mosquitero} onClick={onToggleMosquitero}>
          Mosquitero
        </SelectableCard>

        <SelectableCard selected={guia} onClick={onToggleGuia}>
          Guía
        </SelectableCard>

        <SelectableCard selected={cajonBlock} onClick={onToggleCajonBlock}>
          Cajón Block
        </SelectableCard>
      </div>
    </div>
  );
}
