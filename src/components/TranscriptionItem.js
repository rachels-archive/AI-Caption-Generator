export default function TranscriptionItem({ item, handleStartTimeChange, handleEndTimeChange, handleWordChange }) {
  return (
    <div className="my-1 grid grid-cols-3 gap-1 items-center">
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md width-auto"
        value={item.start}
        onChange={handleStartTimeChange}
      ></input>
      <input type="text" className="bg-white/20 p-1 rounded-md" value={item.end} onChange={handleEndTimeChange}></input>
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={item.punctuated_word}
        onChange={handleWordChange}
      ></input>
    </div>
  );
}
