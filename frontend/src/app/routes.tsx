import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@/App";

import { PrintPage } from "@/pages/PrintPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/print" element={<PrintPage />} />
      </Routes>
    </BrowserRouter>
  );
}
