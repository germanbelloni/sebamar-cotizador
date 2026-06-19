import { OptionSelector } from "./OptionSelector";

type Option =
  | string
  | {
      label: string;
      value: string;
    };

type Props = {
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
};

export function VidrioSelector({ value, options, onChange }: Props) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? {
          label: option,
          value: option,
        }
      : option,
  );

  return (
    <OptionSelector
      title="Vidrio"
      value={value}
      options={normalizedOptions}
      columns={2}
      onChange={onChange}
    />
  );
}
