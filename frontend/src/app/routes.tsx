import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "@/App";

import { LoginPage } from "@/features/auth/pages/LoginPage";

import { PrintPage } from "@/pages/PrintPage";

import { useAuthStore } from "@/store/authStore";

import { ProtectedRoute } from "./ProtectedRoute";

import { AuthInitializer } from "./AuthInitializer";

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
      <AuthInitializer>
        <Routes>
          {/* LOGIN */}

          <Route path="/login" element={<LoginPage />} />

          {/* PROTECTED */}

          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<RootRedirect />} />

            <Route path="/print" element={<PrintPage />} />
          </Route>
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}
