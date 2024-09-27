"use client";
import TranscriptionItem from "@/components/TranscriptionItem";
import axios from "axios";
import { useState, useEffect } from "react";

export default function FilePage({ params }) {
  const fileName = params.filename;
  const [transcription, setTranscription] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    setIsTranscribing(true);

    axios
      .get("api/transcribe?filename=" + fileName)
      .then((response) => {
        setTranscription(response.data || []);
        const videoUrlString = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/videos%2F${fileName}?alt=media&token=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
        setVideoUrl(videoUrlString);
      })
      .catch((error) => {
        console.error("Error fetching transcription:", error);
      })
      .finally(() => {
        setIsTranscribing(false);
      });
  }, [fileName]);

  return (
    <div>
      {isTranscribing ? (
        <span>Transcribing Audio...</span>
      ) : (
        <>
          <h2 className="text-2xl mb-4">Video</h2>
          {videoUrl && (
            <video controls width="600">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          )}
          {Array.isArray(transcription) && transcription.length > 0 ? (
            <>
              <h2 className="text-2xl mb-4">Transcription</h2>
              <div className="grid grid-cols-3 sticky top-0 bg-violet-800 rounded-md p-1">
                <div className="font-bold ml-2">From</div>
                <div className="font-bold ml-2">To</div>
                <div className="font-bold ml-2">Word</div>
              </div>

              {transcription.map((item, index) => (
                <TranscriptionItem key={index} item={item} />
              ))}
            </>
          ) : (
            <div>No transcription available.</div>
          )}
        </>
      )}
    </div>
  );
}
