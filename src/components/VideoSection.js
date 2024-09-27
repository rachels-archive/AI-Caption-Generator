import ArrowIcon from "./ArrowIcon";

export default function VideoSection() {
  return (
    <section className="flex justify-around mt-12 items-center">
      <div className="hidden sm:block bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
      <div className="hidden sm:block">
        <ArrowIcon />
      </div>
      <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
    </section>
  );
}
