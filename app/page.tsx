"use client";
import ModalImage from "@/ui/components/ModalImage";
import PreviewDetail from "@/ui/components/PreviewDetail";
import PreviewIA from "@/ui/components/PreviewIA";
import Sidebar from "@/ui/components/Sidebar";
import { useState } from "react";

export interface IImage {
  url: string;
  name: string;
  logoUrl: string;
}

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
  console.log("image base 64", imageBase64);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="grid grid-cols-[400px_auto_300px] h-full w-full realtive">
        <Sidebar urlImage={urlImage} setUrlImage={setUrlImage} />
        <section className="">
          <PreviewDetail
            setUrlImage={setUrlImage}
            urlImage={urlImage}
            setImageBase64={setImageBase64}
            images={images}
            setOpenModalPreviewIA={setOpenModalPreviewIA}
            setImageEnhanced={setImageEnhanced}
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
        />
        {openModalPreviewIA && (
          <ModalImage
            urlImage={imageEnhanced}
            setOpenModalPreviewIA={setOpenModalPreviewIA}
          />
        )}
      </main>
    </div>
  );
}
