import { GlassCard } from "@/shared/cards/GlassCard";

type Props = {
  label: string;

  selected: boolean;

  onClick: () => void;

  children: React.ReactNode;
};

export function DoorPreviewCard({ label, selected, onClick, children }: Props) {
  return (
    <GlassCard selected={selected} onClick={onClick} className="p-3">
      <div className="space-y-3">
        <div
          className="
            flex
            h-40
            items-center
            justify-center

            rounded-2xl

            border border-white/5

            bg-black/30
          "
        >
          {children}
        </div>

        <div
          className="
            text-center
            text-xs
            font-semibold
            uppercase
            tracking-[0.18em]
            text-zinc-300
          "
        >
          {label}
        </div>
      </div>
    </GlassCard>
  );
}
