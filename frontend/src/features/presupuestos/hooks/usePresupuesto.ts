import { useQuery } from "@tanstack/react-query";

import { getPresupuesto } from "../api/getPresupuesto";

export function usePresupuesto(id?: string | null) {
  return useQuery({
    queryKey: ["presupuesto", id],

    queryFn: () => getPresupuesto(id as string),

    enabled: !!id,
  });
}
