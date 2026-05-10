import type { PortonesConfig, PortonesItem } from "../types";

import { PORTONES_UI } from "../ui";

import { usePortonesForm } from "../hooks/usePortonesForm";

import { usePortonesValidation } from "../hooks/usePortonesValidation";

import { useCotizarPortones } from "../hooks/useCotizarPortones";

import { createPortonesBudgetItem } from "../utils/createPortonesBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { SelectableCard } from "@/components/ui/selectable-card";

type Props = {
  config: PortonesConfig;

  setConfig: React.Dispatch<React.SetStateAction<PortonesConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PortonesItem[]>>;
};

export function PortonesConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarPortones();

  const {
    updateConfig,

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = usePortonesForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePortonesValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createPortonesBudgetItem,
  });

  return (
    <ProductFormLayout title={PORTONES_UI.title}>
      <div className="space-y-6">
        <FormSection title={PORTONES_UI.sections.sistema}>
          <div className="space-y-4">
            <LineaSelector
              value={config.linea}
              options={PORTONES_UI.selectors?.lineas || []}
              onChange={(value) => switchLinea(value)}
            />

            <LineaSelector
              value={config.sistema}
              options={PORTONES_UI.selectors?.sistemas || []}
              onChange={(value) =>
                updateConfig({
                  sistema: value as PortonesConfig["sistema"],
                })
              }
            />
          </div>
        </FormSection>

        <FormSection title={PORTONES_UI.sections.medidas}>
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

        {!medidasValidas && (
          <AlertBox type="error">
            {PORTONES_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        <FormSection title={PORTONES_UI.sections.vidrio}>
          <VidrioSelector
            value={config.tipoVidrio || "4mm"}
            options={["3mm", "4mm", "5mm", "3+3", "dvh"]}
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as PortonesConfig["tipoVidrio"],
              })
            }
          />
        </FormSection>

        <FormSection title={PORTONES_UI.sections.extras}>
          <div className="grid grid-cols-2 gap-3">
            <SelectableCard
              selected={config.automatizado}
              onClick={() =>
                updateConfig({
                  automatizado: !config.automatizado,
                })
              }
            >
              Automatizado
            </SelectableCard>

            <SelectableCard
              selected={config.guiaInferior}
              onClick={() =>
                updateConfig({
                  guiaInferior: !config.guiaInferior,
                })
              }
            >
              Guía inferior
            </SelectableCard>
          </div>
        </FormSection>

        <FormSection title="Color">
          <ColorSelector
            value={config.color}
            onChange={(color) =>
              updateConfig({
                color: color as PortonesConfig["color"],
              })
            }
          />
        </FormSection>

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {PORTONES_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PORTONES_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {PORTONES_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
