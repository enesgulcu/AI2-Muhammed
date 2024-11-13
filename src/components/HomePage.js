"use client";
import { useState, useEffect } from "react";
import RecordButton from "./RecordButton";

export default function HomePage() {
  const [transcribedText, setTranscribedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("onwK4e9ZLuTAKqWW03F9"); // Varsayılan voiceId

  // Ses seçeneği (voice ID) için bir liste
  const voices = [
    { id: "9BWtsMINqrJLrRacOk9x", name: "Ses 1" },
    { id: "pqHfZKP75CvOlQylNhV4", name: "Ses 2" },
    { id: "jsCqWAovK2LkecY7zXl4", name: "Ses 3" },
  ];

  // ChatGPT API çağrısı ile yanıt alma
  const handleSendToChatGPT = async (text) => {
    try {
      const response = await fetch("/api/getChatGPTFeedBack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcribedText: text }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.aiResponse);
        await handleTextToSpeech(data.aiResponse); // Text-to-speech fonksiyonunu çağır
      } else {
        console.error("ChatGPT API çağrısı başarısız:", response.status);
      }
    } catch (error) {
      console.error("ChatGPT API Çağrısı Hatası:", error);
    }
  };

  // Text-to-Speech işlemi için ElevenLabs API'sini çağır
  const handleTextToSpeech = async (text) => {
    try {
      const response = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: selectedVoice }), // Seçilen voice ID'yi de gönder
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        console.error("Text-to-speech API çağrısı başarısız:", response.status);
      }
    } catch (error) {
      console.error("Text-to-speech API Çağrısı Hatası:", error);
    }
  };

  // transcribedText değiştiğinde ChatGPT API'sini çağır
  useEffect(() => {
    if (transcribedText) {
      handleSendToChatGPT(transcribedText);
    }
  }, [transcribedText]);

  return (
    <div className="bg-bgpage flex flex-col pb-28 overflow-hidden">
      <div className="">
        <form className="max-w-md mx-auto flex items-center space-x-2 my-5">
          <label htmlFor="voiceSelect" className="text-md text-gray-500">
            Ses Seçin:
          </label>
          <select
            id="voiceSelect"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
          >
            {voices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
        </form>
      </div>
      <div>
        <RecordButton setTranscribedText={setTranscribedText} />
      </div>
      <div className="bg-secondary h-56 mx-16 rounded-md p-5 flex flex-col gap-4">
        <div className="bg-third rounded-md p-3 h-1/2 flex items-center justify-center text-gray-800">
          <span className={transcribedText ? "text-white" : "text-gray-800"}>
            {transcribedText || "Konuşmanız..."}
          </span>
        </div>
        <div className="bg-third rounded-md p-3 h-1/2 flex items-center justify-center text-gray-800">
          <span>{aiResponse || "Sesli asistan cevabı..."}</span>
        </div>
      </div>
      {/* Ai ses  */}
      {audioUrl && (
        <div className="flex justify-center mt-4">
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
