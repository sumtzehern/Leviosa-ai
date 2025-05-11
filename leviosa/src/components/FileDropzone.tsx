'use client'

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export function FileDropzone({ onFileUpload }: { onFileUpload: (file: File) => void }) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': [],
      'image/*': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
    maxSize: 1024 * 1024 * 1024, // 1 GB
    multiple: true,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
    {...getRootProps()}
    className={`w-full mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors min-h-[300px]
      ${isDragActive 
        ? "border-primary bg-secondary" 
        : "border-muted-foreground/25 bg-muted"
      }
      hover:border-primary/50`}
    style={{
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderSpacing: '4px',
    }}
  >
      <input {...getInputProps()} />
      <Upload className="h-6 w-6 mb-2 text-primary" />
      <p className="font-medium text-lg">Choose files or drag and drop</p>
      <p className="text-muted-foreground text-sm">PDF, Image, Office File (1GB)</p>
    </div>
  );
}
