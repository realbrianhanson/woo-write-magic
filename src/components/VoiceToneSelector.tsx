import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Mic, Plus, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoiceToneSelectorProps {
  value: string;
  examples: string[];
  onChange: (value: string) => void;
  onExamplesChange: (examples: string[]) => void;
}

const VOICE_PRESETS = [
  { id: "casual-friend", label: "Casual Friend", description: "Like texting a buddy who figured something out" },
  { id: "authority", label: "Authority Figure", description: "Expert sharing proven insights" },
  { id: "edgy-disruptor", label: "Edgy Disruptor", description: "Calling out BS and challenging norms" },
  { id: "empathetic-coach", label: "Empathetic Coach", description: "Understanding their struggle, guiding them forward" },
  { id: "data-driven", label: "Data-Driven", description: "Numbers, proof, and logical reasoning" },
];

export function VoiceToneSelector({ value, examples, onChange, onExamplesChange }: VoiceToneSelectorProps) {
  const [newExample, setNewExample] = useState("");

  const addExample = () => {
    if (newExample.trim()) {
      onExamplesChange([...examples, newExample.trim()]);
      setNewExample("");
    }
  };

  const removeExample = (index: number) => {
    onExamplesChange(examples.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice & Tone
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Define the personality and style of your emails
          </p>
        </div>

        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            Voice examples are the #1 way to ensure consistent, on-brand copy
          </AlertDescription>
        </Alert>

        <div>
          <Label className="text-sm font-medium mb-2">Select a Voice Preset</Label>
          <RadioGroup value={value} onValueChange={onChange}>
            {VOICE_PRESETS.map((preset) => (
              <div key={preset.id} className="flex items-start space-x-2 p-3 rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={preset.id} id={preset.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={preset.id} className="font-medium cursor-pointer">
                    {preset.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Voice Examples (Recommended: 2-3 emails in your desired style)
          </Label>
          
          {examples.map((example, index) => (
            <div key={index} className="relative">
              <Textarea
                value={example}
                onChange={(e) => {
                  const updated = [...examples];
                  updated[index] = e.target.value;
                  onExamplesChange(updated);
                }}
                className="pr-10 font-mono text-sm"
                rows={4}
                placeholder="Paste an email that matches the voice you want..."
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExample(index)}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Textarea
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Add another voice example..."
              rows={3}
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addExample}
              disabled={!newExample.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">💡 Pro tip:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Paste actual emails that performed well</li>
            <li>Include subject lines in your examples</li>
            <li>The more examples, the better the AI matches your voice</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}