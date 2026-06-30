type Props = {
  tipo: "simple" | "doble" | "puerta_y_media";
  mano: "izquierda" | "derecha";
};

export function PuertasBlueprint({ tipo, mano }: Props) {
  const principalIzquierda = mano === "izquierda";

  return (
    <div
      className="
        flex
        items-center
        justify-center

        w-full
        rounded-2xl

        border border-white/10
        bg-zinc-900

        p-6
      "
    >
      {/* SIMPLE */}
      {tipo === "simple" && (
        <div className="relative h-[180px] w-[90px] border-2 border-white/40">
          <div className="absolute inset-2 border border-white/20" />

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              text-4xl
              text-[#39FF14]
            "
          >
            {mano === "izquierda" ? "↶" : "↷"}
          </div>
        </div>
      )}

      {/* DOBLE */}
      {tipo === "doble" && (
        <div className="flex h-[180px] w-[180px] border-2 border-white/40">
          <div className="relative h-full w-1/2 border-r border-white/20">
            <div className="absolute inset-2 border border-white/20" />

            <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#39FF14]">
              {principalIzquierda ? "↶" : "↷"}
            </div>
          </div>

          <div className="relative h-full w-1/2">
            <div className="absolute inset-2 border border-white/20" />

            <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#39FF14]">
              {principalIzquierda ? "↷" : "↶"}
            </div>
          </div>
        </div>
      )}

      {/* PUERTA Y MEDIA */}
      {tipo === "puerta_y_media" && (
        <div className="flex h-[180px] w-[180px] border-2 border-white/40">
          {principalIzquierda ? (
            <>
              <div className="relative h-full w-[66%] border-r border-white/20">
                <div className="absolute inset-2 border border-white/20" />

                <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#39FF14]">
                  ↶
                </div>
              </div>

              <div className="relative h-full w-[34%]">
                <div className="absolute inset-2 border border-white/20" />

                <div className="absolute inset-0 flex items-center justify-center text-3xl text-[#39FF14]">
                  ↷
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative h-full w-[34%] border-r border-white/20">
                <div className="absolute inset-2 border border-white/20" />

                <div className="absolute inset-0 flex items-center justify-center text-3xl text-[#39FF14]">
                  ↶
                </div>
              </div>

              <div className="relative h-full w-[66%]">
                <div className="absolute inset-2 border border-white/20" />

                <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#39FF14]">
                  ↷
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
