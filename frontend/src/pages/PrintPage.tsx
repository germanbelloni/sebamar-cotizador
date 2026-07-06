import { Navigate } from "react-router-dom";

import { PrintableBudget } from "@/features/print/components/PrintableBudget";

export function PrintPage() {
  const raw = sessionStorage.getItem("print-data");

  if (!raw) {
    return <Navigate to="/" />;
  }

  const data = JSON.parse(raw);

  return (
    <PrintableBudget
      numero={data.numero}
      fecha={data.fecha}
      empresa={data.empresa}
      cliente={data.cliente}
      items={data.items}
    />
  );
}
