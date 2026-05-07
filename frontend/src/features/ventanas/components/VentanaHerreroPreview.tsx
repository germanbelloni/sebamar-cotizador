import type { VentanaHerreroConfig } from "../types";

type Props = {
  config: VentanaHerreroConfig;
};

export function VentanaHerreroPreview({ config }: Props) {
  const escala = 1.2;

  const colorMap = {
    Blanco: "#E4E4E7",
    Negro: "#18181B",
    "Bronce Colonial": "#2e411f",
    "Simil Madera": "#7C2D12",
  };

  const esHerrero = config.linea === "Herrero";

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} x {config.alto}
        </span>
      </div>

      <div className="mt-6 flex h-[500px] items-center justify-center rounded-2xl border border-border bg-zinc-950 p-6">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          {/* MARCO */}

          <rect
            x={250 - ancho / 2}
            y={250 - alto / 2}
            width={ancho}
            height={alto}
            stroke={colorMap[config.color]}
            strokeWidth={esHerrero ? 10 : 6}
          />

          {/* DIVISION CENTRAL */}

          <line
            x1={250}
            y1={250 - alto / 2}
            x2={250}
            y2={250 + alto / 2}
            stroke={colorMap[config.color]}
            strokeWidth={esHerrero ? 8 : 4}
          />

          {/* CIERRES */}

          {esHerrero ? (
            <line
              x1={250}
              y1={230}
              x2={250}
              y2={270}
              stroke="#09090B"
              strokeWidth={4}
              strokeLinecap="round"
            />
          ) : (
            <>
              <rect
                x={250 - ancho / 2 + 10}
                y={235}
                width={6}
                height={24}
                rx={2}
                fill="#D4D4D8"
              />

              <rect
                x={250 + ancho / 2 - 16}
                y={235}
                width={6}
                height={24}
                rx={2}
                fill="#D4D4D8"
              />
            </>
          )}

          {/* COTA ANCHO */}

          <line
            x1={250 - ancho / 2}
            y1={250 + alto / 2 + 40}
            x2={250 + ancho / 2}
            y2={250 + alto / 2 + 40}
            stroke="#71717A"
            strokeWidth={1.5}
          />

          <line
            x1={250 - ancho / 2}
            y1={250 + alto / 2 + 28}
            x2={250 - ancho / 2}
            y2={250 + alto / 2 + 52}
            stroke="#71717A"
            strokeWidth={1.5}
          />

          <line
            x1={250 + ancho / 2}
            y1={250 + alto / 2 + 28}
            x2={250 + ancho / 2}
            y2={250 + alto / 2 + 52}
            stroke="#71717A"
            strokeWidth={1.5}
          />

          <text
            x="250"
            y={250 + alto / 2 + 35}
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="14"
          >
            {config.ancho} cm
          </text>

          {/* COTA ALTO */}

          <line
            x1={250 - ancho / 2 - 40}
            y1={250 - alto / 2}
            x2={250 - ancho / 2 - 40}
            y2={250 + alto / 2}
            stroke="#71717A"
            strokeWidth={1.5}
          />

          <line
            x1={250 - ancho / 2 - 28}
            y1={250 - alto / 2}
            x2={250 - ancho / 2 - 52}
            y2={250 - alto / 2}
            stroke="#71717A"
            strokeWidth={1.5}
          />

          <line
            x1={250 - ancho / 2 - 28}
            y1={250 + alto / 2}
            x2={250 - ancho / 2 - 52}
            y2={250 + alto / 2}
            stroke="#71717A"
            strokeWidth={1.5}
          />

          <text
            x={250 - ancho / 2 - 55}
            y="250"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="14"
            transform={`rotate(-90 ${250 - ancho / 2 - 55} 250)`}
          >
            {config.alto} cm
          </text>
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Línea: {config.linea}</span>

        <span>Color: {config.color}</span>
      </div>
    </div>
  );
}
