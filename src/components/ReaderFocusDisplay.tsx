import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, RefreshCw } from "lucide-react";
import type { ReaderFocusMetrics } from "@/lib/readerFocus";
import { getReaderFocusRating } from "@/lib/readerFocus";

interface ReaderFocusDisplayProps {
  metrics: ReaderFocusMetrics;
  onIncreaseReaderFocus?: () => void;
  isIncreasing?: boolean;
}

export function ReaderFocusDisplay({ 
  metrics, 
  onIncreaseReaderFocus,
  isIncreasing = false 
}: ReaderFocusDisplayProps) {
  const rating = getReaderFocusRating(metrics.ratio);
  const needsImprovement = metrics.ratio < 60;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Reader Focus Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Metric */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`text-4xl font-bold ${rating.color}`}>
              {metrics.ratio}%
            </span>
            <Badge 
              variant={needsImprovement ? "destructive" : "secondary"}
              className="text-sm"
            >
              {rating.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Reader-Focused Ratio
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {metrics.readerWords}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              "You/Your"
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {metrics.writerWords}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              "We/I/Me"
            </div>
          </div>
        </div>

        {/* Warning */}
        {needsImprovement && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <strong>Email is too self-focused.</strong>
                  <br />
                  <span className="text-sm">
                    Shift language to focus on reader benefits using more "you" and "your".
                  </span>
                </div>
                {onIncreaseReaderFocus && (
                  <Button
                    onClick={onIncreaseReaderFocus}
                    variant="outline"
                    size="sm"
                    disabled={isIncreasing}
                    className="shrink-0"
                  >
                    {isIncreasing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Fixing...
                      </>
                    ) : (
                      "Increase Reader Focus"
                    )}
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Best Practices:</p>
          <ul className="ml-4 space-y-1">
            <li>• Aim for 70%+ reader-focused language</li>
            <li>• Replace "we/our" with "you/your" when possible</li>
            <li>• Focus on benefits to them, not features of your product</li>
            <li>• Make it about their transformation, not your business</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
