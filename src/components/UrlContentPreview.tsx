import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface UrlContentPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  content: string;
  metadata?: {
    title?: string;
    description?: string;
  };
  onApprove: () => void;
  onCancel: () => void;
}

export const UrlContentPreview = ({
  open,
  onOpenChange,
  url,
  content,
  metadata,
  onApprove,
  onCancel,
}: UrlContentPreviewProps) => {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>URL Content Preview</DialogTitle>
          <DialogDescription>
            Review the content extracted from the webpage before using it
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">URL</Badge>
              <p className="text-sm text-muted-foreground break-all">{url}</p>
            </div>
            
            {metadata?.title && (
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">Title</Badge>
                <p className="text-sm font-medium">{metadata.title}</p>
              </div>
            )}
            
            {metadata?.description && (
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">Description</Badge>
                <p className="text-sm text-muted-foreground">{metadata.description}</p>
              </div>
            )}

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{wordCount.toLocaleString()} words</span>
              <span>{charCount.toLocaleString()} characters</span>
            </div>
          </div>

          {/* Content Preview */}
          <div className="flex-1 flex flex-col min-h-0">
            <h4 className="text-sm font-semibold mb-2">Extracted Content</h4>
            <ScrollArea className="flex-1 w-full rounded-md border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm font-sans">
                  {content}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onApprove}>
            Use This Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
