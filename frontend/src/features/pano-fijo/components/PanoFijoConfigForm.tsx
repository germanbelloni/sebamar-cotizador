import type { PanoFijoConfig } from "../types";

import { LINEAS_PANO_FIJO, VIDRIOS_PANO_FIJO } from "../constants";

import { PANO_FIJO_UI } from "../ui";

import { usePanoFijoForm } from "../hooks/usePanoFijoForm";

import { usePanoFijoValidation } from "../hooks/usePanoFijoValidation";

import { useCotizarPanoFijo } from "../hooks/useCotizarPanoFijo";

import { createPanoFijoBudgetItem } from "../utils/createPanoFijoBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { ModenaSection } from "@/shared/sections/ModenaSection";
import {
  requiereTravesanoVertical,
  requiereTravesanoHorizontal,
} from "../utils/travesanos";

type Props = {
  config: PanoFijoConfig;

  setConfig: React.Dispatch<React.SetStateAction<PanoFijoConfig>>;
};

export function PanoFijoConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarPanoFijo();

  const {
    updateConfig,
    updateConfigWithRules,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  } = usePanoFijoForm({
    config,
    setConfig,
  });

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    usePanoFijoValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    createItem: createPanoFijoBudgetItem,
  });

  const showVertical = requiereTravesanoVertical(
    config.ancho,
    config.tipoVidrio,
  );

  const showHorizontal = requiereTravesanoHorizontal(config.alto);

  const showWarning =
    (showVertical && !config.travesanoVertical) ||
    (showHorizontal && !config.travesanoHorizontal);

  const vidriosDisponibles =
    config.linea === "herrero"
      ? VIDRIOS_PANO_FIJO.filter(
          (v) => !["4+4", "dvh_4_9_4", "dvh_5_9_5"].includes(v.value),
        )
      : VIDRIOS_PANO_FIJO;

  return (
    <ProductFormLayout title={PANO_FIJO_UI.title}>
      <div className="space-y-6">
        {/* SISTEMA */}

        <FormSection title="Línea">
          <LineaSelector
            value={config.linea}
            options={LINEAS_PANO_FIJO}
            onChange={(value) => {
              const nuevaLinea = value as PanoFijoConfig["linea"];

              const vidriosInvalidosHerrero = ["4+4", "dvh_4_9_4", "dvh_5_9_5"];

              const vidrioInvalidoEnHerrero =
                nuevaLinea === "herrero" &&
                vidriosInvalidosHerrero.includes(config.tipoVidrio);

              updateConfig({
                linea: nuevaLinea,
                ...(vidrioInvalidoEnHerrero
                  ? { tipoVidrio: "4mm" as PanoFijoConfig["tipoVidrio"] }
                  : {}),
              });
            }}
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
            options={vidriosDisponibles}
            onChange={(value) =>
              updateConfigWithRules({
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

        {config.linea === "modena" && (
          <FormSection title="Extras">
            <ModenaSection
              premarco={config.premarco}
              contramarco={config.contramarco}
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
            />
          </FormSection>
        )}

        {showVertical && (
          <FormSection title="Refuerzo vertical">
            <label className="flex items-center gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={config.travesanoVertical}
                onChange={(e) =>
                  updateConfig({
                    travesanoVertical: e.target.checked,
                  })
                }
              />
              Agregar travesaño vertical visible
            </label>
          </FormSection>
        )}

        {showHorizontal && (
          <FormSection title="Refuerzo horizontal">
            <label className="flex items-center gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={config.travesanoHorizontal}
                onChange={(e) =>
                  updateConfig({
                    travesanoHorizontal: e.target.checked,
                  })
                }
              />
              Agregar travesaño horizontal visible
            </label>
          </FormSection>
        )}
        {showWarning && (
          <AlertBox type="warning">
            Aunque no se visualice el travesaño, el refuerzo estructural está
            incluido en el precio.
          </AlertBox>
        )}

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
