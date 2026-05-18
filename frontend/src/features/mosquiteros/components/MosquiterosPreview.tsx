import type { MosquiterosConfig } from "../types";

import { Mosquitero } from "@/features/ventanas/svg/Mosquitero";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

import { calculateScale } from "@/shared/svg/utils/calculateScale";
type Props = {
  config: MosquiterosConfig;
};

export function MosquiterosPreview({ config }: Props) {
  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const esPuerta = config.tipo === "puerta_mosquitera";

  const esFijo = config.tipo === "fijo";

  const viewWidth = 500;

  const viewHeight = esPuerta ? 650 : 420;

  const scale = calculateScale(config.ancho, config.alto, esPuerta ? 420 : 320);

  const drawWidth = config.ancho * scale;

  const drawHeight = config.alto * scale;

  const paddingX = (viewWidth - drawWidth) / 2;

  const paddingTop = (viewHeight - drawHeight) / 2;

  const ladoBisagra = config.ladoBisagra || "derecha";

  const zocaloHeight = esPuerta ? 80 : 0;

  const travesanoHeight = 12;

  const gapEntreTravesanos = 35;

  const bisagraX =
    ladoBisagra === "derecha" ? paddingX + drawWidth - 2 : paddingX - 6;

  const manijaX =
    ladoBisagra === "derecha" ? paddingX + 8 : paddingX + drawWidth - 26;

  return (
    <div
      className="
        rounded-2xl
        border border-border
        bg-card
        p-6
      "
    >
      {/* HEADER */}

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Mosquitero</h3>

          <p
            className="
              mt-1
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-zinc-500
            "
          >
            {config.tipo === "ventana" && "PARA VENTANA"}

            {config.tipo === "puerta_mosquitera" && "PUERTA MOSQUITERA"}

            {config.tipo === "fijo" && "MOSQUITERO FIJO"}
          </p>
        </div>

        <div
          className="
            text-xs
            font-mono
            text-zinc-400
          "
        >
          {config.ancho}
          {" × "}
          {config.alto}
        </div>
      </div>

      {/* SVG */}

      <div
        className="
          relative
          mt-5
          flex
          h-[500px]
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border border-white/5
          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black
        "
      >
        {/* GLOW */}

        <div
          className="
            absolute
            h-[420px]
            w-[420px]
            rounded-full
            bg-white/[0.02]
            blur-3xl
          "
        />

        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="
            relative
            z-10
            h-full
            w-full
            max-w-[95%]
          "
        >
          {/* MARCO */}

          <rect
            x={paddingX}
            y={paddingTop}
            width={drawWidth}
            height={drawHeight}
            fill="#111"
            stroke={aluminioColor}
            strokeWidth={5}
            rx={2}
          />

          {/* MOSQUITERO */}

          {config.tipo === "ventana" ? (
            <Mosquitero
              left={paddingX}
              top={paddingTop}
              ancho={drawWidth}
              alto={drawHeight - zocaloHeight}
            />
          ) : (
            <>
              {/* GLOW */}

              <rect
                x={paddingX + 10}
                y={paddingTop + 10}
                width={Math.max(0, drawWidth - 20)}
                height={Math.max(0, drawHeight - zocaloHeight - 20)}
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={1.5}
              />

              {/* MALLA */}

              <rect
                x={paddingX + 16}
                y={paddingTop + 16}
                width={Math.max(0, drawWidth - 32)}
                height={Math.max(0, drawHeight - zocaloHeight - 32)}
                fill="url(#mosquiteroPattern)"
                opacity={0.35}
              />
            </>
          )}

          {/* ===== PUERTA ===== */}

          {esPuerta && (
            <g>
              {/* ZÓCALO */}

              <rect
                x={paddingX + 2.5}
                y={paddingTop + drawHeight - zocaloHeight}
                width={drawWidth - 5}
                height={zocaloHeight - 2.5}
                fill={aluminioColor}
              />

              {/* ESTRIADO */}

              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1={paddingX + 10 + i * (drawWidth / 12)}
                  y1={paddingTop + drawHeight - zocaloHeight + 5}
                  x2={paddingX + 10 + i * (drawWidth / 12)}
                  y2={paddingTop + drawHeight - 5}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="1"
                />
              ))}

              {/* TRAVESAÑOS */}

              {[1, 2].map((i) => (
                <rect
                  key={i}
                  x={paddingX + 2}
                  y={
                    paddingTop +
                    drawHeight -
                    zocaloHeight -
                    i * (travesanoHeight + gapEntreTravesanos)
                  }
                  width={drawWidth - 4}
                  height={travesanoHeight}
                  fill={aluminioColor}
                  rx={1}
                />
              ))}

              {/* BISAGRAS */}

              {[0.12, 0.5, 0.88].map((pos, i) => (
                <rect
                  key={i}
                  x={bisagraX}
                  y={paddingTop + drawHeight * pos - 10}
                  width={8}
                  height={28}
                  fill="#1a1a1a"
                  rx={2}
                />
              ))}

              {/* MANIJA */}

              <rect
                x={manijaX}
                y={paddingTop + drawHeight / 2 + 10}
                width={18}
                height={8}
                rx={2}
                fill="#1a1a1a"
              />
            </g>
          )}

          {/* FIJO */}

          {esFijo && (
            <rect
              x={paddingX + 10}
              y={paddingTop + 10}
              width={Math.max(0, drawWidth - 20)}
              height={Math.max(0, drawHeight - 20)}
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.05)"
            />
          )}

          {/* COTAS */}

          <g className="opacity-40">
            <line
              x1={paddingX - 30}
              y1={paddingTop}
              x2={paddingX - 30}
              y2={paddingTop + drawHeight}
              stroke="white"
              strokeWidth="1"
            />

            <text
              x={paddingX - 45}
              y={paddingTop + drawHeight / 2}
              transform={`rotate(-90 ${paddingX - 45} ${
                paddingTop + drawHeight / 2
              })`}
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              {config.alto} cm
            </text>

            <line
              x1={paddingX}
              y1={paddingTop + drawHeight + 30}
              x2={paddingX + drawWidth}
              y2={paddingTop + drawHeight + 30}
              stroke="white"
              strokeWidth="1"
            />

            <text
              x={paddingX + drawWidth / 2}
              y={paddingTop + drawHeight + 50}
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              {config.ancho} cm
            </text>
          </g>
        </svg>
      </div>

      {/* INFO */}

      <div
        className="
          mt-4
          grid
          grid-cols-4
          gap-4
          border-t border-white/5
          pt-4
        "
      >
        <Info
          label="Tipo"
          value={
            config.tipo === "ventana"
              ? "Ventana"
              : config.tipo === "fijo"
                ? "Fijo"
                : "Puerta"
          }
        />

        <Info label="Color" value={config.color} />

        <Info label="Bisagra" value={esPuerta ? ladoBisagra : "-"} />

        <Info label="Medidas" value={`${config.ancho} × ${config.alto}`} />
      </div>
    </div>
  );
}

type InfoProps = {
  label: string;

  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.25em]
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-medium
          text-zinc-200
          capitalize
        "
      >
        {value}
      </p>
    </div>
  );
}
