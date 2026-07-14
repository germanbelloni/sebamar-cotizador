import { GlassCard } from "@/shared/cards/GlassCard";

const colors = [
  {
    label: "Blanco",
    value: "blanco",

    preview: "bg-white",
  },

  {
    label: "Negro",
    value: "negro",

    preview: "bg-background",
  },

  {
    label: "Bronce Colonial",

    value: "bronce colonial",

    preview: "bg-[#2e411f]",
  },

  {
    label: "Simil Madera",

    value: "simil madera",

    preview: "bg-[#9b6b3d]",
  },
] as const;

type ColorOption = {
  label: string;
  value: string;
  preview?: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options?: readonly ColorOption[];
};
export function ColorSelector({ value, onChange, options }: Props) {
  const availableColors = options ?? colors;
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
          Color
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availableColors.map((color) => (
          <GlassCard
            key={color.value}
            selected={value === color.value}
            onClick={() => onChange(color.value)}
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className={`
    h-7
    w-7
    rounded-full
    border border-border
    ${color.preview ?? "bg-white"}
  `}
            />

            <span
              className="
                text-sm
                font-medium
              "
            >
              {color.label}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
