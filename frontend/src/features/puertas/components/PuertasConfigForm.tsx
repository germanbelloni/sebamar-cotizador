import type { PuertasConfig } from "../types";

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

import { SelectableCard } from "@/components/ui/selectable-card";

import { PuertasExtrasSection } from "./sections/PuertasExtrasSection";

import { getAvailableDoorModels } from "../models/utils/getAvailableDoorModels";

import { ModelImageCard } from "./ModelImageCard";

import { PUERTAS_IMAGE_REGISTRY } from "../models/imageRegistry";

import { MEDIA_DOOR_REGISTRY } from "../models/mediaDoorRegistry";

import { MediaDoorPreview } from "./MediaDoorPreview";

import { calcularHojasPorton } from "../utils/calcularHojasPorton";

type Props = {
  config: PuertasConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function PuertasConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarPuertas();

  const {
    updateConfig,
    switchLinea,
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

    createItem: createPuertasBudgetItem,
  });

  const modelos = getAvailableDoorModels(config.linea);
  const modelosVisuales = [...modelos];

  const indexPanel = modelosVisuales.indexOf("modelo_panel");

  if (indexPanel !== -1) {
    modelosVisuales.splice(
      indexPanel + 1,
      0,
      "modelo_panel_barral_recto",
      "modelo_panel_barral_curvo",
    );
  }

  const vidrios = VIDRIOS_POR_LINEA[config.linea];

  const presets = PRESETS_PUERTAS[config.tipoConfiguracion];

  const esPorton = config.tipoConfiguracion === "porton";

  const esPuertaYMedia = config.tipoConfiguracion === "puerta_y_media";

  const getImageSrc = (modelo: string) => {
    let normalized = modelo
      .replace("modelo_", "m")
      .replaceAll(" ", "")
      .replaceAll("_", "");
    if (modelo === "modelo_c_panel") {
      normalized = "mpanel";
    }

    // ========================
    // HACK PANEL + BARRAL
    // ========================
    if (modelo === "modelo_panel") {
      if (config.extras?.barralRecto) {
        normalized = "mpanelbarralrecto";
      }

      if (config.extras?.barralCurvo) {
        normalized = "mpanelbarralcurvo";
      }

      if (!config.extras?.barralRecto && !config.extras?.barralCurvo) {
        normalized = "mpanel";
      }
    }

    let folder: "simples" | "dobles" | "portones" = "simples";

    if (config.tipoConfiguracion === "doble") {
      folder = "dobles";
    }

    if (config.tipoConfiguracion === "porton") {
      folder = "portones";
    }

    const filename =
      PUERTAS_IMAGE_REGISTRY[folder][
        normalized as keyof (typeof PUERTAS_IMAGE_REGISTRY)[typeof folder]
      ];
    if (!filename) {
      return "";
    }
    return `/assets/puertas/${folder}/${filename}.png`;
  };
  const getModeloLabel = (modelo: string) => {
    if (modelo === "modelo_panel") {
      return "Panel";
    }

    if (modelo === "modelo_panel_barral_recto") {
      return "Panel + Barral Recto";
    }

    if (modelo === "modelo_panel_barral_curvo") {
      return "Panel + Barral Curvo";
    }

    return modelo
      .replace("modelo_", "M")
      .replaceAll("_vr", " VR")
      .replaceAll("_", " ");
  };

  const isModeloSelected = (modelo: string) => {
    if (modelo === "modelo_panel") {
      return (
        config.modelo === "modelo_panel" &&
        !config.extras?.barralRecto &&
        !config.extras?.barralCurvo
      );
    }

    if (modelo === "modelo_panel_barral_recto") {
      return config.modelo === "modelo_panel" && !!config.extras?.barralRecto;
    }

    if (modelo === "modelo_panel_barral_curvo") {
      return config.modelo === "modelo_panel" && !!config.extras?.barralCurvo;
    }

    return config.modelo === modelo;
  };

  const modeloSinVidrio =
    config.modelo === "modelo_5" ||
    config.modelo === "modelo_panel" ||
    config.modelo === "modelo_c_panel";

  const esFueraDeMedida = !presets.some(
    (preset) =>
      !preset.custom &&
      preset.ancho === config.ancho &&
      preset.alto === config.alto,
  );
  console.log("CONFIG", config.ancho, config.alto);
  console.log(
    "PRESETS",
    presets.map((p) => ({
      label: p.label,
      ancho: p.ancho,
      alto: p.alto,
    })),
  );
  console.log("CONFIG PUERTAS", {
    ancho: config.ancho,
    alto: config.alto,
    anchoType: typeof config.ancho,
    altoType: typeof config.alto,
  });
  return (
    <ProductFormLayout title={PUERTAS_UI.title}>
      <div className="space-y-6">
        <FormSection title="Línea">
          <LineaSelector
            id="puertas-linea"
            label=""
            value={config.linea}
            options={PUERTAS_LINEAS}
            onChange={(value) => switchLinea(value as PuertasConfig["linea"])}
          />
        </FormSection>

        <FormSection title="Configuración">
          <LineaSelector
            id="puertas-config"
            label=""
            value={config.tipoConfiguracion}
            options={PUERTAS_TIPOS}
            onChange={(value) => {
              const tipo = value as PuertasConfig["tipoConfiguracion"];

              let hojas = 1;

              if (tipo === "doble") {
                hojas = 2;
              }

              if (tipo === "porton") {
                hojas = 3;
              }

              updateConfig({
                tipoConfiguracion: tipo,

                hojas,
                ancho:
                  tipo === "simple"
                    ? 80
                    : tipo === "puerta_y_media"
                      ? 120
                      : tipo === "doble"
                        ? 160
                        : 240,

                alto: 200,
              });
            }}
          />
        </FormSection>

        <FormSection title="Medidas estándar">
          <div className="grid grid-cols-3 gap-3">
            {presets
              .filter((preset) => !preset.custom)
              .map((preset) => {
                const isSelected =
                  config.ancho === preset.ancho && config.alto === preset.alto;

                console.log(preset.label, isSelected);

                return (
                  <SelectableCard
                    key={preset.label}
                    selected={isSelected}
                    onClick={() =>
                      updateConfig({
                        ancho: preset.ancho,
                        alto: preset.alto,
                        hojas:
                          config.tipoConfiguracion === "porton"
                            ? calcularHojasPorton(preset.ancho)
                            : config.tipoConfiguracion === "doble"
                              ? 2
                              : 1,
                        anchoPrincipal:
                          "principal" in preset
                            ? Number(preset.principal ?? preset.ancho)
                            : preset.ancho,
                      })
                    }
                  >
                    <div className="flex h-14 items-center justify-center text-base font-semibold">
                      {preset.label}
                    </div>
                  </SelectableCard>
                );
              })}
          </div>

          <div className="mt-3 w-full">
            <SelectableCard
              selected={esFueraDeMedida}
              onClick={() => {
                const medidas =
                  config.tipoConfiguracion === "simple"
                    ? { ancho: 85, alto: 205 }
                    : config.tipoConfiguracion === "puerta_y_media"
                      ? { ancho: 125, alto: 205 }
                      : config.tipoConfiguracion === "doble"
                        ? { ancho: 170, alto: 205 }
                        : { ancho: 260, alto: 210 };

                updateConfig({
                  ancho: medidas.ancho,
                  alto: medidas.alto,
                  hojas:
                    config.tipoConfiguracion === "porton"
                      ? calcularHojasPorton(medidas.ancho)
                      : config.tipoConfiguracion === "doble"
                        ? 2
                        : 1,
                });
              }}
            >
              <div className="flex h-14 items-center justify-center text-base font-semibold">
                Fuera de medida
              </div>
            </SelectableCard>
          </div>
        </FormSection>

        {esFueraDeMedida && (
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
        )}

        {esPorton && (
          <FormSection title="Sistema">
            <LineaSelector
              id="puertas-sistema"
              label=""
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

        <AlertBox type="warning">
          ⚠️ Mano y apertura siempre se interpretan desde la vista EXTERIOR
          (empujando).
        </AlertBox>

        <FormSection title="Modelo">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {modelosVisuales.map((modelo: string) => (
              <ModelImageCard
                key={modelo}
                imageSrc={getImageSrc(modelo)}
                label={getModeloLabel(modelo)}
                selected={isModeloSelected(modelo)}
                onClick={() => {
                  if (modelo === "modelo_panel") {
                    updateConfig({
                      modelo: "modelo_panel",
                      extras: {
                        ...config.extras,
                        barralRecto: 0,
                        barralCurvo: 0,
                        picaporte: false,
                        mediaManija: false,
                      },
                    });
                    return;
                  }

                  if (modelo === "modelo_panel_barral_recto") {
                    updateConfig({
                      modelo: "modelo_panel",
                      extras: {
                        ...config.extras,
                        barralRecto: 1,
                        barralCurvo: 0,
                        picaporte: false,
                        mediaManija: false,
                      },
                    });
                    return;
                  }

                  if (modelo === "modelo_panel_barral_curvo") {
                    updateConfig({
                      modelo: "modelo_panel",
                      extras: {
                        ...config.extras,
                        barralRecto: 0,
                        barralCurvo: 1,
                        picaporte: false,
                        mediaManija: false,
                      },
                    });
                    return;
                  }

                  updateConfig({
                    modelo,
                  });
                }}
              />
            ))}
          </div>
        </FormSection>

        {esPuertaYMedia && config.linea !== "eco" && (
          <FormSection title="Modelo media puerta">
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(MEDIA_DOOR_REGISTRY).map(([key, item]) => (
                <SelectableCard
                  key={key}
                  selected={config.modeloMediaPuerta === key}
                  onClick={() =>
                    updateConfig({
                      modeloMediaPuerta: key,
                    })
                  }
                >
                  <div className="flex min-h-[180px] flex-col items-center justify-center gap-3">
                    <div
                      className="
        flex
        h-32
        w-full
        items-center
        justify-center
        rounded-xl
        border
        border-white/10
        bg-black/20
        p-2
      "
                    >
                      <MediaDoorPreview
                        model={
                          key as React.ComponentProps<
                            typeof MediaDoorPreview
                          >["model"]
                        }
                      />
                    </div>

                    <div className="text-center text-xs font-medium">
                      {item.label}
                    </div>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </FormSection>
        )}

        {!modeloSinVidrio && (
          <FormSection title="Vidrio">
            <VidrioSelector
              value={config.vidrio || "3mm"}
              options={vidrios}
              onChange={(value) =>
                updateConfig({
                  vidrio: value as PuertasConfig["vidrio"],
                })
              }
            />
          </FormSection>
        )}

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

        <FormSection title="Extras">
          <PuertasExtrasSection
            barralRecto={config.extras.barralRecto}
            barralCurvo={config.extras.barralCurvo}
            picaporte={config.extras.picaporte}
            mediaManija={config.extras.mediaManija}
            onToggleBarralRecto={() =>
              updateConfig({
                extras: {
                  ...config.extras,
                  barralRecto: config.extras.barralRecto ? 0 : 1,
                  barralCurvo: 0,
                  picaporte: false,
                },
              })
            }
            onToggleBarralCurvo={() =>
              updateConfig({
                extras: {
                  ...config.extras,
                  barralCurvo: config.extras.barralCurvo ? 0 : 1,
                  barralRecto: 0,
                  picaporte: false,
                },
              })
            }
            onTogglePicaporte={() =>
              updateConfig({
                extras: {
                  ...config.extras,
                  picaporte: !config.extras.picaporte,
                  barralRecto: 0,
                  barralCurvo: 0,
                  mediaManija: false,
                },
              })
            }
            onToggleMediaManija={() => {
              const tieneBarral =
                !!config.extras.barralRecto || !!config.extras.barralCurvo;

              if (!tieneBarral) {
                return;
              }

              updateConfig({
                extras: {
                  ...config.extras,
                  mediaManija: !config.extras.mediaManija,
                },
              });
            }}
          />
        </FormSection>

        {!medidasValidas && (
          <AlertBox type="error">
            {PUERTAS_UI.messages.invalidMeasures}
          </AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">{PUERTAS_UI.messages.quotationError}</AlertBox>
        )}

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
