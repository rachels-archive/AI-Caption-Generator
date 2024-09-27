"use client";
import ResultVideo from "@/components/ResultVideo";
import TranscriptionEditor from "@/components/TranscriptionEditor";
import axios from "axios";
import { useState, useEffect } from "react";

export default function FilePage({ params }) {
  const fileName = params.filename;
  const [transcriptionItems, setTranscriptionItems] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    setIsTranscribing(true);
    axios
      .get("api/transcribe?filename=" + fileName)
      .then((response) => {
        setTranscriptionItems(response.data || []);
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
    <div className="grid grid-cols-2 gap-5">
      {isTranscribing ? (
        <span>Transcribing Audio...</span>
      ) : (
        <>
          {Array.isArray(transcriptionItems) && transcriptionItems.length > 0 ? (
            <>
              <div>
                <h2 className="text-2xl mb-4">Transcription</h2>

                <TranscriptionEditor
                  transcriptionItems={transcriptionItems}
                  setTranscriptionItems={setTranscriptionItems}
                />
              </div>
            </>
          ) : (
            <div>No transcription available.</div>
          )}

          <div>
            <h2 className="text-2xl mb-4">Result</h2>
            <ResultVideo videoUrl={videoUrl} />
          </div>
        </>
      )}
    </div>
  );
}
