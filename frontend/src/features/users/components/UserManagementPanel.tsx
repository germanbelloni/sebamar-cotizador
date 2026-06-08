import { UserPlus, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { getUsers, type User } from "@/features/users/api/getUsers";

import { toggleUserActive } from "@/features/users/api/toggleUserActive";

import { useUIStore } from "@/store/uiStore";

import { CreateUserModal } from "./CreateUserModal";

import { useAuthStore } from "@/store/authStore";

export function UserManagementPanel() {
  const usersPanelOpen = useUIStore((state) => state.usersPanelOpen);

  const closeUsersPanel = useUIStore((state) => state.closeUsersPanel);

  const openCreateUserModal = useUIStore((state) => state.openCreateUserModal);

  const user = useAuthStore((state) => state.user);

  const isSuperAdmin = user?.role === "superadmin";

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleToggleUser(userId: string) {
    try {
      setUpdatingUserId(userId);

      await toggleUserActive(userId);

      await loadUsers();
    } catch (error) {
      console.log(error);

      alert("Error actualizando usuario");
    } finally {
      setUpdatingUserId(null);
    }
  }

  useEffect(() => {
    if (!usersPanelOpen) {
      return;
    }

    void loadUsers();
  }, [usersPanelOpen, loadUsers]);

  if (!usersPanelOpen) {
    return null;
  }

  return (
    <>
      <CreateUserModal onUserCreated={loadUsers} />

      <div
        className="
          fixed
          inset-0
          z-50

          flex
          items-center
          justify-center

          bg-black/70
          backdrop-blur-sm
        "
      >
        <div
          className="
            relative

            flex
            h-[85vh]
            w-[1100px]
            flex-col

            overflow-hidden

            rounded-3xl
            border
            border-border

            bg-zinc-950

            shadow-2xl
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between

              border-b
              border-border

              px-6
              py-5
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Gestión de usuarios
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Clientes, vendedores y permisos.
              </p>
            </div>
            <div className="flex gap-3">
              {isSuperAdmin ? (
                <>
                  <Button
                    className="gap-2 rounded-xl"
                    onClick={() => openCreateUserModal("admin")}
                  >
                    <UserPlus className="h-4 w-4" />
                    Nueva empresa
                  </Button>

                  <Button
                    className="gap-2 rounded-xl"
                    variant="secondary"
                    onClick={() => openCreateUserModal("user")}
                  >
                    <UserPlus className="h-4 w-4" />
                    Usuario Sebamar
                  </Button>
                </>
              ) : (
                <Button
                  className="gap-2 rounded-xl"
                  onClick={() => openCreateUserModal("user")}
                >
                  <UserPlus className="h-4 w-4" />
                  Nuevo vendedor
                </Button>
              )}

              <Button variant="outline" size="icon" onClick={closeUsersPanel}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* CONTENT */}

          <div
            className="
              flex-1
              overflow-auto

              p-6
            "
          >
            {loading ? (
              <div>Cargando usuarios...</div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="
                      flex
                      items-center
                      justify-between

                      rounded-2xl
                      border
                      border-border

                      bg-card/40

                      p-5
                    "
                  >
                    {/* INFO */}

                    <div>
                      <h3
                        className="
                          text-lg
                          font-semibold
                          uppercase
                        "
                      >
                        {user.nombre}
                      </h3>

                      <p
                        className="
    mt-1
    text-sm
    text-muted-foreground
  "
                      >
                        {user.role === "admin"
                          ? "Empresa"
                          : user.ownerId?.nombre
                            ? `Vendedor de ${user.ownerId.nombre}`
                            : "-"}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div
                      className="
                        flex
                        items-center
                        gap-12
                      "
                    >
                      {/* ROLE */}

                      <div>
                        <p
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          ROLE
                        </p>

                        <p
                          className="
                            font-medium
                            uppercase
                          "
                        >
                          {user.role}
                        </p>
                      </div>

                      {/* ESTADO */}

                      <div>
                        <p
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          ESTADO
                        </p>

                        <div
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-bold
                            uppercase

                            ${
                              user.activo
                                ? "bg-lime-500/20 text-lime-400"
                                : "bg-red-500/20 text-red-400"
                            }
                          `}
                        >
                          {user.activo ? "ACTIVO" : "INACTIVO"}
                        </div>
                      </div>

                      {/* BUTTON */}

                      <Button
                        size="sm"
                        variant={user.activo ? "destructive" : "default"}
                        disabled={updatingUserId === user._id}
                        onClick={() => handleToggleUser(user._id)}
                        className="
                          rounded-xl
                        "
                      >
                        {updatingUserId === user._id
                          ? "..."
                          : user.activo
                            ? "Desactivar"
                            : "Activar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
