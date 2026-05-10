export type FormFieldType =
  | "dimensions"
  | "selector"
  | "toggle-group"
  | "color-selector"
  | "glass-selector";

export type FormField = {
  id: string;

  type: FormFieldType;

  section?: string;

  label?: string;

  selectorKey?: string;
};
