import { useState } from "react";

import { initialCortinaConfig } from "../constants";

export function useCortinaConfig() {
  const [config, setConfig] = useState(initialCortinaConfig);

  return {
    config,
    setConfig,
  };
}
