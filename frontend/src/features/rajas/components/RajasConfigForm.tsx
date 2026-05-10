import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { RajasConfig, RajasItem } from "../types";

import { LineaSelector } from "@/features/ventanas/components/sections/LineaSelector";

import { DimensionsSection } from "@/features/ventanas/components/sections/DimensionsSection";

import { ColorSelector } from "@/features/ventanas/components/sections/ColorSelector";

import { ExtrasSection } from "@/features/ventanas/components/sections/ExtrasSection";

import { useRajasValidation } from "../hooks/useRajasValidation";

import { useCotizarRajas } from "../hooks/useCotizarRajas";

import { createRajasBudgetItem } from "../utils/createRajasBudgetItem";

type Props = {
  config: RajasConfig;

  setConfig: React.Dispatch<React.SetStateAction<RajasConfig>>;

  setItems: React.Dispatch<React.SetStateAction<RajasItem[]>>;
};

export function RajasConfigForm({ config, setConfig, setItems }: Props) {
  const cotizacionMutation = useCotizarRajas();

  const [anchoInput, setAnchoInput] = useState(String(config.ancho));

  const [altoInput, setAltoInput] = useState(String(config.alto));

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = useRajasValidation(config);

  const updateConfig = (updates: Partial<RajasConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleAddToBudget = async () => {
    try {
      const result = await cotizacionMutation.mutateAsync(config);

      const item = createRajasBudgetItem(config);

      item.description = result.descripcion;

      item.subtotal = result.precioVenta;

      setItems((prev) => [...prev, item]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectHerrero = () => {
    setConfig((prev) => ({
      ...prev,

      linea: "Herrero",

      ancho: Math.min(prev.ancho, 240),

      alto: Math.min(prev.alto, 150),
    }));
  };

  const handleSelectModena = () => {
    setConfig((prev) => ({
      ...prev,

      linea: "Modena",

      ancho: Math.min(prev.ancho, 240),

      alto: Math.min(prev.alto, 150),
    }));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Configuración</h3>

      <div className="mt-6 space-y-6">
        <LineaSelector
          linea={config.linea}
          onSelectHerrero={handleSelectHerrero}
          onSelectModena={handleSelectModena}
        />

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

        <ColorSelector
          value={config.color}
          onChange={(color) =>
            updateConfig({
              color,
            })
          }
        />

        <ExtrasSection
          mosquitero={config.mosquitero}
          guia={false}
          cajonBlock={false}
          onToggleMosquitero={() =>
            updateConfig({
              mosquitero: !config.mosquitero,
            })
          }
          onToggleGuia={() => {}}
          onToggleCajonBlock={() => {}}
        />

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
              Medidas inválidas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
