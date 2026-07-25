import type { RajasConfig } from "../types";

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

import { ModenaSection } from "@/shared/sections/ModenaSection";

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

  const vidriosDisponibles =
    config.linea === "Herrero"
      ? RAJAS_UI.vidrios.filter(
          (v) =>
            v.value !== "4+4" &&
            v.value !== "DVH 4+9+4" &&
            v.value !== "DVH 5+9+5",
        )
      : RAJAS_UI.vidrios;

  return (
    <ProductFormLayout title={RAJAS_UI.title}>
      <div className="space-y-6">
        <FormSection title={RAJAS_UI.sections.sistema}>
          <LineaSelector
            value={config.linea}
            options={RAJAS_UI.selectors.lineas}
            onChange={(value) => switchLinea(value)}
          />
        </FormSection>

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
        <AlertBox type="warning">
          Vista interior: la apertura de rajas siempre se interpreta desde
          adentro.
        </AlertBox>
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

        <FormSection title={RAJAS_UI.sections.vidrio}>
          <VidrioSelector
            value={config.tipoVidrio || "4mm"}
            options={vidriosDisponibles}
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as VidrioType,
              })
            }
          />
        </FormSection>

        <FormSection title={RAJAS_UI.sections.extras}>
          <ExtrasSection
            mosquitero={config.mosquitero}
            vidrioRepartido={config.vidrioRepartido}
            onToggleMosquitero={() =>
              updateConfig({
                mosquitero: !config.mosquitero,
              })
            }
            onToggleVidrioRepartido={() =>
              updateConfig({
                vidrioRepartido: !config.vidrioRepartido,
              })
            }
          />
        </FormSection>
        {config.linea === "Modena" && (
          <FormSection title="Utilidades">
            <ModenaSection
              premarco={config.premarco}
              contramarco={config.contramarco}
              herrajesBlancos={config.herrajesBlancos}
              onTogglePremarco={() => {
                const nuevoPremarco = !config.premarco;

                updateConfig({
                  premarco: nuevoPremarco,
                  contramarco: nuevoPremarco ? true : config.contramarco,
                });
              }}
              onToggleContramarco={() =>
                updateConfig({
                  contramarco: !config.contramarco,
                })
              }
              onToggleHerrajesBlancos={() =>
                updateConfig({
                  herrajesBlancos: !config.herrajesBlancos,
                })
              }
            />
          </FormSection>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">{RAJAS_UI.messages.quotationError}</AlertBox>
        )}

        {medidasInvalidas && (
          <AlertBox type="error">{RAJAS_UI.messages.reviewLimits}</AlertBox>
        )}

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
