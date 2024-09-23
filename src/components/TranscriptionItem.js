import { useState } from "react";

export default function TranscriptionItem({ item }) {
  const [startTime, setStartTime] = useState(item.start);
  const [endTime, setEndTime] = useState(item.end);
  const [word, setWord] = useState(item.punctuated_word);

  return (
    <div className="my-1 grid grid-cols-3 gap-1 items-center">
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md width-auto"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      ></input>
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      ></input>
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      ></input>
    </div>
  );
}
