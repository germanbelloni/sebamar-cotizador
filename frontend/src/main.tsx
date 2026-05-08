import React from "react";
import ReactDOM from "react-dom/client";

import { AppRoutes } from "@/app/routes";

import "./index.css";
import { Providers } from "@/app/providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <AppRoutes />
    </Providers>
  </React.StrictMode>,
);
