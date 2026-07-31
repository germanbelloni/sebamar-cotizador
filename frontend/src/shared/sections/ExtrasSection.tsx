import { SelectableCard } from "@/components/ui/selectable-card";

type Props = {
  mosquitero?: boolean;
  guia?: boolean;

  onToggleMosquitero?: () => void;
  onToggleGuia?: () => void;

  vidrioRepartido?: boolean;
  onToggleVidrioRepartido?: () => void;
};

export function ExtrasSection({
  mosquitero,
  guia,
  vidrioRepartido,
  onToggleVidrioRepartido,
  onToggleMosquitero,
  onToggleGuia,
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
