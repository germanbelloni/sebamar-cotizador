import type { PuertasConfig } from "../types";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

type Props = {
  config: PuertasConfig;
};

export function PuertasPreview({ config }: Props) {
  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const esPuertaYMedia = config.tipoConfiguracion === "puerta_y_media";

  const esDoble = config.tipoConfiguracion === "doble";

  const esPorton = config.tipoConfiguracion === "porton";

  const anchoHoja = esPuertaYMedia ? config.anchoPrincipal * 2 : config.ancho;

  const totalHojas = esPuertaYMedia ? 2 : config.hojas;

  const viewWidth = 700;

  const viewHeight = 520;

  const scale = Math.min(
    500 / Math.max(config.ancho, 1),
    360 / Math.max(config.alto, 1),
  );

  const drawWidth = config.ancho * scale;

  const drawHeight = config.alto * scale;

  const startX = (viewWidth - drawWidth) / 2;

  const startY = (viewHeight - drawHeight) / 2;

  const hojaWidth = drawWidth / totalHojas;

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
          <h3 className="text-lg font-semibold text-white">Puerta</h3>

          <p
            className="
              mt-1
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-zinc-500
            "
          >
            {config.linea}
          </p>
        </div>

        <div
          className="
            text-xs
            font-mono
            text-zinc-400
          "
        >
          {config.ancho} × {config.alto}
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
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="
            relative
            z-10
            h-full
            w-full
          "
        >
          {/* GLOW */}

          <circle
            cx={viewWidth / 2}
            cy={viewHeight / 2}
            r={170}
            fill="rgba(255,255,255,0.03)"
          />

          {/* MARCO */}

          <rect
            x={startX}
            y={startY}
            width={drawWidth}
            height={drawHeight}
            fill="rgba(20,20,20,0.95)"
            stroke={aluminioColor}
            strokeWidth={5}
            rx={2}
          />

          {/* HOJAS */}

          {Array.from({
            length: totalHojas,
          }).map((_, index) => {
            const x = startX + hojaWidth * index;

            const esHojaPrincipal =
              config.mano === "izquierda"
                ? index === 0
                : index === totalHojas - 1;

            return (
              <g key={index}>
                {/* DIVISION */}

                {index > 0 && (
                  <rect
                    x={x - 2}
                    y={startY}
                    width={4}
                    height={drawHeight}
                    fill={aluminioColor}
                  />
                )}

                {/* PANEL */}

                <rect
                  x={x + 6}
                  y={startY + 6}
                  width={hojaWidth - 12}
                  height={drawHeight - 12}
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1.5}
                />

                {/* MODELO */}

                <ModeloPuertaSVG
                  modelo={config.modelo}
                  x={x + 6}
                  y={startY + 6}
                  width={hojaWidth - 12}
                  height={drawHeight - 12}
                  vidrio={config.vidrio}
                />

                {/* BARRAL */}

                {esHojaPrincipal &&
                  (config.extras.barralRecto || config.extras.barralCurvo) && (
                    <BarralSVG
                      tipo={config.extras.barralRecto ? "recto" : "curvo"}
                      x={
                        config.mano === "izquierda"
                          ? x + hojaWidth - 32
                          : x + 22
                      }
                      y={startY + drawHeight * 0.22}
                      height={drawHeight * 0.45}
                    />
                  )}

                {/* MEDIA MANIJA */}

                {esHojaPrincipal && config.extras.mediaManija && (
                  <rect
                    x={
                      config.mano === "izquierda" ? x + hojaWidth - 38 : x + 30
                    }
                    y={startY + drawHeight * 0.55}
                    width={5}
                    height={40}
                    rx={999}
                    fill="rgba(255,255,255,0.75)"
                  />
                )}

                {/* PICAPORTE */}

                {esHojaPrincipal && config.extras.picaporte && (
                  <g>
                    <rect
                      x={
                        config.mano === "izquierda"
                          ? x + hojaWidth - 32
                          : x + 18
                      }
                      y={startY + drawHeight * 0.52}
                      width={22}
                      height={5}
                      rx={999}
                      fill="rgba(255,255,255,0.8)"
                    />

                    <circle
                      cx={
                        config.mano === "izquierda" ? x + hojaWidth - 8 : x + 16
                      }
                      cy={startY + drawHeight * 0.525}
                      r={3}
                      fill="rgba(255,255,255,0.8)"
                    />
                  </g>
                )}

                {/* APERTURA */}

                {!esPorton && (
                  <path
                    d={
                      config.mano === "izquierda"
                        ? `
                          M ${x + hojaWidth - 14} ${startY + drawHeight - 24}
                          Q ${x + hojaWidth - 80} ${startY + drawHeight / 2}
                          ${x + hojaWidth - 14} ${startY + 24}
                        `
                        : `
                          M ${x + 14} ${startY + drawHeight - 24}
                          Q ${x + 80} ${startY + drawHeight / 2}
                          ${x + 14} ${startY + 24}
                        `
                    }
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                  />
                )}
              </g>
            );
          })}

          {/* PORTON */}

          {esPorton && (
            <PortonAperturaSVG
              config={config}
              startX={startX}
              startY={startY}
              drawWidth={drawWidth}
              drawHeight={drawHeight}
            />
          )}

          {/* COTAS */}

          <line
            x1={startX}
            y1={startY + drawHeight + 35}
            x2={startX + drawWidth}
            y2={startY + drawHeight + 35}
            stroke="rgba(255,255,255,0.25)"
          />

          <text
            x={startX + drawWidth / 2}
            y={startY + drawHeight + 55}
            fill="rgba(255,255,255,0.45)"
            textAnchor="middle"
            fontSize="12"
          >
            {config.ancho} cm
          </text>

          <line
            x1={startX - 30}
            y1={startY}
            x2={startX - 30}
            y2={startY + drawHeight}
            stroke="rgba(255,255,255,0.25)"
          />

          <text
            x={startX - 42}
            y={startY + drawHeight / 2}
            transform={`rotate(-90 ${startX - 42} ${startY + drawHeight / 2})`}
            fill="rgba(255,255,255,0.45)"
            textAnchor="middle"
            fontSize="12"
          >
            {config.alto} cm
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ========================= */
/* MODELOS */
/* ========================= */

type ModeloProps = {
  modelo: string;

  x: number;

  y: number;

  width: number;

  height: number;

  vidrio?: string;
};

function ModeloPuertaSVG({ modelo, x, y, width, height, vidrio }: ModeloProps) {
  const vidrioFill =
    vidrio && vidrio !== "ninguno" ? "rgba(180,220,255,0.14)" : "transparent";

  switch (modelo) {
    case "modelo_1":
      return (
        <>
          <rect
            x={x + width * 0.2}
            y={y + 25}
            width={width * 0.6}
            height={height * 0.55}
            fill={vidrioFill}
            stroke="rgba(255,255,255,0.14)"
          />
        </>
      );

    case "modelo_2":
      return (
        <>
          <rect
            x={x + width * 0.2}
            y={y + 25}
            width={width * 0.6}
            height={height * 0.22}
            fill={vidrioFill}
            stroke="rgba(255,255,255,0.14)"
          />

          <rect
            x={x + width * 0.2}
            y={y + height * 0.38}
            width={width * 0.6}
            height={height * 0.22}
            fill={vidrioFill}
            stroke="rgba(255,255,255,0.14)"
          />
        </>
      );

    default:
      return (
        <>
          <rect
            x={x + 20}
            y={y + 20}
            width={width - 40}
            height={height - 40}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.08)"
          />
        </>
      );
  }
}

/* ========================= */
/* BARRAL */
/* ========================= */

type BarralProps = {
  tipo: "recto" | "curvo";

  x: number;

  y: number;

  height: number;
};

function BarralSVG({ tipo, x, y, height }: BarralProps) {
  if (tipo === "recto") {
    return (
      <rect
        x={x}
        y={y}
        width={7}
        height={height}
        rx={999}
        fill="rgba(255,255,255,0.82)"
      />
    );
  }

  return (
    <path
      d={`
        M ${x + 18} ${y}
        Q ${x - 8} ${y + height / 2}
        ${x + 18} ${y + height}
      `}
      fill="none"
      stroke="rgba(255,255,255,0.82)"
      strokeWidth={7}
      strokeLinecap="round"
    />
  );
}

/* ========================= */
/* PORTON */
/* ========================= */

type PortonProps = {
  config: PuertasConfig;

  startX: number;

  startY: number;

  drawWidth: number;

  drawHeight: number;
};

function PortonAperturaSVG({
  config,
  startX,
  startY,
  drawWidth,
  drawHeight,
}: PortonProps) {
  if (config.tipoPorton === "corredizo") {
    return (
      <path
        d={
          config.mano === "izquierda"
            ? `
              M ${startX + 20} ${startY + drawHeight / 2}
              Q ${startX - 60} ${startY + drawHeight / 2}
              ${startX - 100} ${startY + drawHeight / 2}
            `
            : `
              M ${startX + drawWidth - 20} ${startY + drawHeight / 2}
              Q ${startX + drawWidth + 60} ${startY + drawHeight / 2}
              ${startX + drawWidth + 100} ${startY + drawHeight / 2}
            `
        }
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={4}
        strokeLinecap="round"
      />
    );
  }

  if (config.tipoPorton === "plegadizo") {
    return (
      <>
        <path
          d={`
            M ${startX + 20} ${startY + drawHeight - 20}
            L ${startX + drawWidth * 0.3} ${startY + 40}
          `}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={3}
        />

        <path
          d={`
            M ${startX + drawWidth * 0.3} ${startY + 40}
            L ${startX + drawWidth * 0.5} ${startY + drawHeight - 20}
          `}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={3}
        />
      </>
    );
  }

  return null;
}
