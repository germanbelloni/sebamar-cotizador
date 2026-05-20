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
          {/* SOMBRA */}

          <rect
            x="105"
            y="105"
            width="290"
            height="290"
            fill="none"
            stroke="rgba(0,0,0,0.45)"
            strokeWidth="24"
            opacity="0.25"
          />

          {/* MARCO */}

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

          {/* REFLEJO */}

          <line
            x1="118"
            y1="118"
            x2="382"
            y2="118"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2"
          />

          <line
            x1="118"
            y1="118"
            x2="118"
            y2="382"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="2"
          />

          {/* ESCUADRAS SOLO PREMARCO */}

          {config.tipo === "premarco" && (
            <>
              {/* SUPERIOR IZQ */}

              <polygon
                points="110,110 150,110 110,150"
                fill="#1F1F1F"
                opacity="0.95"
              />

              {/* SUPERIOR DER */}

              <polygon
                points="390,110 350,110 390,150"
                fill="#1F1F1F"
                opacity="0.95"
              />

              {/* INFERIOR IZQ */}

              <polygon
                points="110,390 150,390 110,350"
                fill="#1F1F1F"
                opacity="0.95"
              />

              {/* INFERIOR DER */}

              <polygon
                points="390,390 350,390 390,350"
                fill="#1F1F1F"
                opacity="0.95"
              />

              {/* HUECOS */}

              <polygon points="120,120 138,120 120,138" fill="#2B2B2B" />

              <polygon points="380,120 362,120 380,138" fill="#2B2B2B" />

              <polygon points="120,380 138,380 120,362" fill="#2B2B2B" />

              <polygon points="380,380 362,380 380,362" fill="#2B2B2B" />

              {/* GRAMPAS LATERALES */}

              <rect
                x="100"
                y="175"
                width="10"
                height="42"
                rx="2"
                fill="#BDBDBD"
              />

              <rect
                x="100"
                y="283"
                width="10"
                height="42"
                rx="2"
                fill="#BDBDBD"
              />

              <rect
                x="390"
                y="175"
                width="10"
                height="42"
                rx="2"
                fill="#BDBDBD"
              />

              <rect
                x="390"
                y="283"
                width="10"
                height="42"
                rx="2"
                fill="#BDBDBD"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
