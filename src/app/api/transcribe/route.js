import transcriptionResults from "@/app/transcriptionStore";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get("filename");

  let results = transcriptionResults[filename];

  // If results are not cached, retrieve it from Firebase Cloud Storage
  if (!results) {
    try {
      const transcriptionRef = ref(storage, `transcriptions/${filename}.json`);
      console.log("Transcription reference:", transcriptionRef.fullPath); // Log full path

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

  // Check if the structure is valid for newly uploaded transcriptions
  if (
    results &&
    results.results &&
    Array.isArray(results.results.channels) &&
    results.results.channels.length > 0 &&
    Array.isArray(results.results.channels[0].alternatives) &&
    results.results.channels[0].alternatives.length > 0
  ) {
    // First-time upload structure
    const words = results.results.channels[0].alternatives[0].words;
    return Response.json({ captions: words }); // Return only captions
  }
  // Check if the structure is valid for reloaded transcriptions
  else if (
    results &&
    Array.isArray(results.captions) && // Check if captions is an array for reloaded data
    results.captions.length > 0 // Ensure there is at least one caption
  ) {
    // Reloaded structure
    return Response.json({ captions: results.captions }); // Return only captions
  } else {
    console.error("Invalid transcription structure:", JSON.stringify(results, null, 2));
    return new Response(JSON.stringify({ error: "Invalid transcription data structure." }), { status: 500 });
  }
}
