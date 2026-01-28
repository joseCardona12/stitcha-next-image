import { ArrowRight, ArrowRightIcon, ChevronRight } from "lucide-react";
import ItemButtonOnboarding from "./ItemButtonOnboarding";
import { ITab } from "@/app/page";

interface IHeaderProps {
  setTab: (value: ITab) => void;
  tab: ITab;
}
export default function Header({ setTab, tab }: IHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between pt-5 max-w-300 m-auto">
      <div className="flex items-center gap-2"></div>
      <ul className="flex items-center gap-2">
        <ItemButtonOnboarding
          isActive={tab.tab === "selection"}
          text="1. Select"
        />
        <ChevronRight className="text-gray-300" />
        <ItemButtonOnboarding
          isActive={tab.tab === "upload-file"}
          text="2. Upload File"
        />
        <ChevronRight className="text-gray-300" />
        <ItemButtonOnboarding isActive={tab.tab === "edit"} text="3. Edit" />
        <ChevronRight className="text-gray-300" />
        <ItemButtonOnboarding
          isActive={tab.tab === "generate-sharp"}
          text="4. Sharp"
        />
        <ChevronRight className="text-gray-300" />
        <ItemButtonOnboarding
          isActive={tab.tab === "generate-image"}
          text="5. OpenAI"
        />
      </ul>
      <div></div>
    </header>
  );
}
