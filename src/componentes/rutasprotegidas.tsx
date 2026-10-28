import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function RutasProtegidas() {
  const autenticado = useAuthStore((s) => s.autenticado);
  const token = useAuthStore((s) => s.token);
  return autenticado && token ? <Outlet /> : <Navigate to="/login" replace />;
}
