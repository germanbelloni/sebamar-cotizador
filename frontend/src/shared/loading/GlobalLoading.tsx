import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
};

export function GlobalLoading({ open }: Props) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          gap-4
          rounded-2xl
          border
          border-border
          bg-card
          p-8
          shadow-2xl
        "
      >
        <Loader2 className="h-10 w-10 animate-spin" />

        <p className="text-lg font-semibold">Calculando...</p>
      </div>
    </div>
  );
}
