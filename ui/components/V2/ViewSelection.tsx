import { CURRENT_IMAGES, IImageLocalMockup } from "@/utils/constants/images";
import Card from "./Card";
import TitleDescription from "./TitleDescription";
import { IUrlImage } from "@/app/page";

interface IViewSelectionProps {
  setImageBaseSelect: (value: IImageLocalMockup) => void;
  imageBaseSelect: IImageLocalMockup;
}
export default function ViewSelection({
  setImageBaseSelect,
  imageBaseSelect,
}: IViewSelectionProps) {
  return (
    <div className="w-full flex flex-col gap-6 mt-10">
      <TitleDescription
        title="Selecciona una Camisa"
        description="Elige una camisa base."
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
