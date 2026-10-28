import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function UnauthorizedPage() {
  const role = useAuthStore((s) => s.usuarioRol);
  const navigate = useNavigate();

  const home =
    role === "Administrador" ? "/admin"
    : role === "Cliente"     ? "/cliente"
    :                         "/login";

  return (
    <main className="grid min-h-screen place-content-center justify-items-center bg-cream-50 px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-terracotta-50 font-serif text-5xl text-terracotta-600">
        S
      </div>
      <h1 className="mt-6 font-serif text-3xl text-cacao-900">No autorizado</h1>
      <p className="mt-2 text-sm text-stone-500">
        Tu rol ({role ?? "sin rol"}) no tiene acceso a esta sección.
      </p>
      <button
        onClick={() => navigate(home)}
        className="mt-6 inline-flex h-12 items-center rounded-xl bg-terracotta-500 px-6 text-sm font-bold text-white hover:bg-terracotta-700"
      >
        Volver al inicio
      </button>
    </main>
  );
}