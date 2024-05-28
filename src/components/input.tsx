import { forwardRef, useState } from "react";
import { cn } from "../core/utils";
import type { FieldError } from "react-hook-form";
import { Icon } from "@iconify/react";
import "./input.css";

type Props = React.ComponentPropsWithRef<"input"> & {
  error?: FieldError;
};

const showType = ({
  isPassword,
  type,
  show,
}: {
  isPassword: boolean;
  type: React.HTMLInputTypeAttribute;
  show: boolean;
}) => {
  if (!isPassword) return type;

  if (show) return "text";

  return type;
};

const Input = forwardRef<null, Props>(function Input(
  { className, name, error, type, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="relative group">
        <input
          {...props}
          className={cn(
            `
              outline outline-[1px] outline-gray-400 text-lg rounded w-full bg-white
              focus:outline-blue-500 focus:outline-2
            `,
            {
              "outline-red-500 outline-2": !!error,
            },
            className
          )}
          name={name}
          ref={ref}
          type={showType({
            isPassword: type === "password",
            type: type ?? "text",
            show: showPassword,
          })}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              text-black text-lg absolute right-1 bottom-[0.4rem] active-password__button transition-[opacity] z-30
              group-hover:opacity-100
            "
          >
            {!showPassword ? (
              <Icon icon="fluent:eye-16-regular" />
            ) : (
              <Icon icon="fluent:eye-off-16-regular" />
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-200 rounded-md mt-2 p-2">
          <p className="text-center text-red-500">{error.message}</p>
        </div>
      )}
    </div>
  );
});
export default Input;
