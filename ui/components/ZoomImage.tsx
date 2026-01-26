import { useState } from "react";

interface IZoomImageProps {
  src: string;
}
export default function ZoomImage({ src }: IZoomImageProps) {
  const [backgroundPosition, setBackgroundPosition] = useState<string>("0% 0%");
  const [showZoom, setShowZoom] = useState<boolean>(false);

  const handleMouseMouse = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className="relative w-full"
      onMouseMove={handleMouseMouse}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      <img className="w-full block" src={src} alt="image-mockup" />
      {showZoom && (
        <div
          className="absolute top-0 left-full ml-5 w-70 h-70 rounded-md bg-no-repeat bg-size-[800px]"
          style={{ backgroundImage: `url(${src})`, backgroundPosition }}
        ></div>
      )}
    </div>
  );
}
