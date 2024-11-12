"use client";
import { useState } from "react";
import RecordButton from "./RecordButton";

export default function HomePage() {
  const [transcribedText, setTranscribedText] = useState("");

  return (
    <div className="bg-bgpage flex flex-col items-center pb-28 overflow-hidden min-h-screen">
      {/* Bas-Konuş buttonu */}
      <div className="w-full flex justify-center mb-6">
        <RecordButton setTranscribedText={setTranscribedText} />
      </div>
      <div className="bg-secondary w-full max-w-2xl mx-4 md:mx-16 rounded-md p-5 flex flex-col gap-4">
        {/* Çocuğun Konuşması */}
        <div className="bg-third rounded-md p-3 h-24 md:h-28 flex items-center justify-center text-gray-800">
          <span className={transcribedText ? "text-white" : "text-gray-800"}>
            {transcribedText || "Konuşmanız..."}
          </span>
        </div>
        {/* AI Cevap */}
        <div className="bg-third rounded-md p-3 h-24 md:h-28 flex items-center justify-center text-gray-800">
          <span>Sesli asistan cevabı...</span>
        </div>
      </div>
    </div>
  );
}
