import type { PuertasPlacaConfig } from "../types";

import {
  MARCOS_ABRIR,
  MARCOS_EMBUTIR,
  MEDIDAS_ABRIR,
  MEDIDAS_EMBUTIR,
  MEDIDAS_GRANERO,
  MODELOS_ALUMINIO,
  MODELOS_MARCO_10,
  MODELOS_MARCO_15,
  TIPOS_PUERTA_PLACA,
  MODELOS_GRANERO,
} from "../constants";

import { PUERTAS_PLACA_UI } from "../ui";

import { usePuertasPlacaForm } from "../hooks/usePuertasPlacaForm";

import { usePuertasPlacaValidation } from "../hooks/usePuertasPlacaValidation";

import { useCotizarPuertasPlaca } from "../hooks/useCotizarPuertasPlaca";

import { createPuertasPlacaBudgetItem } from "../utils/createPuertasPlacaBudgetItem";

import { useBudgetAdder } from "@/shared/budget/hooks/useBudgetAdder";

import { ProductFormLayout } from "@/shared/layout/ProductFormLayout";

import { FormSection } from "@/shared/sections/FormSection";

import { FormFooter } from "@/shared/sections/FormFooter";

import { AlertBox } from "@/shared/components/AlertBox";

import { PrimaryButton } from "@/shared/buttons/PrimaryButton";

import { ToggleCard } from "@/shared/cards/ToggleCard";

import { GlassCard } from "@/shared/cards/GlassCard";

type Props = {
  config: PuertasPlacaConfig;

  setConfig: React.Dispatch<React.SetStateAction<PuertasPlacaConfig>>;
};

export function PuertasPlacaConfigForm({ config, setConfig }: Props) {
  const cotizacionMutation = useCotizarPuertasPlaca();

  const {
    updateConfig,
    anchoInput,
    altoInput,
    handleAnchoChange,
    handleAltoChange,
  } = usePuertasPlacaForm({
    config,
    setConfig,
  });

  const { medidasValidas } = usePuertasPlacaValidation(config);

  const { handleAdd } = useBudgetAdder({
    mutation: cotizacionMutation,

    config,

    createItem: createPuertasPlacaBudgetItem,
  });

  const medidas =
    config.tipo === "embutir"
      ? MEDIDAS_EMBUTIR
      : config.tipo === "granero"
        ? MEDIDAS_GRANERO
        : MEDIDAS_ABRIR;

  const marcos = config.tipo === "embutir" ? MARCOS_EMBUTIR : MARCOS_ABRIR;

  const modelos: {
    label: string;

    value: PuertasPlacaConfig["modelo"];
  }[] =
    config.tipo === "granero"
      ? MODELOS_GRANERO
      : config.marco === "aluminio"
        ? MODELOS_ALUMINIO
        : config.marco === "marco_10"
          ? MODELOS_MARCO_10
          : MODELOS_MARCO_15;

  return (
    <ProductFormLayout title={PUERTAS_PLACA_UI.title}>
      <div className="space-y-6">
        {/* SISTEMA */}

        <FormSection title="Sistema">
          <div className="grid grid-cols-3 gap-4">
            {TIPOS_PUERTA_PLACA.map((tipo) => (
              <GlassCard
                key={tipo.value}
                selected={config.tipo === tipo.value}
                onClick={() =>
                  updateConfig({
                    tipo: tipo.value,

                    ancho:
                      tipo.value === "embutir"
                        ? 60
                        : tipo.value === "granero"
                          ? 80
                          : 80,

                    alto: 200,

                    marco:
                      tipo.value === "embutir"
                        ? "marco_15"
                        : tipo.value === "granero"
                          ? "marco_15" // dummy, granero no usa marco
                          : "marco_10",
                    modelo:
                      tipo.value === "granero" ? "granero_z" : "finger_pino",
                  })
                }
              >
                <div
                  className="
                      flex min-h-[110px]
                      flex-col
                      items-center
                      justify-center
                      gap-2
                      text-center
                    "
                >
                  <div
                    className="
                        text-sm
                        font-semibold
                        tracking-wide
                        text-white
                      "
                  >
                    {tipo.label}
                  </div>

                  <p
                    className="
                        text-xs
                        leading-relaxed
                        text-white/45
                      "
                  >
                    {tipo.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </FormSection>

        {/* MEDIDAS */}

        <FormSection title="Medidas">
          <div className="grid grid-cols-3 gap-4">
            {medidas.map((medida) => (
              <GlassCard
                key={medida.value}
                selected={
                  config.ancho === medida.ancho && config.alto === medida.alto
                }
                onClick={() =>
                  updateConfig({
                    ancho: medida.ancho,
                    alto: medida.alto,
                    medidaSeleccionada: medida.value,
                    fueraDeMedida: false,
                  })
                }
              >
                <div
                  className="
            flex min-h-[90px]
            items-center
            justify-center
            text-center
          "
                >
                  <span
                    className="
              text-sm
              font-semibold
              tracking-wide
              text-white
            "
                  >
                    {medida.label}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <ToggleCard
              active={!!config.fueraDeMedida}
              label="Fuera de medida"
              onClick={() =>
                updateConfig({
                  fueraDeMedida: !config.fueraDeMedida,
                })
              }
            />

            {config.fueraDeMedida && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={anchoInput}
                    min={60}
                    max={config.tipo === "embutir" ? 80 : 100}
                    onChange={(e) => handleAnchoChange(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                    placeholder="Ancho"
                  />

                  <input
                    type="number"
                    value={altoInput}
                    min={150}
                    max={210}
                    onChange={(e) => handleAltoChange(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                    placeholder="Alto"
                  />
                </div>

                {medidasValidas ? (
                  <AlertBox type="warning">
                    Se cotizará como{" "}
                    <strong>
                      {config.ancho <= 60
                        ? 60
                        : config.ancho <= 70
                          ? 70
                          : config.ancho <= 80
                            ? 80
                            : config.ancho <= 90
                              ? 80
                              : 80}
                      {" × "}
                      {config.alto <= 200
                        ? 200
                        : config.alto <= 205
                          ? 205
                          : 210}
                    </strong>
                  </AlertBox>
                ) : (
                  <AlertBox type="error">
                    Las medidas permitidas para este sistema son:
                    <br />
                    Ancho: 60–{config.tipo === "embutir" ? "80" : "100"} cm
                    <br />
                    Alto: 150–210 cm
                  </AlertBox>
                )}
              </div>
            )}
          </div>
        </FormSection>
        {/* MARCO */}

        {config.tipo !== "granero" && (
          <FormSection title="Marco">
            <div className="grid grid-cols-3 gap-4">
              {marcos.map((marco) => (
                <GlassCard
                  key={marco.value}
                  selected={config.marco === marco.value}
                  onClick={() =>
                    updateConfig({
                      marco: marco.value,
                    })
                  }
                >
                  <div
                    className="
                        flex min-h-[110px]
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        text-center
                      "
                  >
                    <div
                      className="
                          text-sm
                          font-semibold
                          tracking-wide
                          text-white
                        "
                    >
                      {marco.label}
                    </div>

                    {marco.description && (
                      <p
                        className="
                            text-xs
                            text-white/45
                          "
                      >
                        {marco.description}
                      </p>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </FormSection>
        )}

        {/* MODELO */}

        <FormSection title="Modelo">
          <div className="grid grid-cols-2 gap-4">
            {modelos.map((modelo) => (
              <GlassCard
                key={modelo.value}
                selected={config.modelo === modelo.value}
                onClick={() =>
                  updateConfig({
                    modelo: modelo.value as PuertasPlacaConfig["modelo"],
                  })
                }
              >
                <div
                  className="
                      flex min-h-[110px]
                      items-center
                      justify-center
                      text-center
                    "
                >
                  <span
                    className="
                        text-sm
                        font-semibold
                        tracking-wide
                        text-white
                      "
                  >
                    {modelo.label}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </FormSection>

        {/* MANO */}

        {config.tipo !== "embutir" && (
          <FormSection title="Mano">
            <div className="grid grid-cols-2 gap-4">
              <GlassCard
                selected={config.mano === "izquierda"}
                onClick={() =>
                  updateConfig({
                    mano: "izquierda",
                  })
                }
              >
                <div
                  className="
                  flex min-h-[110px]
                  flex-col
                  items-center
                  justify-center
                  gap-4
                "
                >
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect
                      x="14"
                      y="10"
                      width="36"
                      height="44"
                      rx="4"
                      stroke={
                        config.mano === "izquierda"
                          ? "#39FF14"
                          : "rgba(255,255,255,0.18)"
                      }
                      strokeWidth="2.5"
                    />

                    <rect
                      x="18"
                      y="14"
                      width="28"
                      height="36"
                      rx="3"
                      fill="rgba(255,255,255,0.06)"
                    />

                    <rect
                      x="14"
                      y="20"
                      width="3"
                      height="8"
                      rx="999"
                      fill="rgba(255,255,255,0.45)"
                    />

                    <rect
                      x="14"
                      y="36"
                      width="3"
                      height="8"
                      rx="999"
                      fill="rgba(255,255,255,0.45)"
                    />

                    <path
                      d="M 48 18 Q 26 32 48 46"
                      stroke={
                        config.mano === "izquierda"
                          ? "#39FF14"
                          : "rgba(255,255,255,0.22)"
                      }
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>

                  <div
                    className="
                    text-sm
                    font-semibold
                    tracking-wide
                    text-white
                  "
                  >
                    Izquierda
                  </div>
                </div>
              </GlassCard>

              <GlassCard
                selected={config.mano === "derecha"}
                onClick={() =>
                  updateConfig({
                    mano: "derecha",
                  })
                }
              >
                <div
                  className="
                  flex min-h-[110px]
                  flex-col
                  items-center
                  justify-center
                  gap-4
                "
                >
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect
                      x="14"
                      y="10"
                      width="36"
                      height="44"
                      rx="4"
                      stroke={
                        config.mano === "derecha"
                          ? "#39FF14"
                          : "rgba(255,255,255,0.18)"
                      }
                      strokeWidth="2.5"
                    />

                    <rect
                      x="18"
                      y="14"
                      width="28"
                      height="36"
                      rx="3"
                      fill="rgba(255,255,255,0.06)"
                    />

                    <rect
                      x="47"
                      y="20"
                      width="3"
                      height="8"
                      rx="999"
                      fill="rgba(255,255,255,0.45)"
                    />

                    <rect
                      x="47"
                      y="36"
                      width="3"
                      height="8"
                      rx="999"
                      fill="rgba(255,255,255,0.45)"
                    />

                    <path
                      d="M 16 18 Q 38 32 16 46"
                      stroke={
                        config.mano === "derecha"
                          ? "#39FF14"
                          : "rgba(255,255,255,0.22)"
                      }
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>

                  <div
                    className="
                    text-sm
                    font-semibold
                    tracking-wide
                    text-white
                  "
                  >
                    Derecha
                  </div>
                </div>
              </GlassCard>
            </div>
          </FormSection>
        )}

        {cotizacionMutation.isError && (
          <AlertBox type="error">
            {PUERTAS_PLACA_UI.messages?.quotationError}
          </AlertBox>
        )}

        <FormFooter>
          <PrimaryButton
            onClick={handleAdd}
            disabled={!medidasValidas || cotizacionMutation.isPending}
            loading={cotizacionMutation.isPending}
          >
            {PUERTAS_PLACA_UI.actions?.addToBudget}
          </PrimaryButton>
        </FormFooter>
      </div>
    </ProductFormLayout>
  );
}
