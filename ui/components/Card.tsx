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
      className={`shadow-xs ${padding ? "p-4" : ""} rounded-md gap-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
