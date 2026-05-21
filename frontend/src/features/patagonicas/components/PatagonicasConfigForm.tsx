import type { PatagonicasConfig } from "../types";

import { PATAGONICAS_UI } from "../ui";

import { usePatagonicasForm } from "../hooks/usePatagonicasForm";

import { usePatagonicasValidation } from "../hooks/usePatagonicasValidation";

import { useCotizarPatagonicas } from "../hooks/useCotizarPatagonicas";

import { createPatagonicasBudgetItem } from "../utils/createPatagonicasBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

import { CortinasSection } from "@/shared/sections/CortinasSection";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { ExtrasSection } from "@/shared/sections/ExtrasSection";

import { ModenaSection } from "@/shared/sections/ModenaSection";

import { OptionSelector } from "@/shared/selectors/OptionSelector";

import { ladosPatagonicas } from "../constants";

import { medidasRajaPatagonicas } from "../constants";

import { Input } from "@/components/ui/input";

type Props = {
  config: PatagonicasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PatagonicasConfig>>;
};

export function PatagonicasConfigForm({
  config,

  setConfig,
}: Props) {
  const cotizacionMutation = useCotizarPatagonicas();

  const {
    updateConfig,

    switchLinea,

    anchoInput,

    altoInput,

    handleAnchoChange,

    handleAltoChange,
  } = usePatagonicasForm({
    config,

    setConfig,
  });

  const {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  } = usePatagonicasValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    createItem: createPatagonicasBudgetItem,
  });

  return (
    <ProductFormLayout title={PATAGONICAS_UI.title}>
      <div className="space-y-6">
        {/* SISTEMA */}

        <FormSection title={PATAGONICAS_UI.sections.sistema}>
          <div className="space-y-4">
            <LineaSelector
              value={config.linea}
              options={PATAGONICAS_UI.selectors?.lineas || []}
              onChange={(value) => switchLinea(value)}
            />

            <OptionSelector
              title="Tipo"
              value={config.tipo}
              options={[
                {
                  label: "1 Raja",
                  value: "1_raja",
                },
                {
                  label: "2 Rajas",
                  value: "2_rajas",
                },
              ]}
              onChange={(value) =>
                updateConfig({
                  tipo: value as PatagonicasConfig["tipo"],

                  cantidadRajas: value === "1_raja" ? 1 : 2,
                })
              }
            />

            {config.tipo === "1_raja" && (
              <>
                <OptionSelector
                  title="Ubicación de la raja"
                  value={config.ladoApertura}
                  options={ladosPatagonicas}
                  onChange={(value) =>
                    updateConfig({
                      ladoApertura: value as PatagonicasConfig["ladoApertura"],
                    })
                  }
                />

                <OptionSelector
                  title="Bisagra"
                  value={config.bisagraRaja1}
                  options={[
                    {
                      label: "Bisagra izquierda",
                      value: "izquierda",
                    },
                    {
                      label: "Bisagra derecha",
                      value: "derecha",
                    },
                  ]}
                  onChange={(value) =>
                    updateConfig({
                      bisagraRaja1: value as "izquierda" | "derecha",
                    })
                  }
                />
              </>
            )}

            {config.tipo === "2_rajas" && (
              <>
                <OptionSelector
                  title="Bisagra raja izquierda"
                  value={config.bisagraRaja1}
                  options={[
                    {
                      label: "Izquierda",
                      value: "izquierda",
                    },
                    {
                      label: "Derecha",
                      value: "derecha",
                    },
                  ]}
                  onChange={(value) =>
                    updateConfig({
                      bisagraRaja1: value as "izquierda" | "derecha",
                    })
                  }
                />

                <OptionSelector
                  title="Bisagra raja derecha"
                  value={config.bisagraRaja2}
                  options={[
                    {
                      label: "Izquierda",
                      value: "izquierda",
                    },
                    {
                      label: "Derecha",
                      value: "derecha",
                    },
                  ]}
                  onChange={(value) =>
                    updateConfig({
                      bisagraRaja2: value as "izquierda" | "derecha",
                    })
                  }
                />
              </>
            )}
          </div>
        </FormSection>

        {/* MEDIDAS */}

        <FormSection title={PATAGONICAS_UI.sections.medidas}>
          <div className="space-y-4">
            <OptionSelector
              title="Ancho de raja"
              value={String(config.anchoRaja)}
              options={medidasRajaPatagonicas.map((medida) => ({
                label: medida.label,

                value: String(medida.value),
              }))}
              disabled={config.fueraDeMedida}
              onChange={(value) =>
                updateConfig({
                  anchoRaja: Number(value),
                })
              }
            />

            <div
              onClick={() =>
                updateConfig({
                  fueraDeMedida: !config.fueraDeMedida,
                })
              }
              className={`
                flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all
                ${
                  config.fueraDeMedida
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                }
              `}
            >
              <div>
                <p className="text-sm font-medium">Fuera de medida</p>

                <p className="text-xs text-muted-foreground">
                  Permitir ancho personalizado
                </p>
              </div>

              <div
                className={`
                  relative h-6 w-11 rounded-full transition-all
                  ${config.fueraDeMedida ? "bg-primary" : "bg-muted"}
                `}
              >
                <div
                  className={`
                    absolute top-1 h-4 w-4 rounded-full bg-white transition-all
                    ${config.fueraDeMedida ? "left-6" : "left-1"}
                  `}
                />
              </div>
            </div>

            {config.fueraDeMedida && (
              <div className="rounded-2xl border border-border bg-card/50 p-4">
                <Input
                  type="number"
                  value={config.anchoRaja || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      updateConfig({
                        anchoRaja: "" as never,
                      });

                      return;
                    }

                    updateConfig({
                      anchoRaja: Number(value),
                    });
                  }}
                  placeholder="Ancho personalizado"
                />
              </div>
            )}

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
          </div>
        </FormSection>

        {!medidasValidas && (
          <AlertBox type="error">
            {PATAGONICAS_UI.messages?.invalidMeasures}
          </AlertBox>
        )}

        {/* VIDRIO */}

        <FormSection title={PATAGONICAS_UI.sections.vidrio}>
          <VidrioSelector
            value={config.tipoVidrio}
            options={
              config.linea === "Herrero"
                ? ["4mm", "3+3", "4+4"]
                : ["4mm", "3+3", "4+4", "DVH 4+9+4", "DVH 5+9+5"]
            }
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as PatagonicasConfig["tipoVidrio"],
              })
            }
          />
        </FormSection>

        {/* EXTRAS */}

        <FormSection title={PATAGONICAS_UI.sections.extras}>
          <div className="space-y-4">
            <ExtrasSection
              mosquitero={config.mosquitero}
              guia={config.guia}
              cajonBlock={config.cajonBlock}
              onToggleMosquitero={() =>
                updateConfig({
                  mosquitero: !config.mosquitero,
                })
              }
              onToggleGuia={() =>
                updateConfig({
                  guia: !config.guia,
                })
              }
              onToggleCajonBlock={() =>
                updateConfig({
                  cajonBlock: !config.cajonBlock,
                })
              }
            />

            {config.guia && (
              <FormSection title="Cortinas">
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
                      cortina:
                        config.cortina === "aluminio" ? null : "aluminio",
                    })
                  }
                />
              </FormSection>
            )}

            {config.linea === "Modena" && (
              <ModenaSection
                premarco={config.premarco}
                contramarco={config.contramarco}
                onTogglePremarco={() =>
                  updateConfig({
                    premarco: !config.premarco,
                  })
                }
                onToggleContramarco={() =>
                  updateConfig({
                    contramarco: !config.contramarco,
                  })
                }
              />
            )}
          </div>
        </FormSection>

        {/* ERROR */}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {PATAGONICAS_UI.messages?.quotationError}
          </AlertBox>
        )}

        {/* FOOTER */}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PATAGONICAS_UI.actions?.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              {PATAGONICAS_UI.messages?.reviewLimits}
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
