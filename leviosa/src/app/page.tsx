'use client'

import { useState } from "react";
import { FileUploadHeader } from "@/components/FileUploadHeader";
import { FileDropzone } from "@/components/FileDropzone";
import Preview from '@/components/Preview'

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file); // or "files[]" if multiple later
  
      const res = await fetch("http://localhost:8000/api/parse", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      const s3Url = data?.uploaded?.[0]?.s3_url;
  
      if (s3Url) {
        setPdfUrl(s3Url); // or send to PdfViewer component
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };
  

  return (
    <div className="w-full py-8 px-4 flex flex-col items-stretch">
      <FileUploadHeader onFileUpload={handleFileUpload} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Uploading file...</p>
        </div>
      ) : pdfUrl ? (
        <Preview url={pdfUrl} />
      ) : (
        <FileDropzone onFileUpload={handleFileUpload} />
      )}
    </div>
  );
}