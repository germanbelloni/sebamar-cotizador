import { SelectableCard } from "@/components/ui/selectable-card";
type Props = {
  premarco: boolean;

  contramarco: boolean;

  onTogglePremarco: () => void;

  onToggleContramarco: () => void;
};

export function ModenaSection({
  premarco,

  contramarco,

  onTogglePremarco,

  onToggleContramarco,
}: Props) {
  return (
    <div className="space-y-3">
      <h4
        className="
          text-sm font-medium
          text-muted-foreground
        "
      >
        Modena
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <SelectableCard selected={premarco} onClick={onTogglePremarco}>
          Premarco
        </SelectableCard>

        <SelectableCard selected={contramarco} onClick={onToggleContramarco}>
          Contramarco
        </SelectableCard>
      </div>
    </div>
  );
}
