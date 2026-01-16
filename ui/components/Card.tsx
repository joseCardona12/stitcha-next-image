interface ICardProps {
  className?: string;
  children: React.ReactNode;
}
export default function Card({ children, className }: ICardProps) {
  return (
    <div className={`shadow-sm p-4 rounded-md gap-2 ${className}`}>
      {children}
    </div>
  );
}
