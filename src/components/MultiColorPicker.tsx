import { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { cn, isLightColor } from "../core/utils";

type MultiColorPickerProps = {
  value: string[];
  onChange: (colors: string[]) => void;
};

/** Lista de colores (hex). Clic en "+" para agregar, clic en un color para quitarlo. */
export function MultiColorPicker({ value, onChange }: MultiColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Se usa el evento nativo "change" (y no onChange de React, que equivale a
  // "input") para agregar el color una sola vez, al cerrar el selector.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const handleChange = () => {
      const color = input.value.toLowerCase();
      if (!value.includes(color)) onChange([...value, color]);
    };
    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, [value, onChange]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {value.map((color) => (
        <button
          key={color}
          type="button"
          title={`Quitar ${color}`}
          onClick={() => onChange(value.filter((c) => c !== color))}
          className="group relative size-10 rounded-md border shadow-sm"
          style={{ backgroundColor: color }}
        >
          <X
            className={cn(
              "absolute inset-0 m-auto size-5 opacity-0 transition group-hover:opacity-100",
              isLightColor(color) ? "text-black" : "text-white",
            )}
          />
        </button>
      ))}

      <label
        className="grid size-10 cursor-pointer place-items-center rounded-md border border-dashed border-neutral-400 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
        title="Agregar color"
      >
        <Plus className="size-5" />
        <input ref={inputRef} type="color" className="sr-only" />
      </label>
    </div>
  );
}
