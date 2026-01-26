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
  const [openModalPreviewIA, setOpenModalPreviewIA] = useState<boolean>(false);
  const [imageEnhanced, setImageEnhanced] = useState<string>("");
  const [images, setImages] = useState<IImage[]>([]);
  const [openModalMessage, setOpenModalMessage] = useState<IModalMessage>(
    CURRENT_MODAL_MESSAGE,
  );
  const [mockupSelected, setMockupSelected] = useState<IImageLocalMockup>(
    CURRENT_IMAGES[0],
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
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
        />
        {openModalPreviewIA && (
          <ModalImage
            urlImage={imageEnhanced}
            setOpenModalPreviewIA={setOpenModalPreviewIA}
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
