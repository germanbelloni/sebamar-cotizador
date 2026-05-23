import { useQuery } from "@tanstack/react-query";

import { getPresupuestos } from "../api/getPresupuestos";

export function usePresupuestos() {
  return useQuery({
    queryKey: ["presupuestos"],

    queryFn: getPresupuestos,
  });
}
