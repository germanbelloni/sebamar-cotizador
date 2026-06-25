type Option = {
  label: string;

  value: string;
};

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function SegmentedControl({ value, options, onChange }: Props) {
  return (
    <div
      className="
        relative

        flex
        w-fit

        rounded-[32px]

        border border-border

        bg-white/[0.03]

        p-1.5

        backdrop-blur-2xl

        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
      "
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="
  group
  relative
  z-10
  min-w-[200px]
  overflow-hidden
  rounded-[26px]
  border border-yellow-500
  px-10
  py-6
"
          >
            {/* Glow */}
            {active && (
              <div
                className="
      absolute
      inset-0
      rounded-[26px]
      bg-lime-500
      z-0
    "
              />
            )}

            {/* Hover glow */}
            <div
              className="
                absolute inset-0

                opacity-0

                transition-opacity
                duration-300

                group-hover:opacity-100

                bg-gradient-to-br
                from-white/[0.06]
                to-transparent
              "
            />

            {/* Text */}
            <span
              className={`
                relative z-10

                text-xl
                font-semibold

                tracking-wide

                transition-all
                duration-300

                ${
                  active
                    ? `
      text-black

                      drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]
                    `
                    : `
                      text-white/45

                      group-hover:text-foreground/75
                    `
                }
              `}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
