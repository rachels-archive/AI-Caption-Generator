"use client";
import TranscriptionItem from "@/components/TranscriptionItem";
import axios from "axios";
import { useState, useEffect } from "react";

export default function FilePage({ params }) {
  const fileName = params.filename;
  const [transcription, setTranscription] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    setIsTranscribing(true);
    axios
      .get("api/transcribe?filename=" + fileName)
      .then((response) => {
        //console.log(response.data);
        setTranscription(response.data);
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
          {transcription.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-8">
                <div className="">
                  <h2 className="text-2xl mb-4">Transcription</h2>
                  <div className="grid grid-cols-3 sticky top-0 bg-violet-800 rounded-md p-1">
                    <div className="font-bold ml-2">From</div>
                    <div className="font-bold ml-2">To</div>
                    <div className="font-bold ml-2">Word</div>
                  </div>

                  {transcription.map((item, index) => (
                    <div key={index}>
                      <TranscriptionItem item={item} />
                    </div>
                  ))}
                </div>
                <h2 className="text-2xl mb-4">Results</h2>
              </div>
            </>
          ) : (
            <div>No transcription available.</div>
          )}
        </>
      )}
    </div>
  );
}
