"use client";
import axios from "axios";
import UploadIcon from "./UploadIcon";
import { useState } from "react";

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);

  async function upload(e) {
    e.preventDefault();
    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      const res = await axios.postForm("/api/upload", {
        file,
      });
      setIsUploading(false);
      console.log(res.data);
    }
  }

  return (
    <label className="bg-orange-500 py-3 px-6 rounded-full inline-flex gap-2 hover:bg-orange-600 cursor-pointer">
      <UploadIcon />
      <span>Choose File</span>
      <input type="file" className="hidden" onChange={upload} />
    </label>
  );
}
