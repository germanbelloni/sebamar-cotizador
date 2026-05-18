import type { MosquiterosConfig, MosquiterosItem } from "../types";

import { MOSQUITEROS_UI } from "../ui";

import { useMosquiterosForm } from "../hooks/useMosquiterosForm";

import { useMosquiterosValidation } from "../hooks/useMosquiterosValidation";

import { useCotizarMosquiteros } from "../hooks/useCotizarMosquiteros";

import { createMosquiterosBudgetItem } from "../utils/createMosquiterosBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

type Props = {
  config: MosquiterosConfig;

  setConfig: React.Dispatch<React.SetStateAction<MosquiterosConfig>>;

  setItems: React.Dispatch<React.SetStateAction<MosquiterosItem[]>>;
};

export function MosquiterosConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarMosquiteros();

  const {
    updateConfig,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = useMosquiterosForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = useMosquiterosValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createMosquiterosBudgetItem,
  });

  return (
    <ProductFormLayout title={MOSQUITEROS_UI.title}>
      <div className="space-y-6">
        <FormSection title={MOSQUITEROS_UI.sections.tipo}>
          <LineaSelector
            value={config.tipo}
            options={MOSQUITEROS_UI.selectors.tipos}
            onChange={(value) => {
              const tipo = value as MosquiterosConfig["tipo"];

              if (tipo === "puerta_mosquitera") {
                updateConfig({
                  tipo,
                  ancho: 80,
                  alto: 200,
                });

                return;
              }

              updateConfig({
                tipo,
              });
            }}
          />
        </FormSection>

        <FormSection title={MOSQUITEROS_UI.sections.medidas}>
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

        <FormSection title={MOSQUITEROS_UI.sections.color}>
          <ColorSelector
            value={config.color}
            onChange={(color) =>
              updateConfig({
                color: color as MosquiterosConfig["color"],
              })
            }
          />
        </FormSection>

        {!medidasValidas && (
          <AlertBox type="error">
            {MOSQUITEROS_UI.messages.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {MOSQUITEROS_UI.messages.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {MOSQUITEROS_UI.actions.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {MOSQUITEROS_UI.messages.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
