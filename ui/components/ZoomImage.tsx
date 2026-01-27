import { useState } from "react";

interface IZoomImageProps {
  src: string;
}
export default function ZoomImage({ src }: IZoomImageProps) {
  const [backgroundPosition, setBackgroundPosition] = useState<string>("0% 0%");
  const [showZoom, setShowZoom] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center bg-white"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onTouchMove={(e) => {
        // Para soporte touch en mobile
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        e.currentTarget.dispatchEvent(mouseEvent);
        setShowZoom(true);
      }}
      onTouchEnd={() => setShowZoom(false)}
    >
      <img
        className="max-w-full max-h-full object-contain"
        src={src}
        alt="image-mockup"
      />
      {showZoom && (
        <div
          className="absolute bottom-2 right-2 w-40 h-40 sm:w-52 sm:h-52 rounded-md bg-no-repeat border-2 border-gray-300 shadow-lg z-20"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition,
            backgroundSize: "800px",
          }}
        ></div>
      )}
    </div>
  );
}
