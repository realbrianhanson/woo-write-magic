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
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ParagraphComparison {
  original: string;
  formatted: string;
  sentenceCount: number;
}

interface ParagraphPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comparisons: ParagraphComparison[];
  onApprove: () => void;
  onCancel: () => void;
}

export function ParagraphPreviewDialog({
  open,
  onOpenChange,
  comparisons,
  onApprove,
  onCancel,
}: ParagraphPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Auto-Format Preview</DialogTitle>
          <DialogDescription>
            Review the proposed paragraph breaks. Long paragraphs will be split into shorter, more readable ones.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {comparisons.map((comparison, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Paragraph {index + 1}</Badge>
                  <Badge variant="secondary">
                    {comparison.sentenceCount} sentences
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase">
                      Before
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {comparison.original}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {/* After */}
                  <div className="space-y-2 md:col-start-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase">
                      After
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {comparison.formatted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onApprove}>
            Apply Formatting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
