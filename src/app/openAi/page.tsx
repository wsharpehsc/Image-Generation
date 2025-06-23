"use client";

import { useState } from "react";
import PromptSelector from "../components/PromptSelector";
import { IPrompt } from "../data/data";
import toast, { Toaster } from "react-hot-toast";
import { openAiGenerate } from "../actions/openAiGenerate";
import FabricCanvas from "../components/ImgEditor/FabricCanvas";
import { Ban } from "lucide-react";
import Popup from "reactjs-popup";
import { AiFillPlusCircle } from "react-icons/ai";
import { OpenAIResponse } from "../types/type";

export default function OpenAiPage() {
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<IPrompt | null>(null);
  const [error, setError] = useState("");
  const [promptWrapper,setPromptWrapper] = useState("");

  

  const handleGenerate = async () => {
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);
      setImg("");
      setError("");

      const response = await openAiGenerate(prompt, category,promptWrapper);

      if (response.type === "error") {
        setError(response.error);
        toast.error(response.error);
        return;
      }

      setImg(response.b64Json);
      toast.success("Image generated successfully!");
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate image");
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="card-body">
          <div className="flex justify-center items-center min-h-96">
            {loading ? (
              <LoadingSpinner />
            ) : img ? (
              <div className="w-full">
                <FabricCanvas b64={img} />
              </div>
              
            ) : (
              <PlaceholderMessage message={error || "Image will appear here"} />
            )}
          </div>
        </div>
        <div>hi</div>

        <PromptSelector handleGenerate={handleGenerate} loading={loading} setCategory={setCategory} prompt={prompt} setPrompt={setPrompt} category={category} setPromptWrapper={setPromptWrapper} promptWrapper="" />

        {error && !loading && (
          <div className="alert alert-error shadow-lg">
            <Ban />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center gap-4">
    <span className="loading loading-spinner loading-lg text-primary"></span>
    <p className="text-base-content/70">Generating...</p>
  </div>
);

const PlaceholderMessage = ({ message }: { message: string }) => (
  <div className="text-center p-8 bg-base-300 rounded-box">
    <p className="text-base-content/70">{message}</p>
  </div>
);
