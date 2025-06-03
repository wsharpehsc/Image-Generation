"use client";

import { useEffect, useRef, useState } from "react";
import { generateImage } from "../actions/generateImage";
import { geminiResponse } from "../types/type";

export default function AIImage() {
  const [prompt, setPrompt] = useState("");
  const [aiData, setAiData] = useState<geminiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleGenerate = async () => {
    const newEntry: geminiResponse = { prompt, loading: true, error: "" };
    setAiData((prev) => [...prev, newEntry]);
    setPrompt("");

    const result = await generateImage(prompt);

    setAiData((prev) => prev.map((item, index) => (index === prev.length - 1 ? { ...result, prompt: item.prompt } : item)));
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [aiData]);

  return (
    <div className="relative">
      <div className="flex flex-col font-mono justify-center items-center tracking-normal w-full gap-8" ref={messagesEndRef}>
        <div className="flex-1 w-1/2 mx-auto flex items-center justify-center min-h-screen">
          <Message aiData={aiData} />
        </div>

        <div className="w-1/2 mx-auto sticky bottom-0 z-50 mb-2">
          <textarea
            placeholder="Please Type Prompt"
            className="textarea w-full border border-border rounded-3xl resize-none h-30 text-textMain p-5 pr-24"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>

          <button className="absolute right-4 bottom-4 btn btn-primary rounded-4xl" onClick={handleGenerate} disabled={loading}>
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

const Message = ({ aiData }: { aiData: geminiResponse[] }) => {
  if (aiData.length === 0) {
    return <h1 className="text-3xl bg-gradient-to-r from-start to-end bg-clip-text text-transparent text-center">Generate AI Image</h1>;
  }

  return (
    <div className="flex flex-col gap-4">
      {aiData.map((item, index) => (
        <div key={index}>
          <div className="chat chat-end">
            <div className="chat-bubble p-2">{item.prompt}</div>
          </div>
          <div className="chat chat-start">
            <div className="chat-bubble p-2">
              {item.loading ? (
                <div className="skeleton card w-96 h-96"></div>
              ) : (
                <img className="w-full object-cover max-h-140" src={`data:image/png;base64,${item.image}`} alt={`AI Response ${index}`} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
