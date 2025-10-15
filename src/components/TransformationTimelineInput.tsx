import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp } from "lucide-react";

interface TransformationTimelineInputProps {
  value: {
    time_to_first_results: string;
    specific_metrics: string;
    progression: string;
  };
  onChange: (value: {
    time_to_first_results: string;
    specific_metrics: string;
    progression: string;
  }) => void;
}

export function TransformationTimelineInput({ value, onChange }: TransformationTimelineInputProps) {
  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Transformation Timeline
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Specific, believable progression from start to results
          </p>
        </div>

        <div>
          <Label htmlFor="time-to-results" className="text-sm font-medium">
            Time to First Results
          </Label>
          <Textarea
            id="time-to-results"
            value={value.time_to_first_results}
            onChange={(e) => onChange({ ...value, time_to_first_results: e.target.value })}
            placeholder="How long until they see something happen? (e.g., 'First email goes out Day 1, first sale within 7 days')"
            rows={2}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="specific-metrics" className="text-sm font-medium">
            Specific Before/After Metrics
          </Label>
          <Textarea
            id="specific-metrics"
            value={value.specific_metrics}
            onChange={(e) => onChange({ ...value, specific_metrics: e.target.value })}
            placeholder="Real numbers they can picture (e.g., 'From 2% to 8% conversion rate, $4K to $15K per month')"
            rows={2}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="progression" className="text-sm font-medium">
            Week-by-Week Progression
          </Label>
          <Textarea
            id="progression"
            value={value.progression}
            onChange={(e) => onChange({ ...value, progression: e.target.value })}
            placeholder="What happens when? (e.g., 'Week 1: Setup, Week 2: First campaign, Week 3: Optimize, Week 4: Scale')"
            rows={3}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}