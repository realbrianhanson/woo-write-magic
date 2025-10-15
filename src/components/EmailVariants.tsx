import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Shield, TrendingUp } from "lucide-react";

interface EmailVariantsProps {
  variants: Array<{
    type: string;
    subject_lines: string[];
    body: string;
    ctas: string[];
  }>;
}

export function EmailVariants({ variants }: EmailVariantsProps) {
  if (!variants || variants.length === 0) return null;

  const variantIcons = {
    safe: Shield,
    aggressive: Zap,
    pattern_interrupt: TrendingUp,
  };

  const variantLabels = {
    safe: "Safe/Proven",
    aggressive: "Aggressive/Polarizing",
    pattern_interrupt: "Pattern Interrupt",
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          3 Copy Variants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Different approaches for the same goal. Test to see what resonates.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="safe" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {variants.map((variant, index) => {
              const Icon = variantIcons[variant.type as keyof typeof variantIcons] || Shield;
              return (
                <TabsTrigger key={index} value={variant.type}>
                  <Icon className="h-4 w-4 mr-2" />
                  {variantLabels[variant.type as keyof typeof variantLabels] || variant.type}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {variants.map((variant, index) => (
            <TabsContent key={index} value={variant.type} className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Subject Lines</h4>
                <div className="space-y-2">
                  {variant.subject_lines.map((subject, i) => (
                    <div key={i} className="p-2 bg-muted rounded text-sm">
                      {subject}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Email Body</h4>
                <div className="p-4 bg-muted rounded whitespace-pre-wrap text-sm">
                  {variant.body}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">CTAs</h4>
                <div className="space-y-2">
                  {variant.ctas.map((cta, i) => (
                    <Badge key={i} variant="outline">
                      {cta}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}