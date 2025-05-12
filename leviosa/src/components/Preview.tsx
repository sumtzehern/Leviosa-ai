import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { PdfViewer } from "./PdfViewer";
import PdfViewerClient from "./PdfViewverClient";

interface PreviewProps {
  url: string;
}

export default function Preview({ url }: PreviewProps) {
  // console.log("Preview rendering with URL:", url);
  
  return (
    <div className="flex h-screen p-2">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full mt-4 overflow-hidden gap-4"
      >
        {/* Left: PDF preview with border */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full w-full rounded-xl border border-border bg-muted overflow-hidden">
            <div className="h-full overflow-y-auto p-4">
              {/* Test both rendering options */}
              {/* Option 1: Direct iframe */}
              <iframe 
                src={url} 
                className="w-full h-full min-h-[600px]" 
                title="PDF Preview"
              />
              
              {/* Option 2: Your PdfViewer */}
              {/* <PdfViewerClient url={url} /> */}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right panel remains the same */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full w-full rounded-xl border border-border bg-background overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
              <h2 className="text-xl font-medium mb-2">PDF URL:</h2>
              <p className="font-mono text-sm break-all bg-muted p-2 rounded">{url}</p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}