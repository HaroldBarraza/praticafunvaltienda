import { api } from "../libs/axios";
import type { LoginFormData } from "../schema/loginSchema";
import { RegisterFormData } from "../schema/registerSchema";

function nomarlizarRol(raw: string): string {
  const r = (raw ?? "").toLowerCase();
  if (r === "admin" || r === "administrador") {
    return "Administrador";
  }
  return "Cliente";
}

interface LoginBackend {
  access_token: string;
  token_type: string;
  user_role: string;
  user_name: string;
}

export interface LoginResponse {
  access_token: string;
  nombre: string;
  role: string;
}

export const authService = {
  login: async (datos: LoginFormData): Promise<LoginResponse> => {
    const { data } = await api.post<LoginBackend>("/auth/login", datos);
    return {
      access_token: data.access_token,
      nombre: data.user_name,
      role: nomarlizarRol(data.user_role),
    };
  },
  register: async (datos: RegisterFormData): Promise<LoginResponse> => {
    await api.post("/auth/register", {
      email: datos.email,
      password: datos.password,
      nombre: datos.nombre,
    });
    return authService.login({ email: datos.email, password: datos.password });
  },
  me: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
