import type { PatagonicasConfig } from "../types";

import { Guide } from "@/features/ventanas/svg/Guide";
import { CajonBlock } from "@/features/ventanas/svg/CajonBlock";
import { CortinaPVC } from "@/features/ventanas/svg/CortinaPVC";
import { CortinaAluminio } from "@/features/ventanas/svg/CortinaAluminio";
import { Premarco } from "@/features/ventanas/svg/Premarco";
import { Contramarco } from "@/features/ventanas/svg/Contramarco";
import { Marco } from "@/features/ventanas/svg/Marco";
import { Cotas } from "@/features/ventanas/svg/Cotas";

import { MetalGradient } from "@/shared/svg/components/MetalGradient";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

import { calculateScale } from "@/shared/svg/utils/calculateScale";
import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

type Props = {
  config: PatagonicasConfig;
};

type GlassPanelProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  tipoVidrio: PatagonicasConfig["tipoVidrio"];
};

function GlassPanel({ x, y, width, height, tipoVidrio }: GlassPanelProps) {
  const esDVH = tipoVidrio.includes("DVH");

  const esLaminado = tipoVidrio === "3+3" || tipoVidrio === "4+4";

  const strokeVidrio = esDVH
    ? "rgba(220,220,220,0.34)"
    : esLaminado
      ? "rgba(125,211,252,0.28)"
      : "rgba(255,255,255,0.12)";

  const fillVidrio = esDVH
    ? "url(#glassDvhGradient)"
    : esLaminado
      ? "url(#glassLaminadoGradient)"
      : "url(#glassGradient)";

  return (
    <g>
      <rect
        x={x + 2}
        y={y + 4}
        width={Math.max(0, width)}
        height={Math.max(0, height)}
        rx={2}
        fill="rgba(0,0,0,0.22)"
      />

      <rect
        x={x}
        y={y}
        width={Math.max(0, width)}
        height={Math.max(0, height)}
        rx={2}
        fill={fillVidrio}
        filter="url(#glassGlow)"
        stroke={strokeVidrio}
        strokeWidth={esDVH ? 2 : 1.2}
        className="transition-all duration-300"
      />

      {esDVH && (
        <>
          <rect
            x={x + 6}
            y={y + 6}
            width={Math.max(0, width - 12)}
            height={Math.max(0, height - 12)}
            rx={1}
            fill="none"
            stroke="rgba(220,220,220,0.22)"
            strokeWidth={1.5}
          />

          <rect
            x={x + 11}
            y={y + 11}
            width={Math.max(0, width - 22)}
            height={Math.max(0, height - 22)}
            rx={1}
            fill="rgba(0,0,0,0.10)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        </>
      )}

      <rect
        x={x + 6}
        y={y + 6}
        width={Math.max(0, width - 12)}
        height={2}
        fill="rgba(255,255,255,0.14)"
        opacity={0.9}
      />
    </g>
  );
}

type RajaProps = {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  ladoBisagra: "izquierda" | "derecha";
  aluminioColor: string;
  esHerrero: boolean;
  mosquitero: boolean;
  tipoVidrio: PatagonicasConfig["tipoVidrio"];
};

function Raja({
  x,
  y,
  ancho,
  alto,
  ladoBisagra,
  aluminioColor,
  esHerrero,
  mosquitero,
  tipoVidrio,
}: RajaProps) {
  const hojaPadding = esHerrero ? 15 : 12;

  const vidrioPadding = esHerrero ? 14 : 12;

  const frameWidth = esHerrero
    ? Math.max(8, ancho * 0.08)
    : Math.max(5, ancho * 0.045);

  const hojaX = x + hojaPadding;

  const hojaY = y + hojaPadding;

  const hojaAncho = Math.max(0, ancho - hojaPadding * 2);

  const hojaAlto = Math.max(0, alto - hojaPadding * 2);

  const vidrioX = hojaX + vidrioPadding;

  const vidrioY = hojaY + vidrioPadding;

  const vidrioAncho = Math.max(0, hojaAncho - vidrioPadding * 2);

  const vidrioAlto = Math.max(0, hojaAlto - vidrioPadding * 2);

  const bisagraX =
    ladoBisagra === "izquierda"
      ? hojaX + hojaAncho - frameWidth / 2
      : hojaX - frameWidth / 2;

  const manijaX = ladoBisagra === "izquierda" ? x + 12 : x + ancho - 22;

  const aperturaPath =
    ladoBisagra === "izquierda"
      ? `
        M ${x + 13} ${y + 18}
        L ${x + ancho - 28} ${y + alto / 2}
        L ${x + 13} ${y + alto - 18}
      `
      : `
        M ${x + ancho - 13} ${y + 18}
        L ${x + 28} ${y + alto / 2}
        L ${x + ancho - 13} ${y + alto - 18}
      `;

  return (
    <g>
      <rect
        x={hojaX + 2}
        y={hojaY + 3}
        width={hojaAncho}
        height={hojaAlto}
        fill="none"
        stroke="rgba(0,0,0,0.26)"
        strokeWidth={frameWidth + 1}
        opacity={0.75}
      />

      <rect
        x={hojaX}
        y={hojaY}
        width={hojaAncho}
        height={hojaAlto}
        fill="rgba(255,255,255,0.025)"
        stroke={aluminioColor}
        strokeWidth={frameWidth}
        strokeLinejoin="round"
        className="transition-all duration-300"
      />

      <rect
        x={hojaX}
        y={hojaY}
        width={hojaAncho}
        height={hojaAlto}
        fill="none"
        stroke="url(#aluminumGradient)"
        strokeWidth={Math.max(1, frameWidth - 1)}
        strokeLinejoin="round"
        opacity={0.92}
      />

      <rect
        x={hojaX + frameWidth / 2}
        y={hojaY + frameWidth / 2}
        width={Math.max(0, hojaAncho - frameWidth)}
        height={Math.max(0, hojaAlto - frameWidth)}
        fill="none"
        stroke="rgba(0,0,0,0.24)"
        strokeWidth={2}
      />

      <GlassPanel
        x={vidrioX}
        y={vidrioY}
        width={vidrioAncho}
        height={vidrioAlto}
        tipoVidrio={tipoVidrio}
      />

      {mosquitero && (
        <rect
          x={vidrioX}
          y={vidrioY}
          width={vidrioAncho}
          height={vidrioAlto}
          fill="url(#mosquiteroPattern)"
          opacity={0.28}
        />
      )}

      <rect
        x={bisagraX}
        y={y + 35}
        width={7}
        height={36}
        rx={1.5}
        fill="#18181B"
      />

      <rect
        x={bisagraX + 1}
        y={y + 38}
        width={1}
        height={30}
        fill="rgba(255,255,255,0.24)"
      />

      <rect
        x={bisagraX}
        y={y + alto - 71}
        width={7}
        height={36}
        rx={1.5}
        fill="#18181B"
      />

      <rect
        x={bisagraX + 1}
        y={y + alto - 68}
        width={1}
        height={30}
        fill="rgba(255,255,255,0.24)"
      />

      <g transform={`translate(${manijaX}, ${y + alto / 2 - 24})`}>
        <rect x={0} y={0} width={10} height={48} rx={2} fill="#18181B" />

        <rect
          x={2}
          y={3}
          width={1.5}
          height={42}
          fill="rgba(255,255,255,0.22)"
        />

        <path
          d={
            ladoBisagra === "izquierda"
              ? `
                M 5 15
                L -10 15
                Q -16 15 -16 22
                L -16 42
              `
              : `
                M 5 15
                L 20 15
                Q 26 15 26 22
                L 26 42
              `
          }
          fill="none"
          stroke="#18181B"
          strokeWidth={6}
          strokeLinecap="round"
        />

        <path
          d={
            ladoBisagra === "izquierda"
              ? `
                M 2 13
                L -10 13
              `
              : `
                M 8 13
                L 20 13
              `
          }
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </g>

      <path
        d={aperturaPath}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
    </g>
  );
}

type FixedPanelProps = {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  aluminioColor: string;
  esHerrero: boolean;
  tipoVidrio: PatagonicasConfig["tipoVidrio"];
};

function FixedPanel({
  x,
  y,
  ancho,
  alto,
  aluminioColor,
  esHerrero,
  tipoVidrio,
}: FixedPanelProps) {
  const padding = esHerrero ? 18 : 15;

  const vidrioPadding = esHerrero ? 14 : 12;

  const frameWidth = esHerrero
    ? Math.max(8, ancho * 0.04)
    : Math.max(5, ancho * 0.025);

  const panelX = x + padding;

  const panelY = y + padding;

  const panelAncho = Math.max(0, ancho - padding * 2);

  const panelAlto = Math.max(0, alto - padding * 2);

  return (
    <g>
      <rect
        x={panelX + 2}
        y={panelY + 3}
        width={panelAncho}
        height={panelAlto}
        fill="none"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth={frameWidth + 1}
        opacity={0.75}
      />

      <rect
        x={panelX}
        y={panelY}
        width={panelAncho}
        height={panelAlto}
        fill="rgba(255,255,255,0.018)"
        stroke={aluminioColor}
        strokeWidth={frameWidth}
        className="transition-all duration-300"
      />

      <rect
        x={panelX}
        y={panelY}
        width={panelAncho}
        height={panelAlto}
        fill="none"
        stroke="url(#aluminumGradient)"
        strokeWidth={Math.max(1, frameWidth - 1)}
        opacity={0.88}
      />

      <rect
        x={panelX + frameWidth / 2}
        y={panelY + frameWidth / 2}
        width={Math.max(0, panelAncho - frameWidth)}
        height={Math.max(0, panelAlto - frameWidth)}
        fill="none"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth={2}
      />

      <GlassPanel
        x={panelX + vidrioPadding}
        y={panelY + vidrioPadding}
        width={Math.max(0, panelAncho - vidrioPadding * 2)}
        height={Math.max(0, panelAlto - vidrioPadding * 2)}
        tipoVidrio={tipoVidrio}
      />
    </g>
  );
}

export function PatagonicasPreview({ config }: Props) {
  const escala = calculateScale(config.ancho, config.alto, 300);

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  const { left, top } = calculateCenter(ancho, alto, 500);

  const esHerrero = config.linea === "Herrero";

  const frameWidth = esHerrero
    ? Math.max(9, ancho * 0.032)
    : Math.max(4, ancho * 0.015);

  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const separacion = esHerrero ? 10 : 8;

  const anchoRajaValue =
    typeof config.anchoRaja === "number" ? config.anchoRaja : 40;

  const anchoRaja = Math.min(anchoRajaValue * escala, ancho * 0.42);

  const rajaIzquierda = config.ladoApertura === "izquierda";

  const anchoFijo =
    config.tipo === "2_rajas"
      ? Math.max(0, ancho - anchoRaja * 2 - separacion * 2)
      : Math.max(0, ancho - anchoRaja - separacion);

  const rajaX = rajaIzquierda ? left : left + anchoFijo + separacion;

  const fijoX =
    config.tipo === "2_rajas"
      ? left + anchoRaja + separacion
      : rajaIzquierda
        ? left + anchoRaja + separacion
        : left;

  const segundaRajaX = left + anchoRaja + separacion + anchoFijo + separacion;

  const separador1X =
    config.tipo === "2_rajas"
      ? left + anchoRaja + separacion / 2
      : rajaIzquierda
        ? fijoX - separacion / 2
        : rajaX - separacion / 2;

  const separador2X =
    left + anchoRaja + separacion + anchoFijo + separacion / 2;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Patagónica</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} × {config.alto}
        </span>
      </div>

      <div className="relative mt-6 flex h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6 transition-all duration-300">
        <div className="absolute h-[420px] w-[420px] rounded-full bg-white/[0.015] blur-3xl" />

        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          className="drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]"
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
                stroke="#D4D4D8"
                strokeWidth="0.5"
              />
            </pattern>

            <MetalGradient />

            <filter id="glassGlow">
              <feGaussianBlur stdDeviation="0.6" result="blur" />

              <feMerge>
                <feMergeNode in="blur" />

                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />

              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>

            <linearGradient
              id="glassLaminadoGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="rgba(125,211,252,0.28)" />

              <stop offset="100%" stopColor="rgba(30,64,175,0.16)" />
            </linearGradient>

            <linearGradient id="glassDvhGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(113,113,122,0.42)" />

              <stop offset="45%" stopColor="rgba(39,39,42,0.34)" />

              <stop offset="100%" stopColor="rgba(10,10,12,0.26)" />
            </linearGradient>

            <linearGradient
              id="aluminumGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />

              <stop offset="20%" stopColor="rgba(255,255,255,0.11)" />

              <stop offset="50%" stopColor="rgba(0,0,0,0.12)" />

              <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
            </linearGradient>
          </defs>

          {config.guia && (
            <Guide
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              tieneCortina={Boolean(config.cortina)}
            />
          )}

          {config.cortina === "pvc" && (
            <CortinaPVC left={left} top={top} ancho={ancho} />
          )}

          {config.cortina === "aluminio" && (
            <CortinaAluminio
              left={left}
              top={top}
              ancho={ancho}
              color={aluminioColor}
            />
          )}

          {config.cajonBlock && (
            <CajonBlock left={left} top={top} ancho={ancho} />
          )}

          {config.premarco && (
            <Premarco left={left} top={top} ancho={ancho} alto={alto} />
          )}

          {config.contramarco && (
            <Contramarco
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
            />
          )}

          <Marco
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
            frameWidth={frameWidth}
          />

          {config.tipo === "1_raja" && (
            <>
              <rect
                x={separador1X}
                y={top + 6}
                width={esHerrero ? 8 : 6}
                height={alto - 12}
                rx={2}
                fill={aluminioColor}
                stroke="url(#aluminumGradient)"
                opacity={0.95}
              />

              <rect
                x={separador1X + 1}
                y={top + 10}
                width={esHerrero ? 2 : 1.5}
                height={alto - 20}
                fill="rgba(255,255,255,0.25)"
                opacity={0.9}
              />

              <Raja
                x={rajaX}
                y={top}
                ancho={anchoRaja}
                alto={alto}
                ladoBisagra={config.bisagraRaja1}
                aluminioColor={aluminioColor}
                esHerrero={esHerrero}
                mosquitero={config.mosquitero}
                tipoVidrio={config.tipoVidrio}
              />

              <FixedPanel
                x={fijoX}
                y={top}
                ancho={anchoFijo}
                alto={alto}
                aluminioColor={aluminioColor}
                esHerrero={esHerrero}
                tipoVidrio={config.tipoVidrio}
              />
            </>
          )}

          {config.tipo === "2_rajas" && (
            <>
              <rect
                x={separador1X}
                y={top + 6}
                width={esHerrero ? 8 : 6}
                height={alto - 12}
                rx={2}
                fill={aluminioColor}
                stroke="url(#aluminumGradient)"
                opacity={0.95}
              />

              <rect
                x={separador1X + 1}
                y={top + 10}
                width={esHerrero ? 2 : 1.5}
                height={alto - 20}
                fill="rgba(255,255,255,0.25)"
                opacity={0.9}
              />

              <rect
                x={separador2X}
                y={top + 6}
                width={esHerrero ? 8 : 6}
                height={alto - 12}
                rx={2}
                fill={aluminioColor}
                stroke="url(#aluminumGradient)"
                opacity={0.95}
              />

              <rect
                x={separador2X + 1}
                y={top + 10}
                width={esHerrero ? 2 : 1.5}
                height={alto - 20}
                fill="rgba(255,255,255,0.25)"
                opacity={0.9}
              />

              <Raja
                x={left}
                y={top}
                ancho={anchoRaja}
                alto={alto}
                ladoBisagra={config.bisagraRaja1}
                aluminioColor={aluminioColor}
                esHerrero={esHerrero}
                mosquitero={config.mosquitero}
                tipoVidrio={config.tipoVidrio}
              />

              <FixedPanel
                x={fijoX}
                y={top}
                ancho={anchoFijo}
                alto={alto}
                aluminioColor={aluminioColor}
                esHerrero={esHerrero}
                tipoVidrio={config.tipoVidrio}
              />

              <Raja
                x={segundaRajaX}
                y={top}
                ancho={anchoRaja}
                alto={alto}
                ladoBisagra={config.bisagraRaja2}
                aluminioColor={aluminioColor}
                esHerrero={esHerrero}
                mosquitero={config.mosquitero}
                tipoVidrio={config.tipoVidrio}
              />
            </>
          )}

          <Cotas
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            anchoReal={config.ancho}
            altoReal={config.alto}
          />
        </svg>
      </div>
    </div>
  );
}
