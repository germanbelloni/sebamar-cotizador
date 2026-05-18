import type { PuertasConfig, PuertasItem } from "../types";

import {
  PRESETS_PUERTAS,
  PUERTAS_LINEAS,
  PUERTAS_TIPOS,
  TIPOS_PORTON,
  VIDRIOS_POR_LINEA,
} from "../constants";

import { PUERTAS_UI } from "../ui";

import { usePuertasForm } from "../hooks/usePuertasForm";

import { usePuertasValidation } from "../hooks/usePuertasValidation";

import { useCotizarPuertas } from "../hooks/useCotizarPuertas";

import { createPuertasBudgetItem } from "../utils/createPuertasBudgetItem";

import { useBudgetAdder } from "@/shared/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { DimensionsSection } from "@/shared/sections/DimensionsSection";

import { LineaSelector } from "@/shared/selectors/LineaSelector";

import { ColorSelector } from "@/shared/selectors/ColorSelector";

import { VidrioSelector } from "@/shared/selectors/VidrioSelector";

import { BisagraSelector } from "@/shared/selectors/BisagraSelector";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { SelectableCard } from "@/components/ui/selectable-card";

import { PuertasExtrasSection } from "./sections/PuertasExtrasSection";

import { getAvailableDoorModels } from "../models/utils/getAvailableDoorModels";

import { MODELOS_PUERTAS_CONFIG } from "../models/registry";

import { DoorRenderer } from "../svg/components/DoorRenderer";

import { DoorPreviewCard } from "../svg/components/DoorPreviewCard";

type Props = {
  config: PuertasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;

  setItems: React.Dispatch<React.SetStateAction<PuertasItem[]>>;
};

export function PuertasConfigForm({ config, setConfig, setItems }: Props) {
  const cotizacionMutation = useCotizarPuertas();

  const {
    updateConfig,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  } = usePuertasForm({
    config,
    setConfig,
  });

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    usePuertasValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,
    config,
    setItems,
    createItem: createPuertasBudgetItem,
  });
  const modelos = getAvailableDoorModels(config.linea);

  const vidrios = VIDRIOS_POR_LINEA[config.linea];

  const presets = PRESETS_PUERTAS[config.tipoConfiguracion];

  const esPorton = config.tipoConfiguracion === "porton";

  const esPuertaYMedia = config.tipoConfiguracion === "puerta_y_media";

  return (
    <ProductFormLayout title={PUERTAS_UI.title}>
      <div className="space-y-6">
        {/* LINEA */}

        <FormSection title="Línea">
          <LineaSelector
            value={config.linea}
            options={PUERTAS_LINEAS}
            onChange={(value) =>
              updateConfig({
                linea: value as PuertasConfig["linea"],
              })
            }
          />
        </FormSection>

        {/* TIPO */}

        <FormSection title="Configuración">
          <LineaSelector
            value={config.tipoConfiguracion}
            options={PUERTAS_TIPOS}
            onChange={(value) =>
              updateConfig({
                tipoConfiguracion: value as PuertasConfig["tipoConfiguracion"],
              })
            }
          />
        </FormSection>

        {/* PRESETS */}

        <FormSection title="Medidas estándar">
          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset) => (
              <SelectableCard
                key={preset.label}
                selected={
                  config.ancho === preset.ancho && config.alto === preset.alto
                }
                onClick={() =>
                  updateConfig({
                    ancho: preset.ancho,
                    alto: preset.alto,

                    anchoPrincipal:
                      "principal" in preset
                        ? preset.principal
                        : config.anchoPrincipal,
                  })
                }
              >
                <div className="text-sm font-medium">{preset.label}</div>
              </SelectableCard>
            ))}
          </div>
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

        {/* MODELOS */}

        <FormSection title="Modelo">
          <div className="grid grid-cols-2 gap-3">
            {modelos.map((modelo: string) => (
              <DoorPreviewCard
                key={modelo}
                label={modelo.replaceAll("_", " ")}
                selected={config.modelo === modelo}
                onClick={() =>
                  updateConfig({
                    modelo,
                  })
                }
              >
                <svg viewBox="0 0 140 240" className="h-full w-full">
                  <DoorRenderer
                    config={config}
                    model={
                      MODELOS_PUERTAS_CONFIG[
                        modelo as keyof typeof MODELOS_PUERTAS_CONFIG
                      ]
                    }
                    color="#D6D3D1"
                    x={38}
                    y={14}
                    width={64}
                    height={210}
                  />
                </svg>
              </DoorPreviewCard>
            ))}
          </div>
        </FormSection>

        {/* MEDIA PUERTA */}

        {esPuertaYMedia && (
          <FormSection title="Modelo media puerta">
            <div className="grid grid-cols-2 gap-3">
              {[
                "v_entero",
                "v_repartido",
                "3_4_v_entero",
                "3_4_v_repartido",
                "1_2_v_entero",
                "1_2_v_repartido",
                "4_travesanos",
                "1_travesano",
              ].map((modelo) => (
                <SelectableCard
                  key={modelo}
                  selected={config.modeloMediaPuerta === modelo}
                  onClick={() =>
                    updateConfig({
                      modelo: modelo as PuertasConfig["modelo"],
                    })
                  }
                >
                  {modelo.replaceAll("_", " ")}
                </SelectableCard>
              ))}
            </div>
          </FormSection>
        )}

        {/* VIDRIO */}

        <FormSection title="Vidrio">
          <VidrioSelector
            value={config.vidrio || "4mm"}
            options={vidrios}
            onChange={(value) =>
              updateConfig({
                vidrio: value as PuertasConfig["vidrio"],
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
                color: color as PuertasConfig["color"],
              })
            }
          />
        </FormSection>

        {/* MANO */}

        <FormSection title="Mano">
          <BisagraSelector
            value={config.mano}
            onChange={(value) =>
              updateConfig({
                mano: value as PuertasConfig["mano"],
              })
            }
          />
        </FormSection>

        {/* PORTON */}

        {esPorton && (
          <FormSection title="Sistema">
            <LineaSelector
              value={config.tipoPorton}
              options={TIPOS_PORTON}
              onChange={(value) =>
                updateConfig({
                  tipoPorton: value as PuertasConfig["tipoPorton"],
                })
              }
            />
          </FormSection>
        )}

        {/* EXTRAS */}

        <FormSection title="Extras">
          <PuertasExtrasSection
            barralRecto={config.extras.barralRecto}
            barralCurvo={config.extras.barralCurvo}
            manija={config.extras.manija}
            picaporte={config.extras.picaporte}
            mediaManija={config.extras.mediaManija}
            onToggleBarralRecto={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  barralRecto: config.extras.barralRecto ? 0 : 1,

                  barralCurvo: 0,
                },
              })
            }
            onToggleBarralCurvo={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  barralCurvo: config.extras.barralCurvo ? 0 : 1,

                  barralRecto: 0,
                },
              })
            }
            onToggleManija={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  manija: !config.extras.manija,
                },
              })
            }
            onTogglePicaporte={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  picaporte: !config.extras.picaporte,
                },
              })
            }
            onToggleMediaManija={() =>
              updateConfig({
                extras: {
                  ...config.extras,

                  mediaManija: !config.extras.mediaManija,
                },
              })
            }
          />
        </FormSection>

        {/* ERRORS */}

        {!medidasValidas && (
          <AlertBox type="error">
            {PUERTAS_UI.messages.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">{PUERTAS_UI.messages.quotationError}</AlertBox>
        )}

        {/* FOOTER */}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PUERTAS_UI.actions.addToBudget}
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">{PUERTAS_UI.messages.reviewLimits}</AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
