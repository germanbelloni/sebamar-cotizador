import { Button } from "@/components/ui/button";

import type { VentanaHerreroConfig } from "../types";

type Props = {
  config: VentanaHerreroConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanaHerreroConfig>>;
};

const colores = [
  {
    nombre: "Blanco",
    clase: "bg-white",
  },

  {
    nombre: "Negro",
    clase: "bg-black",
  },

  {
    nombre: "Bronce Colonial",
    clase: "bg-amber-700",
  },

  {
    nombre: "Simil Madera",
    clase: "bg-orange-900",
  },
] as const;

export function VentanaHerreroForm({ config, setConfig }: Props) {
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
            {colores.map((color) => {
              const selected = config.color === color.nombre;

              return (
                <button
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

        <Button className="w-full">Agregar al presupuesto</Button>
      </div>
    </div>
  );
}
