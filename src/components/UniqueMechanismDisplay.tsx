import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface UniqueMechanism {
  nickname: string;
  rootCause: string;
  metaphor: string;
}

interface UniqueMechanismDisplayProps {
  mechanism: UniqueMechanism;
}

export function UniqueMechanismDisplay({ mechanism }: UniqueMechanismDisplayProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          Unique Mechanism
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant="default" className="mb-2">
            {mechanism.nickname}
          </Badge>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Root Cause</h4>
          <p className="text-sm">{mechanism.rootCause}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Metaphor</h4>
          <p className="text-sm italic">{mechanism.metaphor}</p>
        </div>
      </CardContent>
    </Card>
  );
}
