import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { perfilService, type PerfilFormData } from "../service/perfil";
import { InputFotoPerfil } from "./inputFotoPerfil";

interface PerfilModalProps {
  onClose: () => void;
}

export function PerfilModal({ onClose }: PerfilModalProps) {
  const usuarioNombre = useAuthStore((s) => s.usuarioNombre);
  const usuarioAvatar = useAuthStore((s) => s.usuarioAvatar);
  const usuarioRol = useAuthStore((s) => s.usuarioRol);
  const actualizarPerfil = useAuthStore((s) => s.actualizarPerfil);

  const [modo, setModo] = useState<"ver" | "editar">("ver");
  const [perfil, setPerfil] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [fotoArchivo, setFotoArchivo] = useState<File | undefined>(undefined);
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    defaultValues: { name: usuarioNombre ?? "" },
  });

  useEffect(() => {
    perfilService
      .obtener()
      .then((p) => {
        setPerfil(p);
        actualizarPerfil(p.name, p.avatarurl); 
        reset({ name: p.name });
      })
      .catch(() => {}) 
      .finally(() => setCargando(false));
  }, [actualizarPerfil, reset]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onSubmit = async (data: PerfilFormData) => {
    try {
      setErrorServidor("");
      setMensajeExito("");
      const r = await perfilService.actualizar(data, fotoArchivo);
      actualizarPerfil(r.name, r.avatarurl);
      setPerfil(r);
      setFotoArchivo(undefined);
      reset({ name: r.name });
      setMensajeExito("Se actualizó con éxito");
      setTimeout(() => {
        setMensajeExito("");
        setModo("ver");
      }, 1200);
    } catch {
      setErrorServidor("Error al conectar con el servidor");
    }
  };

  const entrarEdicion = () => {
    setModo("editar");
    setErrorServidor("");
    setMensajeExito("");
    setFotoArchivo(undefined);
    reset({ name: perfil?.name ?? usuarioNombre ?? "" });
  };

  const cancelarEdicion = () => {
    setModo("ver");
    setErrorServidor("");
    setMensajeExito("");
    setFotoArchivo(undefined);
  };

  const iniciales = (usuarioNombre ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: "modalFadeIn 0.2s ease-out" }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalPop 0.22s ease-out" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
        >
          ✕
        </button>

        <div
          key={modo}
          style={{ animation: "modeFade 0.25s ease-out" }}
          className="min-h-110"
        >
          {modo === "ver" ? (
            <div className="p-7">
              <div className="mb-6 text-center">
                <h2 className="font-serif text-2xl text-cacao-900">Mi perfil</h2>
                <p className="mt-1 text-sm text-stone-500">
                  Tu información personal
                </p>
              </div>

              {cargando ? (
                <div className="py-10 text-center text-sm text-stone-500">
                  Cargando perfil...
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-terracotta-100 text-3xl font-bold text-terracotta-600">
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
                    <h3 className="font-serif text-xl text-cacao-900">
                      {usuarioNombre ?? "Sin nombre"}
                    </h3>
                    <span className="rounded-full bg-terracotta-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
                      {usuarioRol ?? "cliente"}
                    </span>
                  </div>

                  <dl className="mt-6 space-y-3 rounded-xl border border-stone-100 bg-cream-50 p-4">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                        Correo electrónico
                      </dt>
                      <dd className="mt-0.5 text-sm text-cacao-900">
                        {perfil?.email ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                        Rol
                      </dt>
                      <dd className="mt-0.5 text-sm capitalize text-cacao-900">
                        {perfil?.role ?? usuarioRol ?? "—"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-11 flex-1 rounded-xl border border-stone-300 bg-white text-sm font-bold text-stone-700 hover:bg-stone-50"
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      onClick={entrarEdicion}
                      className="h-11 flex-1 rounded-xl bg-terracotta-500 text-sm font-bold text-white hover:bg-terracotta-700"
                    >
                      Editar perfil
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-7">
              <div className="mb-6 text-center">
                <h2 className="font-serif text-2xl text-cacao-900">
                  Editar perfil
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Actualiza tu información
                </p>
              </div>

              <div className="flex justify-center">
                <InputFotoPerfil
                  fotoactual={usuarioAvatar}
                  inicialies={iniciales}
                  onChange={setFotoArchivo}
                />
              </div>

              <label className="mt-5 flex flex-col gap-2 text-sm font-semibold text-stone-700">
                <span>Nombre completo</span>
                <input
                  {...register("name", { required: "El nombre es obligatorio" })}
                  placeholder="María Flores"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-[15px] font-normal text-cacao-900 outline-none transition focus:ring-4 ${
                    errors.name
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-stone-300 focus:border-terracotta-500 focus:ring-terracotta-500/10"
                  }`}
                />
                {errors.name && (
                  <span className="text-xs font-medium text-rose-600">
                    {errors.name.message}
                  </span>
                )}
              </label>

              {errorServidor && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
                  {errorServidor}
                </div>
              )}
              {mensajeExito && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
                  {mensajeExito}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="h-11 flex-1 rounded-xl border border-stone-300 bg-white text-sm font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 flex-1 rounded-xl bg-terracotta-500 text-sm font-bold text-white hover:bg-terracotta-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}