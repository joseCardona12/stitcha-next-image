import { ChevronLeft } from "lucide-react";
import Button from "./Button";
import { ITab } from "@/app/page";

interface ITitleDescriptionProps {
  title: string;
  description: string;
  setTab: (value: ITab) => void;
  tab: ITab;
}
export default function TitleDescription({
  title,
  description,
  setTab,
  tab,
}: ITitleDescriptionProps) {
  return (
    <div className="bg-gray-50">
      <div className="flex items-center gap-2 justify-center flex-col">
        <h2 className="text-4xl font-bold text-black">{title}</h2>
        <p className="text-gray-600 text-xl">{description}</p>
      </div>
    </div>
  );
}
