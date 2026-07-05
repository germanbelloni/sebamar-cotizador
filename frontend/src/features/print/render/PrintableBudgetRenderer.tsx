import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";
import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { PrintableBudgetDocument } from "../components/PrintableBudgetDocument";

type Props = {
  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};

export function PrintableBudgetRenderer(props: Props) {
  return (
    <PrintableBudgetDocument
      empresa={props.empresa}
      cliente={props.cliente}
      items={props.items}
    />
  );
}
