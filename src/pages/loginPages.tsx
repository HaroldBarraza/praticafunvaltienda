import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schema/loginSchema";
import { registerSchema, type RegisterFormData } from "../schema/registerSchema";
import { authService } from "../service/auth";
import { useAuthStore } from "../store/authStore";

const HERO_BG =
  "linear-gradient(145deg, rgba(74,39,31,0.96), rgba(128,58,40,0.82)), url('https://images.unsplash.com/photo-1663530761401-15eefb544889?auto=format&fit=crop&w=1200&q=85')";

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${light ? "text-white" : "text-cacao-900"}`}>
      <span
        className={`grid place-items-center w-11 h-11 rounded-xl font-serif text-2xl ${
          light ? "bg-white text-terracotta-600" : "bg-terracotta-500 text-white"
        }`}
      >
        S
      </span>
      <span className="font-serif text-2xl tracking-tight">Solandre</span>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  registration,
  error,
}: {
  label: string;
  placeholder: string;
  type?: string;
  registration: any;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-stone-700">
      <span>{label}</span>
      <span className="relative block">
        <input
          {...registration}
          type={isPassword && visible ? "text" : type}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl border bg-white px-4 pr-14 text-[15px] font-normal text-cacao-900 placeholder:text-stone-400 outline-none transition focus:ring-4 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
              : "border-stone-300 focus:border-terracotta-500 focus:ring-terracotta-500/10"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-2 top-2 h-8 rounded px-2 text-xs font-bold text-terracotta-600 hover:text-terracotta-700"
          >
            {visible ? "Ocultar" : "Ver"}
          </button>
        )}
      </span>
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}

type Modo = "login" | "register";

export function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [modo, setModo] = useState<Modo>("login");
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(modo === "login" ? loginSchema : registerSchema),
  });

  const cambiarModo = (nuevo: Modo) => {
    setModo(nuevo);
    setErrorServidor("");
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      setErrorServidor("");
      const r =
        modo === "login"
          ? await authService.login(data as LoginFormData)
          : await authService.register(data as RegisterFormData);

      loginStore(r.access_token, r.nombre, r.role);

      const destino =
        r.role === "Administrador" ? "/admin"
        :                           "/cliente";
      navigate(destino, { replace: true });
    } catch (e: any) {
      setErrorServidor(
        e.response?.data?.detail?.[0]?.msg ||
          e.response?.data?.detail ||
          (modo === "login" ? "Credenciales incorrectas" : "No se pudo registrar")
      );
    }
  };

  const esRegistro = modo === "register";

  return (
    <main className="grid min-h-screen place-items-center bg-cream-100 px-8 py-8 max-lg:block max-lg:p-0 max-lg:bg-white">
      <section className="grid w-full max-w-7xl min-h-180 grid-cols-[52%_48%] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)] max-lg:block max-lg:min-h-screen max-lg:rounded-none max-lg:shadow-none">
        <div
          className="flex flex-col justify-between p-14 text-white bg-cover bg-center max-lg:hidden"
          style={{ backgroundImage: HERO_BG }}
        >
          <Logo light />
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-200">
              Cocina de verdad
            </span>
            <h1 className="mt-4 mb-5 font-serif text-[58px] leading-[1.06] tracking-tight">
              Sabor de casa,
              <br />
              en cada plato.
            </h1>
            <p className="max-w-sm text-base leading-7 text-terracotta-100">
              Menús frescos, ingredientes honestos y el sabor de casa, directo a
              tu puerta.
            </p>
          </div>
          <span className="text-[13px] text-terracotta-200">© 2026 Solandre</span>
        </div>

        {/* FORM */}
        <div className="grid place-items-center px-14 py-12 max-lg:min-h-screen max-lg:px-6 max-lg:py-10">
          <div className="flex w-full max-w-95 flex-col max-lg:mx-auto">
            <div className="mb-12 hidden justify-center max-lg:flex">
              <Logo />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-600">
              {esRegistro ? "Crea tu cuenta" : "Bienvenido de vuelta"}
            </span>
            <h2 className="mt-3 mb-2 font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
              {esRegistro ? "Regístrate" : "Inicia sesión"}
            </h2>
            <p className="mb-7 text-sm text-stone-500">
              {esRegistro
                ? "Regístrate para pedir tu menú y ver tus pedidos."
                : "Accede a tu cuenta y pide tu menú del día."}
            </p>

            {errorServidor && (
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-[13px] text-rose-600">
                {errorServidor}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="flex flex-col gap-4">
                {esRegistro && (
                  <Field
                    label="Nombre completo"
                    placeholder="María Flores"
                    registration={register("nombre")}
                    error={errors.nombre_completo?.message as string}
                  />
                )}
                <Field
                  label="Correo electrónico"
                  placeholder="nombre@correo.com"
                  type="email"
                  registration={register("email")}
                  error={errors.email?.message as string}
                />
                <Field
                  label="Contraseña"
                  placeholder="••••••••"
                  type="password"
                  registration={register("password")}
                  error={errors.password?.message as string}
                />
              </div>

              {!esRegistro && (
                <button
                  type="button"
                  className="mb-4 mt-3 self-end text-xs font-bold text-terracotta-600 hover:text-terracotta-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-terracotta-500 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-terracotta-700 disabled:opacity-50"
              >
                {isSubmitting
                  ? esRegistro
                    ? "Registrando..."
                    : "Iniciando sesión..."
                  : esRegistro
                  ? "Crear cuenta"
                  : "Iniciar sesión"}
              </button>

              <p className="mt-6 text-center text-sm text-stone-500">
                {esRegistro ? "¿Ya tienes cuenta? " : "¿Todavía no tienes cuenta? "}
                <button
                  type="button"
                  onClick={() => cambiarModo(esRegistro ? "login" : "register")}
                  className="font-bold text-terracotta-600 hover:text-terracotta-700"
                >
                  {esRegistro ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}