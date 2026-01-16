import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { AlertTriangle } from "lucide-react";
import { loadImage } from "@/utils/loadImage";

interface IPreviewDetailProps {
  urlImage: string;
  setUrlImage: (value: string) => void;
  setImageBase64: (value: string) => void;
}

export default function PreviewDetail({
  urlImage,
  setImageBase64,
}: IPreviewDetailProps) {
  const [isOutOfBounds, setIsOutOfBounds] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitializing = useRef(false);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const checkLogoInMask = async (logoObj: fabric.Image): Promise<boolean> => {
    if (!maskCanvasRef.current || !fabricRef.current) return true;
    const maskCtx = maskCanvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    if (!maskCtx) return true;

    // Obtener centro relativo al canvas
    const center = logoObj.getCenterPoint();
    const imageData = maskCtx.getImageData(center.x, center.y, 1, 1);
    return imageData.data[0] > 128;
  };

  const initEditor = async () => {
    if (isInitializing.current || !containerRef.current || !canvasRef.current)
      return;
    isInitializing.current = true;

    if (fabricRef.current) {
      await fabricRef.current.dispose();
      fabricRef.current = null;
    }

    try {
      const [shirtImage, shadowMask, maskImage] = await Promise.all([
        loadImage("/images/heavy-hoodie.png"),
        loadImage("/images/heavy-hoodie-shadow.png"),
        loadImage("/images/heavy-hoodie-mask.png"),
      ]);

      // Calculamos el tamaño basado en el contenedor real para que ocupe el máximo espacio posible
      const contW = containerRef.current.clientWidth;
      const contH = containerRef.current.clientHeight;

      // Ajustar escala para que la imagen quepa perfectamente (contain)
      const scale =
        Math.min(contW / shirtImage.width, contH / shirtImage.height) * 0.9;
      const canvasWidth = shirtImage.width * scale;
      const canvasHeight = shirtImage.height * scale;

      // Sincronizar máscara de colisión
      if (!maskCanvasRef.current)
        maskCanvasRef.current = document.createElement("canvas");
      maskCanvasRef.current.width = canvasWidth;
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

      // 1. CAPA BASE (CENTRADA)
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
      const visualClip = new fabric.Image(maskImage, {
        scaleX: scale,
        scaleY: scale,
        originX: "center",
        originY: "center",
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        absolutePositioned: true,
      });

      // 3. LOGO (AL CENTRO INICIAL)
      if (urlImage) {
        const logoImg = await fabric.Image.fromURL(urlImage, {
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

        logoImg.on("moving", async () => {
          setIsOutOfBounds(!(await checkLogoInMask(logoImg)));
        });

        canvas.add(logoImg);
        logoImg.set({ left: canvasWidth / 2, top: canvasHeight / 2 });
        canvas.setActiveObject(logoImg);
      }

      // 4. CAPA SOMBRAS (MULTIPLY)
      const shadowLayer = new fabric.Image(shadowMask, {
        selectable: false,
        evented: false,
        scaleX: scale,
        scaleY: scale,
        originX: "center",
        originY: "center",
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        globalCompositeOperation: "multiply",
        opacity: 0.8,
      });
      canvas.add(shadowLayer);

      canvas.renderAll();
    } catch (err) {
      console.error(err);
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
  }, [urlImage]);

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none p-6 bg-white">
        <div className="flex justify-between items-center pointer-events-auto">
          <div className="">
            <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
              Real-Time integration
            </p>
            <p className="text-sm font-bold text-zinc-900">Hoodie Mockup v2</p>
          </div>

          {isOutOfBounds && (
            <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs">
              <AlertTriangle size={16} /> LOGO FUERA DE ÁREA
            </div>
          )}

          <button
            onClick={() =>
              setImageBase64(
                fabricRef.current?.toDataURL({ multiplier: 2 }) || "",
              )
            }
            className="border border-gray-200 rounded-xl pl-4 pr-4 p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
          >
            Preview Image
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-12"
      >
        <div className="relative overflow-hidden">
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  );
}
