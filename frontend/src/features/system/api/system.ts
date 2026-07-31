import api from "@/lib/api";

export type SystemStatus = {
  mantenimiento: boolean;
  mensaje: string;
};

export async function getSystemStatus(): Promise<SystemStatus> {
  const { data } = await api.get("/system/status");

  return data;
}

export async function updateMaintenance(
  mantenimiento: boolean,
  mensaje?: string,
) {
  const { data } = await api.patch("/system/maintenance", {
    mantenimiento,
    mensaje,
  });

  return data;
}
