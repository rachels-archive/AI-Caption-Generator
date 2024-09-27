import TranscriptionItem from "./TranscriptionItem";

export default function TranscriptionEditor({ transcriptionItems, setTranscriptionItems }) {
  function updateTranscriptionItem(index, prop, event) {
    const newTranscriptionItem = [...transcriptionItems];
    newTranscriptionItem[index][prop] = event.target.value;
    setTranscriptionItems(newTranscriptionItem);
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
            <TranscriptionItem
              key={key}
              item={item}
              handleStartTimeChange={(e) => {
                updateTranscriptionItem(key, "start", e);
              }}
              handleEndTimeChange={(e) => {
                updateTranscriptionItem(key, "end", e);
              }}
              handleWordChange={(e) => {
                updateTranscriptionItem(key, "punctuated_word", e);
              }}
            />
          ))}
      </div>
    </>
  );
}
