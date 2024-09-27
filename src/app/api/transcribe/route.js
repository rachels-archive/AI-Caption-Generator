import transcriptionResults from "@/app/transcriptionStore";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get("filename");
  let results = transcriptionResults[filename];

  // if results not found locally
  if (!results) {
    try {
      const transcriptionRef = ref(storage, `transcriptions/${filename}.json`);
      const url = await getDownloadURL(transcriptionRef);

      // Fetch the transcription JSON from the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch transcription from Firebase");
      }

      results = await response.json();
      // Optionally cache the results locally
      transcriptionResults[filename] = results;
    } catch (error) {
      console.error("Error retrieving transcription:", error);
      return new Response(JSON.stringify({ error: "Transcription not found." }), { status: 404 });
    }
  }

  /*
  if (!results) {
    return new Response(JSON.stringify({ error: "Transcription not found." }), { status: 404 });
  }*/
  const words = results.results.channels[0].alternatives[0].words;
  return Response.json(words);
}
