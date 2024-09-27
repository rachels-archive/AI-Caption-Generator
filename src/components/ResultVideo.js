import SparklesIcon from "./SparklesIcon";
import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { formatToSrt } from "@/libs/transcriptionHelpers";
import roboto from "/public/fonts/Roboto-Regular.ttf";
import robotoBold from "/public/fonts/Roboto-Bold.ttf";

export default function ResultVideo({ videoUrl, fileName, transcriptionItems }) {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);
  const [primaryColour, setPrimaryColour] = useState("#FFFFFF");
  const [outlineColour, setOutlineColour] = useState("#000000");

  useEffect(() => {
    videoRef.current.src = videoUrl;
    load(); // Load ffmpeg library
  }, [videoUrl]);

  const toFFmpegColor = (rgb) => {
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
    return "&H" + bgr + "&";
  };

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    console.log(roboto, robotoBold);

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile(roboto));
    await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold));
    setLoaded(true); // Set loaded state to true
  };

  const transcode = async () => {
    if (!loaded) {
      console.error("FFmpeg is not loaded yet.");
      return; // Prevent execution if FFmpeg is not loaded
    }

    const ffmpeg = ffmpegRef.current;
    const srt = formatToSrt(transcriptionItems);

    await ffmpeg.writeFile(fileName, await fetchFile(videoUrl));
    await ffmpeg.writeFile("subs.srt", srt);

    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });

    await ffmpeg.exec([
      "-i",
      fileName,
      "-preset",
      "ultrafast",
      "-vf",
      `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto,FontSize=30,MarginV=70,PrimaryColour=${toFFmpegColor(
        primaryColour
      )},OutlineColour=${toFFmpegColor(outlineColour)}'`,
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
  };

  return (
    <>
      <div className="mb-4">
        <button
          className="bg-orange-500 py-3 px-6 rounded-full inline-flex gap-2 hover:bg-orange-600 cursor-pointer"
          onClick={transcode}
          disabled={!loaded} // Disable button if not loaded
        >
          <SparklesIcon />
          <span>Apply captions</span>
        </button>
      </div>
      <div>
        Text color:
        <input type="color" value={primaryColour} onChange={(e) => setPrimaryColour(e.target.value)} />
        <br />
        Outline color:
        <input type="color" value={outlineColour} onChange={(e) => setOutlineColour(e.target.value)} />
      </div>

      {videoUrl && (
        <div className="rounded-lg overflow-hidden">
          <video ref={videoRef} controls></video>
        </div>
      )}
    </>
  );
}
