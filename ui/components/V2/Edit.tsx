import { ITab, IUrlImage } from "@/app/page";
import TitleDescription from "./TitleDescription";
import { RefObject, useEffect, useRef } from "react";
import { IImageLocalMockup } from "@/utils/constants/images";
import * as fabric from "fabric";
import { loadImage } from "@/utils/loadImage";
import adjustScale from "@/utils/adjustScale";
import Button from "./Button";
import { ChevronLeft } from "lucide-react";

interface IEditProps {
  urlImage: IUrlImage;
  imageBaseSelect: IImageLocalMockup;
  fabricRef: RefObject<fabric.Canvas | null>;
  maskCanvasRef: RefObject<HTMLCanvasElement | null>;
  scaleRatioRef: RefObject<number>;
  setTab: (value: ITab) => void;
}
export default function Edit({
  urlImage,
  imageBaseSelect,
  fabricRef,
  maskCanvasRef,
  scaleRatioRef,
  setTab,
}: IEditProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitializing = useRef(false);

  const initEditor = async () => {
    if (isInitializing.current || !containerRef.current || !canvasRef.current)
      return;
    isInitializing.current = true;

    if (fabricRef.current) {
      await fabricRef.current.dispose();
      fabricRef.current = null;
    }

    try {
      const [shirtImage, maskImage] = await Promise.all([
        loadImage(imageBaseSelect.base),
        loadImage(imageBaseSelect.mask),
      ]);
      console.log("shirt image", shirtImage);
      const contW = containerRef.current.clientWidth;
      const contH = containerRef.current.clientHeight;

      const { scale, canvasHeight, canvasWidth } = adjustScale(
        shirtImage,
        contW,
        contH,
      );

      //Save scale factor to calculate original coordinates
      scaleRatioRef.current = scale;

      if (!maskCanvasRef.current)
        maskCanvasRef.current = document.createElement("canvas");
      maskCanvasRef.current.width = canvasHeight;
      maskCanvasRef.current.height = canvasHeight;
      maskCanvasRef.current
        .getContext("2d")
        ?.drawImage(maskImage, 0, 0, canvasWidth, canvasHeight);

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        preserveObjectStacking: true,
        backgroundColor: "transparent",
      });
      fabricRef.current = canvas;

      // 1. BASE LAYER (CENTERED)
      const fabricBase = new fabric.Image(shirtImage, {
        selectable: false,
        evented: false,
        scaleX: scale,
        scaleY: scale,
        originX: "center",
        originY: "center",
        left: canvasWidth / 2,
        top: canvasHeight / 2,
      });
      canvas.add(fabricBase);

      // 2. CLIP PATH
      const visualClip = new fabric.Image(shirtImage, {
        scaleX: scale,
        scaleY: scale,
        originX: "center",
        originY: "center",
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        absolutePositioned: true,
      });

      // 3. LOGO (AT INITIAL CENTER)
      if (urlImage.urlLogo) {
        const logoImg = await fabric.Image.fromURL(urlImage.urlLogo, {
          crossOrigin: "anonymous",
        });
        logoImg.scaleToWidth(canvasWidth * 0.25);
        logoImg.set({
          clipPath: visualClip,
          originX: "center",
          originY: "center",
          cornerColor: "#3b82f6",
          transparentCorners: false,
          cornerStyle: "circle",
          cornerSize: 12,
        });

        canvas.add(logoImg);
        logoImg.set({ left: canvasWidth / 2, top: canvasHeight / 2 });
        canvas.setActiveObject(logoImg);
      }
      canvas.renderAll();
    } catch (error) {
      console.log("ERROR INIT EDITOR: ", error);
    } finally {
      isInitializing.current = false;
    }
  };
  useEffect(() => {
    initEditor();
    window.addEventListener("resize", initEditor);
    return () => {
      window.removeEventListener("resize", initEditor);
      fabricRef.current?.dispose();
    };
  }, [urlImage.urlLogo, imageBaseSelect]);
  return (
    <div className="w-300 h-full overflow-hidden flex flex-col gap-6 relative">
      <TitleDescription
        title="Edit Image"
        description="Edit the logo to generate image."
      />
      <div className="absolute top-0 right-0">
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={() => {
            setTab({
              tab: "selection",
            });
          }}
          disabled={false}
        >
          <ChevronLeft />
          Go to Home
        </Button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-1 sm:p-2 lg:p-6 overflow-auto bg-gray-50 min-h-0"
      >
        <div className="relative flex items-center justify-center w-full h-full">
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  );
}
