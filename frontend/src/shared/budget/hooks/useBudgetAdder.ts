import type { BudgetItem } from "../types/budget.types";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";
import { useGlobalLoadingStore } from "@/shared/loading/useGlobalLoadingStore";

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

  const replaceItem = useBudgetStore((state) => state.replaceItem);

  const editingItem = useBudgetStore((state) => state.editingItem);

  const setLoading = useGlobalLoadingStore((state) => state.setLoading);

  async function handleAdd() {
    let timer: number | undefined;

    try {
      timer = window.setTimeout(() => {
        setLoading(true);
      }, 2000);

      const result = await mutation.mutateAsync(config);

      const item = createItem(config, result);
      if (editingItem) {
        replaceItem({
          ...item,
          id: editingItem.id,
        });
      } else {
        addItem(item);
      }
    } catch (error) {
      console.error("ERROR AGREGANDO ITEM:", error);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  return {
    handleAdd,
  };
}
