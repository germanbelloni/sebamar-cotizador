import { GlassCard } from "@/shared/cards/GlassCard";

type Option = {
  label: string;

  value: string;
};

type Props = {
  title?: string;

  value: string;

  options: Option[];

  columns?: number;

  onChange: (value: string) => void;
};

export function OptionSelector({
  title,

  value,

  options,

  columns = 2,

  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      {title && (
        <h3
          className="
            text-sm
            font-medium

            text-foreground/70
          "
        >
          {title}
        </h3>
      )}

      <div
        className={`
          grid gap-3

          ${
            columns === 2
              ? "grid-cols-2"
              : columns === 3
                ? "grid-cols-3"
                : "grid-cols-1"
          }
        `}
      >
        {options.map((option) => (
          <GlassCard
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          >
            <div
              className="
                min-h-[52px]
                flex
                items-center
                justify-center

                py-2

                text-center
                text-sm
                font-medium
                tracking-wide
              "
            >
              {option.label}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
