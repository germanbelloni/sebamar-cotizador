import api from "@/lib/api";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";
import type { BudgetItem } from "@/shared/budget/types/budget.types";

type Payload = {
  numero: number;
  fecha: string;

  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};

export async function generarPdf(payload: Payload) {
  const response = await api.post("/pdf/preview", payload, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);

  const a = document.createElement("a");

  a.href = url;
  a.download = "Presupuesto.pdf";

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}
