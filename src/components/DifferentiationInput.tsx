import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TextareaWithVoice } from "@/components/ui/textarea-with-voice";
import { Target } from "lucide-react";

interface DifferentiationInputProps {
  value: {
    unfair_advantage: string;
    vs_competitors: string;
    category_position: string;
  };
  onChange: (value: {
    unfair_advantage: string;
    vs_competitors: string;
    category_position: string;
  }) => void;
}

export function DifferentiationInput({ value, onChange }: DifferentiationInputProps) {
  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" />
            Differentiation & Positioning
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Why you vs. everyone else?
          </p>
        </div>

        <div>
          <Label htmlFor="unfair-advantage" className="text-sm font-medium">
            Your Unfair Advantage
          </Label>
          <TextareaWithVoice
            id="unfair-advantage"
            value={value.unfair_advantage}
            onChange={(e) => onChange({ ...value, unfair_advantage: e.target.value })}
            placeholder="What can you do that competitors can't or won't? (e.g., 'We've sent 47M emails, tested everything')"
            rows={2}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="vs-competitors" className="text-sm font-medium">
            You vs. Competitors
          </Label>
          <TextareaWithVoice
            id="vs-competitors"
            value={value.vs_competitors}
            onChange={(e) => onChange({ ...value, vs_competitors: e.target.value })}
            placeholder="What do they do wrong? What gaps do they leave? (e.g., 'They focus on templates, we focus on strategy')"
            rows={2}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="category-position" className="text-sm font-medium">
            Category Position
          </Label>
          <TextareaWithVoice
            id="category-position"
            value={value.category_position}
            onChange={(e) => onChange({ ...value, category_position: e.target.value })}
            placeholder="Are you the premium option? The fastest? The most affordable? The contrarian? (e.g., 'Most expensive but highest ROI')"
            rows={2}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}