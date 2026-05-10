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

    preview: "bg-black",
  },

  {
    label: "Bronce Colonial",

    value: "bronce colonial",

    preview: "bg-[#6b4423]",
  },

  {
    label: "Simil Madera",

    value: "simil madera",

    preview: "bg-[#9b6b3d]",
  },
] as const;

type Props = {
  value: string;

  onChange: (value: string) => void;
};

export function ColorSelector({
  value,

  onChange,
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
          Color
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {colors.map((color) => (
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

                border border-white/10

                ${color.preview}
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
