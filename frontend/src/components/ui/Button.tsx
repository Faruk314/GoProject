import { type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/helpers";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({
  children,
  className,
  isLoading,
  loadingText,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
    secondary:
      "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    danger:
      "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600",
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={cn(
        "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
