export function useConfigUpdater<T>(
  setConfig: React.Dispatch<React.SetStateAction<T>>,
) {
  function updateConfig(updates: Partial<T>) {
    setConfig((prev) => {
      const next = {
        ...prev,
        ...updates,
      };
      return next;
    });
  }

  return {
    updateConfig,
  };
}
