"use client";

import Edit from "@/ui/components/V2/Edit";
import Footer from "@/ui/components/V2/Footer";
import GenerateImage from "@/ui/components/V2/GenerateImage";
import Header from "@/ui/components/V2/Header";
import Separador from "@/ui/components/V2/Separador";
import UploadFile from "@/ui/components/V2/UploadFile";
import ViewSelection from "@/ui/components/V2/ViewSelection";
import {
  CURRENT_IMAGE_LOCAL_MOCKUP,
  IImageLocalMockup,
} from "@/utils/constants/images";
import { useRef, useState } from "react";
import * as fabric from "fabric";
import GenerateSharp from "@/ui/components/V2/GenerateSharp";

export interface ITab {
  tab: string;
}
export const CURRENT_TAB: ITab = {
  tab: "selection",
};

export interface IUrlImage {
  urlLogo: string;
  name: string;
  size: string;
}

export interface IModalMessage {
  message: string;
  open: boolean;
  type: "success" | "error" | "";
}

export const CURRENT_MODAL_MESSAGE: IModalMessage = {
  message: "",
  open: false,
  type: "",
};

export const CURRENT_URL_IMAGE: IUrlImage = {
  urlLogo: "",
  name: "",
  size: "",
};
export default function Home() {
  const [imageBaseSelect, setImageBaseSelect] = useState<IImageLocalMockup>(
    CURRENT_IMAGE_LOCAL_MOCKUP,
  );
  const [urlImage, setUrlImage] = useState<IUrlImage>(CURRENT_URL_IMAGE);
  const [tab, setTab] = useState<ITab>(CURRENT_TAB);
  const [previewSharp, setPreviewSharp] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<IModalMessage>(
    CURRENT_MODAL_MESSAGE,
  );
  const [imageOpenAI, setImageOpenAI] = useState<string>("");

  const fabricRef = useRef<fabric.Canvas | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaleRatioRef = useRef(1);

  return (
    <div className="bg-white flex flex-col gap-4 w-full">
      <Header setTab={setTab} tab={tab} />
      <Separador />
      <main className="max-w-300 m-auto h-[75vh] overflow-y-scroll">
        {tab.tab === "selection" ? (
          <ViewSelection
            setImageBaseSelect={setImageBaseSelect}
            imageBaseSelect={imageBaseSelect}
          />
        ) : tab.tab === "upload-file" ? (
          <UploadFile setUrlImage={setUrlImage} urlImage={urlImage} />
        ) : tab.tab === "edit" ? (
          <Edit
            urlImage={urlImage}
            imageBaseSelect={imageBaseSelect}
            fabricRef={fabricRef}
            maskCanvasRef={maskCanvasRef}
            scaleRatioRef={scaleRatioRef}
            setTab={setTab}
          />
        ) : tab.tab === "generate-image" ? (
          <GenerateImage
            urlImageSharp={previewSharp}
            openModalMessage={openModalMessage}
            setOpenModalMessage={setOpenModalMessage}
            setImageOpenAI={setImageOpenAI}
            imageOpenAI={imageOpenAI}
            imageBaseSelect={imageBaseSelect}
            urlImageLogo={urlImage}
            setTab={setTab}
            setPreviewSharp={setPreviewSharp}
            setUrlImage={setUrlImage}
          />
        ) : tab.tab === "generate-sharp" ? (
          <GenerateSharp urlImageSharp={previewSharp} setTab={setTab} />
        ) : (
          ""
        )}
      </main>
      <Separador />
      <Footer
        imageBaseSelect={imageBaseSelect}
        setTab={setTab}
        tab={tab}
        urlImage={urlImage}
        fabricRef={fabricRef}
        maskCanvasRef={maskCanvasRef}
        scaleRatioRef={scaleRatioRef}
        setPreviewSharp={setPreviewSharp}
        setImageOpenAI={setImageOpenAI}
        imageOpenAI={imageOpenAI}
      />
    </div>
  );
}
