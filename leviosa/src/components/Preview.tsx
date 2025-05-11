// app/page.tsx or wherever you build the full view

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { PdfViewer } from "@/components/PdfViewer";

interface PreviewProps {
    url: string;
  }

export default function Preview({ url }: PreviewProps) {
  return (
    <div className="flex h-screen p-2">
      {/* Main content area */}
        {/* Bottom split view */}
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full mt-4 overflow-hidden gap-4"
        >
          {/* Left: PDF preview with border */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full w-full rounded-xl border border-border bg-muted overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                {/* Insert your PDF preview canvas or image */}
                <PdfViewer url={url} />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Summary with border */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full w-full rounded-xl border border-border bg-background overflow-hidden">
              <div className="h-full overflow-y-auto p-6">
                {/* Insert your extracted summary */}
                
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}
