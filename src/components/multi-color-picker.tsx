import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, getLuminance, hexToRgb } from "../core/utils";
import { Button } from "./ui/button";

function GetX({ color }: { color: string }) {
  const rgb = color.split(", ");

  if (!rgb) {
    return (
      <button className="bg-gray-500/40 flex justify-center items-center">
        <XIcon className="text-black text-3xl" />
      </button>
    );
  }

  const r = parseInt(rgb[0]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2]);

  const luminance = getLuminance(r, g, b);

  const textColor = luminance > 128 ? "text-black" : "text-white";

  return (
    <button
      className="bg-gray-500/40 justify-center items-center absolute size-full hidden group-hover:flex inset-0"
      type="button"
    >
      <XIcon className={cn("text-3xl", textColor)} />
    </button>
  );
}

function MultiColorPicker({
  onColorChange,
  defaultColors,
}: {
  onColorChange: (colors: string[]) => void;
  defaultColors?: string[];
}) {
  const [colors, setColors] = useState<string[]>(defaultColors ?? []);
  const [nextColor, setNextColor] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nextColor.length === 0) return;

    setColors((prev) => [...prev, nextColor]);
  }, [nextColor]);

  useEffect(() => {
    onColorChange(colors);
  }, [colors]);

  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color, i) => (
        <div
          className="p-1 size-12 shadow-sm bg-gray-200 rounded-md relative group"
          key={i}
          onClick={() =>
            setColors((prev) => {
              const index = prev.indexOf(color);
              return prev.toSpliced(index, 1);
            })
          }
        >
          <div
            className="size-full rounded-md"
            style={{ backgroundColor: `rgb(${color})` }}
          />
          <GetX color={color} />
        </div>
      ))}

      <Button
        onClick={() => inputRef.current?.click()}
        size="icon"
        variant="outline"
        type="button"
        onBlur={() => {
          const pickedHexColor = inputRef.current?.value;

          if (!pickedHexColor) return;

          const pickedColor = hexToRgb(pickedHexColor);
          if (pickedColor !== nextColor) {
            setNextColor(pickedColor);
          }
        }}
      >
        <input className="invisible size-0" type="color" ref={inputRef} />
        <PlusIcon />
      </Button>
    </div>
  );
}
export default MultiColorPicker;
