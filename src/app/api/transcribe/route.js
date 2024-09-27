import transcriptionResults from "@/app/transcriptionStore";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get("filename");

  let results = transcriptionResults[filename];

  // if results is not cached, retrieve it from Firebase Cloud Storage
  if (!results) {
    try {
      const transcriptionRef = ref(storage, `transcriptions/${filename}.json`);
      const downloadUrl = await getDownloadURL(transcriptionRef);
      console.log("Fetching transcription from URL:", downloadUrl);

      const response = await fetch(downloadUrl);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch transcription: ${response.status} ${response.statusText}`);
      }

      results = await response.json();
      console.log("Fetched transcription results:", JSON.stringify(results, null, 2));
      transcriptionResults[filename] = results; // Cache locally
    } catch (error) {
      console.error("Error retrieving transcription:", error);
      return new Response(JSON.stringify({ error: "Transcription not found." }), { status: 404 });
    }
  }

  const captions = results.captions.results.channels[0].alternatives[0].words;
  return Response.json({ captions });
}
