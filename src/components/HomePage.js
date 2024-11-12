"use client";
import { useState } from "react";
import RecordButton from "./RecordButton";
import { useEffect } from "react";

export default function HomePage() {
  const [transcribedText, setTranscribedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleSendToChatGPT = async (text) => {
    try {
      const response = await fetch("/api/getChatGPTFeedBack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcribedText: text }),
      });
      const data = await response.json();
      setAiResponse(data.aiResponse);
    } catch (error) {
      console.error("API Çağrısı Hatası:", error);
    }
  };

  // transcribedText güncellendiğinde ChatGPT API'sine gönder
  useEffect(() => {
    if (transcribedText) {
      handleSendToChatGPT(transcribedText);
    }
  }, [transcribedText]);

  return (
    <div className="bg-bgpage flex flex-col pb-28 overflow-hidden">
      {/* Bas-Konuş buttonu */}
      <div>
        <RecordButton setTranscribedText={setTranscribedText} />
      </div>
      <div className="bg-secondary h-56 mx-16 rounded-md p-5 flex flex-col gap-4">
        {/* Çocuğun Konuşması */}
        <div className="bg-third rounded-md p-3 h-1/2 flex items-center justify-center text-gray-800">
          <span className={transcribedText ? "text-white" : "text-gray-800"}>
            {transcribedText || "Konuşmanız..."}
          </span>
        </div>
        {/* AI Cevap */}
        <div className="bg-third rounded-md p-3 h-1/2 flex items-center justify-center text-gray-800">
          <span>{aiResponse || "Sesli asistan cevabı..."}</span>
        </div>
      </div>
    </div>
  );
}
