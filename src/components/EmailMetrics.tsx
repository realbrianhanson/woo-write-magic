import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { ReadabilityMetrics } from "@/lib/readability";

interface EmailMetricsProps {
  metrics: ReadabilityMetrics;
}

export function EmailMetrics({ metrics }: EmailMetricsProps) {
  const hasHighGradeLevel = metrics.gradeLevel > 8;
  const hasLongSentences = metrics.avgSentenceLength > 20;
  const hasLongParagraphs = metrics.longParagraphCount > 0;

  return (
    <div className="space-y-4">
      {/* Metrics Display */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Grade Level</div>
          <Badge 
            variant={hasHighGradeLevel ? "destructive" : "secondary"}
            className="text-lg px-3 py-1"
          >
            {metrics.gradeLevel}th
          </Badge>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Avg Paragraph</div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {metrics.avgParagraphLength} sentences
          </Badge>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Avg Sentence</div>
          <Badge 
            variant={hasLongSentences ? "outline" : "secondary"}
            className="text-lg px-3 py-1"
          >
            {metrics.avgSentenceLength} words
          </Badge>
        </div>
      </div>

      {/* Warnings */}
      {hasHighGradeLevel && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Reading level is too high. Aim for 6-8th grade for best engagement.
          </AlertDescription>
        </Alert>
      )}

      {hasLongParagraphs && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {metrics.longParagraphCount} paragraph{metrics.longParagraphCount > 1 ? 's' : ''} exceed 4 sentences. Break them up for better readability.
          </AlertDescription>
        </Alert>
      )}

      {hasLongSentences && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Sentences average {metrics.avgSentenceLength} words. Aim for under 20 words per sentence.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
