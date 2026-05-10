import type { PuertasConfig, PuertasItem } from "../types";

import { PUERTAS_UI } from "../ui";

import { usePuertasForm } from "../hooks/usePuertasForm";

import { usePuertasValidation } from "../hooks/usePuertasValidation";

import { useCotizarPuertas } from "../hooks/useCotizarPuertas";

import { createPuertasBudgetItem } from "../utils/createPuertasBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { PuertasExtrasSection } from "./sections/PuertasExtrasSection";

type Props = {
  config: PuertasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PuertasItem[]>>;
};

export function PuertasConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarPuertas();

  const {
    updateConfig,

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = usePuertasForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePuertasValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createPuertasBudgetItem,
  });

  return (
    <ProductFormLayout title={PUERTAS_UI.title}>
      <div className="space-y-6">
        <FormSection title={PUERTAS_UI.sections.sistema}>
          <div className="space-y-4">
            <LineaSelector
              value={config.linea}
              options={PUERTAS_UI.selectors?.lineas || []}
              onChange={(value) => switchLinea(value)}
            />

            <LineaSelector
              value={config.tipo}
              options={PUERTAS_UI.selectors?.tipos || []}
              onChange={(value) =>
                updateConfig({
                  tipo: value as PuertasConfig["tipo"],
                })
              }
            />
          </div>
        </FormSection>

        <FormSection title={PUERTAS_UI.sections.medidas}>
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
            {PUERTAS_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        <FormSection title={PUERTAS_UI.sections.vidrio}>
          <VidrioSelector
            value={config.vidrio || "4mm"}
            options={["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"]}
            onChange={(value) =>
              updateConfig({
                vidrio: value as PuertasConfig["vidrio"],
              })
            }
          />
        </FormSection>

        <FormSection title={PUERTAS_UI.sections.extras}>
          <PuertasExtrasSection
            barralRecto={config.extras.barralRecto}
            barralCurvo={config.extras.barralCurvo}
            manija={config.extras.manija}
            picaporte={config.extras.picaporte}
            onToggleBarralRecto={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  barralRecto: config.extras.barralRecto ? 0 : 1,
                },
              })
            }
            onToggleBarralCurvo={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  barralCurvo: config.extras.barralCurvo ? 0 : 1,
                },
              })
            }
            onToggleManija={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  manija: !config.extras.manija,
                },
              })
            }
            onTogglePicaporte={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  picaporte: !config.extras.picaporte,
                },
              })
            }
          />
        </FormSection>

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {PUERTAS_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PUERTAS_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {PUERTAS_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
