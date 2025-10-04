import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Info } from "lucide-react";
import { COPY_FRAMEWORKS } from "@/lib/frameworks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FrameworkDisplayProps {
  frameworkId: string;
  frameworkName?: string;
}

export function FrameworkDisplay({ frameworkId, frameworkName }: FrameworkDisplayProps) {
  const framework = COPY_FRAMEWORKS[frameworkId];
  
  if (!framework) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Copywriting Framework</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{framework.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Framework Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-sm">
            {framework.acronym}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {framework.name}
          </span>
        </div>

        {/* Structure */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Email Structure:</h4>
          <ol className="text-sm space-y-2 ml-4">
            {framework.structure.map((step, index) => (
              <li key={index} className="list-decimal">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Best For */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Best For:</h4>
          <div className="flex flex-wrap gap-2">
            {framework.bestFor.map((use, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {use}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
