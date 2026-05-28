import { apiFetch } from "@/lib/api";

export type User = {
  _id: string;

  nombre: string;

  role: string;

  empresa: string;

  perfil: string;

  margen: number;

  ownerId: string | null;

  activo: boolean;
};

export async function getUsers() {
  return apiFetch<User[]>("/api/auth/users");
}
