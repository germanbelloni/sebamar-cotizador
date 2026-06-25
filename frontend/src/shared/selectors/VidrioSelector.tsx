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

function formatVidrioLabel(value: string) {
  switch (value) {
    case "fantasia":
      return "Fantasía";

    case "esmerilado":
      return "Esmerilado";

    case "dvh":
      return "DVH 4+9+4";

    case "dvh_4_9_4":
      return "DVH 4+9+4";

    case "dvh_5_9_5":
      return "DVH 5+9+5";

    default:
      return value;
  }
}

export function VidrioSelector({ value, options, onChange }: Props) {
  const normalizedOptions = options.map((option) => {
    if (typeof option === "string") {
      return {
        label: formatVidrioLabel(option),
        value: option,
      };
    }

    return {
      label: option.label || formatVidrioLabel(option.value),
      value: option.value,
    };
  });

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
