import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PerfilModal } from "./PerfilModal";

const NAV_POR_ROL: Record<string, { label: string; path: string }[]> = {
  Administrador: [
    { label: "Dashboard", path: "/admin" },
    { label: "Productos", path: "/admin/productos" },
    { label: "Pedidos", path: "/admin/pedidos" },
    { label: "Usuarios", path: "/admin/usuarios" },
  ],
  Cliente: [
    { label: "Catalogo", path: "/cliente" },
    { label: "Mis pedidos", path: "/cliente/pedidos" },
  ],
};

function Logo() {
  return (
    <div className="flex items-center gap-3 text-cacao-900">
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-terracotta-500 font-serif text-xl text-white">
        S
      </span>
      <span className="font-serif text-2xl tracking-tight max-lg:hidden">
        Solandre
      </span>
    </div>
  );
}

export function AppLayout() {
  const nombre = useAuthStore((s) => s.usuarioNombre);
  const rol = useAuthStore((s) => s.usuarioRol);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [perfilAbierto, setPerfilAbierto] = useState(false); 

  const items = rol ? NAV_POR_ROL[rol] ?? [] : [];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="sticky top-0 z-30 h-16 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8 max-lg:px-5">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full bg-terracotta-100 px-2.5 py-1 text-xs font-semibold text-terracotta-600 max-sm:hidden">
              {rol}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-700">
            <button
              onClick={() => setPerfilAbierto(true)}
              className="rounded-lg px-2 py-1 text-sm font-bold text-stone-700 transition hover:text-terracotta-600 hover:underline"
            >
              <span className="max-lg:hidden">{nombre ?? "Mi perfil"}</span>
              <span className="lg:hidden">Perfil</span>
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg px-2 py-1 text-sm font-bold text-terracotta-600 hover:text-terracotta-700 hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {items.length > 0 && (
        <div className="sticky top-16 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-8 max-lg:px-5">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "text-terracotta-600 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-terracotta-500"
                      : "text-stone-500 hover:text-cacao-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-8 pb-20 pt-10 max-lg:px-5 max-lg:pt-7">
        <Outlet />
      </main>

      {perfilAbierto && (
        <PerfilModal onClose={() => setPerfilAbierto(false)} />
      )}
    </>
  );
}