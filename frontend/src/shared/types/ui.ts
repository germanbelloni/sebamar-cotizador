import type { FormField } from "./form";
export type SelectorOption = {
  label: string;

  value: string;
};

export type ProductUI = {
  title: string;

  sections: Record<string, string>;

  selectors?: Record<string, SelectorOption[]>;

  defaults?: Record<string, unknown>;

  messages?: Record<string, string>;

  actions?: Record<string, string>;

  fields?: FormField[];
};
