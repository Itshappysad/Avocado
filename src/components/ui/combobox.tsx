"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import XIcon from "../icons/x";

export function Combobox({
  onValueChange,
  options,
  label,
  defaultValues,
}: {
  onValueChange?: (value: string[]) => void;
  options: { label: string; value: string }[];
  label?: string;
  defaultValues?: string[];
}) {
  const [open, setOpen] = React.useState(false);

  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(
    defaultValues ?? [],
  );

  React.useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedOptions);
    }
  }, [selectedOptions, onValueChange]);

  const deleteValue = React.useCallback(
    (cate: string) => {
      setSelectedOptions((prev) => {
        const index = prev.indexOf(cate);
        if (index > -1) {
          prev.splice(index, 1);
        }
        return [...prev];
      });
    },
    [setSelectedOptions],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="justify-between flex items-center w-full rounded p-2 bg-white text-black border border-gray-800"
        >
          <div className="flex gap-2 flex-1 pr-8 flex-wrap">
            {selectedOptions.length > 0
              ? selectedOptions.map((option) => (
                  <div
                    className="text-xs bg-black rounded-sm p-1 max-w-40 text-white flex gap-1"
                    key={"sp-" + option}
                  >
                    <span className="truncate max-w-32">{option}</span>
                    <XIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteValue(option);
                      }}
                      className="text-base flex-1"
                    />
                  </div>
                ))
              : `Selecciona ${label ?? "una opcion"} ...`}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-h-[260px] overflow-auto p-3">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={option.value}
            className="flex items-center gap-2 font-medium leading-none py-2 px-1 rounded-md hover:bg-gray-100"
          >
            <Checkbox
              checked={selectedOptions.includes(option.value)}
              onCheckedChange={(chk) => {
                if (!chk) {
                  return deleteValue(option.value);
                }
                setSelectedOptions((prev) => [...prev, option.value]);
              }}
              id={option.value}
            />
            {option.label}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}
