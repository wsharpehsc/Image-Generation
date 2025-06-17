"use client";
import { useState } from "react";
import PromptSelector from "../components/PromptSelector";
import { IPrompt } from "../data/data";
import toast, { Toaster } from "react-hot-toast";
import { openAiGenerate } from "../actions/openAiGenerate";

export default function OpenAiPage() {
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<IPrompt | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!category) {
      toast.error("Please Choose a category");
      return;
    }
    setLoading(true);
    setImg("");
    var response = await openAiGenerate(prompt, category);

    if (response.type === "error") {
      setError(response.error);
      return;
    }

    setImg(response.b64Json);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="flex flex-col font-mono justify-center items-center tracking-normal w-full gap-8">
        <div className="flex justify-center items-center w-1/3  max-w-3xl mx-auto p-4">
          {loading && <div className="skeleton h-80 w-80"></div>}
          {img && <img src={`data:image/png;base64,${img}`} alt="Generated" className="w-full h-auto object-contain border rounded shadow-lg" />}
        </div>
        <PromptSelector handleGenerate={handleGenerate} loading={loading} setCategory={setCategory} prompt={prompt} setPrompt={setPrompt} />
      </div>
    </div>
  );
}
