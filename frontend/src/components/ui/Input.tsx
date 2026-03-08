import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../utils/helpers";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("w-full flex flex-col gap-2", containerClassName)}>
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>

        <input
          {...props}
          id={id}
          ref={ref}
          className={cn(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset transition-all focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",

            error
              ? "ring-red-500 focus:ring-red-600"
              : "ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600",

            className,
          )}
        />

        {error && (
          <p className="text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "PrimaryInput";

export default Input;
