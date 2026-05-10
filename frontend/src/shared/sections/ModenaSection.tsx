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
    <div className="grid grid-cols-2 gap-3">
      <SelectableCard selected={premarco} onClick={onTogglePremarco}>
        Premarco
      </SelectableCard>

      <SelectableCard selected={contramarco} onClick={onToggleContramarco}>
        Contramarco
      </SelectableCard>
    </div>
  );
}
