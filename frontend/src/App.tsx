import { useState } from "react";

import { FEATURES, getFeatureLabel } from "@/features";

import { Header } from "@/layouts/components/Header";

import { Sidebar } from "@/layouts/components/Sidebar";

import { empresa } from "@/features/empresa/constants";

import type { Cliente } from "@/features/clientes/types";

import { BudgetPanel } from "@/layouts/components/BudgetPanel";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

import { BudgetDebug } from "@/shared/budget/components/BudgetDebug";

/* RAJAS */

import type { RajasConfig } from "@/features/rajas/types";

import { RajasConfigForm } from "@/features/rajas/components/RajasConfigForm";

import { RajasPreview } from "@/features/rajas/components/RajasPreview";

/* VENTANAS */

import type { VentanaConfig } from "@/features/ventanas/types";

import { VentanaConfigForm } from "@/features/ventanas/components/VentanaConfigForm";

import { VentanaPreview } from "@/features/ventanas/components/VentanaPreview";

/* PORTONES */

import type { PortonesConfig } from "@/features/portones/types";

import { PortonesConfigForm } from "@/features/portones/components/PortonesConfigForm";

/* PUERTAS */

import type { PuertasConfig } from "@/features/puertas/types";

import { PuertasConfigForm } from "@/features/puertas/components/PuertasConfigForm";

import { PuertasPreview } from "@/features/puertas/components/PuertasPreview";

/* PUERTAS PLACA */

import type { PuertasPlacaConfig } from "@/features/puertas-placa/types";

import { PuertasPlacaConfigForm } from "@/features/puertas-placa/components/PuertasPlacaConfigForm";

import { PuertasPlacaPreview } from "@/features/puertas-placa/components/PuertasPlacaPreview";

/* POSTIGONES */

import type { PostigonesConfig } from "@/features/postigones/types";

import { PostigonesConfigForm } from "@/features/postigones/components/PostigonesConfigForm";

import { PostigonPreview } from "@/features/postigones/components/PostigonPreview";

import { initialPostigonesConfig } from "@/features/postigones/constants";

/* PATAGONICAS */

import type { PatagonicasConfig } from "@/features/patagonicas/types";

import { PatagonicasConfigForm } from "@/features/patagonicas/components/PatagonicasConfigForm";

import { PatagonicasPreview } from "@/features/patagonicas/components/PatagonicasPreview";

/* MARCOS */

import type { MarcosConfig } from "@/features/marcos/types";

import { MarcosConfigForm } from "@/features/marcos/components/MarcosConfigForm";

import { MarcosPreview } from "@/features/marcos/components/MarcosPreview";

/* PAÑO FIJO */
import type { PanoFijoConfig } from "@/features/pano-fijo/types";

import { PanoFijoConfigForm } from "@/features/pano-fijo/components/PanoFijoConfigForm";

import { PanoFijoPreview } from "@/features/pano-fijo/components/PanoFijoPreview";
/* MOSQUITEROS */

import type { MosquiterosConfig } from "@/features/mosquiteros/types";

import { MosquiterosConfigForm } from "@/features/mosquiteros/components/MosquiterosConfigForm";

import { MosquiterosPreview } from "@/features/mosquiteros/components/MosquiterosPreview";

function App() {
  /* ACTIVE FEATURE */

  const [activeFeature, setActiveFeature] = useState("rajas");

  const items = useBudgetStore((state) => state.items);

  const setItems = () => {};

  /* CLIENTE */

  const [cliente, setCliente] = useState<Cliente>({
    nombre: "",

    telefono: "",
  });

  /* RAJAS */

  const [rajasConfig, setRajasConfig] = useState<RajasConfig>({
    ancho: 60,
    alto: 60,

    linea: "Herrero",

    color: "blanco",

    tipoVidrio: "4mm",

    mosquitero: false,

    modelo: "raja",

    bisagra: "izquierda",

    posicionOscilo: "cerrada",

    premarco: false,

    contramarco: false,

    herrajesBlancos: false,
  });

  /* VENTANAS */

  const [ventanasConfig, setVentanasConfig] = useState<VentanaConfig>({
    ancho: 120,

    alto: 100,

    linea: "Herrero",

    color: "blanco",

    tipoVidrio: "3mm",

    mosquitero: false,

    guia: false,

    cajonBlock: false,

    cortina: null,
    premarco: false,

    contramarco: false,
  });

  /* PORTONES */

  const [portonesConfig, setPortonesConfig] = useState<PortonesConfig>({
    ancho: 250,

    alto: 220,

    linea: "Herrero",

    sistema: "corredizo",

    hojas: 2,

    color: "blanco",

    automatizado: false,

    guiaInferior: false,
  });

  /* PUERTAS */

  const [puertasConfig, setPuertasConfig] = useState<PuertasConfig>({
    ancho: 80,

    alto: 200,

    linea: "herrero",

    tipoConfiguracion: "simple",

    tipoPorton: "abrir",

    modelo: "modelo_1",

    modeloMediaPuerta: "v_entero",

    color: "blanco",

    mano: "derecha",

    hojas: 1,

    anchoPrincipal: 80,

    vidrio: "4mm",

    extras: {
      barralRecto: 0,
      barralCurvo: 0,
      manija: false,
      picaporte: false,
    },
  });

  /* PUERTAS PLACA */
  const [puertasPlacaConfig, setPuertasPlacaConfig] =
    useState<PuertasPlacaConfig>({
      ancho: 80,

      alto: 200,

      tipo: "abrir",

      medidaSeleccionada: "80x200",

      fueraDeMedida: false,

      marco: "marco_10",

      modelo: "finger_pino",

      mano: "derecha",
    });
  /* POSTIGONES */

  const [postigonesConfig, setPostigonesConfig] = useState<PostigonesConfig>(
    initialPostigonesConfig,
  );
  /* PATAGONICAS */
  const [patagonicasConfig, setPatagonicasConfig] = useState<PatagonicasConfig>(
    {
      // =========================
      // 📏 MEDIDAS
      // =========================

      ancho: 120,

      alto: 100,

      anchoRaja: 40,

      // =========================
      // 🪟 CONFIG
      // =========================

      linea: "Herrero",

      tipo: "1_raja",

      cantidadRajas: 1,

      // =========================
      // 🎨 VISUAL
      // =========================

      color: "blanco",

      tipoVidrio: "4mm",

      // =========================
      // 🚪 APERTURA
      // =========================

      ladoApertura: "derecha",

      tipoApertura: "abrir",

      bisagraRaja1: "izquierda",

      bisagraRaja2: "derecha",

      // =========================
      // 🧩 OPCIONALES
      // =========================

      premarco: false,

      contramarco: false,

      mosquitero: false,

      guia: false,

      cajonBlock: false,

      cortina: null,

      fueraDeMedida: false,
    },
  );
  /* MARCOS */

  const [marcosConfig, setMarcosConfig] = useState<MarcosConfig>({
    ancho: 120,

    alto: 100,

    tipo: "premarco",

    color: "blanco",
  });

  /* PAÑO FIJO */
  const [panoFijoConfig, setPanoFijoConfig] = useState<PanoFijoConfig>({
    ancho: 120,

    alto: 120,

    linea: "herrero",

    color: "blanco",

    tipoVidrio: "4mm",
  });

  /* MOSQUITEROS */

  const [mosquiterosConfig, setMosquiterosConfig] = useState<MosquiterosConfig>(
    {
      ancho: 100,

      alto: 100,

      tipo: "ventana",

      color: "blanco",

      ladoBisagra: "derecha",
    },
  );

  const activeFeatureLabel = getFeatureLabel(activeFeature);
  console.log(activeFeature);
  const FEATURE_COMPONENTS: Record<string, React.ReactNode> = {
    rajas: <RajasConfigForm config={rajasConfig} setConfig={setRajasConfig} />,

    ventanas: (
      <VentanaConfigForm
        config={ventanasConfig}
        setConfig={setVentanasConfig}
        setItems={setItems}
      />
    ),

    portones: (
      <PortonesConfigForm
        config={portonesConfig}
        setConfig={setPortonesConfig}
        setItems={setItems}
      />
    ),

    puertas: (
      <PuertasConfigForm
        config={puertasConfig}
        setConfig={setPuertasConfig}
        setItems={setItems}
      />
    ),

    "puertas-placa": (
      <PuertasPlacaConfigForm
        config={puertasPlacaConfig}
        setConfig={setPuertasPlacaConfig}
        setItems={setItems}
      />
    ),

    postigones: (
      <PostigonesConfigForm
        config={postigonesConfig}
        setConfig={setPostigonesConfig}
        setItems={setItems}
      />
    ),
    patagonicas: (
      <PatagonicasConfigForm
        config={patagonicasConfig}
        setConfig={setPatagonicasConfig}
        setItems={setItems}
      />
    ),

    marcos: (
      <MarcosConfigForm
        config={marcosConfig}
        setConfig={setMarcosConfig}
        setItems={setItems}
      />
    ),

    mosquiteros: (
      <MosquiterosConfigForm
        config={mosquiterosConfig}
        setConfig={setMosquiterosConfig}
        setItems={setItems}
      />
    ),

    "pano-fijo": (
      <PanoFijoConfigForm
        config={panoFijoConfig}
        setConfig={setPanoFijoConfig}
        setItems={setItems}
      />
    ),
  };

  const activeConfig =
    activeFeature === "rajas"
      ? rajasConfig
      : activeFeature === "ventanas"
        ? ventanasConfig
        : activeFeature === "puertas"
          ? puertasConfig
          : activeFeature === "postigones"
            ? postigonesConfig
            : activeFeature === "patagonicas"
              ? patagonicasConfig
              : activeFeature === "mosquiteros"
                ? mosquiterosConfig
                : activeFeature === "marcos"
                  ? marcosConfig
                  : activeFeature === "pano-fijo"
                    ? panoFijoConfig
                    : portonesConfig;
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          features={FEATURES}
          activeFeature={activeFeature}
          onSelectFeature={setActiveFeature}
        />

        <main className="flex-1 overflow-auto">
          <Header empresa={empresa} cliente={cliente} setCliente={setCliente} />

          <div className="grid grid-cols-2 gap-6 p-6">
            {/* FORM */}

            {FEATURE_COMPONENTS[activeFeature]}

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
                  {/* HEADER */}

                  <div>
                    <h2 className="text-xl font-semibold">
                      {activeFeatureLabel}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Vista previa técnica del módulo.
                    </p>
                  </div>

                  {/* SVG */}

                  <div className="mt-6 flex-1">
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
                      <PuertasPreview config={puertasConfig} />
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
                        <span className="text-muted-foreground">Línea</span>

                        <span>
                          {"linea" in activeConfig ? activeConfig.linea : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vidrio</span>

                        <span>
                          {"tipoVidrio" in activeConfig
                            ? activeConfig.tipoVidrio || "-"
                            : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color</span>

                        <span>
                          {"tipo" in activeConfig &&
                          activeConfig.tipo === "premarco"
                            ? "-"
                            : "color" in activeConfig
                              ? activeConfig.color
                              : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medidas</span>

                        <span>
                          {activeConfig.ancho} x {activeConfig.alto}
                        </span>
                      </div>
                    </div>
                  </div>
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
                    <p className="text-[11px] text-muted-foreground">Nombre</p>

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
                      const total = items.reduce(
                        (acc, item) => acc + Number(item.subtotal || 0),
                        0,
                      );

                      return total >= 1000000
                        ? total.toLocaleString("es-AR")
                        : total;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <BudgetPanel
          items={items}
          setItems={setItems}
          cliente={cliente}
          empresa={empresa}
        />
        <BudgetDebug />
      </div>
    </div>
  );
}

export default App;
