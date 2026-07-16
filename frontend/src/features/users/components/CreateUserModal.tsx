import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import api from "../../../lib/api";

import { useUIStore } from "@/store/uiStore";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

type CreateUserForm = {
  nombre: string;
  password: string;
  empresa: string;
  nombreEmpresa: string;
  role: "admin" | "user";
  perfil: string;
  margen: number;
};

type Props = {
  onUserCreated?: () => Promise<void>;
};

export function CreateUserModal({ onUserCreated }: Props) {
  const createUserModalOpen = useUIStore((state) => state.createUserModalOpen);

  const createUserType = useUIStore((state) => state.createUserType);

  const closeCreateUserModal = useUIStore(
    (state) => state.closeCreateUserModal,
  );

  const user = useAuthStore((state) => state.user);

  const isSuperAdmin = user?.role === "superadmin";

  const creandoEmpresa = isSuperAdmin && createUserType === "admin";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<CreateUserForm>({
    nombre: "",
    password: "",
    empresa: "",
    nombreEmpresa: "",
    role: "user",
    perfil: "amarilla",
    margen: 0,
  });
  async function handleSubmit() {
    try {
      setLoading(true);

      const payload = creandoEmpresa
        ? {
            nombre: form.nombre,
            password: form.password,
            nombreEmpresa: form.nombreEmpresa,
            margen: form.margen,
            perfil: form.perfil,
            role: "admin",
          }
        : {
            nombre: form.nombre,
            password: form.password,
            role: "user",
          };

      await api.post("/auth/register", payload);

      await onUserCreated?.();

      closeCreateUserModal();

      setForm({
        nombre: "",
        password: "",
        empresa: "",
        nombreEmpresa: "",
        role: "user",
        perfil: "amarilla",
        margen: 0,
      });
    } catch (error) {
      console.log(error);

      alert("Error creando usuario");
    } finally {
      setLoading(false);
    }
  }

  if (!createUserModalOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[60]

        flex
        items-center
        justify-center

        bg-black/70
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-[520px]

          rounded-3xl
          border
          border-border

          bg-zinc-950

          p-6
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h2
              className="
    text-2xl
    font-bold
  "
            >
              {creandoEmpresa ? "Nueva empresa" : "Nuevo usuario"}
            </h2>

            <p
              className="
    mt-1
    text-sm
    text-muted-foreground
  "
            >
              {creandoEmpresa
                ? "Crear administrador de empresa."
                : "Crear vendedor."}
            </p>
          </div>

          <Button variant="outline" size="icon" onClick={closeCreateUserModal}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* FORM */}

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm">Usuario</label>

            <Input
              value={form.nombre}
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre: e.target.value,
                })
              }
            />
          </div>

          {creandoEmpresa && (
            <div>
              <label className="mb-2 block text-sm">Nombre empresa</label>

              <Input
                value={form.nombreEmpresa}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nombreEmpresa: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* PASSWORD */}

          <div>
            <label
              className="
      mb-2
      block
      text-sm
    "
            >
              Password
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      text-muted-foreground
      hover:text-foreground
    "
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* LISTA DE PRECIOS (SOLO SUPERADMIN) */}

          {creandoEmpresa && (
            <div>
              <label className="mb-2 block text-sm">Lista de precios</label>

              <select
                value={form.perfil}
                onChange={(e) =>
                  setForm({
                    ...form,
                    perfil: e.target.value,
                  })
                }
                className="
        w-full
        rounded-md
        border
        border-input
        bg-background
        px-3
        py-2
        text-sm
      "
              >
                <option value="amarilla">Lista 1</option>
                <option value="azul">Lista 2</option>
                <option value="verde">Lista 3</option>
                <option value="papu">Lista 4</option>
              </select>
            </div>
          )}

          {/* MARGEN (SOLO SUPERADMIN) */}

          {creandoEmpresa && (
            <div>
              <label
                className="
        mb-2
        block
        text-sm
      "
              >
                Margen (%)
              </label>

              <Input
                type="number"
                value={form.margen}
                onChange={(e) =>
                  setForm({
                    ...form,
                    margen: Number(e.target.value),
                  })
                }
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-6
            flex
            justify-end
          "
        >
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="
              rounded-xl
            "
          >
            {loading ? "Creando..." : "Crear usuario"}
          </Button>
        </div>
      </div>
    </div>
  );
}
