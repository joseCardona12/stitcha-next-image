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
import BackToHome from "@/ui/components/V2/BackToHome";

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
    <div className="flex flex-col gap-4 w-full bg-gray-50">
      <Header setTab={setTab} tab={tab} />
      <Separador />
      <main className="w-full md:max-w-300 md:m-auto md:h-[75vh] md:overflow-y-scroll relative">
        {tab.tab === "selection" ? (
          <ViewSelection
            setImageBaseSelect={setImageBaseSelect}
            imageBaseSelect={imageBaseSelect}
            setTab={setTab}
            tab={tab}
          />
        ) : tab.tab === "upload-file" ? (
          <UploadFile
            setUrlImage={setUrlImage}
            urlImage={urlImage}
            setTab={setTab}
            tab={tab}
          />
        ) : tab.tab === "edit" ? (
          <Edit
            urlImage={urlImage}
            imageBaseSelect={imageBaseSelect}
            fabricRef={fabricRef}
            maskCanvasRef={maskCanvasRef}
            scaleRatioRef={scaleRatioRef}
            setTab={setTab}
            tab={tab}
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
            tab={tab}
          />
        ) : tab.tab === "generate-sharp" ? (
          <GenerateSharp
            urlImageSharp={previewSharp}
            setTab={setTab}
            tab={tab}
          />
        ) : (
          ""
        )}
        <BackToHome setTab={setTab} />
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
