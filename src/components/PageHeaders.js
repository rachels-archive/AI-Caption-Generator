export default function PageHeader({ h1 = "Add captions to your videos in ONE click!", h2 = "Powered by AI" }) {
  return (
    <section className="text-center mt-16 mb-8">
      <h1 className="text-3xl mb-3">{h1}</h1>
      <h2 className="text-xl">{h2}</h2>
    </section>
  );
}
