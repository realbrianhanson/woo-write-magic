import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, TrendingUp, Heart, Zap, AlertCircle } from "lucide-react";

interface SubjectLineVariantsProps {
  variants: Array<{
    category: string;
    subject: string;
    character_count: number;
    predicted_performance: string;
  }>;
}

export function SubjectLineVariants({ variants }: SubjectLineVariantsProps) {
  if (!variants || variants.length === 0) return null;

  const categoryIcons = {
    curiosity: Zap,
    benefit: TrendingUp,
    fear: AlertCircle,
    social_proof: Heart,
    urgency: AlertCircle,
  };

  const performanceColors = {
    high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          10 Subject Line Variants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Categorized by strategy with predicted performance
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {variants.map((variant, index) => {
            const Icon = categoryIcons[variant.category as keyof typeof categoryIcons] || Mail;
            return (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        {variant.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {variant.character_count} chars
                      </span>
                      <Badge
                        className={
                          performanceColors[
                            variant.predicted_performance as keyof typeof performanceColors
                          ] || performanceColors.medium
                        }
                      >
                        {variant.predicted_performance} predicted
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{variant.subject}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}