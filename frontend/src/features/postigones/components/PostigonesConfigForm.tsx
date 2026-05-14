import { useEffect } from "react";

import type {
  PostigonesConfig,
  PostigonesItem,
  HojaCierrePostigon,
} from "../types";

import { POSTIGONES_UI } from "../ui";

import { usePostigonesForm } from "../hooks/usePostigonesForm";

import { usePostigonesValidation } from "../hooks/usePostigonesValidation";

import { useCotizarPostigones } from "../hooks/useCotizarPostigones";

import { createPostigonesBudgetItem } from "../utils/createPostigonesBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { OptionSelector } from "@/shared/selectors/OptionSelector";

type Props = {
  config: PostigonesConfig;

  setConfig: React.Dispatch<React.SetStateAction<PostigonesConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PostigonesItem[]>>;
};

export function PostigonesConfigForm({
  config,

  setConfig,

  setItems,
}: Props) {
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

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePostigonesValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    setItems,

    createItem: createPostigonesBudgetItem,
  });

  useEffect(() => {
    // CORREDIZO = SIEMPRE 2 HOJAS

    if (config.tipo === "corredizo") {
      if (
        config.cantidadHojas !== 2 ||
        (config.hojaCierre !== "izquierda" && config.hojaCierre !== "derecha")
      ) {
        updateConfig({
          cantidadHojas: 2,

          hojaCierre: "derecha",
        });
      }

      return;
    }

    // HASTA 120

    if (config.ancho <= 120) {
      if (config.cantidadHojas !== 2) {
        updateConfig({
          cantidadHojas: 2,

          hojaCierre: "derecha",
        });
      }
    }

    // 121 A 149

    if (config.ancho >= 121 && config.ancho <= 149) {
      if (config.cantidadHojas !== 2 && config.cantidadHojas !== 3) {
        updateConfig({
          cantidadHojas: 2,

          hojaCierre: "derecha",
        });
      }
    }

    // 150 A 200

    if (config.ancho >= 150 && config.ancho <= 200) {
      if (config.cantidadHojas !== 3) {
        updateConfig({
          cantidadHojas: 3,

          hojaCierre: "centro-derecha",
        });
      }
    }

    // +200

    if (config.ancho > 200) {
      if (config.cantidadHojas !== 3 && config.cantidadHojas !== 4) {
        updateConfig({
          cantidadHojas: 3,

          hojaCierre: "centro-derecha",
        });
      }
    }
  }, [
    config.tipo,
    config.ancho,
    config.cantidadHojas,
    config.hojaCierre,
    updateConfig,
  ]);

  return (
    <ProductFormLayout title={POSTIGONES_UI.title}>
      <div className="space-y-6">
        {/* TIPO */}

        <FormSection title={POSTIGONES_UI.sections.tipo}>
          <LineaSelector
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
              })
            }
          />
        </FormSection>

        {/* MEDIDAS */}

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

        {/* CONFIGURACION */}

        <FormSection title="Configuración">
          <div className="space-y-6">
            {/* HOJAS */}

            <OptionSelector
              title="Cantidad de hojas"
              value={String(config.cantidadHojas)}
              columns={2}
              options={[
                ...(config.tipo === "corredizo"
                  ? [
                      {
                        label: "2 hojas",
                        value: "2",
                      },
                    ]
                  : []),

                ...(config.tipo !== "corredizo" && config.ancho <= 120
                  ? [
                      {
                        label: "2 hojas",
                        value: "2",
                      },
                    ]
                  : []),

                ...(config.tipo !== "corredizo" &&
                config.ancho >= 121 &&
                config.ancho <= 149
                  ? [
                      {
                        label: "2 hojas",
                        value: "2",
                      },

                      {
                        label: "3 hojas",
                        value: "3",
                      },
                    ]
                  : []),

                ...(config.tipo !== "corredizo" &&
                config.ancho >= 150 &&
                config.ancho <= 200
                  ? [
                      {
                        label: "3 hojas",
                        value: "3",
                      },
                    ]
                  : []),

                ...(config.tipo !== "corredizo" && config.ancho > 200
                  ? [
                      {
                        label: "3 hojas",
                        value: "3",
                      },

                      {
                        label: "4 hojas",
                        value: "4",
                      },
                    ]
                  : []),
              ]}
              onChange={(value) =>
                updateConfig({
                  cantidadHojas: Number(value) as 2 | 3 | 4,
                })
              }
            />

            {/* CIERRE */}

            <OptionSelector
              title="Hoja de cierre"
              value={config.hojaCierre}
              columns={2}
              options={
                config.cantidadHojas === 2
                  ? [
                      {
                        label: "Izquierda",
                        value: "izquierda",
                      },

                      {
                        label: "Derecha",
                        value: "derecha",
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

            {/* COLOR */}

            <OptionSelector
              title="Color"
              value={config.color}
              columns={2}
              options={[
                {
                  label: "Blanco",
                  value: "blanco",
                },

                {
                  label: "Negro",
                  value: "negro",
                },

                {
                  label: "Bronce colonial",
                  value: "bronce colonial",
                },

                {
                  label: "Simil madera",
                  value: "simil madera",
                },
              ]}
              onChange={(value) =>
                updateConfig({
                  color: value as PostigonesConfig["color"],
                })
              }
            />
          </div>
        </FormSection>

        {/* OPCIONES */}

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

        {/* ERRORES */}

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

        {/* FOOTER */}

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
