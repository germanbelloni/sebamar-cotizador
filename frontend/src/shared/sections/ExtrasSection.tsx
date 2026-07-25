import { SelectableCard } from "@/components/ui/selectable-card";

type Props = {
  mosquitero?: boolean;

  guia?: boolean;

  cajonBlock?: boolean;

  onToggleMosquitero?: () => void;

  onToggleGuia?: () => void;

  onToggleCajonBlock?: () => void;
  vidrioRepartido?: boolean;

  onToggleVidrioRepartido?: () => void;
};

export function ExtrasSection({
  mosquitero,

  guia,

  cajonBlock,
  vidrioRepartido,
  onToggleVidrioRepartido,
  onToggleMosquitero,

  onToggleGuia,

  onToggleCajonBlock,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {onToggleMosquitero && (
        <SelectableCard selected={!!mosquitero} onClick={onToggleMosquitero}>
          Mosquitero
        </SelectableCard>
      )}

      {onToggleGuia && (
        <SelectableCard selected={!!guia} onClick={onToggleGuia}>
          Guía
        </SelectableCard>
      )}

      {onToggleCajonBlock && (
        <SelectableCard selected={!!cajonBlock} onClick={onToggleCajonBlock}>
          Cajón Block
        </SelectableCard>
      )}

      {onToggleVidrioRepartido && (
        <SelectableCard
          selected={!!vidrioRepartido}
          onClick={onToggleVidrioRepartido}
        >
          Vidrio repartido
        </SelectableCard>
      )}
    </div>
  );
}
