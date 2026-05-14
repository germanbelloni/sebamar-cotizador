import type { PatagonicasConfig } from "../types";

import { Marco } from "@/features/ventanas/svg/Marco";
import { Premarco } from "@/features/ventanas/svg/Premarco";
import { Contramarco } from "@/features/ventanas/svg/Contramarco";
import { Cotas } from "@/features/ventanas/svg/Cotas";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

import { calculateScale } from "@/shared/svg/utils/calculateScale";
import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

type Props = {
  config: PatagonicasConfig;
};

type RajaProps = {
  x: number;

  top: number;

  anchoRaja: number;

  altoTotal: number;

  hojaPadding: number;

  lado: "izquierda" | "derecha";
};

function Raja({
  x,

  top,

  anchoRaja,

  altoTotal,

  hojaPadding,

  lado,
}: RajaProps) {
  return (
    <g>
      {/* HOJA */}

      <rect
        x={x}
        y={top}
        width={anchoRaja}
        height={altoTotal}
        fill="white"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={1}
      />

      {/* SOMBRA INTERNA */}

      <rect
        x={x + 4}
        y={top + 4}
        width={anchoRaja - 8}
        height={altoTotal - 8}
        fill="url(#metalGradient)"
        opacity={0.6}
      />

      {/* VIDRIO */}

      <rect
        x={x + hojaPadding}
        y={top + hojaPadding}
        width={anchoRaja - hojaPadding * 2}
        height={altoTotal - hojaPadding * 2}
        fill="#18181B"
      />

      <rect
        x={x + hojaPadding}
        y={top + hojaPadding}
        width={anchoRaja - hojaPadding * 2}
        height={altoTotal - hojaPadding * 2}
        fill="url(#glassPatagonica)"
      />

      {/* REFLEJO */}

      <polygon
        points={`
          ${x + hojaPadding},${top + hojaPadding}
          ${x + anchoRaja - hojaPadding},${top + hojaPadding}
          ${x + anchoRaja - hojaPadding - 40},${top + altoTotal - hojaPadding}
          ${x + hojaPadding},${top + altoTotal - hojaPadding}
        `}
        fill="rgba(255,255,255,0.04)"
      />

      {/* BISAGRAS */}

      <rect
        x={lado === "izquierda" ? x + 4 : x + anchoRaja - 8}
        y={top + 38}
        width={4}
        height={38}
        rx={2}
        fill="#2A2A2A"
      />

      <rect
        x={lado === "izquierda" ? x + 4 : x + anchoRaja - 8}
        y={top + altoTotal - 76}
        width={4}
        height={38}
        rx={2}
        fill="#2A2A2A"
      />

      {/* MANIJA */}

      <rect
        x={lado === "izquierda" ? x + anchoRaja - 13 : x + 8}
        y={top + altoTotal / 2 - 32}
        width={6}
        height={64}
        rx={999}
        fill="url(#handleGradient)"
      />
    </g>
  );
}

function Info({
  label,

  value,
}: {
  label: string;

  value: string;
}) {
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
          text-lime-400
        "
      >
        {value}
      </p>
    </div>
  );
}

export function PatagonicasPreview({ config }: Props) {
  const scale = calculateScale(config.ancho, config.alto, 320);

  const anchoTotal = config.ancho * scale;

  const altoTotal = config.alto * scale;

  const anchoRaja = Number(config.anchoRaja || 35) * scale;

  const anchoFijo =
    Number(config.cantidadRajas) === 1
      ? anchoTotal - anchoRaja
      : anchoTotal - anchoRaja * 2;

  const { left, top } = calculateCenter(anchoTotal, altoTotal, 500);

  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const esHerrero = config.linea === "Herrero";

  const frameWidth = esHerrero
    ? Math.max(10, anchoTotal * 0.03)
    : Math.max(6, anchoTotal * 0.02);

  const hojaPadding = frameWidth * 0.9;

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
          h-[520px]
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
            h-[500px]
            w-[500px]
            rounded-full
            bg-white/[0.03]
            blur-3xl
          "
        />

        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          className="
            relative
            z-10
            drop-shadow-[0_0_25px_rgba(0,0,0,0.45)]
          "
        >
          <defs>
            <linearGradient id="glassPatagonica" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />

              <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
            </linearGradient>

            <linearGradient
              id="metalGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />

              <stop offset="50%" stopColor="rgba(255,255,255,0)" />

              <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
            </linearGradient>

            <linearGradient id="handleGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111111" />

              <stop offset="50%" stopColor="#555555" />

              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>

          {/* PREMARCO */}

          {config.premarco && (
            <Premarco
              left={left}
              top={top}
              ancho={anchoTotal}
              alto={altoTotal}
            />
          )}

          {/* CONTRAMARCO */}

          {config.contramarco && (
            <Contramarco
              left={left}
              top={top}
              ancho={anchoTotal}
              alto={altoTotal}
              color={aluminioColor}
            />
          )}

          {/* MARCO */}

          <Marco
            left={left}
            top={top}
            ancho={anchoTotal}
            alto={altoTotal}
            color={aluminioColor}
            frameWidth={frameWidth}
          />

          {/* ===== 1 RAJA ===== */}

          {Number(config.cantidadRajas) === 1 && (
            <>
              <Raja
                x={left}
                top={top}
                anchoRaja={anchoRaja}
                altoTotal={altoTotal}
                hojaPadding={hojaPadding}
                lado="izquierda"
              />

              {/* PARANTE */}

              <rect
                x={left + anchoRaja - frameWidth / 2}
                y={top}
                width={frameWidth}
                height={altoTotal}
                fill={aluminioColor}
              />

              {/* PAÑO FIJO */}

              <rect
                x={left + anchoRaja}
                y={top}
                width={anchoFijo}
                height={altoTotal}
                fill="white"
              />

              <rect
                x={left + anchoRaja}
                y={top}
                width={anchoFijo}
                height={altoTotal}
                fill="url(#metalGradient)"
                opacity={0.55}
              />

              {/* VIDRIO */}

              <rect
                x={left + anchoRaja + hojaPadding}
                y={top + hojaPadding}
                width={anchoFijo - hojaPadding * 2}
                height={altoTotal - hojaPadding * 2}
                fill="#18181B"
              />

              <rect
                x={left + anchoRaja + hojaPadding}
                y={top + hojaPadding}
                width={anchoFijo - hojaPadding * 2}
                height={altoTotal - hojaPadding * 2}
                fill="url(#glassPatagonica)"
              />

              {/* REFLEJO */}

              <polygon
                points={`
                  ${left + anchoRaja + hojaPadding},${top + hojaPadding}
                  ${left + anchoTotal - hojaPadding},${top + hojaPadding}
                  ${left + anchoTotal - hojaPadding - 80},${top + altoTotal - hojaPadding}
                  ${left + anchoRaja + hojaPadding},${top + altoTotal - hojaPadding}
                `}
                fill="rgba(255,255,255,0.04)"
              />
            </>
          )}

          {/* ===== 2 RAJAS ===== */}

          {Number(config.cantidadRajas) === 2 && (
            <>
              <Raja
                x={left}
                top={top}
                anchoRaja={anchoRaja}
                altoTotal={altoTotal}
                hojaPadding={hojaPadding}
                lado="izquierda"
              />

              {/* PAÑO FIJO */}

              <rect
                x={left + anchoRaja}
                y={top}
                width={anchoFijo}
                height={altoTotal}
                fill="white"
              />

              <rect
                x={left + anchoRaja}
                y={top}
                width={anchoFijo}
                height={altoTotal}
                fill="url(#metalGradient)"
                opacity={0.55}
              />

              {/* VIDRIO */}

              <rect
                x={left + anchoRaja + hojaPadding}
                y={top + hojaPadding}
                width={anchoFijo - hojaPadding * 2}
                height={altoTotal - hojaPadding * 2}
                fill="#18181B"
              />

              <rect
                x={left + anchoRaja + hojaPadding}
                y={top + hojaPadding}
                width={anchoFijo - hojaPadding * 2}
                height={altoTotal - hojaPadding * 2}
                fill="url(#glassPatagonica)"
              />

              {/* RAJA DERECHA */}

              <Raja
                x={left + anchoTotal - anchoRaja}
                top={top}
                anchoRaja={anchoRaja}
                altoTotal={altoTotal}
                hojaPadding={hojaPadding}
                lado="derecha"
              />
            </>
          )}

          {/* COTAS */}

          <Cotas
            left={left}
            top={top}
            ancho={anchoTotal}
            alto={altoTotal}
            anchoReal={config.ancho}
            altoReal={config.alto}
          />
        </svg>
      </div>

      {/* INFO */}

      <div
        className="
          mt-4
          grid
          grid-cols-5
          gap-4
          border-t border-white/5
          pt-4
        "
      >
        <Info label="Línea" value={config.linea} />

        <Info label="Tipo" value={`${config.cantidadRajas} Raja`} />

        <Info label="Vidrio" value={config.tipoVidrio} />

        <Info label="Color" value={config.color} />

        <Info label="Medidas" value={`${config.ancho} × ${config.alto}`} />
      </div>
    </div>
  );
}
