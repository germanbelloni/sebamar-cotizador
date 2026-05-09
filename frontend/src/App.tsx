import { useState } from "react";

import { Routes, Route } from "react-router-dom";

import { BudgetPanel } from "@/layouts/components/BudgetPanel";
import { Header } from "@/layouts/components/Header";
import { Sidebar } from "@/layouts/components/Sidebar";

import { empresa } from "@/features/empresa/constants";

import type { Cliente } from "@/features/clientes/types";

import { PrintPage } from "@/pages/PrintPage";

import type { RajasConfig } from "@/features/rajas/types";

import { RajasConfigForm } from "@/features/rajas/components/RajasConfigForm";

function App() {
  const [rajasConfig, setRajasConfig] = useState<RajasConfig>({
    ancho: 60,

    alto: 60,

    linea: "Herrero",

    color: "blanco",

    mosquitero: false,
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [items, setItems] = useState<any[]>([]);

  const [cliente, setCliente] = useState<Cliente>({
    nombre: "",

    telefono: "",
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <div className="flex h-screen">
              <Sidebar />

              <main className="flex-1 overflow-auto">
                <Header
                  empresa={empresa}
                  cliente={cliente}
                  setCliente={setCliente}
                />

                <div className="grid grid-cols-2 gap-6 p-6">
                  <RajasConfigForm
                    config={rajasConfig}
                    setConfig={setRajasConfig}
                    setItems={setItems}
                  />

                  <div />
                </div>
              </main>

              <div className="w-[420px] border-l bg-background">
                <BudgetPanel
                  items={items}
                  setItems={setItems}
                  cliente={cliente}
                  empresa={empresa}
                  config={rajasConfig as any}
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
