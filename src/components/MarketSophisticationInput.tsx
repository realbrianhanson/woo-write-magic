import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MarketSophisticationInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MARKET_STAGES = [
  {
    value: "virgin",
    label: "Virgin Market (We're First)",
    description: "New category with no competitors. Use direct, simple claims.",
  },
  {
    value: "early",
    label: "Early Market (1-3 Competitors)",
    description: "Claims still work, amplify with specifics and bigger numbers.",
  },
  {
    value: "saturated",
    label: "Saturated Market (5-10+ Competitors)",
    description: "Need a unique mechanism/HOW. Show why old methods fail.",
  },
  {
    value: "mechanism-wars",
    label: "Mechanism Wars (Everyone has secrets)",
    description: "Your mechanism must be easier, faster, or more proven.",
  },
  {
    value: "dead",
    label: "Dead Market (Nothing works)",
    description: "Focus on identity, tribe, and transformation, not product.",
  },
];

export function MarketSophisticationInput({
  value,
  onChange,
}: MarketSophisticationInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Market Sophistication</Label>
        <p className="text-sm text-muted-foreground mt-1">
          How competitive is your market? This changes your entire messaging strategy.
        </p>
      </div>
      
      <RadioGroup value={value} onValueChange={onChange}>
        {MARKET_STAGES.map((stage) => (
          <div key={stage.value} className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value={stage.value} id={stage.value} className="mt-1" />
            <div className="space-y-1 flex-1">
              <Label
                htmlFor={stage.value}
                className="font-medium cursor-pointer"
              >
                {stage.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {stage.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
