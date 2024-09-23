"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function FilePage({ params }) {
  const fileName = params.filename;
  const [transcription, setTranscription] = useState([]); // Initialize as an array

  useEffect(() => {
    axios
      .get("api/transcribe?filename=" + fileName)
      .then((response) => {
        //console.log(response.data);
        setTranscription(response.data); // Set transcription to response.data
      })
      .catch((error) => {
        console.error("Error fetching transcription:", error); // Handle errors
      });
  }, [fileName]);

  return (
    <div>
      {transcription.length > 0 ? (
        transcription.map((item, index) => (
          <div key={index}>
            <span className="text-white/50 mr-2">
              {item.start} - {item.end}
            </span>
            <span>{item.punctuated_word}</span>
          </div>
        ))
      ) : (
        <div>No transcription available</div>
      )}
    </div>
  );
}
