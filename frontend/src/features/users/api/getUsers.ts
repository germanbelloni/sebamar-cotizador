import api from "@/lib/api";

export type User = {
  _id: string;

  nombre: string;

  role: string;

  empresa: string;

  perfil: string;

  margen: number;

  ownerId: {
    _id: string;
    nombre: string;
    role: string;
  } | null;

  activo: boolean;
};

export async function getUsers() {
  const { data } = await api.get<User[]>("/auth/users");

  return data;
}
