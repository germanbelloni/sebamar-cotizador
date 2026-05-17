import type { PatagonicasConfig, PatagonicasItem } from "../types";

import { PATAGONICAS_UI } from "../ui";

import { usePatagonicasForm } from "../hooks/usePatagonicasForm";

import { usePatagonicasValidation } from "../hooks/usePatagonicasValidation";

import { useCotizarPatagonicas } from "../hooks/useCotizarPatagonicas";

import { createPatagonicasBudgetItem } from "../utils/createPatagonicasBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";
import { CortinasSection } from "@/shared/sections/CortinasSection";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { ExtrasSection } from "@/shared/sections/ExtrasSection";

import { ModenaSection } from "@/shared/sections/ModenaSection";

type Props = {
  config: PatagonicasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PatagonicasConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PatagonicasItem[]>>;
};

export function PatagonicasConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarPatagonicas();

  const {
    updateConfig,

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = usePatagonicasForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePatagonicasValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createPatagonicasBudgetItem,
  });

  return (
    <ProductFormLayout title={PATAGONICAS_UI.title}>
      <div className="space-y-6">
        {/* SISTEMA */}

        <FormSection title={PATAGONICAS_UI.sections.sistema}>
          <div className="space-y-4">
            <LineaSelector
              value={config.linea}
              options={PATAGONICAS_UI.selectors?.lineas || []}
              onChange={(value) => switchLinea(value)}
            />

            <LineaSelector
              value={config.tipo}
              options={PATAGONICAS_UI.selectors?.tipos || []}
              onChange={(value) =>
                updateConfig({
                  tipo: value as PatagonicasConfig["tipo"],

                  cantidadRajas: value === "1_raja" ? 1 : 2,
                })
              }
            />
          </div>
        </FormSection>

        {/* MEDIDAS */}

        <FormSection title={PATAGONICAS_UI.sections.medidas}>
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
            {PATAGONICAS_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {/* VIDRIO */}

        <FormSection title={PATAGONICAS_UI.sections.vidrio}>
          <VidrioSelector
            value={config.tipoVidrio}
            options={["4mm", "3+3"]}
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as PatagonicasConfig["tipoVidrio"],
              })
            }
          />
        </FormSection>

        {/* EXTRAS */}

        <FormSection title={PATAGONICAS_UI.sections.extras}>
          <div className="space-y-4">
            <ExtrasSection
              mosquitero={config.mosquitero}
              guia={config.guia}
              cajonBlock={config.cajonBlock}
              onToggleMosquitero={() =>
                updateConfig({
                  mosquitero: !config.mosquitero,
                })
              }
              onToggleGuia={() =>
                updateConfig({
                  guia: !config.guia,
                })
              }
              onToggleCajonBlock={() =>
                updateConfig({
                  cajonBlock: !config.cajonBlock,
                })
              }
            />

            {config.guia && (
              <FormSection title="Cortinas">
                <CortinasSection
                  color={config.color}
                  cortina={config.cortina}
                  onTogglePVC={() =>
                    updateConfig({
                      cortina: config.cortina === "pvc" ? null : "pvc",
                    })
                  }
                  onToggleAluminio={() =>
                    updateConfig({
                      cortina:
                        config.cortina === "aluminio" ? null : "aluminio",
                    })
                  }
                />
              </FormSection>
            )}

            {config.linea === "Modena" && (
              <ModenaSection
                premarco={config.premarco}
                contramarco={config.contramarco}
                onTogglePremarco={() =>
                  updateConfig({
                    premarco: !config.premarco,
                  })
                }
                onToggleContramarco={() =>
                  updateConfig({
                    contramarco: !config.contramarco,
                  })
                }
              />
            )}
          </div>
        </FormSection>

        {/* ERROR */}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {PATAGONICAS_UI.messages?.quotationError}
          </AlertBox>
        )}

        {/* FOOTER */}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PATAGONICAS_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {PATAGONICAS_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
