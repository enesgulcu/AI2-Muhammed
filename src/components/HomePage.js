"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import RecordButton from "./RecordButton";

export default function HomePage() {
  const { data: session } = useSession();
  const [transcribedText, setTranscribedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("9BWtsMINqrJLrRacOk9x");

  const voices = [
    { id: "9BWtsMINqrJLrRacOk9x", name: "Ses 1" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Ses 2" },
    { id: "KIJiZX0SdfrXAR9Xomm8", name: "Ses 3" },
    { id: "onwK4e9ZLuTAKqWW03F9", name: "Ses 4" },
    { id: "D38z5RcWu1voky8WS1ja", name: "Ses 5" },
  ];

  const resetStates = () => {
    setTranscribedText("");
    setAiResponse("");
    setAudioUrl("");
    setSelectedVoice("onwK4e9ZLuTAKqWW03F9");
  };

  useEffect(() => {
    resetStates();
  }, []);

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
        await handleTextToSpeech(data.aiResponse);
      } else {
        toast.error("ChatGPT API çağrısı başarısız.");
      }
    } catch (error) {
      toast.error("ChatGPT API çağrısı hatası.");
    }
  };

  const handleTextToSpeech = async (text) => {
    try {
      const response = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: selectedVoice }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        toast.error("Text-to-speech API çağrısı başarısız.");
      }
    } catch (error) {
      toast.error("Text-to-speech API çağrısı hatası.");
    }
  };

  useEffect(() => {
    if (transcribedText) {
      handleSendToChatGPT(transcribedText);
    }
  }, [transcribedText]);

  return (
    <div className="bg-bgpage min-h-screen flex flex-col pb-28 overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} /> {/* Toast notifications */}
      <div className="max-w-md w-1/3 mx-auto flex items-center space-x-2 my-5">
        <label htmlFor="voiceSelect" className="text-md text-gray-500">Ses Seçin:</label>
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
      </div>

      <div>
        <RecordButton setTranscribedText={setTranscribedText} isLoggedIn={!!session} />
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

      {audioUrl && (
        <div className="my-4 mx-16 p-4 bg-bgpage rounded-lg shadow-lg">
          <audio
            controls
            src={audioUrl}
            className="w-full h-12 bg-bgpage rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            playsInline
            autoPlay
          />
        </div>
      )}
    </div>
  );
}
