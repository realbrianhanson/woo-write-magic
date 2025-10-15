import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ObjectionsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ObjectionsInput({ value, onChange }: ObjectionsInputProps) {
  const [newObjection, setNewObjection] = useState("");

  const addObjection = () => {
    if (newObjection.trim() && value.length < 5) {
      onChange([...value, newObjection.trim()]);
      setNewObjection("");
    }
  };

  const removeObjection = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            Specific Objections
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            What are the top 3-5 reasons people don't buy? Use their exact words.
          </p>
        </div>

        <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
            Objections are your roadmap. Address them = more sales.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          {value.map((objection, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={objection}
                onChange={(e) => {
                  const updated = [...value];
                  updated[index] = e.target.value;
                  onChange(updated);
                }}
                placeholder={`Objection ${index + 1}: "I don't have time for this..."`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeObjection(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {value.length < 5 && (
            <div className="flex gap-2">
              <Input
                value={newObjection}
                onChange={(e) => setNewObjection(e.target.value)}
                placeholder={`Add objection ${value.length + 1}...`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addObjection();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addObjection}
                disabled={!newObjection.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Examples of good objections:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>"I've tried this before and it didn't work"</li>
            <li>"This seems too expensive for what it is"</li>
            <li>"I don't have the time to implement this right now"</li>
            <li>"How do I know this will work for MY specific situation?"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}