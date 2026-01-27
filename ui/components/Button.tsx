import { ButtonHTMLAttributes } from "react";

interface IButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}
export default function Button({ children, onClick, disabled }: IButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-white border border-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${disabled ? "opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}
