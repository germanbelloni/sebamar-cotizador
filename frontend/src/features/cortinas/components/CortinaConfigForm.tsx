import type { CortinaConfig } from "../types";

import { cortinas_UI } from "../ui";

import { useCortinaForm } from "../hooks/useCortinaForm";
import { useCortinaValidation } from "../hooks/useCortinaValidation";
import { useCotizarCortina } from "../hooks/useCotizarCortina";

import { createCortinaBudgetItem } from "../utils/createCortinaBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormFooter } from "@/shared/sections/FormFooter";
import { FormSection } from "@/shared/sections/FormSection";
import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { OptionSelector } from "@/shared/selectors/OptionSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

type Props = {
  config: CortinaConfig;
  setConfig: React.Dispatch<React.SetStateAction<CortinaConfig>>;
};

export function CortinaConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarCortina();

  const {
    updateConfig,

    anchoInput,
    altoInput,

    handleAnchoChange,
    handleAltoChange,
  } = useCortinaForm({
    config,
    setConfig,
  });

  const {
    limites,

    anchoValido,
    altoValido,

    medidasValidas,
    medidasInvalidas,
  } = useCortinaValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,
    config,
    createItem: createCortinaBudgetItem,
  });

  const editingItem = useBudgetStore((state) => state.editingItem);
  const esCajon = config.tipo === "cajon_block";

  const esPVC = config.material === "pvc";

  return (
    <ProductFormLayout title={cortinas_UI.title}>
      <div className="space-y-6">
        <FormSection title={cortinas_UI.sections.sistema}>
          <OptionSelector
            title="Tipo"
            value={config.tipo}
            options={cortinas_UI.selectors.tipos}
            onChange={(value) =>
              updateConfig({
                tipo: value as CortinaConfig["tipo"],
              })
            }
          />

          <OptionSelector
            title="Material"
            value={config.material}
            options={cortinas_UI.selectors.materiales}
            onChange={(value) =>
              updateConfig({
                material: value as CortinaConfig["material"],
              })
            }
          />
        </FormSection>

        <FormSection title={cortinas_UI.sections.medidas}>
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

        {!esCajon && (
          <>
            <FormSection title={cortinas_UI.sections.construccion}>
              <OptionSelector
                title="Construcción"
                value={config.construccion}
                options={cortinas_UI.selectors.construcciones}
                onChange={(value) =>
                  updateConfig({
                    construccion: value as CortinaConfig["construccion"],
                  })
                }
              />
            </FormSection>

            {esPVC ? (
              <>
                <FormSection title="Calidad">
                  <OptionSelector
                    title="Calidad"
                    value={config.calidad}
                    options={cortinas_UI.selectors.calidadesPVC}
                    onChange={(value) =>
                      updateConfig({
                        calidad: value as CortinaConfig["calidad"],
                      })
                    }
                  />
                </FormSection>

                <FormSection title="Color">
                  <OptionSelector
                    title="Color"
                    value="blanco"
                    disabled
                    options={cortinas_UI.selectors.coloresPVC}
                    onChange={() => {}}
                  />
                </FormSection>
              </>
            ) : (
              <FormSection title="Color">
                <OptionSelector
                  title="Color"
                  value={config.color}
                  options={cortinas_UI.selectors.coloresAluminio}
                  onChange={(value) =>
                    updateConfig({
                      color: value as CortinaConfig["color"],
                    })
                  }
                />
              </FormSection>
            )}
          </>
        )}

        {!medidasValidas && (
          <AlertBox type="error">
            {cortinas_UI.messages.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {cortinas_UI.messages.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {editingItem ? "Guardar modificación" : "Agregar al presupuesto"}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {cortinas_UI.messages.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
