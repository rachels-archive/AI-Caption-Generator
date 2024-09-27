import { createClient } from "@deepgram/sdk";
import { uploadFile } from "@/libs/storage";
import transcriptionResults from "@/app/transcriptionStore";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, type } = file;
    const data = await file.arrayBuffer();

    // Upload video to Firebase
    const folder = "/videos/";

    const uploadedPath = await uploadFile(file, folder);
    const newName = uploadedPath.split("/").pop();

    // Create a Deepgram client using the API key
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(data, {
      model: "nova-2",
      smart_format: true,
      mimetype: type,
    });

    if (error) {
      return new Response(JSON.stringify({ error: "Error during transcription: " + error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    transcriptionResults[newName] = result;

    return new Response(JSON.stringify({ name, newName, results: result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in upload handler:", error);
    return new Response(JSON.stringify({ error: "Server error: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
