import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function RoleRoute({allow}: {allow: string[]}){
    const role = useAuthStore((s) => s.usuarioRol)
    return role && allow.includes(role) ? <Outlet/> : <Navigate to="/unauthorized" replace/>
}