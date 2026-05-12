import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "@/App";

import { ProtectedRoute } from "@/guards/ProtectedRoute";

import { LoginPage } from "@/features/auth/pages/LoginPage";

import { PrintPage } from "@/pages/PrintPage";

import { useAuthStore } from "@/store/authStore";

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <App />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 APP */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<RootRedirect />} />

          <Route path="/print" element={<PrintPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
