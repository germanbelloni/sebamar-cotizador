import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/login";

import { useAuthStore } from "@/store/authStore";

export function LoginPage() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

  const [nombre, setNombre] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const response = await login({
        nombre,
        password,
      });

      loginStore(response);

      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-zinc-950
        flex
        items-center
        justify-center
        p-6
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-zinc-900/80
          border
          border-zinc-800
          rounded-3xl
          p-8
          backdrop-blur
          shadow-2xl
        "
      >
        <div className="mb-8">
          <h1
            className="
              text-3xl
              font-bold
              text-white
              mb-2
            "
          >
            Sebamar
          </h1>

          <p className="text-zinc-400">Ingresá al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="
                text-sm
                text-zinc-300
                block
                mb-2
              "
            >
              Usuario
            </label>

            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="
                w-full
                rounded-xl
                bg-zinc-950
                border
                border-zinc-800
                px-4
                py-3
                text-white
                outline-none
                focus:border-lime-400
              "
              placeholder="usuario"
            />
          </div>

          <div>
            <label
              className="
                text-sm
                text-zinc-300
                block
                mb-2
              "
            >
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                rounded-xl
                bg-zinc-950
                border
                border-zinc-800
                px-4
                py-3
                text-white
                outline-none
                focus:border-lime-400
              "
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="
                text-sm
                text-red-400
              "
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-lime-400
              text-black
              font-semibold
              py-3
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
