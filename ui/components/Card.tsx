interface ICardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  padding?: boolean;
}
export default function Card({
  children,
  className,
  onClick,
  padding = true,
}: ICardProps) {
  return (
    <div
      className={`shadow-xs rounded-md gap-2 transition-all duration-150 hover:shadow-sm ${padding ? "p-2 sm:p-3 lg:p-4" : "p-0"} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
