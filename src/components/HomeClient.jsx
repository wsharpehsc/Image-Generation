"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { BlinkBlur } from "react-loading-indicators";      
import { AiFillPlusCircle } from "react-icons/ai";
import Popup from "reactjs-popup";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);       // Use States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const chatEndRef = useRef(null);
  const focusChat = useRef(null);

  useEffect(() => {
    focusChat.current?.focus();       // Auto focus on input box on first render of site
  },[]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });   // Scroll to end of chat after each generation
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {                                 // Standard image generation 
      setError("Prompt cannot be empty");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setChatHistory((prev) => [
        ...prev,
        { question: prompt, image: data.image },
      ]);
      setPrompt("");
    } else {
      setError(data.error || "Something went wrong");
    }
  };


  const handleUploadImage = async () => {
    if (!userImage || !editPrompt.trim()) {
      setError("Please upload an image and enter a prompt");
      return;
    }                                                             // Function to edit an image that has been uploaded by the user
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/edit-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: editPrompt, base64Image: userImage }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setChatHistory((prev) => [
          ...prev,
          { question: editPrompt, image: data.image },
        ]);
        setEditPrompt("");
        setEditingIndex(null);
        setUserImage(null);
      } else {
        setError(data.error || "Error generating image");
      }
    } catch (err) {
      setLoading(false);
      setError("Error editing image");
    }
  };

  const handleEditImage = async (entry, index) => {
    if (!editPrompt.trim()) {
      setError("Edit prompt cannot be empty");
      return;
    }

    setError("");
    setLoading(true);
    const rawBase64 = entry.image.split(",")[1];
    const res = await fetch("/api/edit-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: editPrompt, base64Image: rawBase64 }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setChatHistory((prev) => [
        ...prev,
        { question: editPrompt, image: data.image },
      ]);
      setEditPrompt("");
      setEditingIndex(null);
    } else {
      setError(data.error || "Failed to edit image");
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(",")[1];
      setUserImage(base64Image);
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <>
      <Head>
        <title>Gemini Image Chat</title>
      </Head>
      <div className="flex flex-col h-screen bg-beige-50">
        <div className="flex-9 overflow-y-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Gemini Image Chat</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="space-y-4">
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className="space-y-2">
                    <div className="chat chat-end">
                        <div className="chat-bubble bg-blue-600 text-white">
                            {entry.question}
                        </div>
                    </div>

               
                <p className="mb-2 text-white-400 text-lg">{entry.question}</p>
                {entry.image && (
                    <div className="chat chat-start">
                      <div className="chat-bubble p-2 bg-gray-200">
                        <div>
                  <img
                    src={entry.image}
                    alt="Generated"
                    className="rounded-sm mb-2 max-w-md"
                  />
                        </div>
                      </div>
                    </div>
                )}
                {editingIndex === index ? (
                  <div>
                    <textarea
                      className="w-lg p-2 border rounded-md mb-2 text-white-400"
                      placeholder="Edit prompt..."
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                    />
                    
                    <p></p>
                    <button
                      onClick={() => handleEditImage(entry, index)}
                      className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-indigo-700 "
                    >
                      Submit Edit
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-lg text-white-400 hover:underline mt-2"
                    onClick={() => setEditingIndex(index)}
                  >
                    Edit This Image
                  </button>
                  
                )}
              </div>

            ))}
            <div ref={chatEndRef} />
          </div>
          {loading && (
            <div className="mt-6 flex justify-center">
              <BlinkBlur color="#6366f1" size="small" />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 bg-beige flex items-center gap-3"
        >
          <input
            ref={focusChat}
            type="text"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your image prompt..."
            className="flex-1 p-2 border rounded-md text-white"
          />
          <Popup
            trigger={
              <button type="button">
                <AiFillPlusCircle size={28} className="text-white-400" />
              </button>
            }
            position="top center"
            closeOnDocumentClick
          >
            <div className="p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mb-2"
              />
              <textarea
                placeholder="Describe how to edit your image"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={handleUploadImage}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Edit Uploaded Image
              </button>
              {userImage && (
                <img
                  src={`data:image/png;base64,${userImage}`}
                  alt="Uploaded"
                  className="mt-2 rounded"
                />
              )}
            </div>
          </Popup>
          <button
            type="submit"
            className="bg-white-400 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Generate
          </button>
        </form>
      </div>
    </>
  );
}
