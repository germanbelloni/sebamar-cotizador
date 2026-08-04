import type { VentanaConfig } from "../types";

import { Guide } from "../svg/Guide";
import { CortinaPVC } from "../svg/CortinaPVC";
import { CortinaAluminio } from "../svg/CortinaAluminio";
import { CajonBlock } from "../svg/CajonBlock";
import { Marco } from "../svg/Marco";
import { Premarco } from "../svg/Premarco";
import { Contramarco } from "../svg/Contramarco";
import { Vidrios3 } from "../svg/Vidrios3";
import { Hojas3 } from "../svg/Hojas3";
import { Mosquitero } from "../svg/Mosquitero";
import { Cierres } from "../svg/Cierres";
import { Cotas } from "../svg/Cotas";
import { RielInferior } from "../svg/RielInferior";
import { RielSuperior } from "../svg/RielSuperior";

import { MetalGradient } from "@/shared/svg/components/MetalGradient";
import { SVG_COLORS } from "@/shared/svg/constants/colors";
import { calculateScale } from "@/shared/svg/utils/calculateScale";
import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

type Props = {
  config: VentanaConfig;
};

export function VentanaPreview3Hojas({ config }: Props) {
  const escala = calculateScale(config.ancho, config.alto, 300);

  const ancho = config.ancho * escala;
  const alto = config.alto * escala;

  const { left, top } = calculateCenter(ancho, alto, 500);

  const esHerrero = config.linea === "Herrero";

  const frameWidth = esHerrero
    ? Math.max(9, ancho * 0.032)
    : Math.max(4, ancho * 0.015);

  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] ?? SVG_COLORS.blanco;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ventana</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} × {config.alto}
        </span>
      </div>

      <div
        className="
          relative
          mt-6
          flex
          h-[420px]
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border border-white/5
          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black
          p-6
        "
      >
        <div
          className="
            absolute
            h-[420px]
            w-[420px]
            rounded-full
            bg-white/[0.015]
            blur-3xl
          "
        />

        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          className="drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]"
        >
          <defs>
            <MetalGradient />

            <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>

            <linearGradient
              id="aluminumGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="20%" stopColor="rgba(255,255,255,0.10)" />
              <stop offset="50%" stopColor="rgba(0,0,0,0.10)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
            </linearGradient>
          </defs>
          {/* GUÍAS */}
          {config.guia && (
            <Guide
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              tieneCortina={Boolean(config.cortina)}
              tipoConstruccion={config.tipoConstruccion ?? "3_hojas_2_guias"}
            />
          )}
          {/* CORTINA PVC */}
          {config.cortina === "pvc" && (
            <CortinaPVC left={left} top={top} ancho={ancho} />
          )}
          {/* CORTINA ALUMINIO */}
          {config.cortina === "aluminio" && (
            <CortinaAluminio
              left={left}
              top={top}
              ancho={ancho}
              color={aluminioColor}
            />
          )}
          {/* CAJÓN BLOCK */}
          {config.cajonBlock && (
            <CajonBlock left={left} top={top} ancho={ancho} />
          )}
          {/* PREMARCO */}
          {config.premarco && (
            <Premarco left={left} top={top} ancho={ancho} alto={alto} />
          )}
          {/* CONTRAMARCO */}
          {config.contramarco && (
            <Contramarco
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
            />
          )}
          {/* MARCO */}
          <Marco
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
            frameWidth={frameWidth}
          />
          {/* RIELES */}
          <RielSuperior
            left={left}
            top={top}
            ancho={ancho}
            color={aluminioColor}
            esHerrero={esHerrero}
          />
          <RielInferior
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
          />
          {/* DIVISIONES */}
          {(() => {
            const x1 = left + ancho / 3;
            const x2 = left + (ancho / 3) * 2;

            const grosor = esHerrero ? 8 : 4;

            return (
              <>
                {/* División 1 */}

                <rect
                  x={x1 - grosor / 2}
                  y={top}
                  width={grosor}
                  height={alto}
                  fill={aluminioColor}
                  stroke="url(#aluminumGradient)"
                />

                <rect
                  x={x1 + 1}
                  y={top}
                  width={1}
                  height={alto}
                  fill="rgba(0,0,0,0.25)"
                />

                <rect
                  x={x1 - 2}
                  y={top}
                  width={1}
                  height={alto}
                  fill="rgba(255,255,255,0.12)"
                />

                {/* División 2 */}

                <rect
                  x={x2 - grosor / 2}
                  y={top}
                  width={grosor}
                  height={alto}
                  fill={aluminioColor}
                  stroke="url(#aluminumGradient)"
                />

                <rect
                  x={x2 + 1}
                  y={top}
                  width={1}
                  height={alto}
                  fill="rgba(0,0,0,0.25)"
                />

                <rect
                  x={x2 - 2}
                  y={top}
                  width={1}
                  height={alto}
                  fill="rgba(255,255,255,0.12)"
                />
              </>
            );
          })()}
          {/* VIDRIOS */}
          <Vidrios3
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            tipoVidrio={config.tipoVidrio}
          />
          {/* MOSQUITERO */}
          {config.mosquitero && (
            <Mosquitero left={left} top={top} ancho={ancho} alto={alto} />
          )}
          {/* HOJAS */}
          <Hojas3
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            strokeWidth={frameWidth / 2}
            esHerrero={esHerrero}
            tipoConstruccion={
              config.tipoConstruccion === "3_hojas_3_guias"
                ? "3_hojas_3_guias"
                : "3_hojas_2_guias"
            }
          />
          {/* CIERRES */}
          <Cierres
            centerX={left + ancho / 2}
            centerY={top + alto / 2}
            ancho={ancho}
            esHerrero={esHerrero}
          />
          {/* COTAS */}
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
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Línea: {config.linea}</span>

          <span>Color: {config.color}</span>
        </div>

        <div
          className="
            rounded-xl
            border border-border
            bg-background
            px-4
            py-3
            text-center
          "
        >
          <div className="text-base font-medium text-foreground">
            {config.ancho} × {config.alto} cm
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Ventana {config.ancho}x{config.alto}
          {" · "}
          {config.linea}
          {" · "}
          {config.color}
          {config.tipoVidrio && ` · ${config.tipoVidrio}`}
          {config.guia && " · guía"}
          {config.mosquitero && " · mosquitero"}
          {config.cajonBlock && " · cajón block"}
          {config.cortina === "pvc" && " · PVC"}
          {config.cortina === "aluminio" && " · cortina aluminio"}
          {config.premarco && " · premarco"}
          {config.contramarco && " · contramarco"}
        </div>
      </div>
    </div>
  );
}
