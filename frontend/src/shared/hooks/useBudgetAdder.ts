type Params<TConfig, TResult = unknown, TItem = unknown> = {
  mutation: {
    mutateAsync: (config: TConfig) => Promise<TResult>;
  };

  config: TConfig;

  setItems: React.Dispatch<React.SetStateAction<TItem[]>>;

  createItem: (config: TConfig, result: TResult) => TItem;
};

export function useBudgetAdder<TConfig, TResult = unknown, TItem = unknown>({
  mutation,
  config,
  setItems,
  createItem,
}: Params<TConfig, TResult, TItem>) {
  async function handleAdd() {
    try {
      const result = await mutation.mutateAsync(config);

      const item = createItem(config, result);

      setItems((prev) => [...prev, item]);
    } catch (error) {
      console.error("ERROR AGREGANDO ITEM:", error);
    }
  }

  return {
    handleAdd,
  };
}
