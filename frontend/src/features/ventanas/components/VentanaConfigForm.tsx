import { useState } from "react";

import { Button } from "@/components/ui/button";

import { LIMITES_LINEA } from "../constants";
import { coloresVentana } from "../constants";

import { buildVentanaItem } from "../utils/buildVentanaItem";

import type { VentanaConfig, VentanaItem } from "../types";

type Props = {
  config: VentanaConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanaConfig>>;

  setItems: React.Dispatch<React.SetStateAction<VentanaItem[]>>;
};

export function VentanaConfigForm({ config, setConfig, setItems }: Props) {
  const limites = LIMITES_LINEA[config.linea];

  /* INPUT STATES */

  const [anchoInput, setAnchoInput] = useState(String(config.ancho));

  const [altoInput, setAltoInput] = useState(String(config.alto));

  /* HELPERS */

  const toggleField = (field: keyof VentanaConfig) => {
    setConfig((prev) => ({
      ...prev,

      [field]: !prev[field],
    }));
  };

  const handleAddToBudget = () => {
    const item = buildVentanaItem(config);

    setItems((prev) => [...prev, item]);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Configuración</h3>

      <div className="mt-6 space-y-6">
        {/* LINEA */}

        <div>
          <label
            className="
              mb-3 block text-center
              text-sm text-muted-foreground
            "
          >
            Línea
          </label>

          <div className="flex justify-center gap-3">
            <Button
              variant={config.linea === "Herrero" ? "default" : "outline"}
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,

                  linea: "Herrero",

                  ancho: Math.min(prev.ancho, LIMITES_LINEA.Herrero.anchoMax),

                  alto: Math.min(prev.alto, LIMITES_LINEA.Herrero.altoMax),
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

                  ancho: Math.min(prev.ancho, LIMITES_LINEA.Modena.anchoMax),

                  alto: Math.min(prev.alto, LIMITES_LINEA.Modena.altoMax),
                }))
              }
            >
              Modena
            </Button>
          </div>
        </div>

        {/* MEDIDAS */}

        <div className="grid grid-cols-2 gap-4">
          {/* ANCHO */}

          <div>
            <label
              className="
        mb-2 block text-sm
        text-muted-foreground
      "
            >
              Ancho
            </label>

            <input
              type="text"
              inputMode="numeric"
              value={anchoInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setAnchoInput(value);

                setConfig((prev) => ({
                  ...prev,

                  ancho: value === "" ? 0 : Number(value),
                }));
              }}
              className="
        w-full rounded-xl
        border border-white/10
        bg-zinc-900
        px-4 py-2
        transition-all
        focus:border-white/20
        focus:outline-none
      "
            />
          </div>

          {/* ALTO */}

          <div>
            <label
              className="
        mb-2 block text-sm
        text-muted-foreground
      "
            >
              Alto
            </label>

            <input
              type="text"
              inputMode="numeric"
              value={altoInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setAltoInput(value);

                setConfig((prev) => ({
                  ...prev,

                  alto: value === "" ? 0 : Number(value),
                }));
              }}
              className="
        w-full rounded-xl
        border border-white/10
        bg-zinc-900
        px-4 py-2
        transition-all
        focus:border-white/20
        focus:outline-none
      "
            />
          </div>
        </div>

        {/* LIMITES */}

        <div
          className="
            rounded-xl border border-border
            bg-zinc-900/80
            p-3 text-center
            text-xs text-muted-foreground
          "
        >
          <div>
            Ancho permitido: {limites.anchoMin}
            {" - "}
            {limites.anchoMax}
            {" cm"}
          </div>

          <div className="mt-1">
            Alto permitido: {limites.altoMin}
            {" - "}
            {limites.altoMax}
            {" cm"}
          </div>
        </div>

        {/* COLORES */}

        <div>
          <label
            className="
              mb-3 block text-sm
              text-muted-foreground
            "
          >
            Color
          </label>

          <div
            className="
              flex gap-3
              overflow-x-auto pb-1
            "
          >
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

                      cortinaPVC:
                        color.nombre === "Blanco" ? prev.cortinaPVC : false,
                    }))
                  }
                  className={`
                    flex items-center gap-3
                    rounded-xl border
                    px-3 py-2
                    transition-all

                    ${
                      selected
                        ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                        : "border-border"
                    }
                  `}
                >
                  <div
                    className={`
                      h-6 w-6 rounded-full
                      border border-white/20
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
          <h4
            className="
              text-sm font-medium
              text-muted-foreground
            "
          >
            Extras
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {/* MOSQUITERO */}

            <button
              type="button"
              onClick={() => toggleField("mosquitero")}
              className={`
                rounded-xl border
                p-3 text-left
                transition-all

                ${
                  config.mosquitero
                    ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                    : "border-border"
                }
              `}
            >
              Mosquitero
            </button>

            {/* GUIA */}

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
                rounded-xl border
                p-3 text-left
                transition-all

                ${
                  config.guia
                    ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                    : "border-border"
                }
              `}
            >
              Guía
            </button>

            {/* CAJON */}

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
                rounded-xl border
                p-3 text-left
                transition-all

                ${
                  config.cajonBlock
                    ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
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
              <h4
                className="
                  text-sm font-medium
                  text-muted-foreground
                "
              >
                Cortina
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* PVC */}

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
                    rounded-xl border
                    p-3 text-left
                    transition-all

                    ${
                      config.cortinaPVC
                        ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                        : "border-border"
                    }

                    ${
                      config.color !== "Blanco"
                        ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-white/30"
                        : ""
                    }
                  `}
                >
                  PVC
                </button>

                {/* ALUMINIO */}

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
                    rounded-xl border
                    p-3 text-left
                    transition-all

                    ${
                      config.cortinaAluminio
                        ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                        : "border-border"
                    }
                  `}
                >
                  Aluminio
                </button>
              </div>

              {config.color !== "Blanco" && (
                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  PVC disponible únicamente en Blanco
                </p>
              )}
            </div>
          )}

          {/* MODENA */}

          {config.linea === "Modena" && (
            <div className="space-y-3">
              <h4
                className="
                  text-sm font-medium
                  text-muted-foreground
                "
              >
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
                    rounded-xl border
                    p-3 text-left
                    transition-all

                    ${
                      config.premarco
                        ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
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
                    rounded-xl border
                    p-3 text-left
                    transition-all

                    ${
                      config.contramarco
                        ? "border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
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

        {/* ACTION */}

        <Button className="w-full" onClick={handleAddToBudget}>
          Agregar al presupuesto
        </Button>
      </div>
    </div>
  );
}
