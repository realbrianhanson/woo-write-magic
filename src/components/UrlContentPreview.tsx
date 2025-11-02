import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface UrlContentPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  content: string;
  metadata?: {
    title?: string;
    description?: string;
  };
  onApprove: (editedContent: string) => void;
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
  const [editedContent, setEditedContent] = useState(content);
  
  useEffect(() => {
    setEditedContent(content);
  }, [content]);
  
  const wordCount = editedContent.split(/\s+/).filter(Boolean).length;
  const charCount = editedContent.length;
  
  const handleApprove = () => {
    onApprove(editedContent);
  };

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
            <h4 className="text-sm font-semibold mb-2">Extracted Content (editable)</h4>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 min-h-[300px] font-mono text-sm resize-none"
              placeholder="Edit the extracted content..."
            />
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleApprove}>
            Use This Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
