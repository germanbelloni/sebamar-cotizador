import { X } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { apiFetch } from "@/lib/api";

import { useUIStore } from "@/store/uiStore";

type CreateUserForm = {
  nombre: string;

  password: string;

  empresa: string;

  role: "admin" | "user";

  perfil: string;

  margen: number;
};

type Props = {
  onUserCreated?: () => Promise<void>;
};

export function CreateUserModal({ onUserCreated }: Props) {
  const createUserModalOpen = useUIStore((state) => state.createUserModalOpen);

  const closeCreateUserModal = useUIStore(
    (state) => state.closeCreateUserModal,
  );

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CreateUserForm>({
    nombre: "",

    password: "",

    empresa: "",

    role: "user",

    perfil: "amarilla",

    margen: 0,
  });

  async function handleSubmit() {
    try {
      setLoading(true);

      await apiFetch("/auth/register", {
        method: "POST",

        body: JSON.stringify(form),
      });

      await onUserCreated?.();

      closeCreateUserModal();

      setForm({
        nombre: "",

        password: "",

        empresa: "",

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
              Nuevo usuario
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Crear cliente o vendedor.
            </p>
          </div>

          <Button variant="outline" size="icon" onClick={closeCreateUserModal}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* FORM */}

        <div className="mt-6 space-y-4">
          {/* USUARIO */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
              "
            >
              Usuario
            </label>

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

            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,

                  password: e.target.value,
                })
              }
            />
          </div>

          {/* EMPRESA */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
              "
            >
              Empresa
            </label>

            <Input
              value={form.empresa}
              onChange={(e) =>
                setForm({
                  ...form,

                  empresa: e.target.value,
                })
              }
            />
          </div>

          {/* ROLE */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
              "
            >
              Role
            </label>

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,

                  role: e.target.value as "admin" | "user",
                })
              }
              className="
                h-10
                w-full

                rounded-xl
                border
                border-border

                bg-background

                px-3
              "
            >
              <option value="user">User</option>

              <option value="admin">Admin</option>
            </select>
          </div>

          {/* MARGEN */}

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
