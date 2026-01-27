import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { loadImage } from "@/utils/loadImage";
import { CURRENT_IMAGE, IImage, IModalPreview } from "@/app/page";
import { CURRENT_IMAGES, IImageLocalMockup } from "@/utils/constants/images";
import Button from "./Button";
import adjustScale from "@/utils/adjustScale";
import { IGeneratePreviewSharpRequest, sharpService } from "@/services/sharp";

interface IPreviewDetailProps {
  urlImage: string;
  setUrlImage: (value: string) => void;
  setImageBase64: (value: string) => void;
  images: IImage[];
  setOpenModalPreviewIA: (value: IModalPreview) => void;
  setImageEnhanced: (value: string) => void;
  mockupSelected: IImageLocalMockup;
  setPreviewSharp: (value: string) => void;
}

export default function PreviewDetail({
  urlImage,
  setImageBase64,
  images,
  setImageEnhanced,
  setOpenModalPreviewIA,
  mockupSelected,
  setPreviewSharp,
}: IPreviewDetailProps) {
  const [isOutOfBounds, setIsOutOfBounds] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitializing = useRef(false);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaleRatioRef = useRef(1);
  const [origDimensions, setOrigDimensions] = useState({ with: 0, height: 0 });
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);

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
      const [shirtImage, maskImage] = await Promise.all([
        loadImage(mockupSelected.base),
        loadImage(mockupSelected.mask),
      ]);
      const contW = containerRef.current.clientWidth;
      const contH = containerRef.current.clientHeight;

      setOrigDimensions({ with: contW, height: contH });

      const { scale, canvasHeight, canvasWidth } = adjustScale(
        shirtImage,
        contW,
        contH,
      );

      // Guardar el factor de escala para calcular coordenadas originales
      scaleRatioRef.current = scale;

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
      canvas.renderAll();
    } catch (err) {
      console.error(err);
    } finally {
      isInitializing.current = false;
    }
  };

  const previewGenerate = async () => {
    setLoadingPreview(true);
    const canvas = fabricRef.current;
    if (!canvas) {
      setLoadingPreview(false);
      return;
    }
    const logoObject = canvas
      .getObjects()
      .find((obj) => obj.selectable) as fabric.Image;
    if (!logoObject) {
      setLoadingPreview(false);
      return;
    }

    // El ratio es simple: 1 / scale
    // Las coordenadas en el canvas están escaladas, divido por el factor de escala
    const ratio = 1 / scaleRatioRef.current;

    const logoDataURL = logoObject.toDataURL({
      format: "png",
      quality: 1,
    });

    const renderData: IGeneratePreviewSharpRequest = {
      mockupId: mockupSelected.id,
      logoData: logoDataURL,
      coords: {
        left: Math.round(logoObject.left * ratio),
        top: Math.round(logoObject.top * ratio),
        width: Math.round(logoObject.getScaledWidth() * ratio),
        height: Math.round(logoObject.getScaledHeight() * ratio),
        angle: logoObject.angle || 0,
      },
    };

    try {
      const result = await sharpService.generatePreviewSharp(renderData);
      setPreviewSharp(result?.data?.url ?? "");
      setImageBase64(fabricRef.current?.toDataURL({ multiplier: 2 }) || "");
    } catch (error) {
      console.log("ERROR: ", error);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    initEditor();
    window.addEventListener("resize", initEditor);
    return () => {
      window.removeEventListener("resize", initEditor);
      fabricRef.current?.dispose();
    };
  }, [urlImage, mockupSelected]);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="shrink-0 z-40 pointer-events-none p-2 sm:p-3 lg:p-5 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 pointer-events-auto flex-wrap">
          <div>
            <p className="text-[7px] sm:text-[10px] font-black uppercase text-blue-600 tracking-widest">
              Real-Time Editor
            </p>
            <p className="text-xs sm:text-sm font-bold text-zinc-900">
              Design Your Mockup
            </p>
          </div>

          <Button
            disabled={loadingPreview}
            onClick={() => {
              previewGenerate();
            }}
          >
            {loadingPreview ? "Loading..." : "Generate"}
          </Button>
        </div>
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
