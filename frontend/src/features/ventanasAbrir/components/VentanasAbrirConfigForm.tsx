import type { VentanasAbrirConfig } from "../types";

import type { VidrioType } from "@/shared/types/vidrios";

import { VENTANAS_ABRIR_UI } from "../ui";

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
import { BisagraSelector } from "@/shared/selectors/BisagraSelector";

import { ModenaSection } from "@/shared/sections/ModenaSection";

import { useVentanasAbrirForm } from "../hooks/useVentanasAbrirForm";
import { useVentanasAbrirValidation } from "../hooks/useVentanasAbrirValidation";
import { useCotizarVentanasAbrir } from "../hooks/useCotizarVentanasAbrir";

import { createVentanasAbrirBudgetItem } from "../utils/createVentanasAbrirBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";
import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

type Props = {
  config: VentanasAbrirConfig;

  setConfig: React.Dispatch<React.SetStateAction<VentanasAbrirConfig>>;
};

export function VentanasAbrirConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarVentanasAbrir();

  const {
    updateConfig,
    switchLinea,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  } = useVentanasAbrirForm({
    config,
    setConfig,
  });

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    useVentanasAbrirValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    createItem: createVentanasAbrirBudgetItem,
  });

  const editingItem = useBudgetStore((state) => state.editingItem);

  const VIDRIOS_HERRERO = new Set([
    "3mm",
    "4mm",
    "fantasia",
    "esmerilado",
    "3+3",
  ]);

  const vidriosDisponibles =
    config.linea === "Herrero"
      ? VENTANAS_ABRIR_UI.vidrios.filter((v) => VIDRIOS_HERRERO.has(v.value))
      : VENTANAS_ABRIR_UI.vidrios;

  return (
    <ProductFormLayout title="Ventanas de Abrir">
      <div className="space-y-6">
        <FormSection title={VENTANAS_ABRIR_UI.sections.sistema}>
          <LineaSelector
            value={config.linea}
            options={VENTANAS_ABRIR_UI.selectors.lineas}
            onChange={(value) => switchLinea(value)}
          />
        </FormSection>

        <FormSection title={VENTANAS_ABRIR_UI.sections.medidas}>
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

        <FormSection title="Hoja principal">
          <BisagraSelector
            value={config.bisagra}
            onChange={(value) =>
              updateConfig({
                bisagra: value,
              })
            }
          />
        </FormSection>

        <AlertBox type="warning">
          Vista interior: elegí cuál será la hoja principal (la que llevará la
          manija y el cierre).
        </AlertBox>

        <FormSection title={VENTANAS_ABRIR_UI.sections.colores}>
          <ColorSelector
            value={config.color}
            onChange={(color) =>
              updateConfig({
                color: color as VentanasAbrirConfig["color"],
              })
            }
          />
        </FormSection>

        <FormSection title={VENTANAS_ABRIR_UI.sections.vidrio}>
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

        <FormSection title={VENTANAS_ABRIR_UI.sections.extras}>
          <ExtrasSection
            mosquitero={config.mosquitero}
            onToggleMosquitero={() =>
              updateConfig({
                mosquitero: !config.mosquitero,
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
          <AlertBox type="error">
            {VENTANAS_ABRIR_UI.messages.quotationError}
          </AlertBox>
        )}

        {medidasInvalidas && (
          <AlertBox type="error">
            {VENTANAS_ABRIR_UI.messages.reviewLimits}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            className="w-full"
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {editingItem
              ? "Guardar modificación"
              : VENTANAS_ABRIR_UI.actions.addToBudget}
          </PrimaryButton>
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
