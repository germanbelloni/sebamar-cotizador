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
  console.log("ENVIANDO PDF");
  console.log(payload);

  const response = await api.post("/pdf/preview", payload, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);

  window.open(url, "_blank");
}
