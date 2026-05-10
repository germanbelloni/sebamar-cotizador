import { useState } from "react";

import { Routes, Route } from "react-router-dom";

import { FEATURES, getFeatureLabel } from "@/features";

import { BudgetPanel } from "@/layouts/components/BudgetPanel";

import { Header } from "@/layouts/components/Header";

import { Sidebar } from "@/layouts/components/Sidebar";

import { empresa } from "@/features/empresa/constants";

import type { Cliente } from "@/features/clientes/types";

import { PrintPage } from "@/pages/PrintPage";

/* RAJAS */

import type { RajasConfig } from "@/features/rajas/types";

import { RajasConfigForm } from "@/features/rajas/components/RajasConfigForm";

/* VENTANAS */

import type { VentanaConfig } from "@/features/ventanas/types";

import { VentanaConfigForm } from "@/features/ventanas/components/VentanaConfigForm";

/* PORTONES */

import type { PortonesConfig } from "@/features/portones/types";

import { PortonesConfigForm } from "@/features/portones/components/PortonesConfigForm";

/* PUERTAS */

import type { PuertasConfig } from "@/features/puertas/types";

import { PuertasConfigForm } from "@/features/puertas/components/PuertasConfigForm";

/* PUERTAS PLACA */

import type { PuertasPlacaConfig } from "@/features/puertas-placa/types";

import { PuertasPlacaConfigForm } from "@/features/puertas-placa/components/PuertasPlacaConfigForm";

/* POSTIGONES */

import type { PostigonesConfig } from "@/features/postigones/types";

import { PostigonesConfigForm } from "@/features/postigones/components/PostigonesConfigForm";

/* PATAGONICAS */

import type { PatagonicasConfig } from "@/features/patagonicas/types";

import { PatagonicasConfigForm } from "@/features/patagonicas/components/PatagonicasConfigForm";

/* SUPERFICIES */

import type { SuperficiesConfig } from "@/features/superficies/types";

import { SuperficiesConfigForm } from "@/features/superficies/components/SuperficiesConfigForm";

/* MOSQUITEROS */

import type { MosquiterosConfig } from "@/features/mosquiteros/types";

import { MosquiterosConfigForm } from "@/features/mosquiteros/components/MosquiterosConfigForm";

function App() {
  /* ACTIVE FEATURE */

  const [activeFeature, setActiveFeature] = useState("rajas");

  /* ITEMS */

  /* eslint-disable @typescript-eslint/no-explicit-any */

  const [items, setItems] = useState<any[]>([]);

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

    mosquitero: false,

    modelo: "raja",

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

    mosquitero: false,

    guia: false,

    cajonBlock: false,

    cortinaPVC: false,

    cortinaAluminio: false,

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

    tipo: "simple",

    modelo: "",

    color: "blanco",

    apertura: "derecha",

    hojas: 1,

    extras: {},
  });

  /* PUERTAS PLACA */

  const [puertasPlacaConfig, setPuertasPlacaConfig] =
    useState<PuertasPlacaConfig>({
      ancho: 80,

      alto: 200,

      tipo: "interior",

      marco: "ch18",

      mano: "derecha",
    });

  /* POSTIGONES */

  const [postigonesConfig, setPostigonesConfig] = useState<PostigonesConfig>({
    ancho: 120,

    alto: 100,

    tipo: "abrir",

    linea: "Herrero",

    color: "blanco",
  });

  /* PATAGONICAS */

  const [patagonicasConfig, setPatagonicasConfig] = useState<PatagonicasConfig>(
    {
      ancho: 120,

      alto: 100,

      linea: "Herrero",

      tipo: "1_raja",

      color: "blanco",

      cantidadRajas: 1,

      tipoVidrio: "4mm",

      ladoApertura: "derecha",

      tipoApertura: "abrir",

      premarco: false,

      contramarco: false,

      mosquitero: false,
    },
  );

  /* SUPERFICIES */

  const [superficiesConfig, setSuperficiesConfig] = useState<SuperficiesConfig>(
    {
      ancho: 120,

      alto: 100,

      linea: "herrero",

      tipo: "pano_fijo",

      color: "blanco",

      tipoVidrio: "4mm",
    },
  );

  /* MOSQUITEROS */

  const [mosquiterosConfig, setMosquiterosConfig] = useState<MosquiterosConfig>(
    {
      ancho: 100,

      alto: 100,

      tipo: "ventana",

      color: "blanco",
    },
  );

  const activeFeatureLabel = getFeatureLabel(activeFeature);

  const FEATURE_COMPONENTS: Record<string, React.ReactNode> = {
    rajas: (
      <RajasConfigForm
        config={rajasConfig}
        setConfig={setRajasConfig}
        setItems={setItems}
      />
    ),

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

    superficies: (
      <SuperficiesConfigForm
        config={superficiesConfig}
        setConfig={setSuperficiesConfig}
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
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <div className="flex h-screen">
              <Sidebar
                features={FEATURES}
                activeFeature={activeFeature}
                onSelectFeature={setActiveFeature}
              />

              <main className="flex-1 overflow-auto">
                <Header
                  empresa={empresa}
                  cliente={cliente}
                  setCliente={setCliente}
                />

                <div className="grid grid-cols-2 gap-6 p-6">
                  {/* FORM */}

                  {FEATURE_COMPONENTS[activeFeature]}

                  {/* PREVIEW */}

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-xl font-semibold">
                      Sebamar · {activeFeatureLabel}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Configurador técnico del módulo seleccionado.
                    </p>
                  </div>
                </div>
              </main>

              <div className="w-[420px] border-l bg-background">
                <BudgetPanel
                  items={items}
                  setItems={setItems}
                  cliente={cliente}
                  empresa={empresa}
                />
              </div>
            </div>
          </div>
        }
      />

      <Route path="/print" element={<PrintPage />} />
    </Routes>
  );
}

export default App;
