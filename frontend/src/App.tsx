import { useState } from "react";

import { BudgetPanel } from "@/layouts/components/BudgetPanel";
import { Header } from "@/layouts/components/Header";
import { Sidebar } from "@/layouts/components/Sidebar";

import { VentanaHerreroForm } from "@/features/ventanas/components/VentanaHerreroForm";
import { VentanaHerreroPreview } from "@/features/ventanas/components/VentanaHerreroPreview";

import type { VentanaHerreroConfig } from "@/features/ventanas/types";

function App() {
  const [config, setConfig] = useState<VentanaHerreroConfig>({
    ancho: 120,
    alto: 150,
    linea: "Herrero",
    color: "Blanco",
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <Header />

          <div className="grid grid-cols-2 gap-6 p-6">
            <VentanaHerreroForm config={config} setConfig={setConfig} />

            <VentanaHerreroPreview config={config} />
          </div>
        </main>

        <BudgetPanel />
      </div>
    </div>
  );
}

export default App;
