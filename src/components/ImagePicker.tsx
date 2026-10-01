/**
 * Selector de imagen con vista previa (usado en el formulario de producto).
 */
import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "../core/utils";

type ImagePickerProps = {
  /** Se llama con el archivo elegido por el usuario. */
  onChange: (file: File) => void;
  /** URL de la imagen actual (al editar). */
  defaultImage?: string | null;
  /** Resalta el borde en rojo (cuando falta la imagen). */
  invalid?: boolean;
};

/** Selector de imagen con vista previa. */
export function ImagePicker({
  onChange,
  defaultImage,
  invalid,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Libera la URL temporal de la vista previa cuando ya no se usa.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const image = preview ?? defaultImage;

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        "group relative grid aspect-square w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition hover:border-neutral-500",
        invalid && "border-red-500",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPreview(URL.createObjectURL(file));
          onChange(file);
        }}
      />
      {image ? (
        <>
          <img
            src={image}
            alt="Vista previa"
            className="size-full object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-black/60 py-2 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
            Cambiar imagen
          </span>
        </>
      ) : (
        <span className="flex flex-col items-center gap-2 text-neutral-500">
          <ImagePlus className="size-8" />
          Seleccionar imagen
        </span>
      )}
    </button>
  );
}
