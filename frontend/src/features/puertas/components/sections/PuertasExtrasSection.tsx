import { SelectableCard } from "@/components/ui/selectable-card";

type Props = {
  barralRecto?: number;

  barralCurvo?: number;

  manija?: boolean;

  picaporte?: boolean;

  mediaManija?: boolean;

  onToggleBarralRecto: () => void;

  onToggleBarralCurvo: () => void;

  onToggleManija: () => void;

  onTogglePicaporte: () => void;

  onToggleMediaManija: () => void;
};

export function PuertasExtrasSection({
  barralRecto,
  barralCurvo,
  manija,
  picaporte,
  mediaManija,
  onToggleBarralRecto,
  onToggleBarralCurvo,
  onToggleManija,
  onTogglePicaporte,
  onToggleMediaManija,
}: Props) {
  const tieneBarral = !!barralRecto || !!barralCurvo;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* BARRAL RECTO */}

      <SelectableCard selected={!!barralRecto} onClick={onToggleBarralRecto}>
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <div
              className="
                h-10
                w-[6px]
                rounded-full
                bg-white/80
              "
            />
          </div>

          <div className="text-sm font-medium">Barral recto</div>
        </div>
      </SelectableCard>

      {/* BARRAL CURVO */}

      <SelectableCard selected={!!barralCurvo} onClick={onToggleBarralCurvo}>
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <svg width="42" height="42">
              <path
                d="M 28 6 Q 6 20 28 36"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="text-sm font-medium">Barral curvo</div>
        </div>
      </SelectableCard>

      {/* MEDIA MANIJA */}

      <SelectableCard
        disabled={!tieneBarral}
        selected={!!mediaManija}
        onClick={onToggleMediaManija}
      >
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <div
              className="
                h-6
                w-[5px]
                rounded-full
                bg-white/80
              "
            />
          </div>

          <div className="text-sm font-medium">Media manija</div>
        </div>
      </SelectableCard>

      {/* PICAPORTE */}

      <SelectableCard selected={!!picaporte} onClick={onTogglePicaporte}>
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <svg width="52" height="28">
              <rect
                x="10"
                y="12"
                width="24"
                height="4"
                rx="999"
                fill="rgba(255,255,255,0.8)"
              />

              <circle cx="38" cy="14" r="4" fill="rgba(255,255,255,0.8)" />
            </svg>
          </div>

          <div className="text-sm font-medium">Picaporte</div>
        </div>
      </SelectableCard>

      {/* MANIJA */}

      <SelectableCard selected={!!manija} onClick={onToggleManija}>
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <svg width="38" height="38">
              <path
                d="M 14 10 L 14 28"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <path
                d="M 14 19 L 26 19"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="text-sm font-medium">Manija</div>
        </div>
      </SelectableCard>
    </div>
  );
}
