"use client";
import axios from "axios";
import UploadIcon from "./UploadIcon";
import { useState } from "react";
import "../styles.css";

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
    <>
      {isUploading && (
        <div className="bg-black/80 text-white fixed inset-0 flex items-center justify-center">
          <div>
            <h2 className="text-4xl mb-2 loader"></h2>
            <h3 className="text-xl">Thank you for your patience &#x1F64F;</h3>
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
