import { CURRENT_IMAGES, IImageLocalMockup } from "@/utils/constants/images";
import Card from "./Card";
import TitleDescription from "./TitleDescription";
import { ITab, IUrlImage } from "@/app/page";

interface IViewSelectionProps {
  setImageBaseSelect: (value: IImageLocalMockup) => void;
  imageBaseSelect: IImageLocalMockup;
  setTab: (value: ITab) => void;
  tab: ITab;
}
export default function ViewSelection({
  setImageBaseSelect,
  imageBaseSelect,
  setTab,
  tab,
}: IViewSelectionProps) {
  return (
    <div className="w-full flex flex-col gap-6 md:mt-10 p-4">
      <TitleDescription
        setTab={setTab}
        tab={tab}
        title="Select a shirt"
        description="Choose a base shirt."
      />
      <div className="grid md:grid-cols-2 xs:grid-cols-1 sm:grid-cols-1 xl:grid-cols-3  items-center gap-6">
        {CURRENT_IMAGES.map((image: IImageLocalMockup, index: number) => (
          <Card
            urlImage={image.base}
            title={image.id}
            onClick={() => setImageBaseSelect(image)}
            key={index}
            isActive={imageBaseSelect.id === image.id}
          />
        ))}
      </div>
    </div>
  );
}
