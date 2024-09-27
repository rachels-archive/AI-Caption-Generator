import SparklesIcon from "./SparklesIcon";
import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { formatToSrt } from "@/libs/transcriptionHelpers";

export default function ResultVideo({ videoUrl, fileName, transcriptionItems }) {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.src = videoUrl;
    load(); //load ffmpeg library
  }, []);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    setLoaded(true);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(fileName, await fetchFile(videoUrl));

    console.log(formatToSrt(transcriptionItems));
    await ffmpeg.exec(["-i", fileName, "output.mp4"]);
    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
  };

  return (
    <>
      <div className="mb-4">
        <button
          className="bg-orange-500 py-3 px-6 rounded-full inline-flex gap-2 hover:bg-orange-600 cursor-pointer"
          onClick={transcode}
        >
          <SparklesIcon />
          <span>Apply captions</span>
        </button>
      </div>

      {videoUrl && (
        <div className="rounded-lg overflow-hidden">
          <video ref={videoRef} controls></video>
        </div>
      )}
    </>
  );
}
