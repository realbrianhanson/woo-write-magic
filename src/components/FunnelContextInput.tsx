import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Filter } from "lucide-react";

interface FunnelContextInputProps {
  value: {
    traffic_temperature: string;
    funnel_stage: string;
    sequence_position_context: string;
  };
  onChange: (value: {
    traffic_temperature: string;
    funnel_stage: string;
    sequence_position_context: string;
  }) => void;
}

export function FunnelContextInput({ value, onChange }: FunnelContextInputProps) {
  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4 text-orange-600" />
            Funnel Context
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Where are they in the journey?
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2">Traffic Temperature</Label>
          <RadioGroup
            value={value.traffic_temperature}
            onValueChange={(val) => onChange({ ...value, traffic_temperature: val })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cold" id="cold" />
              <Label htmlFor="cold" className="font-normal cursor-pointer">
                Cold (Never heard of you)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="warm" id="warm" />
              <Label htmlFor="warm" className="font-normal cursor-pointer">
                Warm (Aware of you, not convinced yet)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hot" id="hot" />
              <Label htmlFor="hot" className="font-normal cursor-pointer">
                Hot (Ready to buy, just needs push)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2">Funnel Stage</Label>
          <RadioGroup
            value={value.funnel_stage}
            onValueChange={(val) => onChange({ ...value, funnel_stage: val })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="awareness" id="awareness" />
              <Label htmlFor="awareness" className="font-normal cursor-pointer">
                Awareness (Problem-focused)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="consideration" id="consideration" />
              <Label htmlFor="consideration" className="font-normal cursor-pointer">
                Consideration (Solution-focused)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="decision" id="decision" />
              <Label htmlFor="decision" className="font-normal cursor-pointer">
                Decision (Offer-focused)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="sequence-context" className="text-sm font-medium">
            Sequence Context (Optional)
          </Label>
          <Textarea
            id="sequence-context"
            value={value.sequence_position_context}
            onChange={(e) => onChange({ ...value, sequence_position_context: e.target.value })}
            placeholder="What happened in previous emails? What's coming next? (e.g., 'Email 1 introduced the problem, Email 2 agitated it, this one presents the solution')"
            rows={3}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}