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
        {!imageData && (
          <h1 className="text-3xl bg-gradient-to-r from-start to-end bg-clip-text text-transparent text-center">
            Generate AI Image
          </h1>
        )}

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
      <div className="w-1/2 flex flex-row gap-2 mt-auto justify-center items-center">
        <textarea
          placeholder="Please Type Prompt"
          className="textarea w-full border border-border rounded-3xl resize-none text-textMain"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <button
          className="btn btn-primary rounded-4xl"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
