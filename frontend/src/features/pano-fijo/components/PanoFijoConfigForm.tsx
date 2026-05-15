import type { PanoFijoConfig, PanoFijoItem } from "../types";

import { LINEAS_PANO_FIJO, VIDRIOS_PANO_FIJO } from "../constants";

import { PANO_FIJO_UI } from "../ui";

import { usePanoFijoForm } from "../hooks/usePanoFijoForm";

import { usePanoFijoValidation } from "../hooks/usePanoFijoValidation";

import { useCotizarPanoFijo } from "../hooks/useCotizarPanoFijo";

import { createPanoFijoBudgetItem } from "../utils/createPanoFijoBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

type Props = {
  config: PanoFijoConfig;

  setConfig: React.Dispatch<React.SetStateAction<PanoFijoConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PanoFijoItem[]>>;
};

export function PanoFijoConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
  const cotizacionMutation = useCotizarPanoFijo();

  const {
    updateConfig,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = usePanoFijoForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePanoFijoValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createPanoFijoBudgetItem,
  });

  return (
    <ProductFormLayout title={PANO_FIJO_UI.title}>
      <div className="space-y-6">
        {/* SISTEMA */}

        <FormSection title="Línea">
          <LineaSelector
            value={config.linea}
            options={LINEAS_PANO_FIJO}
            onChange={(value) =>
              updateConfig({
                linea: value as PanoFijoConfig["linea"],
              })
            }
          />
        </FormSection>

        {/* MEDIDAS */}

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

        {/* VIDRIO */}

        <FormSection title="Vidrio">
          <VidrioSelector
            value={config.tipoVidrio}
            options={VIDRIOS_PANO_FIJO.map((vidrio) => vidrio.value)}
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as PanoFijoConfig["tipoVidrio"],
              })
            }
          />
        </FormSection>

        {/* COLOR */}

        <FormSection title="Color">
          <ColorSelector
            value={config.color}
            onChange={(color) =>
              updateConfig({
                color: color as PanoFijoConfig["color"],
              })
            }
          />
        </FormSection>

        {!medidasValidas && (
          <AlertBox type="error">
            {PANO_FIJO_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {PANO_FIJO_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PANO_FIJO_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {PANO_FIJO_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
