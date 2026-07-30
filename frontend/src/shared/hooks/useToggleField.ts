// type Params<T> = {
//   config: T;

//   updateConfig: (updates: Partial<T>) => void;
// };

// export function useToggleField<T extends Record<string, unknown>>({
//   config,

//   updateConfig,
// }: Params<T>) {
//   function toggleField(field: keyof T) {
//     updateConfig({
//       [field]: !config[field],
//     } as Partial<T>);
//   }

//   return {
//     toggleField,
//   };
// }
type Params<T> = {
  config: T;

  updateConfig: (updates: Partial<T>) => void;
};

export function useToggleField<T extends Record<string, unknown>>({
  config,

  updateConfig,
}: Params<T>) {
  function toggleField(field: keyof T) {
    updateConfig({
      [field]: !config[field],
    } as Partial<T>);
  }

  return {
    toggleField,
  };
}
