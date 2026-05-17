import type { MarcosConfig } from "../types";

type Props = {
  config: MarcosConfig;
};

export function MarcosPreview({ config }: Props) {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {config.tipo === "premarco" ? "Premarco" : "Contramarco"}
          </h3>

          <p className="text-sm text-white/45">
            {config.ancho} × {config.alto}
          </p>
        </div>

        {config.tipo === "contramarco" && config.color && (
          <div className="text-sm text-white/55 capitalize">{config.color}</div>
        )}
      </div>

      <div
        className="
          mt-6
          flex
          h-[420px]
          items-center
          justify-center
          rounded-2xl
          border border-white/5
          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black
        "
      >
        <svg width="500" height="500" viewBox="0 0 500 500">
          <rect
            x="110"
            y="110"
            width="280"
            height="280"
            fill="none"
            stroke={
              config.tipo === "premarco"
                ? "#8A8A8A"
                : config.color === "negro"
                  ? "#1A1A1A"
                  : config.color === "bronce colonial"
                    ? "#6B4423"
                    : config.color === "simil madera"
                      ? "#7A5230"
                      : "#D6D6D6"
            }
            strokeWidth={config.tipo === "premarco" ? 18 : 12}
          />
        </svg>
      </div>
    </div>
  );
}
