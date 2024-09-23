import uniqid from "uniqid";
import { createClient } from "@deepgram/sdk";
import transcriptionResults from "@/app/transcriptionStore";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  // Ensure the file exists
  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  // Get file properties
  const { name, type } = file;
  const data = await file.arrayBuffer();

  const id = uniqid();
  const ext = name.slice(name.lastIndexOf("."));
  const newName = id + ext;

  // Create a Deepgram client using the API key
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  try {
    // Call the transcribeFile method with the audio payload
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(data, {
      model: "nova-2",
      smart_format: true,
      mimetype: type, // Add MIME type for correct handling
    });

    if (error) throw error;
    // console.log(result);

    transcriptionResults[newName] = result.results;

    // console.log(`Stored transcription results for ${newName}:`, transcriptionResults);

    // Return the transcription results
    return new Response(JSON.stringify({ name, id, ext, newName, results: result.results }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Error during transcription: " + error.message, { status: 500 });
  }
}
