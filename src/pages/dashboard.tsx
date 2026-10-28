import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { perfilService } from "../service/perfil";
import { PerfilModal } from "../componentes/PerfilModal";

export function DashboardPage() {                               
  const usuarioNombre   = useAuthStore((s) => s.usuarioNombre);
  const usuarioAvatar   = useAuthStore((s) => s.usuarioAvatar);
  const usuarioRol      = useAuthStore((s) => s.usuarioRol);
  const actualizarPerfil = useAuthStore((s) => s.actualizarPerfil);

  const [perfil, setPerfil] = useState<any>(null);
  const [isPerfilOpen, setIsPerfilOpen] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    perfilService
      .obtener()
      .then((p) => {
        setPerfil(p);
        actualizarPerfil(p.name, p.avatarurl);            
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [actualizarPerfil]);

  const cerrarModal = () => {
    setIsPerfilOpen(false);
    perfilService.obtener().then(setPerfil).catch(() => {});
  };

  const iniciales = (usuarioNombre ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20 text-stone-500">
        Cargando perfil...
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Administra tu información personal
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="h-32 bg-linear-to-r from-terracotta-500 to-terracotta-700" />

        <div className="px-8 pb-8 max-lg:px-5">
          <div className="-mt-12 mb-5 flex items-end justify-between max-lg:flex-col max-lg:items-start max-lg:gap-4">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-white bg-terracotta-100 text-3xl font-bold text-terracotta-600 shadow-md">
              {usuarioAvatar ? (
                <img
                  src={usuarioAvatar}
                  alt={usuarioNombre ?? "Perfil"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{iniciales}</span>
              )}
            </div>

            <button
              onClick={() => setIsPerfilOpen(true)}
              className="inline-flex h-10 items-center rounded-lg bg-terracotta-500 px-4 text-sm font-bold text-white hover:bg-terracotta-700"
            >
              Editar perfil
            </button>
          </div>

          <div className="mb-6">
            <h2 className="font-serif text-2xl text-cacao-900">
              {usuarioNombre ?? "Sin nombre"}
            </h2>
            <span className="mt-1 inline-block rounded-full bg-terracotta-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
              {usuarioRol ?? "cliente"}
            </span>
          </div>

          <dl className="grid gap-4 border-t border-stone-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Correo electrónico
              </dt>
              <dd className="mt-1 text-sm text-cacao-900">
                {perfil?.email ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Rol
              </dt>
              <dd className="mt-1 text-sm capitalize text-cacao-900">
                {perfil?.role ?? usuarioRol ?? "—"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {isPerfilOpen && <PerfilModal onClose={cerrarModal} />}
    </>
  );
}