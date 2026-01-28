import { ButtonHTMLAttributes } from "react";

interface IButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant: "default" | "black" | "outline";
  className?: string;
}
export default function Button({
  children,
  onClick,
  disabled,
  variant,
  className,
}: IButtonProps) {
  const BUTTON_VARIANT = {
    default: "text-gray-500 bg-gray-100",
    black:
      "bg-black text-white hover:opacity-80 transition-opacity duration-100",
    outline: "bg-white shadow-md",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded-xl  pl-8 pr-8 ${BUTTON_VARIANT[variant]} cursor-pointer duration-100 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
