"use client";
import PreviewDetail from "@/ui/components/PreviewDetail";
import PreviewIA from "@/ui/components/PreviewIA";
import Sidebar from "@/ui/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [urlImage, setUrlImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="grid md:grid-cols-[400px_auto_300px] xs:grid-cols-1 h-full w-full">
        <Sidebar urlImage={urlImage} setUrlImage={setUrlImage} />
        <section className="">
          <PreviewDetail
            setUrlImage={setUrlImage}
            urlImage={urlImage}
            setImageBase64={setImageBase64}
          />
        </section>
        <PreviewIA imageBase64={imageBase64} urlImage={urlImage} />
      </main>
    </div>
  );
}
