type Option = {
  label: string;
  value: string;
};

type Props = {
  id: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function SegmentedControl({ id, value, options, onChange }: Props) {
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
            key={`${id}-${option.value}`}
            type="button"
            onClick={() => {
              onChange(option.value);
            }}
            className={`
              group
              relative
              z-10
              min-w-[200px]
              overflow-hidden
              rounded-[26px]
              px-10
              py-6
              transition-all
              duration-300

             ${
               active
                 ? `
      border border-[#39FF14]/70
      bg-[#39FF14]/[0.18]
      shadow-[0_0_40px_rgba(57,255,20,0.45)]
    `
                 : `
      hover:bg-white/[0.05]
      hover:border-[#39FF14]/20
    `
             }
            `}
          >
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
                      text-white
                    `
                    : `
                      text-white/45
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
