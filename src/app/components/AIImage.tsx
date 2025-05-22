"use client";

import { useState } from "react";
import { generateImage } from "../actions/generateImage";

export default function AIImage() {
  const [prompt, setPrompt] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateImage(prompt);
    setImageData(result);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-mono tracking-normal">
      <div className="flex-1 flex justify-center items-center">
        {!imageData && !loading && (
          <h1 className="text-3xl bg-gradient-to-r from-start to-end bg-clip-text text-transparent text-center">
            Generate AI Image
          </h1>
        )}

        {loading ? (
          <div className="skeleton card w-96 h-96"></div>
        ) : (
          imageData && (
            <img
              className="w-full object-cover max-h-140"
              src={`data:image/png;base64,${imageData}`}
            />
          )
        )}
      </div>
      <div className="w-1/2 flex flex-row gap-2 mt-auto justify-center items-center">
        <textarea
          placeholder="Please Type Prompt"
          className="textarea w-full border border-border rounded-3xl resize-none h-30 text-textMain p-5"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <button
          className="btn btn-primary rounded-4xl"
          onClick={handleGenerate}
          disabled={loading}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
