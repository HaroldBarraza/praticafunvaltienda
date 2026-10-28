import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().min(1, "Requerido").email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
