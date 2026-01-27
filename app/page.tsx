"use client";
import ModalImage from "@/ui/components/ModalImage";
import ModalMessage from "@/ui/components/ModalMessage";
import PreviewDetail from "@/ui/components/PreviewDetail";
import PreviewIA from "@/ui/components/PreviewIA";
import Sidebar from "@/ui/components/Sidebar";
import { CURRENT_IMAGES, IImageLocalMockup } from "@/utils/constants/images";
import { useState } from "react";

export interface IImage {
  url: string;
  name: string;
  logoUrl: string;
}
export interface IModalMessage {
  open: boolean;
  type: "error" | "success";
  message: string;
}

export interface IModalPreview {
  state: boolean;
  url: string;
  title: string;
}

export const CURRENT_MODAL_PREVIEW: IModalPreview = {
  state: false,
  url: "",
  title: "",
};
export const CURRENT_MODAL_MESSAGE: IModalMessage = {
  open: false,
  type: "success",
  message: "",
};

export const CURRENT_IMAGE: IImage = {
  url: "",
  name: "",
  logoUrl: "",
};
export default function Home() {
  const [urlImage, setUrlImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [openModalPreviewIA, setOpenModalPreviewIA] = useState<IModalPreview>(
    CURRENT_MODAL_PREVIEW,
  );
  const [imageEnhanced, setImageEnhanced] = useState<string>("");
  const [images, setImages] = useState<IImage[]>([]);
  const [openModalMessage, setOpenModalMessage] = useState<IModalMessage>(
    CURRENT_MODAL_MESSAGE,
  );
  const [mockupSelected, setMockupSelected] = useState<IImageLocalMockup>(
    CURRENT_IMAGES[0],
  );
  const [previewSharp, setPreviewSharp] = useState<string>("");
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <main className="grid grid-cols-[400px_auto_300px] h-full w-full realtive">
        <Sidebar
          urlImage={urlImage}
          setUrlImage={setUrlImage}
          setMockupSelected={setMockupSelected}
        />
        <section className="">
          <PreviewDetail
            setUrlImage={setUrlImage}
            urlImage={urlImage}
            setImageBase64={setImageBase64}
            images={images}
            setOpenModalPreviewIA={setOpenModalPreviewIA}
            setImageEnhanced={setImageEnhanced}
            mockupSelected={mockupSelected}
            setPreviewSharp={setPreviewSharp}
          />
        </section>
        <PreviewIA
          imageBase64={imageBase64}
          setOpenModalPreviewIA={setOpenModalPreviewIA}
          setImageEnhanced={setImageEnhanced}
          imageEnhanced={imageEnhanced}
          urlImage={urlImage}
          setImages={setImages}
          images={images}
          setOpenModalMessage={setOpenModalMessage}
          previewSharp={previewSharp}
        />
        {openModalPreviewIA.state && (
          <ModalImage
            urlImage={openModalPreviewIA.url}
            setOpenModalPreviewIA={setOpenModalPreviewIA}
            openModalPreviewIA={openModalPreviewIA}
          />
        )}
        {openModalMessage.open && (
          <ModalMessage
            openModalMessage={openModalMessage}
            setOpenModalMessage={setOpenModalMessage}
          />
        )}
      </main>
    </div>
  );
}
