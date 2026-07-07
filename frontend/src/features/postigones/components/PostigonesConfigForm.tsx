import { useEffect } from "react";

import type { PostigonesConfig, HojaCierrePostigon } from "../types";

import { POSTIGONES_UI } from "../ui";

import { usePostigonesForm } from "../hooks/usePostigonesForm";

import { getPostigonesHojasOptions } from "../utils/getPostigonesHojasOptions";

import { getDefaultHojaCierre } from "../utils/getDefaultHojaCierre";

import { usePostigonesValidation } from "../hooks/usePostigonesValidation";

import { useCotizarPostigones } from "../hooks/useCotizarPostigones";

import { createPostigonesBudgetItem } from "../utils/createPostigonesBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { OptionSelector } from "@/shared/selectors/OptionSelector";

import { coloresPostigones } from "../constants";

type Props = {
  config: PostigonesConfig;

  setConfig: React.Dispatch<React.SetStateAction<PostigonesConfig>>;
};

export function PostigonesConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarPostigones();

  const {
    updateConfig,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  } = usePostigonesForm({
    config,
    setConfig,
  });

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    usePostigonesValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    createItem: createPostigonesBudgetItem,
  });

  const hojasDisponibles = getPostigonesHojasOptions({
    tipo: config.tipo,

    ancho: config.ancho,
  });

  useEffect(() => {
    const hojaValida = hojasDisponibles.includes(config.cantidadHojas);

    if (!hojaValida) {
      const hojas = hojasDisponibles[0];

      updateConfig({
        cantidadHojas: hojas,

        hojaCierre: getDefaultHojaCierre(hojas),
      });
    }
  }, [hojasDisponibles, config.cantidadHojas, updateConfig]);

  return (
    <ProductFormLayout title={POSTIGONES_UI.title}>
      <div className="space-y-6">
        <FormSection title={POSTIGONES_UI.sections.tipo}>
          <LineaSelector
            id="postigones-tipo"
            value={config.tipo}
            options={[
              {
                label: "De abrir",
                value: "abrir",
              },
              {
                label: "Corredizo",
                value: "corredizo",
              },
            ]}
            onChange={(value) =>
              updateConfig({
                tipo: value as PostigonesConfig["tipo"],
                marco: value === "corredizo" ? "ancho" : config.marco,
              })
            }
          />
        </FormSection>

        <FormSection title={POSTIGONES_UI.sections.medidas}>
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

        <FormSection title="Configuración">
          <div className="space-y-6">
            <OptionSelector
              title="Cantidad de hojas"
              value={String(config.cantidadHojas)}
              columns={2}
              options={hojasDisponibles.map((hojas) => ({
                label: `${hojas} hojas`,

                value: String(hojas),
              }))}
              onChange={(value) =>
                updateConfig({
                  cantidadHojas: Number(value) as 2 | 3 | 4,

                  hojaCierre: getDefaultHojaCierre(Number(value) as 2 | 3 | 4),
                })
              }
            />

            {config.tipo === "abrir" && (
              <OptionSelector
                title="Hoja de cierre"
                value={config.hojaCierre}
                columns={2}
                options={
                  config.cantidadHojas === 2
                    ? [
                        {
                          label: "Hoja izquierda",
                          value: "izquierda",
                        },
                        {
                          label: "Hoja derecha",
                          value: "derecha",
                        },
                      ]
                    : config.cantidadHojas === 3
                      ? [
                          {
                            label: "Hoja izquierda",
                            value: "hoja-izquierda",
                          },
                          {
                            label: "Centro izquierda",
                            value: "centro-izquierda",
                          },
                          {
                            label: "Centro derecha",
                            value: "centro-derecha",
                          },
                          {
                            label: "Hoja derecha",
                            value: "hoja-derecha",
                          },
                        ]
                      : [
                          {
                            label: "Centro izquierda",
                            value: "centro-izquierda",
                          },
                          {
                            label: "Centro derecha",
                            value: "centro-derecha",
                          },
                        ]
                }
                onChange={(value) =>
                  updateConfig({
                    hojaCierre: value as HojaCierrePostigon,
                  })
                }
              />
            )}
            <AlertBox type="warning">
              MIRANDO DESDE EL INTERIOR, SIEMPRE EMPUJANDO.
            </AlertBox>
            <OptionSelector
              title="Color"
              value={config.color}
              columns={2}
              options={coloresPostigones.map((color) => ({
                label: color.label,

                value: color.value,

                colorClass: color.clase,
              }))}
              onChange={(value) =>
                updateConfig({
                  color: value as PostigonesConfig["color"],
                })
              }
            />
          </div>

          {config.tipo === "abrir" && (
            <OptionSelector
              title="Marco"
              value={config.marco || "ancho"}
              columns={2}
              options={[
                {
                  label: "Ancho",
                  value: "ancho",
                },

                {
                  label: "Fino",
                  value: "fino",
                },
              ]}
              onChange={(value) =>
                updateConfig({
                  marco: value as "ancho" | "fino",
                })
              }
            />
          )}
        </FormSection>

        <FormSection title="Opciones">
          <div className="space-y-4">
            <OptionSelector
              title="Microperforado"
              value={config.microperforado ? "si" : "no"}
              columns={2}
              options={[
                {
                  label: "Sí",
                  value: "si",
                },

                {
                  label: "No",
                  value: "no",
                },
              ]}
              onChange={(value) =>
                updateConfig({
                  microperforado: value === "si",
                })
              }
            />

            <OptionSelector
              title="Herrajes blancos"
              value={config.herrajeBlanco ? "si" : "no"}
              columns={2}
              options={[
                {
                  label: "Sí",
                  value: "si",
                },

                {
                  label: "No",
                  value: "no",
                },
              ]}
              onChange={(value) =>
                updateConfig({
                  herrajeBlanco: value === "si",
                })
              }
            />
          </div>
        </FormSection>

        {!medidasValidas && (
          <AlertBox type="error">
            {POSTIGONES_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {POSTIGONES_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {POSTIGONES_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {POSTIGONES_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
