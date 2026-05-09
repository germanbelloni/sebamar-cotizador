import { useLocation, Navigate } from "react-router-dom";

import { PrintableBudget } from "@/features/print/components/PrintableBudget";

export function PrintPage() {
  const location = useLocation();

  const state = location.state;

  console.log(state);

  if (!state) {
    return <Navigate to="/" />;
  }

  return (
    <PrintableBudget
      empresa={state.empresa}
      cliente={state.cliente}
      items={state.items}
    />
  );
}
