import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";
import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { PrintableBudgetDocument } from "../components/PrintableBudgetDocument";

type Props = {
  numero: number;
  fecha: string;

  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};

export function PrintableBudgetRenderer({
  numero,
  fecha,
  empresa,
  cliente,
  items,
}: Props) {
  return (
    <PrintableBudgetDocument
      numero={numero}
      fecha={fecha}
      empresa={empresa}
      cliente={cliente}
      direccion=""
      observaciones=""
      validez=""
      items={items}
    />
  );
}
