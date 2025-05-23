"use client";

import { useEffect, useRef, useState } from "react";
import { generateImage, geminiResponse } from "../actions/generateImage";

export default function AIImage() {
  const [prompt, setPrompt] = useState("");
  const [aiData, setAiData] = useState<geminiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleGenerate = async () => {
    setPrompt("");
    setLoading(true);
    const result = await generateImage(prompt);
    setAiData((prev) => [...prev, result]);
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [aiData]);

  return (
    <div className="flex flex-col font-mono justify-center items-center tracking-normal gap-8" ref={messagesEndRef}>
      <div className="flex-1 w-full mx-auto flex items-center justify-center">
        <Message aiData={aiData} loading={loading} />
      </div>

      <div className="w-1/2 mx-auto relative mb-2">
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
  );
}

const Message = ({ aiData, loading }: { aiData: geminiResponse[]; loading: boolean }) => {
  if (aiData.length === 0 && !loading) {
    return <h1 className="text-3xl bg-gradient-to-r from-start to-end bg-clip-text text-transparent text-center">Generate AI Image</h1>;
  }

  if (loading) {
    return <div className="skeleton card w-96 h-96"></div>;
  }

  if (aiData.length > 0) {
    return (
      <div className="flex flex-col">
        {aiData.map((item, index) => (
          <div key={index}>
            <div className="chat chat-start">
              <div className="chat-bubble">{item.prompt}</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">
                <img className="w-full object-cover max-h-140" src={`data:image/png;base64,${item.image}`} alt={`AI Response ${index}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
