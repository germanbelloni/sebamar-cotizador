import type { PosicionOscilo } from "@/features/rajas/types";

type Props = {
  value?: PosicionOscilo;

  onChange: (value: PosicionOscilo) => void;
};

const options: PosicionOscilo[] = ["cerrada", "abrir", "oscilo"];

export function OsciloPositionSelector({ value = "cerrada", onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => {
        const active = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`
              rounded-2xl

              border

              px-4 py-4

              text-sm
              font-medium
              capitalize

              transition-all duration-200

              ${
                active
                  ? "border-emerald-400/40 bg-emerald-500/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:text-white"
              }
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
