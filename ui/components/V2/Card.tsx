import { Check } from "lucide-react";
import { useState } from "react";

interface ICardProps {
  urlImage: string;
  title: string;
  onClick: () => void;
  isActive: boolean;
}
export default function Card({
  urlImage,
  title,
  onClick,
  isActive,
}: ICardProps) {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <div
      className={`${isActive ? "border-2 border-purple-400" : ""} ${isActive ? "hover:border-purple-400" : ""} border border-gray-100 rounded-xl bg-gray-50 cursor-pointer hover:border-gray-200 relative hover:opacity-90 transition-opacity duration-150`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <img
        src={urlImage}
        alt="image-base"
        className="w-full h-full object-cover"
      />
      {hover && (
        <span className="absolute bottom-5 left-5 text-md font-bold">
          {title}
        </span>
      )}
      {isActive && (
        <span className="absolute top-2 right-2 bg-purple-400 border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </span>
      )}
    </div>
  );
}
