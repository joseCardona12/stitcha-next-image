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
      className={`bg-white border border-gray-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 text-xs sm:text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shrink-0`}
    >
      {children}
    </button>
  );
}
