// src/features/auth/pages/LoginPage.tsx

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
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#090909]
        px-6
      "
    >
      {/* FONDO */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.12),transparent_45%)]
        "
      />

      <div
        className="
          absolute
          left-[-120px]
          top-[-120px]
          h-[300px]
          w-[300px]
          rounded-full
          bg-lime-400/10
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          h-[300px]
          w-[300px]
          rounded-full
          bg-fuchsia-500/10
          blur-3xl
        "
      />

      {/* CARD */}

      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-[#111111]/95
          shadow-[0_0_80px_rgba(0,0,0,0.55)]
          backdrop-blur-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            relative
            border-b
            border-white/5
            px-8
            pb-8
            pt-10
          "
        >
          {/* GLOW */}

          <div
            className="
              absolute
              left-1/2
              top-0
              h-40
              w-40
              -translate-x-1/2
              rounded-full
              bg-lime-400/10
              blur-3xl
            "
          />

          {/* VERSION */}

          <div className="flex justify-center">
            <div
              className="
                rounded-full
                border
                border-fuchsia-500/20
                bg-fuchsia-500/10
                px-4
                py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.35em]
                text-fuchsia-300
              "
            >
              Cotizador <span className="text-[9px] opacity-70">V 1.0.1</span>
            </div>
          </div>

          {/* LOGO */}

          <div className="mt-8 flex justify-center">
            <img
              src="/logos/sebamar.png"
              alt="Sebamar"
              className="
    h-24
    object-contain
    drop-shadow-[0_0_25px_rgba(255,255,255,0.18)]
  "
            />
          </div>

          {/* FOOTER */}

          <div
            className="
              mt-8
              flex
              items-center
              justify-between
              text-[11px]
              text-zinc-500
            "
          >
            <span>{new Date().toLocaleDateString("es-AR")}</span>

            <span>
              {new Date().toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            <span
              className="
                rounded-full
                border
                border-fuchsia-500/20
                bg-fuchsia-500/10
                px-2
                py-1
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-fuchsia-300
              "
            >
              Premium
            </span>
          </div>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8">
          {/* USER */}

          <div>
            <label
              className="
                mb-2
                block
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-zinc-500
              "
            >
              Usuario
            </label>

            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="usuario"
              className="
                w-full
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-900
                px-5
                py-4
                text-white
                outline-none
                transition-all
                duration-200

                placeholder:text-zinc-600

                hover:border-zinc-500

                focus:border-zinc-300
                focus:bg-zinc-800
                focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]
              "
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label
              className="
                mb-2
                block
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-zinc-500
              "
            >
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-900
                px-5
                py-4
                text-white
                outline-none
                transition-all
                duration-200

                placeholder:text-zinc-600

                hover:border-zinc-500

                focus:border-zinc-300
                focus:bg-zinc-800
                focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]
              "
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              {error}
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              mt-2
              w-full
              rounded-2xl
              border
              border-lime-300/30
              bg-lime-400
              py-4
              text-sm
              font-black
              uppercase
              tracking-[0.18em]
              text-black
              transition-all
              duration-300

              shadow-[0_0_35px_rgba(255,255,255,0.12)]

              hover:scale-[1.01]
              hover:shadow-[0_0_45px_rgba(255,255,255,0.22)]

              active:scale-[0.99]

              disabled:cursor-not-allowed
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
