import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { VentanaConfig, VentanaItem } from "../types";

import { ColorSelector } from "./sections/ColorSelector";
import { ExtrasSection } from "./sections/ExtrasSection";
import { CortinasSection } from "./sections/CortinasSection";
import { ModenaSection } from "./sections/ModenaSection";
import { DimensionsSection } from "./sections/DimensionsSection";
import { LineaSelector } from "./sections/LineaSelector";
import { useVentanaValidation } from "../hooks/useVentanaValidation";
import { createVentanaBudgetItem } from "../utils/createVentanaBudgetItem";
import { useCotizarVentana } from "../hooks/useCotizarVentana";
import { useVentanaConfig } from "../hooks/useVentanaConfig";
type Props = {
  config: VentanaConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanaConfig>>;

  setItems: React.Dispatch<React.SetStateAction<VentanaItem[]>>;
};

export function VentanaConfigForm({ config, setConfig, setItems }: Props) {
  const cotizacionMutation = useCotizarVentana();

  /* INPUT STATES */

  const [anchoInput, setAnchoInput] = useState(String(config.ancho));

  const [altoInput, setAltoInput] = useState(String(config.alto));

  /* HELPERS */

  const {
    updateConfig,

    toggleField,

    handleSelectHerrero,

    handleSelectModena,
  } = useVentanaConfig({
    config,
    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = useVentanaValidation(config);

  const handleAddToBudget = async () => {
    try {
      const result = await cotizacionMutation.mutateAsync(config);

      const item = createVentanaBudgetItem(config, result);

      setItems((prev) => [...prev, item]);
    } catch (error) {
      console.error("ERROR COTIZANDO:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Configuración</h3>

      <div className="mt-6 space-y-6">
        {/* LINEA */}

        <LineaSelector
          linea={config.linea}
          onSelectHerrero={handleSelectHerrero}
          onSelectModena={handleSelectModena}
        />

        {/* MEDIDAS */}

        <DimensionsSection
          anchoInput={anchoInput}
          altoInput={altoInput}
          anchoValido={anchoValido}
          altoValido={altoValido}
          anchoMin={limites.anchoMin}
          anchoMax={limites.anchoMax}
          altoMin={limites.altoMin}
          altoMax={limites.altoMax}
          onAnchoChange={(value) => {
            setAnchoInput(value);

            updateConfig({
              ancho: value === "" ? 0 : Number(value),
            });
          }}
          onAltoChange={(value) => {
            setAltoInput(value);

            updateConfig({
              alto: value === "" ? 0 : Number(value),
            });
          }}
        />
        {!medidasValidas && (
          <div
            className="
              rounded-xl
              border border-red-500/30
              bg-red-500/10
              p-3
              text-sm
              text-red-200
            "
          >
            Las medidas ingresadas no son válidas para la línea seleccionada.
          </div>
        )}

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

        <ColorSelector
          value={config.color}
          onChange={(color) =>
            updateConfig({
              color,

              cortinaPVC: color === "blanco" ? config.cortinaPVC : false,
            })
          }
        />
        {/* EXTRAS */}

        <ExtrasSection
          mosquitero={config.mosquitero}
          guia={config.guia}
          cajonBlock={config.cajonBlock}
          onToggleMosquitero={() => toggleField("mosquitero")}
          onToggleGuia={() =>
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
          onToggleCajonBlock={() =>
            setConfig((prev) => ({
              ...prev,

              cajonBlock: !prev.cajonBlock,

              guia: false,

              cortinaPVC: false,

              cortinaAluminio: false,
            }))
          }
        />

        {/* CORTINAS */}

        {config.guia && (
          <CortinasSection
            color={config.color}
            cortinaPVC={config.cortinaPVC}
            cortinaAluminio={config.cortinaAluminio}
            onTogglePVC={() =>
              updateConfig({
                cortinaPVC: !config.cortinaPVC,
                cortinaAluminio: false,
              })
            }
            onToggleAluminio={() =>
              updateConfig({
                cortinaAluminio: !config.cortinaAluminio,
                cortinaPVC: false,
              })
            }
          />
        )}

        {/* MODENA */}

        {config.linea === "Modena" && (
          <ModenaSection
            premarco={config.premarco}
            contramarco={config.contramarco}
            onTogglePremarco={() =>
              setConfig((prev) => {
                const nuevoPremarco = !prev.premarco;

                return {
                  ...prev,

                  premarco: nuevoPremarco,

                  contramarco: nuevoPremarco ? true : prev.contramarco,
                };
              })
            }
            onToggleContramarco={() => toggleField("contramarco")}
          />
        )}
        {/* ERROR */}
        {cotizacionMutation.isError && (
          <div
            className="
      rounded-xl
      border border-red-500/20
      bg-red-500/10
      px-4 py-3
      text-sm text-red-300
    "
          >
            Ocurrió un error al cotizar la ventana.
          </div>
        )}

        {/* ACTION */}

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={handleAddToBudget}
            disabled={!medidasValidas || cotizacionMutation.isPending}
          >
            {cotizacionMutation.isPending
              ? "Cotizando..."
              : "Agregar al presupuesto"}
          </Button>

          {medidasInvalidas && (
            <div
              className="
        rounded-xl
        border border-red-500/20
        bg-red-500/10
        px-4 py-3
        text-center
      "
            >
              <p className="text-sm font-medium text-red-300">
                Las medidas ingresadas no son válidas para la línea
                seleccionada.
              </p>

              <p className="mt-1 text-xs text-red-400">
                Revisá los límites permitidos antes de agregar al presupuesto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
