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
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchTranscriptionData = async () => {
      setIsTranscribing(true);
      try {
        const response = await axios.get(`/api/transcribe?filename=${fileName}`);
        setTranscriptionItems(response.data.captions || []);

        // Construct video URL for Firebase storage
        const videoUrlString = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/videos%2F${fileName}?alt=media&token=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
        setVideoUrl(videoUrlString);
      } catch (error) {
        console.error("Error fetching transcription:", error);
        alert("Failed to load transcription data.");
      } finally {
        setIsTranscribing(false);
      }
    };

    fetchTranscriptionData();
  }, [fileName]);

  const handleValidationChange = (isValid) => {
    setIsValid(isValid);
  };

  return (
    <div className="grid sm:grid-cols-2 gap-8 sm:gap-16">
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
                  onValidationChange={handleValidationChange}
                />
              </div>
            </>
          ) : (
            <div>No transcription available.</div>
          )}

          {videoUrl && (
            <div>
              <h2 className="text-2xl mb-4">Result</h2>
              <ResultVideo
                videoUrl={videoUrl}
                fileName={fileName}
                transcriptionItems={transcriptionItems}
                isValid={isValid}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
