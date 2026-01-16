import { Prompt } from "@/services/promps";
import { useState } from "react";

interface IPreviewIAProps {
  imageBase64: string;
  urlImage: string;
}

const promptService = new Prompt();
export default function PreviewIA({ imageBase64, urlImage }: IPreviewIAProps) {
  const [enhanced, setEnhanced] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const handleClick = async () => {
    if (!urlImage) {
      setError("Logo required");
      return;
    }
    setLoading(true);
    try {
      const response = await promptService.createPrompt(
        `
        Create a realistic t-shirt mockup.
        Use the provided image as the logo.
        Center the logo on the chest.
        Neutral background, studio lighting.
      `,
        imageBase64,
      );
      console.log("response", response);
    } catch (error) {
      console.log("....error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="border-l border-gray-200 p-4 flex flex-col gap-2">
      <span>Preview</span>
      <div className="h-40 border border-gray-100 rounded-md p-1 w-full">
        {imageBase64 && (
          <img className="w-full h-full object-contain" src={imageBase64} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="border border-gray-200 p-2 pl-4 pr-4 rounded-xl text-sm cursor-pointer hover:bg-gray-100 transition-colors duration-150"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate with openAI"}
        </button>
        <div className="w-full h-50 border border-gray-100 rounded-md p-1">
          {enhanced && (
            <img
              className="w-full h-full object-contain"
              src={enhanced}
              alt="image-by-gemini"
            />
          )}
        </div>
        {!error && <span>{error}</span>}
      </div>
    </div>
  );
}
