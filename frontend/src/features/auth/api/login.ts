import api from "@/lib/api";

type LoginPayload = {
  nombre: string;
  password: string;
};

type LoginResponse = {
  token: string;

  user: {
    id: string;

    nombre: string;

    role: "superadmin" | "admin" | "user";

    perfil: string;

    margen: number;

    empresa: string;

    nombreEmpresa?: string;

    telefono?: string;

    direccion?: string;

    email?: string;

    observacionesPdf?: string;

    logo?: string;

    colorPrimario?: string;

    colorSecundario?: string;

    ownerId: {
      _id: string;

      nombre: string;

      role: string;

      empresa?: string;
    } | null;
  };
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);

  return data;
}
