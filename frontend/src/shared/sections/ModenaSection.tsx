import { SelectableCard } from "@/components/ui/selectable-card";

type Props = {
  premarco: boolean;
  contramarco: boolean;
  herrajesBlancos?: boolean;

  onTogglePremarco: () => void;
  onToggleContramarco: () => void;
  onToggleHerrajesBlancos?: () => void;
};

export function ModenaSection({
  premarco,
  contramarco,
  herrajesBlancos,
  onTogglePremarco,
  onToggleContramarco,
  onToggleHerrajesBlancos,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <SelectableCard selected={premarco} onClick={onTogglePremarco}>
        Premarco
      </SelectableCard>

      <SelectableCard selected={contramarco} onClick={onToggleContramarco}>
        Contramarco
      </SelectableCard>

      <SelectableCard
        selected={!!herrajesBlancos}
        onClick={onToggleHerrajesBlancos}
      >
        Herrajes blancos
      </SelectableCard>
    </div>
  );
}
