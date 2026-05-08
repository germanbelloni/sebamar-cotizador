import { Button } from "@/components/ui/button";

import { coloresVentana } from "../constants";

import type { VentanaHerreroConfig } from "../types";

type Props = {
  config: VentanaHerreroConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanaHerreroConfig>>;
};
export function VentanaConfigForm({ config, setConfig }: Props) {
  const toggleField = (field: keyof VentanaHerreroConfig) => {
    setConfig((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Configuración</h3>

      <div className="mt-6 space-y-6">
        {/* LINEA */}

        <div>
          <label className="mb-3 block text-sm text-muted-foreground">
            Línea
          </label>

          <div className="flex gap-3">
            <Button
              variant={config.linea === "Herrero" ? "default" : "outline"}
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  linea: "Herrero",
                }))
              }
            >
              Herrero
            </Button>

            <Button
              variant={config.linea === "Modena" ? "default" : "outline"}
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  linea: "Modena",
                }))
              }
            >
              Modena
            </Button>
          </div>
        </div>

        {/* MEDIDAS */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Ancho
            </label>

            <input
              type="number"
              value={config.ancho}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  ancho: Number(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Alto
            </label>

            <input
              type="number"
              value={config.alto}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  alto: Number(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-2"
            />
          </div>
        </div>

        {/* COLORES */}

        <div>
          <label className="mb-3 block text-sm text-muted-foreground">
            Color
          </label>

          <div className="flex flex-wrap gap-4">
            {coloresVentana.map((color) => {
              const selected = config.color === color.nombre;

              return (
                <button
                  type="button"
                  key={color.nombre}
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      color: color.nombre,
                    }))
                  }
                  className={`
                    flex items-center gap-3 rounded-xl border px-3 py-2 transition-all
                    ${
                      selected
                        ? "border-green-500 bg-green-500/10"
                        : "border-border"
                    }
                  `}
                >
                  <div
                    className={`
                      h-6 w-6 rounded-full border border-white/20
                      ${color.clase}
                    `}
                  />

                  <span className="text-sm">{color.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* EXTRAS */}

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Extras</h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toggleField("mosquitero")}
              className={`
                rounded-xl border p-3 text-left transition-all
                ${
                  config.mosquitero
                    ? "border-green-500 bg-green-500/10"
                    : "border-border"
                }
              `}
            >
              Mosquitero
            </button>

            <button
              type="button"
              onClick={() =>
                setConfig((prev) => {
                  const nuevaGuia = !prev.guia;

                  return {
                    ...prev,

                    guia: nuevaGuia,

                    cajonBlock: false,

                    cortinaPVC: nuevaGuia ? prev.cortinaPVC : false,

                    cortinaAluminio: nuevaGuia ? prev.cortinaAluminio : false,
                  };
                })
              }
              className={`
                rounded-xl border p-3 text-left transition-all
                ${
                  config.guia
                    ? "border-green-500 bg-green-500/10"
                    : "border-border"
                }
              `}
            >
              Guía
            </button>

            <button
              type="button"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,

                  cajonBlock: !prev.cajonBlock,

                  guia: false,

                  cortinaPVC: false,

                  cortinaAluminio: false,
                }))
              }
              className={`
                rounded-xl border p-3 text-left transition-all
                ${
                  config.cajonBlock
                    ? "border-green-500 bg-green-500/10"
                    : "border-border"
                }
              `}
            >
              Cajón Block
            </button>
          </div>

          {/* CORTINAS */}

          {config.guia && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Cortina
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={config.color !== "Blanco"}
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,

                      cortinaPVC: !prev.cortinaPVC,

                      cortinaAluminio: false,
                    }))
                  }
                  className={`
    rounded-xl border p-3 text-left transition-all

    ${config.cortinaPVC ? "border-green-500 bg-green-500/10" : "border-border"}

    ${config.color !== "Blanco" ? "cursor-not-allowed opacity-40" : ""}
  `}
                >
                  PVC
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,

                      cortinaAluminio: !prev.cortinaAluminio,

                      cortinaPVC: false,
                    }))
                  }
                  className={`
    rounded-xl border p-3 text-left transition-all

    ${
      config.cortinaAluminio
        ? "border-green-500 bg-green-500/10"
        : "border-border"
    }
  `}
                >
                  Aluminio
                </button>
              </div>
            </div>
          )}

          {/* MODENA */}

          {config.linea === "Modena" && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Modena
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* PREMARCO */}

                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => {
                      const nuevoPremarco = !prev.premarco;

                      return {
                        ...prev,

                        premarco: nuevoPremarco,

                        contramarco: nuevoPremarco ? true : prev.contramarco,
                      };
                    })
                  }
                  className={`
          rounded-xl border p-3 text-left transition-all

          ${
            config.premarco
              ? "border-green-500 bg-green-500/10"
              : "border-border"
          }
        `}
                >
                  Premarco
                </button>

                {/* CONTRAMARCO */}

                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,

                      contramarco: !prev.contramarco,
                    }))
                  }
                  className={`
          rounded-xl border p-3 text-left transition-all

          ${
            config.contramarco
              ? "border-green-500 bg-green-500/10"
              : "border-border"
          }
        `}
                >
                  Contramarco
                </button>
              </div>
            </div>
          )}
        </div>

        <Button className="w-full">Agregar al presupuesto</Button>
      </div>
    </div>
  );
}
