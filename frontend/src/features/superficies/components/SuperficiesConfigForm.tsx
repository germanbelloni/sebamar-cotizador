import type { SuperficiesConfig, SuperficiesItem } from "../types";

import { SUPERFICIES_UI } from "../ui";

import { useSuperficiesForm } from "../hooks/useSuperficiesForm";

import { useSuperficiesValidation } from "../hooks/useSuperficiesValidation";

import { useCotizarSuperficies } from "../hooks/useCotizarSuperficies";

import { createSuperficiesBudgetItem } from "../utils/createSuperficiesBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

type Props = {
  config: SuperficiesConfig;

  setConfig: React.Dispatch<React.SetStateAction<SuperficiesConfig>>;

  setItems: React.Dispatch<React.SetStateAction<SuperficiesItem[]>>;
};

export function SuperficiesConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarSuperficies();

  const {
    updateConfig,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = useSuperficiesForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = useSuperficiesValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createSuperficiesBudgetItem,
  });

  const isPanoFijo = config.tipo === "pano_fijo";

  return (
    <ProductFormLayout title={SUPERFICIES_UI.title}>
      <div className="space-y-6">
        <FormSection title={SUPERFICIES_UI.sections.sistema}>
          <div className="space-y-4">
            <LineaSelector
              value={config.tipo || "pano_fijo"}
              options={SUPERFICIES_UI.selectors?.tipos || []}
              onChange={(value) =>
                updateConfig({
                  tipo: value as SuperficiesConfig["tipo"],
                })
              }
            />

            {isPanoFijo && (
              <LineaSelector
                value={config.linea || "herrero"}
                options={SUPERFICIES_UI.selectors?.lineas || []}
                onChange={(value) =>
                  updateConfig({
                    linea: value as SuperficiesConfig["linea"],
                  })
                }
              />
            )}
          </div>
        </FormSection>

        <FormSection title={SUPERFICIES_UI.sections.medidas}>
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
            {SUPERFICIES_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {isPanoFijo && (
          <FormSection title={SUPERFICIES_UI.sections.vidrio}>
            <VidrioSelector
              value={config.tipoVidrio || "4mm"}
              options={["3mm", "4mm", "3+3", "dvh"]}
              onChange={(value) =>
                updateConfig({
                  tipoVidrio: value as SuperficiesConfig["tipoVidrio"],
                })
              }
            />
          </FormSection>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {SUPERFICIES_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {SUPERFICIES_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {SUPERFICIES_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
