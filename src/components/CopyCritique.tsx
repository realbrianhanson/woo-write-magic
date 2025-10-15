import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

interface CopyCritiqueProps {
  critique: {
    readability_score?: number;
    spam_triggers?: string[];
    curiosity_gaps?: string[];
    weak_points?: string[];
    strengths?: string[];
    improvement_suggestions?: string[];
  };
}

export function CopyCritique({ critique }: CopyCritiqueProps) {
  if (!critique || Object.keys(critique).length === 0) return null;

  const getReadabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Copy Critique
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pre-send analysis to catch issues before they tank your open rates
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {critique.readability_score !== undefined && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Readability Score</h4>
            <div className={`text-3xl font-bold ${getReadabilityColor(critique.readability_score)}`}>
              {critique.readability_score}/100
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {critique.readability_score >= 80 ? "Excellent - Easy to read" : 
               critique.readability_score >= 60 ? "Good - Could be simpler" : 
               "Needs work - Too complex"}
            </p>
          </div>
        )}

        {critique.strengths && critique.strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {critique.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {critique.weak_points && critique.weak_points.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <h4 className="font-semibold mb-2">Weak Points</h4>
              <ul className="space-y-1">
                {critique.weak_points.map((point, i) => (
                  <li key={i} className="text-sm">{point}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {critique.spam_triggers && critique.spam_triggers.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Spam Trigger Words Detected
            </h4>
            <div className="flex flex-wrap gap-2">
              {critique.spam_triggers.map((word, i) => (
                <Badge key={i} variant="destructive" className="text-xs">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {critique.curiosity_gaps && critique.curiosity_gaps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Curiosity Gaps
            </h4>
            <ul className="space-y-1">
              {critique.curiosity_gaps.map((gap, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {gap}</li>
              ))}
            </ul>
          </div>
        )}

        {critique.improvement_suggestions && critique.improvement_suggestions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Improvement Suggestions</h4>
            <ul className="space-y-2">
              {critique.improvement_suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-blue-800 dark:text-blue-200">→ {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}