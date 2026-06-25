import { SegmentedControl } from "@/components/ui/segmented-control";

type Option = {
  label: string;

  value: string;
};

type Props = {
  label?: string;

  value: string;

  options: Option[];

  onChange: (value: string) => void;
};

export function LineaSelector({
  label = "Línea",

  value,

  options,

  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      {label && (
        <div>
          <h3
            className="
        text-sm
        font-medium
        text-foreground
      "
          >
            {label}
          </h3>
        </div>
      )}

      <div className="flex justify-center">
        <SegmentedControl value={value} onChange={onChange} options={options} />
      </div>
    </div>
  );
}
