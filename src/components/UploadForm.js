"use client";
import axios from "axios";
import UploadIcon from "./UploadIcon";
import { useState, useRef } from "react";
import "../app/globals.css";
import { useRouter } from "next/navigation";

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  async function upload(e) {
    e.preventDefault();
    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);

      const validTypes = ["video/mp4", "video/ogg", "video/webm"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a video.");
        setIsUploading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        });

        if (res.status === 200) {
          router.push("./" + res.data.newName);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed! Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  }

  return (
    <>
      {isUploading && (
        <div className="bg-black/90 text-white fixed inset-0 flex items-center justify-center">
          <div>
            <h2 className="text-4xl mb-2 loader"></h2>
          </div>
        </div>
      )}
      <label className="bg-orange-500 py-3 px-6 rounded-full inline-flex gap-2 hover:bg-orange-600 cursor-pointer">
        <UploadIcon />
        <span>Choose File</span>
        <input type="file" className="hidden" onChange={upload} />
      </label>
    </>
  );
}
