import { useState } from "react";

import { BudgetPanel } from "@/layouts/components/BudgetPanel";
import { Header } from "@/layouts/components/Header";
import { Sidebar } from "@/layouts/components/Sidebar";

import { VentanaConfigForm } from "@/features/ventanas/components/VentanaConfigForm";
import { VentanaPreview } from "@/features/ventanas/components/VentanaPreview";

import type { VentanaHerreroConfig } from "@/features/ventanas/types";

function App() {
  const [config, setConfig] = useState<VentanaHerreroConfig>({
    ancho: 120,

    alto: 150,

    linea: "Herrero",

    color: "Blanco",

    mosquitero: false,

    guia: false,

    cajonBlock: false,

    cortinaPVC: false,

    cortinaAluminio: false,

    premarco: false,

    contramarco: false,
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <Header />

          <div className="grid grid-cols-2 gap-6 p-6">
            <VentanaConfigForm config={config} setConfig={setConfig} />

            <VentanaPreview config={config} />
          </div>
        </main>

        <BudgetPanel />
      </div>
    </div>
  );
}

export default App;
