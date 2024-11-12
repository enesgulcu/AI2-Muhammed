"use client";
import { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa6";

export default function RecordButton({ setTranscribedText }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];

      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      console.log("Audio blob:", audioBlob);
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: audioBlob,
        headers: {
          "Content-Type": "audio/wav",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTranscribedText(data.text); // Transkribe edilen metni HomePage'e gönder
        console.log("Oluşturulan Metin:", data.text);
      } else {
        console.error("Transkription hatası:", response.statusText);
      }

      setAudioUrl(URL.createObjectURL(audioBlob));
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center my-10 gap-3 ">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-36 h-36 rounded-full text-white font-semibold shadow-lg ${isRecording ? "bg-red-500" : "bg-primary"}`}
      >
        {isRecording ? (
          <span className="flex justify-center items-center text-black ">
            <FaMicrophoneSlash size={60} />
          </span>
        ) : (
          <span className="flex justify-center items-center text-black ">
            <FaMicrophone size={60} />
          </span>
        )}
      </button>
      <p className="text-white flex justify-center ">Bas ve Konuş</p>

    </div>
  );
}
