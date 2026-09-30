import { useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Checkbox } from "./checkbox";
import { cn, toggleValue } from "../../core/utils";

type Option = { label: string; value: string };

type ComboboxProps = {
  id?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
};

/** Selector múltiple con casillas (ej: tallas o categorías de un producto). */
export function Combobox({
  id,
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  invalid,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-left outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30",
            invalid && "border-red-500",
          )}
        >
          <span className="flex flex-1 flex-wrap gap-1.5">
            {value.length === 0 && (
              <span className="text-neutral-400">{placeholder}</span>
            )}
            {value.map((selected) => (
              <span
                key={selected}
                className="inline-flex items-center gap-1 rounded bg-neutral-900 px-2 py-0.5 text-xs text-white"
              >
                {options.find((o) => o.value === selected)?.label ?? selected}
                <X
                  role="button"
                  aria-label={`Quitar ${selected}`}
                  className="size-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(value.filter((v) => v !== selected));
                  }}
                />
              </span>
            ))}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-64 w-[--radix-popover-trigger-width] overflow-auto p-1">
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-neutral-100"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() =>
                  onChange(toggleValue(value, option.value))
                }
              />
              {option.label}
            </label>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
