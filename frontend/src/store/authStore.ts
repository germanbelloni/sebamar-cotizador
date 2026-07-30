import { create } from "zustand";
import { queryClient } from "@/app/providers";
import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

type User = {
  id: string;

  nombre: string;

  role: "superadmin" | "admin" | "user";

  perfil: string;

  margen: number;

  empresa: string;

  nombreEmpresa?: string;

  colorPrimario?: string;

  colorSecundario?: string;

  telefono?: string;

  direccion?: string;

  email?: string;

  observacionesPdf?: string;

  logo?: string;

  ownerId: {
    _id: string;
    nombre: string;
    role: string;
    empresa?: string;
  } | null;
};

type AuthState = {
  token: string | null;

  user: User | null;

  isAuthenticated: boolean;

  login: (data: { token: string; user: User }) => void;

  refreshUser: (user: User) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),

  user: (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  })(),

  isAuthenticated: !!localStorage.getItem("token"),

  login: ({ token, user }) => {
    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  refreshUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
    });
  },

  logout: () => {
    useBudgetStore.getState().clearBudget();

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sebamar-budget-storage");

    queryClient.clear();

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
