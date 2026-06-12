import { OptionSelector } from "./OptionSelector";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function VidrioSelector({ value, options, onChange }: Props) {
  return (
    <OptionSelector
      title="Vidrio"
      value={value}
      options={options}
      columns={2}
      onChange={onChange}
    />
  );
}
