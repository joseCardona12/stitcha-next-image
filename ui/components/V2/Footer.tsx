import { IImageLocalMockup } from "@/utils/constants/images";
import Button from "./Button";
import { ITab, IUrlImage } from "@/app/page";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { RefObject, useState } from "react";
import * as fabric from "fabric";
import { renderMaskedLogo } from "@/utils/renderMaskedLogo";
import { IGeneratePreviewSharpRequest, sharpService } from "@/services/sharp";

interface IFooterProps {
  imageBaseSelect: IImageLocalMockup;
  urlImage: IUrlImage;
  setTab: (value: ITab) => void;
  tab: ITab;
  fabricRef: RefObject<fabric.Canvas | null>;
  maskCanvasRef: RefObject<HTMLCanvasElement | null>;
  scaleRatioRef: RefObject<number>;
  setPreviewSharp: (value: string) => void;
  setImageOpenAI: (value: string) => void;
  imageOpenAI: string;
}
export default function Footer({
  imageBaseSelect,
  setTab,
  tab,
  urlImage,
  fabricRef,
  maskCanvasRef,
  scaleRatioRef,
  setPreviewSharp,
  setImageOpenAI,
  imageOpenAI,
}: IFooterProps) {
  const [loadingGenerate, setLoadingGenerate] = useState<boolean>(false);
  const is_edit_generate =
    tab.tab === "edit" && urlImage.urlLogo && imageBaseSelect.base;
  console.log("is edit", is_edit_generate);

  const handleBack = () => {
    if (tab.tab === "selection") {
      setTab({
        tab: "selection",
      });
    }
    if (tab.tab === "upload-file") {
      setTab({
        tab: "selection",
      });
    }
    if (tab.tab === "edit") {
      setTab({
        tab: "upload-file",
      });
    }
    if (tab.tab === "generate-sharp") {
      setTab({
        tab: "edit",
      });
    }
    if (tab.tab === "generate-image") {
      setTab({
        tab: "generate-sharp",
      });
    }
  };

  const generateUrl = async () => {
    setLoadingGenerate(true);
    const canvas = fabricRef.current;
    if (!canvas) {
      setLoadingGenerate(false);
      return;
    }
    const logoObject = canvas
      .getObjects()
      .find((obj) => obj.selectable) as fabric.Image;
    if (!logoObject || !maskCanvasRef.current) {
      setLoadingGenerate(false);
      return;
    }

    const ratio = 1 / scaleRatioRef.current;
    const logoWidth = logoObject.getScaledWidth();
    const logoHeight = logoObject.getScaledHeight();
    try {
      // Get the logo image without mask
      const originalClipPath = logoObject.clipPath;
      logoObject.clipPath = undefined;
      const logoDataURL = logoObject.toDataURL({
        format: "png",
        quality: 1,
      });
      logoObject.clipPath = originalClipPath;
      // Render logo with mask applied
      const maskedLogoResult = await renderMaskedLogo({
        logoDataURL,
        logoWidth,
        logoHeight,
        logoAngle: logoObject.angle,
        maskCanvas: maskCanvasRef.current,
        logoPositionLeft: logoObject.left,
        logoPositionTop: logoObject.top,
      });

      if (!maskedLogoResult.success) {
        throw new Error("Failed to render masked logo");
      }

      const renderData: IGeneratePreviewSharpRequest = {
        mockupId: imageBaseSelect.id,
        logoData: maskedLogoResult.croppedLogoDataURL,
        coords: {
          left: Math.round(logoObject.left * ratio),
          top: Math.round(logoObject.top * ratio),
          width: Math.round(logoWidth * ratio),
          height: Math.round(logoHeight * ratio),
          angle: logoObject.angle || 0,
        },
      };
      const result = await sharpService.generatePreviewSharp(renderData);
      setPreviewSharp(result?.data?.url ?? "");
      setTab({
        tab: "generate-sharp",
      });
    } catch (error) {
      console.log("ERROR TO GENERATE URL: ", error);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleContinue = () => {
    if (tab.tab === "selection") {
      setTab({
        tab: "upload-file",
      });
    }
    if (tab.tab === "upload-file" && urlImage.urlLogo) {
      setTab({
        tab: "edit",
      });
    }
    if (tab.tab === "generate-sharp") {
      setTab({
        tab: "generate-image",
      });
    }
    if (is_edit_generate) generateUrl();
  };
  return (
    <footer className="w-full flex justify-center mt-auto">
      <div className="max-w-[1200px] w-full flex justify-between items-center">
        <Button
          onClick={handleBack}
          disabled={false}
          variant={"default"}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        {tab.tab !== "generate-image" && (
          <Button
            onClick={handleContinue}
            disabled={loadingGenerate}
            variant={imageBaseSelect.base ? "black" : "default"}
            className="flex items-center gap-2"
          >
            {is_edit_generate ? "Generate image" : "Continue"}
            {is_edit_generate && loadingGenerate ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </footer>
  );
}
