import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Lightbulb } from "lucide-react";
import { useState } from "react";

interface EmailFeedbackProps {
  onFeedbackSelected: (feeling: string) => void;
  onHumanize: () => void;
  isHumanizing: boolean;
  blandPhrasesFound?: string[];
}

const STORY_ANGLE_SUGGESTIONS = [
  "Start with a specific mistake you made (with dollar amounts or real consequences)",
  "Share something weird you noticed that everyone else misses",
  "Drop an uncomfortable truth they're avoiding",
  "Tell them about your 2AM realization that changed everything",
  "Describe a conversation you overheard that made you realize something",
];

export function EmailFeedback({ 
  onFeedbackSelected, 
  onHumanize, 
  isHumanizing,
  blandPhrasesFound = []
}: EmailFeedbackProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelection = (value: string) => {
    setSelectedFeeling(value);
    setShowSuggestions(value === "nothing");
    onFeedbackSelected(value);
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-3">Quick Gut Check</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Reading this email, I felt:
        </p>

        <RadioGroup value={selectedFeeling} onValueChange={handleSelection}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nothing" id="nothing" />
              <Label htmlFor="nothing" className="font-normal cursor-pointer">
                Nothing - sounds like marketing
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="curious" id="curious" />
              <Label htmlFor="curious" className="font-normal cursor-pointer">
                Curious - wanted to keep reading
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="connected" id="connected" />
              <Label htmlFor="connected" className="font-normal cursor-pointer">
                Connected - they get me
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="emotional" id="emotional" />
              <Label htmlFor="emotional" className="font-normal cursor-pointer">
                Emotional - hit me in the feels
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compelled" id="compelled" />
              <Label htmlFor="compelled" className="font-normal cursor-pointer">
                Compelled - I'd take action
              </Label>
            </div>
          </div>
        </RadioGroup>

        {showSuggestions && (
          <div className="mt-6 space-y-4">
            <Alert className="border-red-600 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-bold text-red-900 dark:text-red-100 text-base">
                    ⚠️ This won't convert. Let's fix it.
                  </p>
                  
                  {blandPhrasesFound.length > 0 && (
                    <div className="mt-3">
                      <p className="text-red-800 dark:text-red-200 font-semibold text-sm mb-2">
                        Generic phrases detected:
                      </p>
                      <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                        {blandPhrasesFound.slice(0, 3).map((phrase, idx) => (
                          <li key={idx}>"{phrase}"</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-red-800 dark:text-red-200 font-semibold text-sm mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Try these story angles instead:
                    </p>
                    <ul className="space-y-2">
                      {STORY_ANGLE_SUGGESTIONS.map((suggestion, idx) => (
                        <li key={idx} className="text-red-700 dark:text-red-300 text-sm pl-4 border-l-2 border-red-300">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={onHumanize}
                    variant="destructive"
                    size="lg"
                    disabled={isHumanizing}
                    className="w-full mt-4"
                  >
                    {isHumanizing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Making It Human...
                      </>
                    ) : (
                      "Regenerate with More Personality"
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {selectedFeeling && selectedFeeling !== "nothing" && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✓ Great! This email is hitting the right notes. {selectedFeeling === "compelled" && "That's the emotional connection we're looking for."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
