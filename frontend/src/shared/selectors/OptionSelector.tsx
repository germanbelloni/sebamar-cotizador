import { GlassCard } from "@/shared/cards/GlassCard";

type Option = {
  label: string;

  value: string;

  colorClass?: string;
};

type Props = {
  title: string;

  value: string;

  options: readonly Option[];

  onChange: (value: string) => void;

  disabled?: boolean;

  columns?: 1 | 2 | 3;
};

export function OptionSelector({
  title,

  value,

  options,

  columns = 2,

  onChange,

  disabled = false,
}: Props) {
  return (
    <div
      className={`
        space-y-4

        ${disabled ? "pointer-events-none opacity-50" : ""}
      `}
    >
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
            onClick={() => {
              if (!disabled) {
                onChange(option.value);
              }
            }}
          >
            <div
              className="
                min-h-[52px]
                flex
                items-center
                justify-center
                gap-3

                py-2

                text-center
                text-sm
                font-medium
                tracking-wide
              "
            >
              {option.colorClass && (
                <div
                  className={`
                    h-4
                    w-4
                    rounded-full
                    border
                    border-white/20
                    shadow-md

                    ${option.colorClass}
                  `}
                />
              )}

              <span>{option.label}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
