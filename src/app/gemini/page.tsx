"use client";

import { useEffect, useRef, useState } from "react";
import { generateImage } from "../actions/generateImage";
import { editImage } from "../actions/editImage";
import { geminiResponse } from "../types/type";
import { ECategory, IPrompt, prompts } from "../data/data";
import { AiFillPlusCircle } from "react-icons/ai";
import Popup from "reactjs-popup";
import { FaLessThanEqual } from "react-icons/fa";
import toast from "react-hot-toast";
import PromptSelector from "../components/PromptSelector";

export default function GeminiAiPage() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<geminiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<IPrompt | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [uploadedImagePrompt,setUploadedImagePrompt] = useState("");
  const [uploadedImage,setUploadedImage] = useState<string |null>(null);
  const [showEditPopup,setShowEditPopup] = useState(false);
  const [usedPromptWrapper, setUsedPromptWrapper] = useState("");

  const handleGenerate = async () => {
    
    if (!category) {
      toast.error("Please Choose a category");
      return;
    }
    const newEntry: geminiResponse = { prompt, loading: true, error: "",geminiText:"" };
    setChatHistory((prev) => [...prev, newEntry]);
    setPrompt("");
    console.log(usedPromptWrapper);
    const result = await generateImage(prompt, category, usedPromptWrapper);
    setChatHistory((prev) =>
      prev.map((item, index) => (index === prev.length - 1 ? { ...result, prompt: item.prompt } : item))
    );
    setLoading(false);
  };

  const handleUpload =(e:any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    if(file){
      reader.readAsDataURL(file);
    }
  };
  


  const handleUploadImage = async()=>{
    if(!uploadedImagePrompt || !uploadedImage){
      toast.error("Please enter a prompt and upload an image");
      return;
    }
    const cleanedBase64 = uploadedImage.replace(/^data:image\/\w+;base64,/, "");
    const tempEntry: geminiResponse= {
      prompt:uploadedImagePrompt,
      image:undefined,
      loading:true,
      error:"",
      geminiText:""
    };
    setChatHistory((prev)=>[...prev,tempEntry]);
    setUploadedImagePrompt("");
    setUploadedImage(null);
    setShowEditPopup(false);
    setLoading(true);
    
    const result = await editImage(uploadedImagePrompt,cleanedBase64);
    if(!result || !result.image){
      toast.error(result?.error || "No image returned");
      setLoading(false);
      return;
    }
    setChatHistory((prev)=>
      prev.map((item,index)=>(index === prev.length - 1? result : item)));
    setLoading(false);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory]);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="flex flex-col font-mono justify-center items-center tracking-normal w-full gap-8" ref={messagesEndRef}>
        <div className="flex-1 w-1/2 mx-auto flex items-center justify-center min-h-screen">
          <Message aiData={chatHistory} setChatHistory={setChatHistory} setLoading={setLoading} />
        </div>

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
                  const sku = category.skus?.find(s=> s.productDescription === e.target.value);
                  if(sku) setUsedPromptWrapper(sku.promptWrapper);
                }}
              >
                <option defaultValue={""}>
                  Select SKU Prompt Wrapper
                </option>
                {category.skus.map((sku)=>(
                  <option key={sku.productDescription} value ={sku.productDescription}>
                    {sku.productDescription} - {sku.skuNumber}
                  </option>
                ))}
              </select>
            )}
            <Popup
              open={showEditPopup}
              onOpen={()=>setShowEditPopup(true)}
              onClose={() =>{
                setShowEditPopup(false);
                setUploadedImagePrompt("");
                setUploadedImage(null);
              }}
              trigger={
                <button type="button">
                  <AiFillPlusCircle size={28} className="text-white-400"/>
                </button>
              }
              position="top right"
              closeOnDocumentClick
              >
              <div className="p-4">
                <textarea
                  placeholder="Describe how to edit your image"
                  value={uploadedImagePrompt}
                  onChange={(e) => setUploadedImagePrompt(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="mb-2"
                />
                <button className="btn btn-accent mt-2" 
                  onClick={handleUploadImage}>
                    Upload Image & Generate
                </button>
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="mt-2 rounded size-100"
                  />
                )}


              </div>
                

              </Popup>
            <button className="btn btn-primary rounded-4xl" onClick={handleGenerate} disabled={loading}>
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Message = ({
  aiData,
  setChatHistory,
  setLoading,
}: {
  aiData: geminiResponse[];
  setChatHistory: React.Dispatch<React.SetStateAction<geminiResponse[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [editPrompt, setEditPrompt] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleImageEdit = async (item: geminiResponse, index: number) => {
    if (!editPrompt.trim()) {
      toast.error("Edit prompt cannot be empty");
      return;
    }
    const imageBase64 = item.image;
    if (!imageBase64 || imageBase64.length === 0) {
      toast.error("No image found");
      return;
    }
    setLoading(true);
    const result = await editImage(editPrompt, imageBase64);
    setLoading(false);

    if (result && result.image) {
      setChatHistory((prev) => [...prev, result]);
      setEditPrompt("");
      setEditingIndex(null);
    } else {
      toast.error("Failed to edit image");
    }
  };

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
            <div className="chat-bubble p-5">
              {item.loading ? (
                <div className="skeleton card w-96 h-96"></div>
              ) : (
                <>
                  <div className="mt-2 text-white">
                    {item.geminiText}
                  </div>
                  <img className="w-full object-cover max-h-140" src={item.image?.startsWith("data:image") ? item.image : `data:image/png;base64,${item.image}`} alt={`AI Response ${index}`} />
                  <button
                    className="mt-2 text-blue-600 hover:underline"
                    onClick={() => setEditingIndex(index)}
                  >
                    Edit this image
                  </button>
                  {editingIndex === index && (
                    <>
                      <textarea
                        placeholder="Edit Prompt"
                        className="textarea textarea-bordered w-full mt-2"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                      ></textarea>
                      <button
                        className="btn btn-secondary mt-2"
                        onClick={() => handleImageEdit(item, index)}
                      >
                        Submit Edit
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
