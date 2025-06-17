import React from "react";
import { IPrompt, prompts } from "../data/data";

interface PromptSelectorProps {
  setCategory: (prompt: IPrompt) => void;
  handleGenerate: () => void;
  setPrompt: (x: string) => void;
  loading: boolean;
  prompt: string;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({ setCategory, handleGenerate, loading, prompt, setPrompt }) => {
  return (
    <div className="w-1/2 mx-auto sticky bottom-0 z-50 mb-2">
      <textarea
        placeholder="Please Type Prompt"
        className="textarea w-full border border-border rounded-3xl resize-none h-30 text-textMain p-5 pr-24"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>

      <div className="flex flex-row justify-between mt-2">
        <select
          className="select select-info text-base rounded-lg shadow-sm border border-blue-600"
          onChange={(e) => setCategory(prompts[parseInt(e.target.value)])}
          defaultValue=""
        >
          <option value="" disabled>
            Pick a category
          </option>
          {prompts.map((item, index) => (
            <option key={index} value={index}>
              {item.Type}
            </option>
          ))}
        </select>
        <button className="btn btn-primary rounded-4xl" onClick={handleGenerate} disabled={loading}>
          Generate
        </button>
      </div>
    </div>
  );
};

export default PromptSelector;
