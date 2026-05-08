import { useState } from "react";

import { BudgetPanel } from "@/layouts/components/BudgetPanel";
import { Header } from "@/layouts/components/Header";
import { Sidebar } from "@/layouts/components/Sidebar";
import { empresa } from "@/features/empresa/constants";

import { VentanaConfigForm } from "@/features/ventanas/components/VentanaConfigForm";
import { VentanaPreview } from "@/features/ventanas/components/VentanaPreview";

import type { VentanaConfig, VentanaItem } from "@/features/ventanas/types";

import type { Cliente } from "@/features/clientes/types";

function App() {
  const [config, setConfig] = useState<VentanaConfig>({
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

  const [items, setItems] = useState<VentanaItem[]>([]);

  const [cliente, setCliente] = useState<Cliente>({
    nombre: "",
    telefono: "",
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <Header empresa={empresa} cliente={cliente} setCliente={setCliente} />

          <div className="grid grid-cols-2 gap-6 p-6">
            <VentanaConfigForm
              config={config}
              setConfig={setConfig}
              setItems={setItems}
            />

            <VentanaPreview config={config} />
          </div>
        </main>

        <div className="w-[420px] border-l bg-background">
          <BudgetPanel
            items={items}
            setItems={setItems}
            cliente={cliente}
            empresa={empresa}
            config={config}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
