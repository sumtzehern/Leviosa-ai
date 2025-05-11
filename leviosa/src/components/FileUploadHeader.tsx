'use client'

import { useRef, useState } from "react";
import { Upload, Settings, Check } from "lucide-react";

export function FileUploadHeader({ onFileUpload }: { onFileUpload: (file: File) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Update files state to show the selected file count
      setFiles(e.target.files ? Array.from(e.target.files) : []);
      // Pass the file to parent component
      onFileUpload(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-4 rounded-xl border border-border bg-popover p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={handleButtonClick}
          className="cursor-pointer flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Choose File
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          className="hidden"
        />

        {files.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </div>
        )}
      </div>

      <button className="cursor-pointer flex items-center gap-2 text-primary font-medium hover:underline">
        <Settings className="h-4 w-4" />
        Configure Options
      </button>
    </div>
  );
}