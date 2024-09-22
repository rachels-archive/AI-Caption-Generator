"use client";
import axios from "axios";
import { useEffect } from "react";

export default function FilePage({ params }) {
  const fileName = params.filename;
  useEffect(() => {
    axios.get("api/transcribe?filename" + fileName);
  }, [fileName]);
  return <div>{fileName}</div>;
}
