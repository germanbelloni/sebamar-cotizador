import type { MarcosConfig } from "../types";

import { TIPOS_MARCOS } from "../constants";

import { MARCOS_UI } from "../ui";

import { useMarcosForm } from "../hooks/useMarcosForm";

import { useMarcosValidation } from "../hooks/useMarcosValidation";

import { useCotizarMarcos } from "../hooks/useCotizarMarcos";

import { createMarcosBudgetItem } from "../utils/createMarcosBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { OptionSelector } from "@/shared/selectors/OptionSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

type Props = {
  config: MarcosConfig;

  setConfig: React.Dispatch<React.SetStateAction<MarcosConfig>>;
};

export function MarcosConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarMarcos();

  const {
    updateConfig,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  } = useMarcosForm({
    config,
    setConfig,
  });

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    useMarcosValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    createItem: createMarcosBudgetItem,
  });

  return (
    <ProductFormLayout title={MARCOS_UI.title}>
      <div className="space-y-6">
        <FormSection title="Tipo">
          <OptionSelector
            title="Marco"
            value={config.tipo}
            options={TIPOS_MARCOS}
            onChange={(value) =>
              updateConfig({
                tipo: value as MarcosConfig["tipo"],
              })
            }
          />
        </FormSection>

        <FormSection title="Medidas">
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

        {config.tipo === "contramarco" && (
          <FormSection title="Color">
            <ColorSelector
              value={config.color || "blanco"}
              onChange={(color) =>
                updateConfig({
                  color: color as MarcosConfig["color"],
                })
              }
            />
          </FormSection>
        )}

        {!medidasValidas && (
          <AlertBox type="error">
            {MARCOS_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">{MARCOS_UI.messages?.quotationError}</AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {MARCOS_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">{MARCOS_UI.messages?.reviewLimits}</AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
