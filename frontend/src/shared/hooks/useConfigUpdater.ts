export function useConfigUpdater<T>(
  setConfig: React.Dispatch<React.SetStateAction<T>>,
) {
  function updateConfig(updates: Partial<T>) {
    setConfig((prev) => ({
      ...prev,

      ...updates,
    }));
  }

  return {
    updateConfig,
  };
}
