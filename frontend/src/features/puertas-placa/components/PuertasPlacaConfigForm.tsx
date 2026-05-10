import type { PuertasPlacaConfig, PuertasPlacaItem } from "../types";

import { PUERTAS_PLACA_UI } from "../ui";

import { usePuertasPlacaForm } from "../hooks/usePuertasPlacaForm";

import { usePuertasPlacaValidation } from "../hooks/usePuertasPlacaValidation";

import { useCotizarPuertasPlaca } from "../hooks/useCotizarPuertasPlaca";

import { createPuertasPlacaBudgetItem } from "../utils/createPuertasPlacaBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

type Props = {
  config: PuertasPlacaConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasPlacaConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PuertasPlacaItem[]>>;
};

export function PuertasPlacaConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarPuertasPlaca();

  const {
    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = usePuertasPlacaForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePuertasPlacaValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createPuertasPlacaBudgetItem,
  });

  return (
    <ProductFormLayout title={PUERTAS_PLACA_UI.title}>
      <div className="space-y-6">
        <FormSection title={PUERTAS_PLACA_UI.sections.medidas}>
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
            {PUERTAS_PLACA_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {PUERTAS_PLACA_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PUERTAS_PLACA_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {PUERTAS_PLACA_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
