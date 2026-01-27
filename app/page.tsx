"use client";
import ModalImage from "@/ui/components/ModalImage";
import ModalMessage from "@/ui/components/ModalMessage";
import PreviewDetail from "@/ui/components/PreviewDetail";
import PreviewIA from "@/ui/components/PreviewIA";
import Sidebar from "@/ui/components/Sidebar";
import { CURRENT_IMAGES, IImageLocalMockup } from "@/utils/constants/images";
import { useEffect, useState } from "react";

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
  const [mobileTab, setMobileTab] = useState<"editor" | "mockups" | "preview">(
    "editor",
  );

  // Automáticamente ir a editor cuando se sube un logo
  useEffect(() => {
    if (urlImage) {
      setMobileTab("editor");
    }
  }, [urlImage]);

  // Automáticamente ir a preview cuando se genera el resultado
  useEffect(() => {
    if (previewSharp) {
      setMobileTab("preview");
    }
  }, [previewSharp]);

  return (
    <div className="flex flex-col h-screen w-screen bg-white font-sans overflow-hidden">
      <main className="flex flex-col lg:flex-row flex-1 w-full gap-0 overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block lg:w-auto lg:min-w-75 xl:min-w-100 border-r border-gray-200 overflow-y-auto">
          <Sidebar
            urlImage={urlImage}
            setUrlImage={setUrlImage}
            setMockupSelected={setMockupSelected}
          />
        </div>

        {/* Main Editor Section */}
        <section className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-0 overflow-hidden">
          {/* Always show on desktop (lg:block), conditionally show on mobile based on tab */}
          <div
            className={`h-full ${mobileTab === "editor" ? "block" : "hidden"} lg:block`}
          >
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
          </div>
          {mobileTab === "mockups" && (
            <div className="lg:hidden h-full overflow-y-auto">
              <Sidebar
                urlImage={urlImage}
                setUrlImage={setUrlImage}
                setMockupSelected={setMockupSelected}
              />
            </div>
          )}
          {mobileTab === "preview" && (
            <div className="lg:hidden h-full overflow-y-auto">
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
            </div>
          )}
        </section>

        {/* Preview Panel - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block lg:w-auto lg:min-w-70 xl:min-w-75 min-h-0 overflow-y-auto">
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
        </div>
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

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex border-t border-gray-200 bg-white">
        <button
          onClick={() => setMobileTab("mockups")}
          className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold transition-colors ${
            mobileTab === "mockups"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Mockups
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold transition-colors ${
            mobileTab === "editor"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold transition-colors ${
            mobileTab === "preview"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Preview
        </button>
      </div>
    </div>
  );
}
