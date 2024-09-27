import transcriptionResults from "@/app/transcriptionStore";
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get("filename");
  const results = transcriptionResults[filename];

  if (!results) {
    return new Response(JSON.stringify({ error: "Transcription not found." }), { status: 404 });
  }

  const words = results.results.channels[0].alternatives[0].words;
  return Response.json(words);
}
