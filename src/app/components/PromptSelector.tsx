import React from "react";
import { IPrompt, prompts } from "../data/data";
import { SiKyocera } from "react-icons/si";

interface PromptSelectorProps {
  setCategory: (prompt: IPrompt) => void;
  handleGenerate: () => void;
  setPrompt: (x: string) => void;
  loading: boolean;
  prompt: string;
  category:(IPrompt | null);
  setPromptWrapper: (wrapper:string) => void;
  promptWrapper: string;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({ setCategory, handleGenerate, loading, prompt, setPrompt,category,setPromptWrapper,promptWrapper }) => {
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
        {category?.skus && (
          <select
            className="select select-secondary mt-2 text-base rounded-lg shadow-sm border border-blue-600"
            onChange={(e)=> {
              const sku = category.skus?.find((s) => s.productDescription === e.target.value);
              if(sku) setPromptWrapper(sku.promptWrapper);
            }}
          >
            <option
              defaultValue={""}
            >
              Select SKU Prompt Wrapper
            </option>
            {category.skus.map((sku) =>(
              <option key={sku.productDescription} value ={sku.productDescription}>
                    {sku.productDescription} - {sku.skuNumber}
                  </option>
            ))}

          </select>
            
        )}
      
        <button className="btn btn-primary rounded-4xl" onClick={handleGenerate} disabled={loading}>
          Generate
        </button>
      </div>
    </div>
  );
};

export default PromptSelector;
