import { OptionSelector } from "./OptionSelector";

import type { VidrioType } from "@/shared/types/vidrios";

type Props = {
  value: string;

  options: VidrioType[];

  onChange: (value: string) => void;
};

export function VidrioSelector({
  value,

  options,

  onChange,
}: Props) {
  return (
    <OptionSelector
      title="Vidrio"
      value={value}
      options={options.map((vidrio) => ({
        label: vidrio,
        value: vidrio,
      }))}
      columns={2}
      onChange={onChange}
    />
  );
}
