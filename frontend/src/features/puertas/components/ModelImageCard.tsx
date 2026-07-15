type Props = {
  imageSrc: string;
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function ModelImageCard({ imageSrc, label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border p-3 transition-all duration-300 backdrop-blur-xl
        ${
          selected
            ? `
    border-border
    bg-[#39FF14]/[0.10]
    shadow-[0_0_35px_rgba(57,255,20,0.28)]
  `
            : `
    border-border
    bg-white/[0.03]
    hover:border-[#39FF14]/20
    hover:bg-white/[0.05]
  `
        }
      `}
    >
          <div className="flex h-[180px] items-center justify-center">
            <img
              src={imageSrc}
              alt={label}
              onError={() => console.log("ERROR IMG:", imageSrc)}
              onLoad={() => console.log("LOAD IMG:", imageSrc)}
              className="max-h-full max-w-full object-contain pointer-events-none"
            />
          </div>

      <div className="mt-3 text-center text-sm font-semibold uppercase text-zinc-200">
        {label}
      </div>
    </button>
  );
}
