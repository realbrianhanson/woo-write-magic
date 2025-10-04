import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { buildEmailPrompt } from "@/lib/prompts";
import { analyzeReadability } from "@/lib/readability";
import { calculateReaderFocus } from "@/lib/readerFocus";
import { CompetitorCopyInput } from "@/components/CompetitorCopyInput";
import { AudienceReviewsInput } from "@/components/AudienceReviewsInput";

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    audience: "",
    painPoint: "",
    desiredResult: "",
    campaignType: "Product Launch",
    sequenceLength: "5",
    primaryEmotion: "Hope & Transformation",
    useUniqueMechanism: true,
    storyStructure: "surprise",
    competitorCopy: "",
    audienceReviews: "",
  });

  const handleSubmit = async (e: React.FormEvent, simplify: boolean = false) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.id,
          name: formData.productName,
          campaign_type: formData.campaignType,
          settings: formData,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Build AI prompt
      const prompt = buildEmailPrompt(
        {
          productName: formData.productName,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          audience: formData.audience,
          painPoint: formData.painPoint,
          desiredResult: formData.desiredResult,
          campaignType: formData.campaignType,
          primaryEmotion: formData.primaryEmotion,
          sequenceLength: parseInt(formData.sequenceLength),
          useUniqueMechanism: formData.useUniqueMechanism,
          storyStructure: formData.storyStructure,
          competitorCopy: formData.competitorCopy,
          audienceReviews: formData.audienceReviews,
        },
        1,
        parseInt(formData.sequenceLength),
        simplify
      );

      // Call Lovable AI
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        {
          body: { prompt },
        }
      );

      if (aiError) throw aiError;

      // Parse AI response
      const emailData = JSON.parse(aiResponse.generatedText);

      // Analyze readability
      const metrics = analyzeReadability(emailData.emailBody);
      const readerFocus = calculateReaderFocus(emailData.emailBody);

      // Prepare metadata
      const metadata: any = { metrics, readerFocus };
      if (emailData.uniqueMechanism) {
        metadata.uniqueMechanism = emailData.uniqueMechanism;
      }
      // Framework no longer included in new generations

      // Save email
      const { data: email, error: emailError } = await supabase
        .from("emails")
        .insert([{
          campaign_id: campaign.id,
          sequence_position: 1,
          subject_lines: emailData.subjectLines,
          body: emailData.emailBody,
          ctas: emailData.ctas,
          metadata: metadata as any,
        }])
        .select()
        .single();

      if (emailError) throw emailError;

      toast({
        title: "Email generated!",
        description: "Your high-converting email is ready.",
      });

      navigate(`/email/${email.id}`);
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Campaign Details</h1>
          <p className="text-muted-foreground">
            Type: {formData.campaignType}
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {/* Product/Offer */}
          <div className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold">Product/Offer</h2>
            
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="e.g., Email Mastery Course"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description or URL</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your product or paste a sales page URL..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price Point</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="97"
                required
              />
            </div>
          </div>

          {/* Audience & Psychology */}
          <div className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold">Audience & Psychology</h2>
            
            <div>
              <Label htmlFor="audience">Who's buying?</Label>
              <Input
                id="audience"
                value={formData.audience}
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
                placeholder="Course creators earning $5-20K/mo"
                required
              />
            </div>

            <div>
              <Label htmlFor="painPoint">Biggest Pain Point</Label>
              <Input
                id="painPoint"
                value={formData.painPoint}
                onChange={(e) =>
                  setFormData({ ...formData, painPoint: e.target.value })
                }
                placeholder="Low email engagement, no sales"
                required
              />
            </div>

            <div>
              <Label htmlFor="desiredResult">Desired Result</Label>
              <Input
                id="desiredResult"
                value={formData.desiredResult}
                onChange={(e) =>
                  setFormData({ ...formData, desiredResult: e.target.value })
                }
                placeholder="Predictable $10K months from email"
                required
              />
            </div>
          </div>

          {/* Primary Emotion */}
          <div className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold">Primary Emotion</h2>
            <RadioGroup
              value={formData.primaryEmotion}
              onValueChange={(value) =>
                setFormData({ ...formData, primaryEmotion: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Fear of Missing Out" id="fomo" />
                <Label htmlFor="fomo">Fear of Missing Out</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Desire for Status" id="status" />
                <Label htmlFor="status">Desire for Status</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Hope & Transformation" id="hope" />
                <Label htmlFor="hope">Hope & Transformation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Fear of Loss" id="fear" />
                <Label htmlFor="fear">Fear of Loss</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Greed & Opportunity" id="greed" />
                <Label htmlFor="greed">Greed & Opportunity</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Story Structure Selection */}
          <div className="space-y-4 bg-card p-6 rounded-lg border border-primary/20">
            <h2 className="text-xl font-semibold">Pick a Story Structure</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the narrative mode for your email. Each structure uses different proven examples.
            </p>
            <RadioGroup
              value={formData.storyStructure}
              onValueChange={(value) =>
                setFormData({ ...formData, storyStructure: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mistake" id="mistake" />
                <Label htmlFor="mistake" className="font-normal cursor-pointer">
                  The Mistake I Made
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weird" id="weird" />
                <Label htmlFor="weird" className="font-normal cursor-pointer">
                  The Weird Thing I Noticed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="truth" id="truth" />
                <Label htmlFor="truth" className="font-normal cursor-pointer">
                  The Uncomfortable Truth
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="realization" id="realization" />
                <Label htmlFor="realization" className="font-normal cursor-pointer">
                  The 2AM Realization
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conversation" id="conversation" />
                <Label htmlFor="conversation" className="font-normal cursor-pointer">
                  The Overheard Conversation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="surprise" id="surprise" />
                <Label htmlFor="surprise" className="font-normal cursor-pointer">
                  None - Let AI surprise me
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Competitor Copy Input */}
          <CompetitorCopyInput
            value={formData.competitorCopy}
            onChange={(value) => setFormData({ ...formData, competitorCopy: value })}
          />

          {/* Audience Reviews Input */}
          <AudienceReviewsInput
            value={formData.audienceReviews}
            onChange={(value) => setFormData({ ...formData, audienceReviews: value })}
          />

          {/* Advanced Section */}
          <div className="space-y-4 bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold">Advanced (Optional)</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="uniqueMechanism"
                checked={formData.useUniqueMechanism}
                onChange={(e) =>
                  setFormData({ ...formData, useUniqueMechanism: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="uniqueMechanism" className="font-normal">
                Generate unique mechanism (recommended)
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Creates a proprietary-sounding framework that differentiates your offer
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Email...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Campaign
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
