import type { PuertasPlacaConfig } from "../types";

import {
  getPuertaPlacaMarcoLabel,
  getPuertaPlacaModeloLabel,
  getPuertaPlacaTipoLabel,
} from "../utils/display";

import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

import { calculateScale } from "@/shared/svg/utils/calculateScale";

type Props = {
  config: PuertasPlacaConfig;
};

export function PuertasPlacaPreview({ config }: Props) {
  const esEmbutir = config.tipo === "embutir";

  const esGranero = config.tipo === "granero";

  const graneroEsZ = config.modelo === "granero_z";

  const graneroEsAluminio =
    config.modelo === "granero_aluminio" ||
    config.modelo === "granero_aluminio_sin_herrajes";

  const graneroSinHerrajes = config.modelo === "granero_aluminio_sin_herrajes";

  const abreIzquierda = config.mano === "izquierda";

  const esAluminio = config.marco === "aluminio";

  const anchoVisual = config.ancho;

  const escala = calculateScale(anchoVisual, config.alto, 380);

  const ancho = anchoVisual * escala;

  const alto = config.alto * escala;

  const { left, top } = calculateCenter(ancho, alto, 500);

  const tipoLabel = getPuertaPlacaTipoLabel(config.tipo);

  const modeloLabel = getPuertaPlacaModeloLabel(config.modelo);

  const marcoLabel = esGranero
    ? "Sistema granero"
    : esAluminio
      ? "Marco aluminio blanco"
      : getPuertaPlacaMarcoLabel(config.marco);

  return (
    <div
      className="
        rounded-2xl
        border border-border

        bg-card

        p-6

        transition-all duration-300
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Puerta placa</h3>

          <p className="mt-1 text-sm text-muted-foreground">{tipoLabel}</p>
        </div>

        <div
          className="
            rounded-full

            border border-white/10

            bg-white/[0.03]

            px-4 py-1.5

            text-sm
            text-white/70
          "
        >
          {config.ancho} × {config.alto}
        </div>
      </div>

      {/* VISUAL */}

      <div
        className="
          relative overflow-hidden

          mt-6
          flex h-[440px]

          items-center
          justify-center

          rounded-2xl

          border border-white/5

          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black

          p-6
        "
      >
        {/* LIGHT */}

        <div
          className="
            absolute inset-0

            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]
          "
        />

        {/* SHADOW */}

        <div
          className="
            absolute bottom-10

            h-12
            w-[240px]

            rounded-full

            bg-black/50

            blur-2xl
          "
        />

        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          className="
            relative z-10

            drop-shadow-[0_25px_40px_rgba(0,0,0,0.55)]
          "
        >
          <defs>
            {/* MADERA */}

            <linearGradient id="woodGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6B4E3B" />

              <stop offset="50%" stopColor="#87624B" />

              <stop offset="100%" stopColor="#533B2E" />
            </linearGradient>

            {/* ALUMINIO */}

            <linearGradient id="aluminumGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E5E5E5" />

              <stop offset="50%" stopColor="#CFCFCF" />

              <stop offset="100%" stopColor="#A8A8A8" />
            </linearGradient>

            {/* MARCO */}

            <linearGradient id="frameGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#343434" />

              <stop offset="100%" stopColor="#171717" />
            </linearGradient>

            {/* BRILLO */}

            <linearGradient id="shineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />

              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* GRANERO */}

          {esGranero && !graneroSinHerrajes && (
            <>
              {/* GUIA SUPERIOR */}

              <rect
                x={left - 55}
                y={top - 18}
                width={ancho + 110}
                height={10}
                rx={999}
                fill="#050505"
              />

              {/* SOPORTES */}

              <rect
                x={left + 22}
                y={top - 10}
                width={6}
                height={24}
                rx={999}
                fill="#121212"
              />

              <rect
                x={left + ancho - 28}
                y={top - 10}
                width={6}
                height={24}
                rx={999}
                fill="#121212"
              />

              {/* RUEDAS */}

              <circle cx={left + 25} cy={top - 14} r={10} fill="#0F0F0F" />

              <circle
                cx={left + ancho - 25}
                cy={top - 14}
                r={10}
                fill="#0F0F0F"
              />

              {/* CENTRO RUEDAS */}

              <circle
                cx={left + 25}
                cy={top - 14}
                r={3}
                fill="rgba(255,255,255,0.12)"
              />

              <circle
                cx={left + ancho - 25}
                cy={top - 14}
                r={3}
                fill="rgba(255,255,255,0.12)"
              />
            </>
          )}

          {/* EMBUTIR */}

          {esEmbutir && (
            <>
              {/* CAJON */}

              <rect
                x={abreIzquierda ? left - ancho : left + ancho}
                y={top}
                width={ancho}
                height={alto}
                rx={8}
                fill="#171717"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={2}
              />

              {/* GUIA SUPERIOR */}

              <rect
                x={abreIzquierda ? left - ancho : left}
                y={top - 10}
                width={ancho * 2}
                height={6}
                rx={999}
                fill="rgba(255,255,255,0.08)"
              />
            </>
          )}

          {/* MARCO */}

          {!esGranero && (
            <rect
              x={left}
              y={top}
              width={ancho}
              height={alto}
              rx={8}
              fill={
                esAluminio ? "url(#aluminumGradient)" : "url(#frameGradient)"
              }
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={4}
            />
          )}

          {/* HOJA */}

          <rect
            x={left + 10}
            y={top + 10}
            width={ancho - 20}
            height={alto - 20}
            rx={6}
            fill={
              esGranero && graneroEsAluminio
                ? "url(#aluminumGradient)"
                : "url(#woodGradient)"
            }
          />

          {/* VETAS */}

          {!(esGranero && graneroEsAluminio) &&
            Array.from({
              length: 10,
            }).map((_, index) => (
              <rect
                key={index}
                x={left + 22 + index * 16}
                y={top + 16}
                width={2}
                height={alto - 32}
                fill="rgba(255,255,255,0.045)"
              />
            ))}

          {/* Z GRANERO */}

          {esGranero && graneroEsZ && (
            <>
              <line
                x1={left + 24}
                y1={top + 30}
                x2={left + ancho - 24}
                y2={top + alto - 30}
                stroke="rgba(35,20,10,0.55)"
                strokeWidth={8}
                strokeLinecap="round"
              />

              <line
                x1={left + 24}
                y1={top + 30}
                x2={left + ancho - 24}
                y2={top + 30}
                stroke="rgba(35,20,10,0.55)"
                strokeWidth={8}
                strokeLinecap="round"
              />

              <line
                x1={left + 24}
                y1={top + alto - 30}
                x2={left + ancho - 24}
                y2={top + alto - 30}
                stroke="rgba(35,20,10,0.55)"
                strokeWidth={8}
                strokeLinecap="round"
              />
            </>
          )}

          {/* BRILLO */}

          <rect
            x={left + 16}
            y={top + 16}
            width={18}
            height={alto - 32}
            fill="url(#shineGradient)"
            opacity={0.7}
          />

          {!esGranero && (
            <rect
              x={abreIzquierda ? left + ancho - 28 : left + 18}
              y={top + alto / 2 - 24}
              width={8}
              height={48}
              rx={999}
              fill="#D8D8D8"
            />
          )}
        </svg>
      </div>

      {/* INFO */}

      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="
              rounded-xl
              border border-white/5

              bg-white/[0.03]

              px-4 py-3
            "
          >
            <div className="text-xs text-white/45">Sistema</div>

            <div className="mt-1 text-sm font-medium text-white/85">
              {marcoLabel}
            </div>
          </div>

          {!esGranero && (
            <div
              className="
      rounded-xl
      border border-white/5
      bg-white/[0.03]
      px-4 py-3
    "
            >
              <div className="text-xs text-white/45">Mano</div>

              <div className="mt-1 text-sm font-medium text-white/85 capitalize">
                {config.mano}
              </div>
            </div>
          )}
        </div>

        <div
          className="
            rounded-xl
            border border-white/5

            bg-white/[0.03]

            px-4 py-3
          "
        >
          <div className="text-xs text-white/45">Modelo</div>

          <div className="mt-1 text-sm font-medium text-white/85">
            {modeloLabel}
          </div>
        </div>

        <div className="text-center text-xs text-white/35">
          {config.ancho} × {config.alto} cm
          {" · "}
          {tipoLabel}
          {config.fueraDeMedida && " · fuera de medida"}
        </div>
      </div>
    </div>
  );
}
