import type { BudgetItem } from "../budget/types/budget.types";

type Params<TConfig, TResult = unknown> = {
  mutation: {
    mutateAsync: (config: TConfig) => Promise<TResult>;
  };

  config: TConfig;

  createItem: (config: TConfig, result: TResult) => BudgetItem;

  onAddItem?: (item: BudgetItem) => void;
};

export function useBudgetAdder<TConfig, TResult = unknown>({
  mutation,

  config,

  createItem,

  onAddItem,
}: Params<TConfig, TResult>) {
  async function handleAdd() {
    try {
      const result = await mutation.mutateAsync(config);

      const item = createItem(config, result);

      onAddItem?.(item);
    } catch (error) {
      console.error("ERROR AGREGANDO ITEM:", error);
    }
  }

  return {
    handleAdd,
  };
}
