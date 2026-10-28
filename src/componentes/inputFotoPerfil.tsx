import React, { useEffect, useState } from "react";

interface Props {
  fotoactual?: string | null;
  inicialies: string;
  onChange: (file: File | undefined) => void;
}

export function InputFotoPerfil({ fotoactual, inicialies, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen debe ser menor a 5 MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const quitarSeleccion = () => {
    setPreview(null);
    onChange(undefined);
  };

  const imagenMostrada = preview ?? fotoactual;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circular */}
      <div className="relative">
        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-stone-200 bg-terracotta-100 text-2xl font-bold text-terracotta-600">
          {imagenMostrada ? (
            <img
              src={imagenMostrada}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{inicialies}</span>
          )}
        </div>

        <label
          htmlFor="foto-perfil-input"
          className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-terracotta-500 text-white shadow-md transition hover:bg-terracotta-700"
          title="Cambiar foto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <input
            id="foto-perfil-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

      {preview ? (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-stone-500">
            Nueva foto lista para guardar
          </span>
          <button
            type="button"
            onClick={quitarSeleccion}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Quitar selección
          </button>
        </div>
      ) : (
        <span className="text-xs text-stone-500">JPG o PNG · máx. 5 MB</span>
      )}
    </div>
  );
}
