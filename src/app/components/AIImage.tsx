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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-3xl bg-gradient-to-r from-red-500 to-purple-400 bg-clip-text text-transparent">
        Generate AI Image
      </h1>
      <textarea
        placeholder="Please Type Prompt"
        className="textarea textarea-primary max-w-1/2 w-1/2"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {loading ? (
        <div className="skeleton card w-96 h-96"></div>
      ) : (
        imageData && (
          <div className="card bg-base-100 w-96 shadow-md mt-4">
            <figure>
              <img
                src={`data:image/png;base64,${imageData}`}
                alt="Generated AI"
              />
            </figure>
          </div>
        )
      )}
    </div>
  );
}
