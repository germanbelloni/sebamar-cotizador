import type { MosquiterosConfig } from "../types";
import { MOSQUITEROS_UI } from "../ui";

import { getDefaultMosquiteroMeasures } from "../constants";

import { useMosquiterosForm } from "../hooks/useMosquiterosForm";

import { useMosquiterosValidation } from "../hooks/useMosquiterosValidation";

import { useCotizarMosquiteros } from "../hooks/useCotizarMosquiteros";

import { createMosquiterosBudgetItem } from "../utils/createMosquiterosBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

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
};

export function MosquiterosConfigForm({ config, setConfig }: Props) {
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

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    useMosquiterosValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,
    config,
    createItem: createMosquiterosBudgetItem,
  });
  const coloresMosquiteros =
    config.tipo === "fijo"
      ? undefined
      : config.tipo === "ventana"
        ? [
            {
              value: "blanco",
              label: "Blanco",
              preview: "bg-white",
            },
            {
              value: "negro",
              label: "Negro",
              preview: "bg-background",
            },
          ]
        : [
            {
              value: "blanco",
              label: "Blanco",
              preview: "bg-white",
            },
          ];
  return (
    <ProductFormLayout title={MOSQUITEROS_UI.title}>
      <div className="space-y-6">
        <FormSection title={MOSQUITEROS_UI.sections.tipo}>
          <LineaSelector
            value={config.tipo}
            options={MOSQUITEROS_UI.selectors.tipos}
            onChange={(value) => {
              const tipo = value as MosquiterosConfig["tipo"];

              const medidas = getDefaultMosquiteroMeasures(tipo);

              let color = config.color;

              if (tipo === "ventana") {
                if (!["blanco", "negro"].includes(color)) {
                  color = "blanco";
                }
              }

              if (tipo === "puerta_mosquitera") {
                color = "blanco";
              }

              updateConfig({
                tipo,
                color,
                ...medidas,
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
            options={coloresMosquiteros}
            onChange={(color) =>
              updateConfig({
                color: color as MosquiterosConfig["color"],
              })
            }
          />
        </FormSection>

        {config.tipo === "puerta_mosquitera" && (
          <FormSection title="Bisagra">
            <LineaSelector
              value={config.ladoBisagra}
              options={[
                { value: "izquierda", label: "Izquierda" },
                { value: "derecha", label: "Derecha" },
              ]}
              onChange={(value) =>
                updateConfig({
                  ladoBisagra: value as "izquierda" | "derecha",
                })
              }
            />
          </FormSection>
        )}

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
