import { useState } from "react";

import { FEATURES } from "@/features";

import { Header } from "@/layouts/components/Header";

import { Sidebar } from "@/layouts/components/Sidebar";

import type { Cliente } from "@/features/clientes/types";

import { BudgetPanel } from "@/layouts/components/BudgetPanel";

import { PresupuestosPage } from "@/features/presupuestos/pages/PresupuestosPage";

import { usePresupuesto } from "@/features/presupuestos/hooks/usePresupuesto";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

import ConfiguracionPage from "@/pages/ConfiguracionPage";

import { UserManagementPanel } from "@/features/users/components/UserManagementPanel";

import { useAuthStore } from "@/store/authStore";

import {
  formatLinea,
  formatColor,
  formatVidrio,
} from "@/shared/utils/displayLabels";
/* PRESUPUESTO */
import { PresupuestoDetallePage } from "@/features/presupuestos/pages/PresupuestoDetallePage";

/* RAJAS */

import type { RajasConfig } from "@/features/rajas/types";

import { RajasConfigForm } from "@/features/rajas/components/RajasConfigForm";

import { RajasPreview } from "@/features/rajas/components/RajasPreview";

import { initialRajasConfig } from "@/features/rajas/constants";

/* VENTANAS */

import type { VentanaConfig } from "@/features/ventanas/types";

import { VentanaConfigForm } from "@/features/ventanas/components/VentanaConfigForm";

import { VentanaPreview } from "@/features/ventanas/components/VentanaPreview";

import { initialVentanasConfig } from "@/features/ventanas/constants";

/* PORTONES */

import type { PortonesConfig } from "@/features/portones/types";

import { PortonesConfigForm } from "@/features/portones/components/PortonesConfigForm";

import { initialPortonesConfig } from "@/features/portones/constants";

/* PUERTAS */

import type { PuertasConfig } from "@/features/puertas/types";

import { PuertasConfigForm } from "@/features/puertas/components/PuertasConfigForm";

import { initialPuertasConfig } from "@/features/puertas/constants";

import { PuertasBlueprint } from "@/features/puertas/components/PuertasBlueprint";

/* PUERTAS PLACA */

import type { PuertasPlacaConfig } from "@/features/puertas-placa/types";

import { PuertasPlacaConfigForm } from "@/features/puertas-placa/components/PuertasPlacaConfigForm";

import { PuertasPlacaPreview } from "@/features/puertas-placa/components/PuertasPlacaPreview";

import { initialPuertasPlacaConfig } from "@/features/puertas-placa/constants";

/* POSTIGONES */

import type { PostigonesConfig } from "@/features/postigones/types";

import { PostigonesConfigForm } from "@/features/postigones/components/PostigonesConfigForm";

import { PostigonPreview } from "@/features/postigones/components/PostigonPreview";

import { initialPostigonesConfig } from "@/features/postigones/constants";

/* PATAGONICAS */

import type { PatagonicasConfig } from "@/features/patagonicas/types";

import { PatagonicasConfigForm } from "@/features/patagonicas/components/PatagonicasConfigForm";

import { PatagonicasPreview } from "@/features/patagonicas/components/PatagonicasPreview";

import { initialPatagonicasConfig } from "@/features/patagonicas/constants";

/* MARCOS */

import type { MarcosConfig } from "@/features/marcos/types";

import { MarcosConfigForm } from "@/features/marcos/components/MarcosConfigForm";

import { MarcosPreview } from "@/features/marcos/components/MarcosPreview";

import { initialMarcosConfig } from "@/features/marcos/constants";

/* PAÑO FIJO */
import type { PanoFijoConfig } from "@/features/pano-fijo/types";

import { PanoFijoConfigForm } from "@/features/pano-fijo/components/PanoFijoConfigForm";

import { PanoFijoPreview } from "@/features/pano-fijo/components/PanoFijoPreview";

import { initialPanoFijoConfig } from "@/features/pano-fijo/constants";

/* MOSQUITEROS */

import type { MosquiterosConfig } from "@/features/mosquiteros/types";

import { MosquiterosConfigForm } from "@/features/mosquiteros/components/MosquiterosConfigForm";

import { MosquiterosPreview } from "@/features/mosquiteros/components/MosquiterosPreview";

import { initialMosquiterosConfig } from "@/features/mosquiteros/constants";

function App() {
  /* ACTIVE FEATURE */

  const user = useAuthStore((state) => state.user);

  const empresa = {
    nombre: user?.nombreEmpresa || user?.empresa || "Empresa",

    telefono: user?.telefono || "",

    direccion: user?.direccion || "",

    email: user?.email || "",

    logo: user?.logo || "",

    primaryColor: user?.colorPrimario || "#D6B400",

    secondaryColor: user?.colorSecundario || "#1f2937",
  };

  const [activeFeature, setActiveFeature] = useState("ventanas");

  const [selectedPresupuestoId, setSelectedPresupuestoId] = useState<
    string | null
  >(null);

  const total = useBudgetStore((state) => state.total);

  const items = useBudgetStore((state) => state.items);

  usePresupuesto(selectedPresupuestoId);
  /* CLIENTE */

  const [cliente, setCliente] = useState<Cliente>({
    nombre: "",

    telefono: "",
  });

  /* RAJAS */

  const [rajasConfig, setRajasConfig] =
    useState<RajasConfig>(initialRajasConfig);

  /* VENTANAS */

  const [ventanasConfig, setVentanasConfig] = useState<VentanaConfig>(
    initialVentanasConfig,
  );

  /* PORTONES */
  const [portonesConfig, setPortonesConfig] = useState<PortonesConfig>(
    initialPortonesConfig,
  );
  /* PUERTAS */

  const [puertasConfig, setPuertasConfigState] =
    useState<PuertasConfig>(initialPuertasConfig);

  const setPuertasConfig = (
    value: PuertasConfig | ((prev: PuertasConfig) => PuertasConfig),
  ) => {
    setPuertasConfigState(value);
  };

  /* PUERTAS PLACA */
  const [puertasPlacaConfig, setPuertasPlacaConfig] =
    useState<PuertasPlacaConfig>(initialPuertasPlacaConfig);
  /* POSTIGONES */

  const [postigonesConfig, setPostigonesConfig] = useState<PostigonesConfig>(
    initialPostigonesConfig,
  );
  /* PATAGONICAS */
  const [patagonicasConfig, setPatagonicasConfig] = useState<PatagonicasConfig>(
    initialPatagonicasConfig,
  );
  /* MARCOS */

  const [marcosConfig, setMarcosConfig] =
    useState<MarcosConfig>(initialMarcosConfig);

  /* PAÑO FIJO */
  const [panoFijoConfig, setPanoFijoConfig] = useState<PanoFijoConfig>(
    initialPanoFijoConfig,
  );

  /* MOSQUITEROS */

  const [mosquiterosConfig, setMosquiterosConfig] = useState<MosquiterosConfig>(
    initialMosquiterosConfig,
  );

  //const activeFeatureLabel = getFeatureLabel(activeFeature);

  const FEATURE_COMPONENTS = {
    rajas: <RajasConfigForm config={rajasConfig} setConfig={setRajasConfig} />,

    ventanas: (
      <VentanaConfigForm
        config={ventanasConfig}
        setConfig={setVentanasConfig}
      />
    ),

    portones: (
      <PortonesConfigForm
        config={portonesConfig}
        setConfig={setPortonesConfig}
      />
    ),

    puertas: (
      <PuertasConfigForm config={puertasConfig} setConfig={setPuertasConfig} />
    ),

    "puertas-placa": (
      <PuertasPlacaConfigForm
        config={puertasPlacaConfig}
        setConfig={setPuertasPlacaConfig}
      />
    ),

    postigones: (
      <PostigonesConfigForm
        config={postigonesConfig}
        setConfig={setPostigonesConfig}
      />
    ),

    patagonicas: (
      <PatagonicasConfigForm
        config={patagonicasConfig}
        setConfig={setPatagonicasConfig}
      />
    ),

    marcos: (
      <MarcosConfigForm config={marcosConfig} setConfig={setMarcosConfig} />
    ),

    mosquiteros: (
      <MosquiterosConfigForm
        config={mosquiterosConfig}
        setConfig={setMosquiterosConfig}
      />
    ),

    "pano-fijo": (
      <PanoFijoConfigForm
        config={panoFijoConfig}
        setConfig={setPanoFijoConfig}
      />
    ),

    configuracion: <ConfiguracionPage />,
  };

  const CONFIGS = {
    rajas: rajasConfig,

    ventanas: ventanasConfig,

    puertas: puertasConfig,

    postigones: postigonesConfig,

    patagonicas: patagonicasConfig,

    mosquiteros: mosquiterosConfig,

    marcos: marcosConfig,

    "pano-fijo": panoFijoConfig,

    portones: portonesConfig,
  };

  const activeConfig =
    CONFIGS[activeFeature as keyof typeof CONFIGS] || portonesConfig;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          features={FEATURES}
          activeFeature={activeFeature}
          onSelectFeature={setActiveFeature}
        />

        <main className="flex-1 overflow-auto">
          {activeFeature === "presupuestos" ? (
            selectedPresupuestoId ? (
              <PresupuestoDetallePage
                presupuestoId={selectedPresupuestoId}
                onBack={() => setSelectedPresupuestoId(null)}
              />
            ) : (
              <PresupuestosPage onOpenPresupuesto={setSelectedPresupuestoId} />
            )
          ) : activeFeature === "configuracion" ? (
            <ConfiguracionPage />
          ) : (
            <>
              <Header
                empresa={empresa}
                cliente={cliente}
                setCliente={setCliente}
              />

              <div className="grid grid-cols-2 gap-6 p-6">
                {/* FORM */}

                {
                  FEATURE_COMPONENTS[
                    activeFeature as keyof typeof FEATURE_COMPONENTS
                  ]
                }

                {/* PREVIEW COLUMN */}
                <div className="flex h-full flex-col gap-4">
                  {/* SVG / PREVIEW */}
                  <div
                    className="
      flex-[4]
      rounded-2xl
      border border-border
      bg-card
      p-6
    "
                  >
                    <div className="flex h-full flex-col">
                      {/* SVG */}
                      <div className="mt-2 flex-1">
                        {activeFeature === "ventanas" && (
                          <VentanaPreview config={ventanasConfig} />
                        )}

                        {activeFeature === "rajas" && (
                          <RajasPreview config={rajasConfig} />
                        )}

                        {activeFeature === "postigones" && (
                          <PostigonPreview config={postigonesConfig} />
                        )}

                        {activeFeature === "patagonicas" && (
                          <PatagonicasPreview config={patagonicasConfig} />
                        )}

                        {activeFeature === "mosquiteros" && (
                          <MosquiterosPreview config={mosquiterosConfig} />
                        )}

                        {activeFeature === "puertas" && (
                          <PuertasBlueprint
                            config={puertasConfig}
                            onChange={setPuertasConfig}
                          />
                        )}

                        {activeFeature === "puertas-placa" && (
                          <PuertasPlacaPreview config={puertasPlacaConfig} />
                        )}

                        {activeFeature === "pano-fijo" && (
                          <PanoFijoPreview config={panoFijoConfig} />
                        )}
                      </div>

                      {activeFeature === "marcos" && (
                        <MarcosPreview config={marcosConfig} />
                      )}

                      {/* TECHNICAL INFO */}
                      {activeFeature !== "puertas" && (
                        <div
                          className="
            mt-4
            rounded-xl
            border border-border
            bg-background/50
            p-4
          "
                        >
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Línea
                              </span>

                              <span>
                                {"linea" in activeConfig
                                  ? formatLinea(activeConfig.linea)
                                  : "-"}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Vidrio
                              </span>

                              <span>
                                {"tipoVidrio" in activeConfig &&
                                activeConfig.tipoVidrio
                                  ? formatVidrio(activeConfig.tipoVidrio)
                                  : "vidrio" in activeConfig &&
                                      activeConfig.vidrio
                                    ? formatVidrio(activeConfig.vidrio)
                                    : "-"}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Color
                              </span>

                              <span>
                                {"tipo" in activeConfig &&
                                activeConfig.tipo === "premarco"
                                  ? "-"
                                  : "color" in activeConfig
                                    ? formatColor(activeConfig.color)
                                    : "-"}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Medidas
                              </span>

                              <span>
                                {activeConfig.ancho} x {activeConfig.alto}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CLIENT CARD */}

                  <div
                    className="
                flex-[1]
                rounded-2xl
                border border-border
                bg-card
                p-6
              "
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">Cliente</h3>

                      <span
                        className="
                    rounded-full
                    border border-lime-400/20
                    bg-lime-400/10
                    px-2 py-1
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wider
                    text-zinc-300/70
                  "
                      >
                        Presupuesto
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div
                        className="
                    rounded-xl
                    border border-border
                    bg-background
                    px-4 py-3
                  "
                      >
                        <p className="text-[11px] text-muted-foreground">
                          Nombre
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                          {cliente.nombre || "-"}
                        </p>
                      </div>

                      <div
                        className="
                    rounded-xl
                    border border-border
                    bg-background
                    px-4 py-3
                  "
                      >
                        <p className="text-[11px] text-muted-foreground">
                          Teléfono
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                          {cliente.telefono || "-"}
                        </p>
                      </div>
                    </div>

                    {/* TOTAL */}

                    <div
                      className="
                  mt-5
                  rounded-2xl
                  border border-zinc-700/40
                  bg-zinc-900/60
                  px-5 py-4
                "
                    >
                      <p
                        className="
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-zinc-400
                  "
                      >
                        Total presupuesto
                      </p>

                      <div
                        className="
    mt-2
    text-3xl
    font-bold
    tracking-tight
    text-zinc-100
  "
                      >
                        $
                        {(() => {
                          const totalValue = total();

                          return totalValue >= 1000000
                            ? totalValue.toLocaleString("es-AR")
                            : totalValue;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <BudgetPanel items={items} cliente={cliente} empresa={empresa} />

        <UserManagementPanel />
      </div>
    </div>
  );
}

export default App;
