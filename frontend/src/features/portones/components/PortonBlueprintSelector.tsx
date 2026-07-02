import type { ReactNode } from "react";
import type { PortonMano } from "../types";

type Props = {
  hojas: 3 | 4 | 5 | 6;
  mano: PortonMano;
  //hojaPrincipal: PortonHojaPrincipal;
  sistema?: "abrir" | "corredizo" | "plegadizo";
  onChange: (data: { mano: PortonMano }) => void;
};

export function PortonBlueprintSelector({
  hojas,
  mano,
  sistema = "abrir",
  onChange,
}: Props) {
  function selectLeft() {
    onChange({
      mano: "izquierda",
    });
  }

  function selectRight() {
    onChange({
      mano: "derecha",
    });
  }

  const Card = ({
    selected,
    title,
    onClick,
    children,
  }: {
    selected: boolean;
    title: string;
    onClick: () => void;
    children: ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-3xl border p-4 transition-all duration-300 min-h-[300px]
        ${
          selected
            ? "border-lime-400 bg-lime-400/10 shadow-[0_0_35px_rgba(57,255,20,0.18)]"
            : "border-white/10 bg-zinc-900 hover:border-lime-400/30"
        }
      `}
    >
      <div className="mb-4 text-center text-sm font-bold text-white">
        {title}
      </div>

      {children}
    </button>
  );

  const renderLayout = (side: "left" | "right") => {
    if (hojas >= 5) {
      return (
        <div className="flex h-[180px] items-center justify-center rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-center text-sm font-semibold text-yellow-300">
          ⚠ CONSULTAR EN FÁBRICA
        </div>
      );
    }

    if (sistema === "abrir") {
      if (hojas === 3) {
        return (
          <div className="flex h-[180px] border border-white/20">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex flex-1 items-center justify-center border-r border-white/10 text-4xl text-lime-400 last:border-r-0"
              >
                {side === "left" ? (n === 1 ? "↶" : "") : n === 3 ? "↷" : ""}
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="flex h-[180px] border border-white/20">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex flex-1 items-center justify-center border-r border-white/10 text-4xl text-lime-400 last:border-r-0"
            >
              {side === "left" ? (n <= 2 ? "↶" : "") : n >= 3 ? "↷" : ""}
            </div>
          ))}
        </div>
      );
    }
    if (sistema === "plegadizo") {
      return (
        <div className="flex h-[180px] border border-white/20">
          {Array.from({ length: hojas }).map((_, i) => {
            const isFirst = i === 0;
            const isLast = i === hojas - 1;

            let symbol = "";

            if (side === "left") {
              if (isFirst) symbol = "↶";
              else symbol = "→";
            } else {
              if (isLast) symbol = "↷";
              else symbol = "←";
            }

            return (
              <div
                key={i}
                className="flex flex-1 items-center justify-center border-r border-white/10 text-4xl text-lime-400 last:border-r-0"
              >
                {symbol}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex h-[180px] border border-white/20">
        {Array.from({ length: hojas }).map((_, i) => (
          <div
            key={i}
            className="flex flex-1 items-center justify-center border-r border-white/10 text-4xl text-lime-400 last:border-r-0"
          >
            {side === "left" ? "→" : "←"}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Vista exterior
        </div>

        <div className="mt-2 text-lg font-semibold text-white">
          Elegí apertura del portón
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card
          selected={mano === "izquierda"}
          title="APERTURA IZQUIERDA"
          onClick={selectLeft}
        >
          {renderLayout("left")}
        </Card>

        <Card
          selected={mano === "derecha"}
          title="APERTURA DERECHA"
          onClick={selectRight}
        >
          {renderLayout("right")}
        </Card>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center text-xs text-zinc-400">
        Sistema: <span className="font-semibold">{sistema}</span> · Hojas:{" "}
        <span className="font-semibold">{hojas}</span>
      </div>
    </div>
  );
}
