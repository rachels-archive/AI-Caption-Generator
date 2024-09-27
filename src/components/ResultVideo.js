import SparklesIcon from "./SparklesIcon";

export default function ResultVideo({ videoUrl }) {
  return (
    <>
      <div className="mb-4">
        <button className="bg-orange-500 py-3 px-6 rounded-full inline-flex gap-2 hover:bg-orange-600 cursor-pointer">
          <SparklesIcon />
          <span>Apply captions</span>
        </button>
      </div>

      {videoUrl && (
        <div className="rounded-lg overflow-hidden">
          <video controls width="600">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>
      )}
    </>
  );
}
