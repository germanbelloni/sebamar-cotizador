type MediaDoorModel =
  | "v_entero"
  | "v_repartido"
  | "3_4_v_entero"
  | "3_4_v_repartido"
  | "1_2_v_entero"
  | "1_2_v_repartido"
  | "4_travesanos"
  | "1_travesano"
  | "ciega";

type Props = {
  model: MediaDoorModel;
};

export function MediaDoorPreview({ model }: Props) {
  const glassHeight =
    model === "3_4_v_entero" || model === "3_4_v_repartido"
      ? "75%"
      : model === "1_2_v_entero" || model === "1_2_v_repartido"
        ? "50%"
        : model === "ciega"
          ? "0%"
          : "100%";

  const travesanos =
    model === "v_repartido"
      ? 2
      : model === "3_4_v_repartido"
        ? 2
        : model === "4_travesanos"
          ? 4
          : model === "1_travesano"
            ? 1
            : 0;

  return (
    <div className="flex items-center justify-center">
      <div
        className="
          relative
          h-[120px]
          w-[44px]
          rounded-md
          border-2
          border-white/80
          bg-zinc-200
          p-[3px]
          shadow-[0_0_12px_rgba(255,255,255,0.12)]
        "
      >
        <div className="relative h-full w-full overflow-hidden rounded-sm bg-zinc-50">
          {/* VIDRIO */}
          {model !== "ciega" && (
            <div
              className="
                absolute
                left-0
                top-0
                w-full
                bg-gradient-to-b
                from-slate-500
                to-slate-800
              "
              style={{ height: glassHeight }}
            >
              {/* CASO ESPECIAL: 1/2 vidrio repartido */}
              {model === "1_2_v_repartido" && (
                <div
                  className="absolute left-0 w-full bg-white/80"
                  style={{
                    top: "50%",
                    height: "3px",
                  }}
                />
              )}
            </div>
          )}

          {/* TRAVESAÑOS GENERALES */}
          {Array.from({ length: travesanos }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 w-full bg-white/80"
              style={{
                top: `${((i + 1) * 100) / (travesanos + 1)}%`,
                height: "3px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
