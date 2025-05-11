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
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("http://localhost:8000/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (data.uploaded && data.uploaded[0]) {
        // Get the URL to the PDF from the FastAPI backend
        const fileUrl = `http://localhost:8000/uploads/${data.uploaded[0].stored_name}`;
        setPdfUrl(fileUrl);
        console.log("PDF available at:", fileUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
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