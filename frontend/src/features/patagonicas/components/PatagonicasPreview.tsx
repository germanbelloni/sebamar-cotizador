import type { PatagonicasConfig } from "../types";

import { Premarco } from "@/features/ventanas/svg/Premarco";
import { Contramarco } from "@/features/ventanas/svg/Contramarco";

import { Guide } from "@/features/ventanas/svg/Guide";
import { CajonBlock } from "@/features/ventanas/svg/CajonBlock";
import { CortinaPVC } from "@/features/ventanas/svg/CortinaPVC";
import { CortinaAluminio } from "@/features/ventanas/svg/CortinaAluminio";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

type Props = {
  config: PatagonicasConfig;
};

type RajaProps = {
  x: number;

  ancho: number;

  alto: number;

  ladoBisagra: "izquierda" | "derecha";

  aluminioColor: string;

  mosquitero: boolean;
};

function Raja({
  x,

  ancho,

  alto,

  ladoBisagra,

  aluminioColor,

  mosquitero,
}: RajaProps) {
  const vidrioPadding = 8;

  const bisagraX = ladoBisagra === "izquierda" ? x + 3 : x + ancho - 7;

  const manijaX = ladoBisagra === "izquierda" ? x + ancho - 12 : x + 7;

  return (
    <g>
      {/* HOJA */}

      <rect
        x={x}
        y={60}
        width={ancho}
        height={alto}
        fill="rgba(20,20,20,0.95)"
        stroke={aluminioColor}
        strokeWidth={2}
      />

      {/* VIDRIO */}

      <rect
        x={x + vidrioPadding}
        y={68}
        width={ancho - vidrioPadding * 2}
        height={alto - vidrioPadding * 2}
        fill="rgba(255,255,255,0.05)"
      />

      {/* REFLEJO */}

      <rect
        x={x + vidrioPadding}
        y={68}
        width={ancho - vidrioPadding * 2}
        height={alto * 0.28}
        fill="rgba(255,255,255,0.03)"
      />

      {/* MOSQUITERO */}

      {mosquitero && (
        <rect
          x={x + vidrioPadding}
          y={68}
          width={ancho - vidrioPadding * 2}
          height={alto - vidrioPadding * 2}
          fill="url(#mosquiteroPattern)"
          opacity={0.55}
        />
      )}

      {/* BISAGRAS */}

      <rect
        x={bisagraX}
        y={95}
        width={4}
        height={32}
        rx={999}
        fill="rgba(255,255,255,0.18)"
      />

      <rect
        x={bisagraX}
        y={alto + 28}
        width={4}
        height={32}
        rx={999}
        fill="rgba(255,255,255,0.18)"
      />

      {/* MANIJA */}

      <rect
        x={manijaX}
        y={alto / 2 + 40}
        width={5}
        height={46}
        rx={999}
        fill="rgba(240,240,240,0.75)"
      />

      {/* SOMBRA */}

      <rect
        x={manijaX + 1}
        y={alto / 2 + 40}
        width={1}
        height={46}
        fill="rgba(0,0,0,0.25)"
      />
    </g>
  );
}

export function PatagonicasPreview({ config }: Props) {
  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const viewWidth = 500;

  const viewHeight = 350;

  const padding = 60;

  const drawWidth = viewWidth - padding * 2;

  const drawHeight = viewHeight - padding * 2;

  const anchoRaja =
    config.tipo === "1_raja"
      ? drawWidth * (config.anchoRaja / 100)
      : drawWidth * ((config.anchoRaja - 8) / 100);

  const anchoFijo =
    config.tipo === "1_raja"
      ? drawWidth - anchoRaja
      : drawWidth - anchoRaja * 2;

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
          <h3 className="text-lg font-semibold text-white">
            Patagónica {config.linea}
          </h3>

          <p
            className="
              mt-1
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-zinc-500
            "
          >
            {config.cantidadRajas}
            {" RAJA/S · "}
            PAÑO FIJO
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
          h-[430px]
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
            h-[450px]
            w-[450px]
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
            max-w-[92%]
          "
        >
          <defs>
            <pattern
              id="mosquiteroPattern"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 6 6 M 6 0 L 0 6"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>

          {/* GUIA */}

          {config.guia && (
            <Guide
              left={padding}
              top={60}
              ancho={drawWidth}
              alto={drawHeight}
              tieneCortina={config.cortinaPVC || config.cortinaAluminio}
            />
          )}

          {/* CORTINAS */}

          {config.cortinaPVC && (
            <CortinaPVC left={padding} top={60} ancho={drawWidth} />
          )}

          {config.cortinaAluminio && (
            <CortinaAluminio
              left={padding}
              top={60}
              ancho={drawWidth}
              color={aluminioColor}
            />
          )}

          {/* CAJON BLOCK */}

          {config.cajonBlock && (
            <CajonBlock left={padding} top={60} ancho={drawWidth} />
          )}

          {/* PREMARCO */}

          {config.premarco && (
            <Premarco
              left={padding - 10}
              top={50}
              ancho={drawWidth + 20}
              alto={drawHeight + 20}
            />
          )}

          {/* CONTRAMARCO */}

          {config.contramarco && (
            <Contramarco
              left={padding - 4}
              top={56}
              ancho={drawWidth + 8}
              alto={drawHeight + 8}
              color={aluminioColor}
            />
          )}

          {/* MARCO */}

          <rect
            x={padding}
            y={60}
            width={drawWidth}
            height={drawHeight}
            fill="rgba(20,20,20,0.92)"
            stroke={aluminioColor}
            strokeWidth={4}
          />

          {/* ===== 1 RAJA ===== */}

          {config.tipo === "1_raja" && (
            <>
              <Raja
                x={padding}
                ancho={anchoRaja}
                alto={drawHeight}
                ladoBisagra={config.bisagraRaja1}
                aluminioColor={aluminioColor}
                mosquitero={config.mosquitero}
              />

              {/* PARANTE */}

              <line
                x1={padding + anchoRaja}
                y1={60}
                x2={padding + anchoRaja}
                y2={60 + drawHeight}
                stroke={aluminioColor}
                strokeWidth={2}
              />

              {/* PAÑO FIJO */}

              <rect
                x={padding + anchoRaja}
                y={60}
                width={anchoFijo}
                height={drawHeight}
                fill="rgba(255,255,255,0.03)"
                stroke={aluminioColor}
                strokeWidth={1}
              />
            </>
          )}

          {/* ===== 2 RAJAS ===== */}

          {config.tipo === "2_rajas" && (
            <>
              {/* RAJA IZQUIERDA */}

              <Raja
                x={padding}
                ancho={anchoRaja}
                alto={drawHeight}
                ladoBisagra={config.bisagraRaja1}
                aluminioColor={aluminioColor}
                mosquitero={config.mosquitero}
              />

              {/* PARANTE IZQ */}

              <line
                x1={padding + anchoRaja}
                y1={60}
                x2={padding + anchoRaja}
                y2={60 + drawHeight}
                stroke={aluminioColor}
                strokeWidth={2}
              />

              {/* FIJO CENTRAL */}

              <rect
                x={padding + anchoRaja}
                y={60}
                width={anchoFijo}
                height={drawHeight}
                fill="rgba(255,255,255,0.03)"
                stroke={aluminioColor}
                strokeWidth={1}
              />

              {/* PARANTE DER */}

              <line
                x1={padding + anchoRaja + anchoFijo}
                y1={60}
                x2={padding + anchoRaja + anchoFijo}
                y2={60 + drawHeight}
                stroke={aluminioColor}
                strokeWidth={2}
              />

              {/* RAJA DERECHA */}

              <Raja
                x={padding + anchoRaja + anchoFijo}
                ancho={anchoRaja}
                alto={drawHeight}
                ladoBisagra={config.bisagraRaja2}
                aluminioColor={aluminioColor}
                mosquitero={config.mosquitero}
              />
            </>
          )}

          {/* COTAS */}

          <g>
            <line
              x1={padding - 20}
              y1={60}
              x2={padding - 20}
              y2={60 + drawHeight}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />

            <text
              x={padding - 32}
              y={60 + drawHeight / 2}
              transform={`rotate(-90 ${padding - 32} ${60 + drawHeight / 2})`}
              textAnchor="middle"
              fill="rgba(255,255,255,0.45)"
              fontSize="11"
            >
              {config.alto} cm
            </text>
          </g>

          <g>
            <line
              x1={padding}
              y1={60 + drawHeight + 28}
              x2={padding + drawWidth}
              y2={60 + drawHeight + 28}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />

            <text
              x={padding + drawWidth / 2}
              y={60 + drawHeight + 45}
              textAnchor="middle"
              fill="rgba(255,255,255,0.45)"
              fontSize="11"
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
        <Info label="Línea" value={config.linea} />

        <Info label="Vidrio" value={config.tipoVidrio} />

        <Info label="Raja" value={`${config.anchoRaja} cm`} />

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
        "
      >
        {value}
      </p>
    </div>
  );
}
