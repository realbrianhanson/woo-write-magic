import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  XCircle,
  Sparkles
} from "lucide-react";
import type { CritiqueResult, CritiqueIssue } from "@/lib/critique";

interface CritiquePanelProps {
  result: CritiqueResult;
  onApplyFixes: () => void;
  isApplyingFixes: boolean;
}

function getIssueIcon(severity: CritiqueIssue["severity"]) {
  switch (severity) {
    case "error":
      return <XCircle className="h-5 w-5 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBadge(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

export function CritiquePanel({ result, onApplyFixes, isApplyingFixes }: CritiquePanelProps) {
  const hasIssues = result.issues.length > 0;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Email Critique
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}
              </div>
              <div className="text-xs text-muted-foreground">
                {getScoreBadge(result.score)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {result.bannedWords.length}
            </div>
            <div className="text-xs text-muted-foreground">Banned Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {result.gradeLevel}th
            </div>
            <div className="text-xs text-muted-foreground">Grade Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {result.youYourRatio}%
            </div>
            <div className="text-xs text-muted-foreground">Reader-Focused</div>
          </div>
        </div>

        {/* Issues List */}
        {hasIssues ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Issues Found ({result.issues.length})
              </h3>
              <Button
                onClick={onApplyFixes}
                disabled={isApplyingFixes}
                className="gap-2"
              >
                {isApplyingFixes ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Applying Fixes...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Apply All Fixes
                  </>
                )}
              </Button>
            </div>

            {result.issues.map((issue, index) => (
              <Alert
                key={index}
                className={
                  issue.severity === "error"
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : issue.severity === "warning"
                    ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                    : "border-blue-500 bg-blue-50 dark:bg-blue-950"
                }
              >
                <div className="flex gap-3">
                  {getIssueIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{issue.title}</h4>
                        <p className="text-sm mt-1">{issue.description}</p>
                      </div>
                      {issue.count && (
                        <Badge
                          variant={issue.severity === "error" ? "destructive" : "secondary"}
                          className="ml-2 shrink-0"
                        >
                          {issue.count}
                        </Badge>
                      )}
                    </div>
                    
                    {issue.details && (
                      <div className="mt-2 p-2 bg-background rounded text-xs font-mono">
                        {issue.details}
                      </div>
                    )}
                    
                    {issue.suggestions && issue.suggestions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-semibold">How to fix:</p>
                        <ul className="text-xs space-y-1 ml-4">
                          {issue.suggestions.map((suggestion, i) => (
                            <li key={i} className="list-disc">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        ) : (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Excellent!</strong> No major issues detected. This email follows best practices.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
