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
  const [captionSize, setCaptionSize] = useState(30);
  const [progress, setProgress] = useState(1);

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

    videoRef.current.src = videoUrl;
    await new Promise((resolve, reject) => {
      videoRef.current.onloadedmetadata = resolve;
    });
    const videoDuration = videoRef.current.duration;
    //console.log(videoDuration);
    ffmpeg.on("log", ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if (regexResult && regexResult?.[1]) {
        const progress = regexResult?.[1];
        const [hours, minutes, seconds] = progress.split(":");
        const progressInSeconds = hours * 3600 + minutes * 60 + seconds;
        const videoProgress = progressInSeconds / videoDuration;

        setProgress(videoProgress);
      }
    });

    await ffmpeg.exec([
      "-i",
      fileName,
      "-preset",
      "ultrafast",
      "-vf",
      `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto,FontSize=${captionSize},MarginV=70,PrimaryColour=${toFFmpegColor(
        primaryColour
      )},OutlineColour=${toFFmpegColor(outlineColour)}'`,
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    setProgress(1);
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
        <div className="flex items-center mb-3">
          <span className="mr-2">Text color:</span>
          <input
            className="rounded-md"
            type="color"
            value={primaryColour}
            onChange={(e) => setPrimaryColour(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-3">
          <span className="mr-2">Outline color:</span>
          <input
            className="rounded-md"
            type="color"
            value={outlineColour}
            onChange={(e) => setOutlineColour(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-3">
          <span className="mr-2">Font size:</span>

          <div className="flex items-center mr-4 sm:mr-0">
            <input
              type="radio"
              id="small"
              name="font_size"
              value="30"
              checked={captionSize == 30}
              onChange={(e) => setCaptionSize(e.target.value)}
              className="mr-1" // Small gap between the checkbox and label
            />
            <label htmlFor="small" className="mr-1">
              Small
            </label>{" "}
            {/* Reduced margin */}
          </div>

          <div className="flex items-center mr-4  sm:mr-0">
            <input
              type="radio"
              id="medium"
              name="font_size"
              value="50"
              checked={captionSize == 50}
              onChange={(e) => setCaptionSize(e.target.value)}
              className="mr-1" // Small gap between the checkbox and label
            />
            <label htmlFor="medium" className="mr-1">
              Medium
            </label>{" "}
            {/* Reduced margin */}
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="large"
              name="font_size"
              value="70"
              checked={captionSize == 70}
              onChange={(e) => setCaptionSize(e.target.value)}
              className="mr-1" // Small gap between the checkbox and label
            />
            <label htmlFor="large">Large</label>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden relative">
        {progress && progress < 1 && (
          <div className="absolute inset-0 bg-black/80 flex items-center">
            <div className="w-full text-center">
              <div className="bg-bg-gradient-from/50 mx-8 rounded-lg overflow-hidden relative">
                <div className="bg-bg-gradient-from h-8" style={{ width: progress * 100 + "%" }}>
                  <h3 className="text-white text-xl absolute inset-0 py-1">{parseInt(progress * 100)}%</h3>
                </div>
              </div>
            </div>
          </div>
        )}
        {videoUrl && <video ref={videoRef} controls></video>}
      </div>
    </>
  );
}
