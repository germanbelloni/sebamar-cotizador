import type { PostigonesConfig, PostigonesItem } from "../types";

import { POSTIGONES_UI } from "../ui";

import { usePostigonesForm } from "../hooks/usePostigonesForm";

import { usePostigonesValidation } from "../hooks/usePostigonesValidation";

import { useCotizarPostigones } from "../hooks/useCotizarPostigones";

import { createPostigonesBudgetItem } from "../utils/createPostigonesBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

type Props = {
  config: PostigonesConfig;

  setConfig: React.Dispatch<React.SetStateAction<PostigonesConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PostigonesItem[]>>;
};

export function PostigonesConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarPostigones();

  const {
    updateConfig,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = usePostigonesForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePostigonesValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createPostigonesBudgetItem,
  });

  return (
    <ProductFormLayout title={POSTIGONES_UI.title}>
      <div className="space-y-6">
        <FormSection title={POSTIGONES_UI.sections.tipo}>
          <LineaSelector
            value={config.tipo}
            options={POSTIGONES_UI.selectors?.tipos || []}
            onChange={(value) =>
              updateConfig({
                tipo: value as PostigonesConfig["tipo"],
              })
            }
          />
        </FormSection>

        <FormSection title={POSTIGONES_UI.sections.medidas}>
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
            {POSTIGONES_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {POSTIGONES_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {POSTIGONES_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {POSTIGONES_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
