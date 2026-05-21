import type { RajasConfig, RajasItem } from "../types";

import type { VidrioType } from "@/shared/types/vidrios";

import { RAJAS_UI } from "../ui";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { ExtrasSection } from "@/shared/sections/ExtrasSection";

import { OptionSelector } from "@/shared/selectors/OptionSelector";

import { BisagraSelector } from "@/shared/selectors/BisagraSelector";

import { OsciloPositionSelector } from "@/shared/selectors/OsciloPositionSelector";

import { useRajasForm } from "../hooks/useRajasForm";

import { useRajasValidation } from "../hooks/useRajasValidation";

import { useCotizarRajas } from "../hooks/useCotizarRajas";

import { createRajasBudgetItem } from "../utils/createRajasBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

type Props = {
  config: RajasConfig;

  setConfig: React.Dispatch<React.SetStateAction<RajasConfig>>;
};

export function RajasConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarRajas();

  const {
    updateConfig,
    switchLinea,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  } = useRajasForm({
    config,
    setConfig,
  });

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    useRajasValidation(config);

  const modelosHerrero = [
    {
      label: "Raja",
      value: "raja",
    },

    {
      label: "Brazo de empuje",
      value: "brazo",
    },

    {
      label: "Volcable",
      value: "volcable",
    },
  ];

  const modelosModena = [
    {
      label: "Raja",
      value: "raja",
    },

    {
      label: "Brazo de empuje",
      value: "brazo",
    },

    {
      label: "Volcable",
      value: "volcable",
    },

    {
      label: "Oscilobatiente",
      value: "oscilobatiente",
    },
  ];

  const modelos = config.linea === "Herrero" ? modelosHerrero : modelosModena;

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    createItem: createRajasBudgetItem,
  });

  return (
    <ProductFormLayout title={RAJAS_UI.title}>
      <div className="space-y-6">
        {/* SISTEMA */}

        <FormSection title={RAJAS_UI.sections.sistema}>
          <LineaSelector
            value={config.linea}
            options={RAJAS_UI.selectors.lineas}
            onChange={(value) => switchLinea(value)}
          />
        </FormSection>

        {/* MODELO */}

        <FormSection title="Modelo">
          <OptionSelector
            title="Modelo"
            value={config.modelo}
            options={modelos}
            onChange={(value) =>
              updateConfig({
                modelo: value as RajasConfig["modelo"],
              })
            }
          />
        </FormSection>

        {/* OSCILO */}

        {config.modelo === "oscilobatiente" && (
          <FormSection title="Posición">
            <OsciloPositionSelector
              value={config.posicionOscilo}
              onChange={(value) =>
                updateConfig({
                  posicionOscilo: value,
                })
              }
            />
          </FormSection>
        )}

        {/* MEDIDAS */}

        <FormSection title={RAJAS_UI.sections.medidas}>
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

        {/* BISAGRA */}

        {(config.modelo === "raja" || config.modelo === "oscilobatiente") && (
          <FormSection title="Bisagra">
            <BisagraSelector
              value={config.bisagra}
              onChange={(value) =>
                updateConfig({
                  bisagra: value,
                })
              }
            />
          </FormSection>
        )}

        {/* COLOR */}

        <FormSection title={RAJAS_UI.sections.colores}>
          <ColorSelector
            value={config.color}
            onChange={(color) =>
              updateConfig({
                color: color as RajasConfig["color"],
              })
            }
          />
        </FormSection>

        {/* VIDRIO */}

        <FormSection title={RAJAS_UI.sections.vidrio}>
          <VidrioSelector
            value={config.tipoVidrio || "4mm"}
            options={RAJAS_UI.vidrios}
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as VidrioType,
              })
            }
          />
        </FormSection>

        {/* EXTRAS */}

        <FormSection title={RAJAS_UI.sections.extras}>
          <ExtrasSection
            mosquitero={config.mosquitero}
            guia={false}
            cajonBlock={false}
            onToggleMosquitero={() =>
              updateConfig({
                mosquitero: !config.mosquitero,
              })
            }
            onToggleGuia={() => {}}
            onToggleCajonBlock={() => {}}
          />
        </FormSection>

        {/* ERROR */}

        {cotizacionMutation.isError && (
          <AlertBox type="error">{RAJAS_UI.messages.quotationError}</AlertBox>
        )}

        {medidasInvalidas && (
          <AlertBox type="error">{RAJAS_UI.messages.reviewLimits}</AlertBox>
        )}

        {/* FOOTER */}

        <FormFooter>
          <PrimaryButton
            className="w-full"
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {RAJAS_UI.actions.addToBudget}
          </PrimaryButton>
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
