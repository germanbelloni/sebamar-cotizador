import { SelectableCard } from "@/components/ui/selectable-card";

type Props = {
  barralRecto?: number;

  barralCurvo?: number;

  manija?: boolean;

  picaporte?: boolean;

  onToggleBarralRecto: () => void;

  onToggleBarralCurvo: () => void;

  onToggleManija: () => void;

  onTogglePicaporte: () => void;
};

export function PuertasExtrasSection({
  barralRecto,

  barralCurvo,

  manija,

  picaporte,

  onToggleBarralRecto,

  onToggleBarralCurvo,

  onToggleManija,

  onTogglePicaporte,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SelectableCard selected={!!barralRecto} onClick={onToggleBarralRecto}>
        Barral recto
      </SelectableCard>

      <SelectableCard selected={!!barralCurvo} onClick={onToggleBarralCurvo}>
        Barral curvo
      </SelectableCard>

      <SelectableCard selected={!!manija} onClick={onToggleManija}>
        Manija
      </SelectableCard>

      <SelectableCard selected={!!picaporte} onClick={onTogglePicaporte}>
        Picaporte
      </SelectableCard>
    </div>
  );
}
