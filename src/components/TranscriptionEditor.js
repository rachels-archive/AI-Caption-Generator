import { useState, useEffect } from "react";
import TranscriptionItem from "./TranscriptionItem";

export default function TranscriptionEditor({ transcriptionItems, setTranscriptionItems, onValidationChange }) {
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Notify parent about validation state
    onValidationChange(Object.keys(validationErrors).length === 0);
  }, [validationErrors]);

  function validateTranscriptionItems(items) {
    const errors = {};

    items.forEach((item, index) => {
      // Use regex to check for positive integers
      const startValid = /^\d+(\.\d+)?$/.test(item.start);
      const endValid = /^\d+(\.\d+)?$/.test(item.end);
      const start = startValid ? parseFloat(item.start) : NaN;
      const end = endValid ? parseFloat(item.end) : NaN;

      if (!startValid || start < 0) {
        errors[`start-${index}`] = "Start time must be a valid positive integer.";
      }

      if (!endValid || end < 0) {
        errors[`end-${index}`] = "End time must be a valid positive integer.";
      }

      if (end < start) {
        errors[`range-${index}`] = "Start time must be earlier than end time.";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  }

  function updateTranscriptionItem(index, prop, event) {
    const newTranscriptionItem = [...transcriptionItems];
    newTranscriptionItem[index][prop] = event.target.value;

    if (validateTranscriptionItems(newTranscriptionItem)) {
      setTranscriptionItems(newTranscriptionItem);
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 sticky top-0 bg-violet-800 rounded-md p-1 ">
        <div className="font-bold ml-2">From</div>
        <div className="font-bold ml-2">To</div>
        <div className="font-bold ml-2">Word</div>
      </div>
      <div className="h-48 sm:h-auto overflow-y-scroll sm:overflow-auto">
        {transcriptionItems.length > 0 &&
          transcriptionItems.map((item, key) => (
            <div key={key}>
              <TranscriptionItem
                item={item}
                handleStartTimeChange={(e) => updateTranscriptionItem(key, "start", e)}
                handleEndTimeChange={(e) => updateTranscriptionItem(key, "end", e)}
                handleWordChange={(e) => updateTranscriptionItem(key, "punctuated_word", e)}
              />

              {validationErrors[`start-${key}`] && <p className="text-red-500">{validationErrors[`start-${key}`]}</p>}
              {validationErrors[`end-${key}`] && <p className="text-red-500">{validationErrors[`end-${key}`]}</p>}
              {validationErrors[`range-${key}`] && <p className="text-red-500">{validationErrors[`range-${key}`]}</p>}
            </div>
          ))}
      </div>
    </>
  );
}
