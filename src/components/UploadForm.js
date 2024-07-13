"use client";
import UploadIcon from "./UploadIcon";

export default function UploadForm() {
  async function upload(e) {
    e.preventDefault();
    const files = e.target.files;

    if (files.length > 0) {
      const file = files[0];
      const res = await axios.postForm("/api/upload", {
        file,
      });

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
