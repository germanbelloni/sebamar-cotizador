import axios from "axios";
import { useCotizacionStore } from "@/store/cotizacionStore";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const { user } = useAuthStore.getState();
  const { perfilTemporal } = useCotizacionStore.getState();

  if (
    config.method === "post" &&
    user?.role === "superadmin" &&
    user?.empresa === "Sebamar" &&
    config.data &&
    typeof config.data === "object"
  ) {
    config.data = {
      ...config.data,
      perfil: perfilTemporal,
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default api;
