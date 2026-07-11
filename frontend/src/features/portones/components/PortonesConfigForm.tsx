import type { PortonesConfig } from "../types";

import { PORTONES_UI } from "../ui";

import { usePortonesForm } from "../hooks/usePortonesForm";
import { usePortonesValidation } from "../hooks/usePortonesValidation";
import { useCotizarPortones } from "../hooks/useCotizarPortones";
import { createPortonesBudgetItem } from "../utils/createPortonesBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";
import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";
import { FormSection } from "@/shared/sections/FormSection";
import { FormFooter } from "@/shared/sections/FormFooter";
import { DimensionsSection } from "@/shared/sections/DimensionsSection";
import { LineaSelector } from "@/shared/selectors/LineaSelector";
import { VidrioSelector } from "@/shared/selectors/VidrioSelector";
import { ColorSelector } from "@/shared/selectors/ColorSelector";
import { AlertBox } from "@/shared/components/AlertBox";
import { PrimaryButton } from "@/shared/buttons/PrimaryButton";
import { SelectableCard } from "@/components/ui/selectable-card";
import { PortonBlueprintSelector } from "./PortonBlueprintSelector";

type Props = {
  config: PortonesConfig;
  setConfig: React.Dispatch<React.SetStateAction<PortonesConfig>>;
};

const MODELOS = [
  "modelo 1",
  "modelo 2",
  "modelo 3",
  "modelo 4",
  "modelo 4 vr",
  "modelo 5",
];

export function PortonesConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarPortones();

  const {
    updateConfig,
    switchLinea,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
    hojasDisponibles,
  } = usePortonesForm({
    config,
    setConfig,
  });

  const { limites, anchoValido, altoValido, medidasValidas, medidasInvalidas } =
    usePortonesValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,
    config,
    createItem: createPortonesBudgetItem,
  });

  const tieneBarral =
    !!config.extras?.barralRecto || !!config.extras?.barralCurvo;

  const permiteDobleTravesano =
    config.sistema === "abrir" &&
    ["modelo 4", "modelo 4 vr", "modelo 5"].includes(config.modelo);

  return (
    <ProductFormLayout title="Portones">
      <div className="space-y-6">
        <FormSection title="Sistema">
          <div className="space-y-4">
            <LineaSelector
              id="portones-linea"
              value={config.linea}
              options={PORTONES_UI.selectors?.lineas || []}
              onChange={(value) => switchLinea(value)}
            />

            <LineaSelector
              id="portones-sistema"
              value={config.sistema}
              options={[
                { label: "Abrir", value: "abrir" },
                { label: "Corredizo", value: "corredizo" },
                { label: "Plegadizo", value: "plegadizo" },
              ]}
              onChange={(value) =>
                updateConfig({
                  sistema: value as PortonesConfig["sistema"],
                })
              }
            />
          </div>
        </FormSection>

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

        <FormSection title="Cantidad de hojas">
          <div className="grid grid-cols-4 gap-3">
            {[3, 4, 5, 6].map((hojas) => {
              const enabled = hojasDisponibles.includes(hojas as 3 | 4 | 5 | 6);

              return (
                <SelectableCard
                  key={hojas}
                  disabled={!enabled}
                  selected={config.hojas === hojas}
                  onClick={() => {
                    if (!enabled) return;

                    updateConfig({
                      hojas: hojas as PortonesConfig["hojas"],
                      hojaPrincipal: 1,
                    });
                  }}
                >
                  {hojas} hojas
                </SelectableCard>
              );
            })}
          </div>
        </FormSection>

        <FormSection title="Apertura">
          <PortonBlueprintSelector
            hojas={config.hojas}
            mano={config.mano}
            sistema={config.sistema}
            onChange={({ mano }) =>
              updateConfig({
                mano,
              })
            }
          />

          <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center text-sm text-zinc-400">
            Actualmente:
            <span className="ml-2 font-bold text-lime-400">
              {config.hojas} hojas
            </span>
          </div>
        </FormSection>

        <FormSection title="Modelo">
          <div className="grid grid-cols-2 gap-3">
            {MODELOS.map((modelo) => (
              <SelectableCard
                key={modelo}
                selected={config.modelo === modelo}
                onClick={() => updateConfig({ modelo })}
              >
                {modelo}
              </SelectableCard>
            ))}
          </div>
        </FormSection>
        {permiteDobleTravesano && (
          <SelectableCard
            selected={!!config.extras.dobleTravesano}
            onClick={() =>
              updateConfig({
                extras: {
                  ...config.extras,
                  dobleTravesano: !config.extras.dobleTravesano,
                },
              })
            }
          >
            Doble travesaño
          </SelectableCard>
        )}

        <FormSection title="Vidrio">
          <VidrioSelector
            value={config.tipoVidrio || "4mm"}
            options={["3mm", "4mm", "5mm", "3+3", "DVH 4+9+4", "DVH 5+9+5"]}
            onChange={(value) =>
              updateConfig({
                tipoVidrio: value as PortonesConfig["tipoVidrio"],
              })
            }
          />
        </FormSection>

        {config.linea === "modena" && (
          <FormSection title="Premarcos">
            <div className="grid grid-cols-2 gap-3">
              <SelectableCard
                selected={!!config.premarco}
                onClick={() =>
                  updateConfig({
                    premarco: !config.premarco,
                  })
                }
              >
                Premarco
              </SelectableCard>

              <SelectableCard
                selected={!!config.contramarco}
                onClick={() =>
                  updateConfig({
                    contramarco: !config.contramarco,
                  })
                }
              >
                Contramarco
              </SelectableCard>
            </div>
          </FormSection>
        )}

        <FormSection title="Extras">
          <div className="grid grid-cols-2 gap-3">
            <SelectableCard
              selected={!!config.extras.barralRecto}
              onClick={() =>
                updateConfig({
                  extras: {
                    ...config.extras,
                    barralRecto: config.extras.barralRecto ? 0 : 1,
                    barralCurvo: 0,
                    picaporte: false,
                    mediaManija: false,
                  },
                })
              }
            >
              Barral recto
            </SelectableCard>

            <SelectableCard
              selected={!!config.extras.barralCurvo}
              onClick={() =>
                updateConfig({
                  extras: {
                    ...config.extras,
                    barralCurvo: config.extras.barralCurvo ? 0 : 1,
                    barralRecto: 0,
                    picaporte: false,
                    mediaManija: false,
                  },
                })
              }
            >
              Barral curvo
            </SelectableCard>

            <SelectableCard
              selected={!!config.extras.picaporte}
              onClick={() =>
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
            >
              Picaporte
            </SelectableCard>

            {tieneBarral && (
              <SelectableCard
                selected={!!config.extras.mediaManija}
                onClick={() =>
                  updateConfig({
                    extras: {
                      ...config.extras,
                      mediaManija: !config.extras.mediaManija,
                    },
                  })
                }
              >
                Media manija
              </SelectableCard>
            )}

            <SelectableCard
              selected={!!config.extras.cartelprohibido}
              onClick={() =>
                updateConfig({
                  extras: {
                    ...config.extras,
                    cartelprohibido: !config.extras.cartelprohibido,
                  },
                })
              }
            >
              Cartel prohibido
            </SelectableCard>
          </div>
        </FormSection>

        <FormSection title="Color">
          <ColorSelector
            value={config.color}
            onChange={(color) =>
              updateConfig({
                color: color as PortonesConfig["color"],
              })
            }
          />
        </FormSection>

        {!medidasValidas && (
          <AlertBox type="error">Medidas / sistema / hojas inválidos.</AlertBox>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">Error al cotizar portón.</AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            Agregar al presupuesto
          </PrimaryButton>

          {medidasInvalidas && (
            <AlertBox type="error">
              Revisá medidas y cantidad de hojas.
            </AlertBox>
          )}
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
