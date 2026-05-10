import type { RajasConfig, RajasItem } from "../types";

import type { VidrioType } from "@/shared/types/vidrios";

import { RAJAS_UI } from "../ui";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { useRajasForm } from "../hooks/useRajasForm";

import { ExtrasSection } from "@/shared/sections/ExtrasSection";

import { useRajasValidation } from "../hooks/useRajasValidation";

import { useCotizarRajas } from "../hooks/useCotizarRajas";

import { createRajasBudgetItem } from "../utils/createRajasBudgetItem";

type Props = {
  config: RajasConfig;

  setConfig: React.Dispatch<React.SetStateAction<RajasConfig>>;

  setItems: React.Dispatch<React.SetStateAction<RajasItem[]>>;
};

export function RajasConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarRajas();

  const {
    updateConfig,

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = useRajasForm({
    config,

    setConfig,
  });
  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = useRajasValidation(config);

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

  return (
    <ProductFormLayout title={RAJAS_UI.title}>
      <div className="space-y-6">
        <FormSection title={RAJAS_UI.sections.sistema}>
          <LineaSelector
            value={config.linea}
            options={RAJAS_UI.lineas}
            onChange={(value) => switchLinea(value)}
          />
        </FormSection>

        <FormSection title={RAJAS_UI.sections.medidas}>
          <DimensionsSection
            anchoInput={anchoInput}
            altoInput={altoInput}
            anchoValido={anchoValido}
            altoValido={altoValido}
            anchoMin={limites.anchoMin}
            anchoMax={limites.anchoMax}
            altoMin={limites.altoMin}
            altoMax={limites.altoMax}
            onAnchoChange={handleAnchoChange}
            onAltoChange={handleAltoChange}
          />
        </FormSection>

        <FormSection title={RAJAS_UI.sections.colores}>
          <ColorSelector
            value={config.color}
            onChange={(color) =>
              updateConfig({
                color: color as RajasConfig["color"],
              })
            }
          />
        </FormSection>

        <FormSection title={RAJAS_UI.sections.vidrio}>
          <VidrioSelector
            value={config.tipoVidrio || "4mm"}
            options={RAJAS_UI.vidrios}
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as VidrioType,
              })
            }
          />
        </FormSection>

        <FormSection title={RAJAS_UI.sections.extras}>
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
        </FormSection>

        {medidasInvalidas && (
          <AlertBox type="error">Medidas inválidas.</AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            className="w-full"
            onClick={handleAddToBudget}
            disabled={!medidasValidas || cotizacionMutation.isPending}
          >
            {cotizacionMutation.isPending
              ? "Cotizando..."
              : "Agregar al presupuesto"}
          </PrimaryButton>
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
