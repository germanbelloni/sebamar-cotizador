import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { Providers } from "@/app/providers";

import { AppRoutes } from "@/app/routes";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <>
        <AppRoutes />

        <Toaster richColors position="top-right" closeButton duration={2500} />
      </>
    </Providers>
  </React.StrictMode>,
);
