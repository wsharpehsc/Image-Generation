"use client";

import { useState } from "react";
import PromptSelector from "../components/PromptSelector";
import { IPrompt } from "../data/data";
import toast, { Toaster } from "react-hot-toast";
import { openAiGenerate } from "../actions/openAiGenerate";
import FabricCanvas from "../components/ImgEditor/FabricCanvas";

export default function OpenAiPage() {
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<IPrompt | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);
      setImg("");
      setError("");

      const response = await openAiGenerate(prompt, category);

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
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg font-semibold">Image</h2>

            <div className="flex justify-center items-center min-h-96">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-base-content/70">Generating your image...</p>
                </div>
              ) : img ? (
                <div className="w-full">
                  <FabricCanvas b64={img} />
                </div>
              ) : (
                <div className="text-center p-8 bg-base-300 rounded-box">
                  <p className="text-base-content/70">{error || "Your generated image will appear here"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card shadow-lg">
          <div className="card-body">
            <PromptSelector handleGenerate={handleGenerate} loading={loading} setCategory={setCategory} prompt={prompt} setPrompt={setPrompt} />
          </div>
        </div>
        {error && !loading && (
          <div className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
