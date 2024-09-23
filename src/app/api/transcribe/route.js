import transcriptionResults from "@/app/transcriptionStore";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get("filename");
  const results = transcriptionResults[filename];
  const words = results.channels[0].alternatives[0].words;
  console.log(words);

  return Response.json(words);
}
