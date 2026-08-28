import type { VentanaConfig } from "../types";

import { VENTANAS_UI } from "../ui";

import { useVentanaForm } from "../hooks/useVentanaForm";

import { useVentanaValidation } from "../hooks/useVentanaValidation";

import { useCotizarVentana } from "../hooks/useCotizarVentana";

import { createVentanaBudgetItem } from "../utils/createVentanaBudgetItem";

import { VIDRIOS_HERRERO, VIDRIOS_MODENA } from "@/shared/constants/vidrios";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { ExtrasSection } from "@/shared/sections/ExtrasSection";

import { CortinasSection } from "@/shared/sections/CortinasSection";

import { ModenaSection } from "@/shared/sections/ModenaSection";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";
import { BipuntosSection } from "../components/BipuntosSection";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

import { ConstructionSection } from "../components/ConstructionSection";

type Props = {
  config: VentanaConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanaConfig>>;
};

export function VentanaConfigForm({
  config,

  setConfig,
}: Props) {
  const cotizacionMutation = useCotizarVentana();

  const {
    updateConfig,

    switchLinea,

    toggleField,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,

    handleToggleGuia,

    handleTogglePremarco,
  } = useVentanaForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = useVentanaValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,
    config,
    createItem: createVentanaBudgetItem,
  });
  const editingItem = useBudgetStore((state) => state.editingItem);

  const vidrios = [
    ...(config.linea === "Herrero" ? VIDRIOS_HERRERO : VIDRIOS_MODENA),
  ] as string[];

  return (
    <>
      <ProductFormLayout title={VENTANAS_UI.title}>
        <div className="space-y-6">
          <FormSection title={VENTANAS_UI.sections.sistema}>
            <LineaSelector
              id="linea"
              value={config.linea}
              options={VENTANAS_UI.selectors?.lineas || []}
              onChange={(value) => switchLinea(value as VentanaConfig["linea"])}
            />
          </FormSection>

          <FormSection title={VENTANAS_UI.sections.medidas}>
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
              {VENTANAS_UI.messages?.invalidMeasures}
            </AlertBox>
          )}

          <FormSection title="Vidrio">
            <VidrioSelector
              value={config.tipoVidrio || "3mm"}
              options={vidrios}
              onChange={(value) =>
                updateConfig({
                  tipoVidrio: value as VentanaConfig["tipoVidrio"],
                })
              }
            />
          </FormSection>

          <FormSection title={VENTANAS_UI.sections.colores}>
            <ColorSelector
              value={config.color}
              onChange={(color) =>
                updateConfig({
                  color: color as VentanaConfig["color"],

                  cortina:
                    color === "blanco" || config.cortina !== "pvc"
                      ? config.cortina
                      : null,
                })
              }
            />
          </FormSection>

          <FormSection title={VENTANAS_UI.sections.extras}>
            <ExtrasSection
              mosquitero={config.mosquitero}
              guia={config.guia}
              onToggleMosquitero={() => toggleField("mosquitero")}
              onToggleGuia={handleToggleGuia}
            />
          </FormSection>

          {config.linea === "Modena" && config.ancho >= 200 && (
            <FormSection title="Construcción">
              <ConstructionSection
                value={config.tipoConstruccion ?? "2_hojas"}
                onChange={(value) =>
                  updateConfig({
                    tipoConstruccion: value,
                  })
                }
              />
            </FormSection>
          )}

          {config.guia && (
            <FormSection title={VENTANAS_UI.sections.cortinas}>
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
                    cortina: config.cortina === "aluminio" ? null : "aluminio",
                  })
                }
              />
            </FormSection>
          )}

          {config.linea === "Modena" && (
            <FormSection title={VENTANAS_UI.sections.modena}>
              <ModenaSection
                premarco={config.premarco}
                contramarco={config.contramarco}
                onTogglePremarco={handleTogglePremarco}
                onToggleContramarco={() => toggleField("contramarco")}
              />
            </FormSection>
          )}

          {config.linea === "Modena" && (
            <FormSection title="Bipuntos">
              <BipuntosSection
                izquierda={config.bipuntoIzquierda}
                derecha={config.bipuntoDerecha}
                onChangeIzquierda={(value) =>
                  updateConfig({
                    bipuntoIzquierda: value,
                  })
                }
                onChangeDerecha={(value) =>
                  updateConfig({
                    bipuntoDerecha: value,
                  })
                }
              />
            </FormSection>
          )}

          {cotizacionMutation.isError && (
            <AlertBox type="error">
              {VENTANAS_UI.messages?.quotationError}
            </AlertBox>
          )}

          <FormFooter>
            <PrimaryButton
              onClick={handleAdd}
              loading={cotizacionMutation.isPending}
            >
              {editingItem
                ? "Guardar modificación"
                : VENTANAS_UI.actions?.addToBudget}
            </PrimaryButton>

            {medidasInvalidas && (
              <AlertBox type="error">
                {VENTANAS_UI.messages?.reviewLimits}
              </AlertBox>
            )}
          </FormFooter>
        </div>
      </ProductFormLayout>
    </>
  );
}
