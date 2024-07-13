import ArrowIcon from "@/components/ArrowIcon";
import PageHeader from "@/components/PageHeaders";
import UploadIcon from "@/components/UploadIcon";
import VideoSection from "@/components/VideoSection";

export default function Home() {
  return (
    <>
      <PageHeader />
      <div className="text-center ">
        <button className="bg-orange-500 py-3 px-6 rounded-full inline-flex gap-2 hover:bg-orange-600">
          <UploadIcon />
          <span>Choose File</span>
        </button>
        <VideoSection />
      </div>
    </>
  );
}
