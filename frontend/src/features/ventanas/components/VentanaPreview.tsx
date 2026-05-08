import type { VentanaHerreroConfig } from "../types";

import { Guide } from "../svg/Guide";
import { CortinaPVC } from "../svg/CortinaPVC";
import { CortinaAluminio } from "../svg/CortinaAluminio";
import { CajonBlock } from "../svg/CajonBlock";
import { Marco } from "../svg/Marco";
import { Premarco } from "../svg/Premarco";
import { Contramarco } from "../svg/Contramarco";
import { Vidrios } from "../svg/Vidrios";
import { Hojas } from "../svg/Hojas";
import { Mosquitero } from "../svg/Mosquitero";
import { Cierres } from "../svg/Cierres";
import { Cotas } from "../svg/Cotas";
import { RielInferior } from "../svg/RielInferior";

type Props = {
  config: VentanaHerreroConfig;
};
export function VentanaPreview({ config }: Props) {
  const maxSize = 260;

  const mayorMedida = Math.max(config.ancho, config.alto);

  const escala = maxSize / mayorMedida;

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  const left = 250 - ancho / 2;

  const top = 250 - alto / 2;

  const centerX = 250;

  const esHerrero = config.linea === "Herrero";

  const frameWidth = esHerrero
    ? Math.max(9, ancho * 0.032)
    : Math.max(4, ancho * 0.015);

  const colorMap = {
    Blanco: "#E4E4E7",
    Negro: "#18181B",
    "Bronce Colonial": "#2e411f",
    "Simil Madera": "#7C2D12",
  };

  const aluminioColor = colorMap[config.color];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} x {config.alto}
        </span>
      </div>

      <div className="mt-6 flex h-[500px] items-center justify-center rounded-2xl border border-border bg-zinc-950 p-6 transition-all duration-300">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
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

            <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />

              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>
          </defs>

          {/* GUIA */}

          {config.guia && (
            <Guide left={left} top={top} ancho={ancho} alto={alto} />
          )}

          {/* CORTINA PVC */}

          {config.cortinaPVC && (
            <CortinaPVC left={left} top={top} ancho={ancho} />
          )}

          {/* CORTINA ALUMINIO */}

          {config.cortinaAluminio && (
            <CortinaAluminio
              left={left}
              top={top}
              ancho={ancho}
              color={aluminioColor}
            />
          )}

          {/* CAJON BLOCK */}

          {config.cajonBlock && (
            <CajonBlock left={left} top={top} ancho={ancho} />
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

          <RielInferior
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
          />

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

          {/* DIVISION CENTRAL */}

          <rect
            x={centerX - (esHerrero ? 4 : 2)}
            y={top}
            width={esHerrero ? 8 : 4}
            height={alto}
            fill={aluminioColor}
          />

          {/* SOMBRA */}

          <rect
            x={centerX + 1}
            y={top}
            width={1}
            height={alto}
            fill="rgba(0,0,0,0.25)"
          />

          {/* BRILLO */}

          <rect
            x={centerX - 2}
            y={top}
            width={1}
            height={alto}
            fill="rgba(255,255,255,0.12)"
          />

          {/* VIDRIOS */}

          <Vidrios left={left} top={top} ancho={ancho} alto={alto} />

          {/* MOSQUITERO */}

          {config.mosquitero && (
            <Mosquitero left={left} top={top} ancho={ancho} alto={alto} />
          )}

          {/* HOJAS */}

          <Hojas
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            strokeWidth={frameWidth / 2}
            esHerrero={esHerrero}
          />

          {/* CIERRES */}

          <Cierres centerX={centerX} ancho={ancho} esHerrero={esHerrero} />

          {/* COTAS */}

          <Cotas
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            medidaAncho={config.ancho}
            medidaAlto={config.alto}
          />
        </svg>
      </div>

      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Línea: {config.linea}</span>

          <span>Color: {config.color}</span>
        </div>

        <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
          <div className="text-base font-medium text-foreground">
            {config.ancho} × {config.alto} cm
          </div>

          {(config.cajonBlock || config.cortinaPVC) && (
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              {config.cajonBlock && (
                <>
                  <div>+8 cm ancho cajón block</div>

                  <div>+20 cm alto cajón block</div>
                </>
              )}

              {config.cortinaPVC && <div>+17 cm PVC</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
