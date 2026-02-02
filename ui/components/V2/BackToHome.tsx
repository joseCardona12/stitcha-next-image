import { ITab } from "@/app/page";
import { ArrowLeft, ChevronLeft } from "lucide-react";

interface IBackToHomeProps {
  setTab: (value: ITab) => void;
}
export default function BackToHome({ setTab }: IBackToHomeProps) {
  return (
    <div
      className="fixed top-20 right-0 bg-white p-1 pt-10 pb-10 rounded-md shadow-sm z-1000"
      onClick={() => {
        setTab({
          tab: "selection",
        });
      }}
    >
      <ChevronLeft className="text-black" />
    </div>
  );
}
