import ArrowIcon from "@/components/ArrowIcon";
import PageHeader from "@/components/PageHeaders";
import UploadIcon from "@/components/UploadIcon";
import VideoSection from "@/components/VideoSection";
import UploadForm from "@/components/UploadForm";
export default function Home() {
  return (
    <>
      <PageHeader />
      <div className="text-center ">
        <UploadForm />
        <VideoSection />
      </div>
    </>
  );
}
