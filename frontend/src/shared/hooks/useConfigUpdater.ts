// export function useConfigUpdater<T>(
//   setConfig: React.Dispatch<React.SetStateAction<T>>,
// ) {
//   function updateConfig(updates: Partial<T>) {
//     setConfig((prev) => ({
//       ...prev,
//       ...updates,
//     }));
//   }

//   return {
//     updateConfig,
//   };
// }
export function useConfigUpdater<T>(
  setConfig: React.Dispatch<React.SetStateAction<T>>,
) {
  function updateConfig(updates: Partial<T>) {
    console.log("========== UPDATE CONFIG ==========");
    console.log("Updates:", updates);

    setConfig((prev) => {
      const next = {
        ...prev,
        ...updates,
      };

      console.log("Prev:", prev);
      console.log("Next:", next);
      console.log("===================================");

      return next;
    });
  }

  return {
    updateConfig,
  };
}
