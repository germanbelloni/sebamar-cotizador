import type { BudgetItem } from "../types/budget.types";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

type Params<TConfig, TResult = unknown> = {
  mutation: {
    mutateAsync: (config: TConfig) => Promise<TResult>;
  };

  config: TConfig;

  createItem: (config: TConfig, result: TResult) => BudgetItem;
};

export function useBudgetAdder<TConfig, TResult = unknown>({
  mutation,
  config,
  createItem,
}: Params<TConfig, TResult>) {
  const addItem = useBudgetStore((state) => state.addItem);

  async function handleAdd() {
    try {
      const result = await mutation.mutateAsync(config);

      const item = createItem(config, result);

      addItem(item);
    } catch (error) {
      console.error("ERROR AGREGANDO ITEM:", error);
    }
  }

  return {
    handleAdd,
  };
}
