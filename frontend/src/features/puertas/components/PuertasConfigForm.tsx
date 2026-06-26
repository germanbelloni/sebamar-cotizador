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

  const vidrios = VIDRIOS_POR_LINEA[config.linea];

  const presets = PRESETS_PUERTAS[config.tipoConfiguracion];

  const esPorton = config.tipoConfiguracion === "porton";

  const esPuertaYMedia = config.tipoConfiguracion === "puerta_y_media";

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

  return (
    <ProductFormLayout title={PUERTAS_UI.title}>
      <div className="space-y-6">
        <FormSection title="Línea">
          <LineaSelector
            label=""
            value={config.linea}
            options={PUERTAS_LINEAS}
            onChange={(value) => switchLinea(value as PuertasConfig["linea"])}
          />
        </FormSection>

        <FormSection title="Configuración">
          <LineaSelector
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
              .map((preset) => (
                <SelectableCard
                  key={preset.label}
                  selected={
                    config.ancho === preset.ancho && config.alto === preset.alto
                  }
                  onClick={() =>
                    updateConfig({
                      ancho: preset.ancho,

                      alto: preset.alto,

                      hojas:
                        config.tipoConfiguracion === "porton"
                          ? 3
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
              ))}
          </div>

          <div className="mt-3 w-full">
            <SelectableCard
              selected={esFueraDeMedida}
              onClick={() =>
                updateConfig({
                  ancho:
                    config.tipoConfiguracion === "simple"
                      ? 85
                      : config.tipoConfiguracion === "puerta_y_media"
                        ? 125
                        : config.tipoConfiguracion === "doble"
                          ? 170
                          : 260,

                  alto: config.tipoConfiguracion === "porton" ? 210 : 205,
                })
              }
            >
              <div className="flex h-14 items-center justify-center text-base font-semibold">
                Fuera de medida
              </div>
            </SelectableCard>
          </div>
        </FormSection>

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
                <svg
                  viewBox="0 0 140 240"
                  className="h-full w-full pointer-events-none"
                >
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

        {esPuertaYMedia && config.linea !== "eco" && (
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
                      modeloMediaPuerta: modelo,
                    })
                  }
                >
                  {modelo.replaceAll("_", " ")}
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

        {esPorton && (
          <FormSection title="Sistema">
            <LineaSelector
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
