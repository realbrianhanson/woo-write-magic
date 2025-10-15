import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { VoiceToneSelector } from "@/components/VoiceToneSelector";
import { ObjectionsInput } from "@/components/ObjectionsInput";
import { DifferentiationInput } from "@/components/DifferentiationInput";
import { TransformationTimelineInput } from "@/components/TransformationTimelineInput";
import { FunnelContextInput } from "@/components/FunnelContextInput";

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingCampaignId, setExistingCampaignId] = useState<string | null>(null);

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
    competitorCopy: "",
    audienceReviews: "",
    voiceTone: "casual-friend",
    voiceExamples: [] as string[],
    specificObjections: [] as string[],
    differentiation: {
      unfair_advantage: "",
      vs_competitors: "",
      category_position: "",
    },
    transformationTimeline: {
      time_to_first_results: "",
      specific_metrics: "",
      progression: "",
    },
    funnelContext: {
      traffic_temperature: "warm",
      funnel_stage: "consideration",
      sequence_position_context: "",
    },
  });

  // Load existing campaign if campaignId is provided
  useEffect(() => {
    const campaignId = searchParams.get("campaignId");
    if (campaignId) {
      loadExistingCampaign(campaignId);
    }
  }, [searchParams]);

  const loadExistingCampaign = async (campaignId: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: campaign, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (campaign) {
        setExistingCampaignId(campaignId);
        
        // Load campaign settings into form
        const settings = (campaign.settings || {}) as any;
        setFormData({
          productName: campaign.name || settings.productName || "",
          description: settings.description || "",
          price: settings.price || "",
          audience: settings.audience || "",
          painPoint: settings.painPoint || "",
          desiredResult: settings.desiredResult || "",
          campaignType: campaign.campaign_type || settings.campaignType || "Product Launch",
          sequenceLength: settings.sequenceLength || "5",
          primaryEmotion: settings.primaryEmotion || "Hope & Transformation",
          useUniqueMechanism: settings.useUniqueMechanism ?? true,
          competitorCopy: settings.competitorCopy || "",
          audienceReviews: settings.audienceReviews || "",
          voiceTone: campaign.voice_tone || settings.voiceTone || "casual-friend",
          voiceExamples: campaign.voice_examples || settings.voiceExamples || [],
          specificObjections: campaign.specific_objections || settings.specificObjections || [],
          differentiation: (campaign.differentiation || settings.differentiation || {
            unfair_advantage: "",
            vs_competitors: "",
            category_position: "",
          }) as any,
          transformationTimeline: (campaign.transformation_timeline || settings.transformationTimeline || {
            time_to_first_results: "",
            specific_metrics: "",
            progression: "",
          }) as any,
          funnelContext: (campaign.funnel_context || settings.funnelContext || {
            traffic_temperature: "warm",
            funnel_stage: "consideration",
            sequence_position_context: "",
          }) as any,
        });

        toast({
          title: "Campaign loaded",
          description: "Generate another email using these campaign settings",
        });
      }
    } catch (error) {
      console.error("Error loading campaign:", error);
      toast({
        title: "Error",
        description: "Failed to load campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Detect and fetch URL content
  const handleDescriptionChange = async (value: string) => {
    // Check if the value contains a URL (more flexible pattern)
    const urlPattern = /https?:\/\/[^\s]+/;
    const urlMatch = value.trim().match(urlPattern);
    
    if (urlMatch) {
      const url = urlMatch[0];
      setIsFetchingUrl(true);
      try {
        console.log('Detected URL, fetching content:', url);
        const { data, error } = await supabase.functions.invoke('fetch-webpage', {
          body: { url }
        });

        console.log('Fetch webpage response:', data, error);

        if (error) throw error;

        if (data?.success && data?.content) {
          setFormData({ ...formData, description: data.content });
          toast({
            title: "Page content fetched!",
            description: "Sales page content has been extracted and will be used to generate your email.",
          });
        } else {
          throw new Error('No content returned from webpage');
        }
      } catch (error: any) {
        console.error('Error fetching URL:', error);
        toast({
          title: "Couldn't fetch page",
          description: error.message || "Using the URL as-is. You can paste the page content directly instead.",
          variant: "destructive",
        });
        // Keep the URL in the field if fetch fails
        setFormData({ ...formData, description: value });
      } finally {
        setIsFetchingUrl(false);
      }
    } else {
      // No URL detected, just update the description normally
      setFormData({ ...formData, description: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, starting generation...");
    await generateEmail(false);
  };

  const generateEmail = async (simplify: boolean = false) => {
    console.log("generateEmail called with simplify:", simplify);
    setIsGenerating(true);

    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User authenticated:", user?.id);
      if (!user) throw new Error("Not authenticated");

      let campaign;

      // If we're using an existing campaign, just use that ID
      if (existingCampaignId) {
        campaign = { id: existingCampaignId };
      } else {
        // Create new campaign
        const { data: newCampaign, error: campaignError } = await supabase
          .from("campaigns")
          .insert({
            user_id: user.id,
            name: formData.productName,
            campaign_type: formData.campaignType,
            settings: formData,
            voice_tone: formData.voiceTone,
            voice_examples: formData.voiceExamples,
            specific_objections: formData.specificObjections,
            differentiation: formData.differentiation,
            transformation_timeline: formData.transformationTimeline,
            funnel_context: formData.funnelContext,
          })
          .select()
          .single();

        if (campaignError) throw campaignError;
        campaign = newCampaign;
      }

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
          competitorCopy: formData.competitorCopy,
          audienceReviews: formData.audienceReviews,
          voiceTone: formData.voiceTone,
          voiceExamples: formData.voiceExamples,
          specificObjections: formData.specificObjections,
          differentiation: formData.differentiation,
          transformationTimeline: formData.transformationTimeline,
          funnelContext: formData.funnelContext,
        },
        1,
        parseInt(formData.sequenceLength),
        simplify
      );

      // Call Lovable AI with timeout (longer timeout for GPT-5)
      console.log("Calling generate-email function with prompt length:", prompt.length);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 200000); // 3.3 minute timeout
      
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        {
          body: { prompt },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeout);
      console.log("AI Response received:", aiResponse);
      console.log("AI Error:", aiError);
      
      if (aiError) {
        console.error("Function invocation error:", aiError);
        throw new Error(`Failed to generate email: ${aiError.message || 'Unknown error'}`);
      }
      
      if (!aiResponse || !aiResponse.generatedText) {
        console.error("Invalid response structure:", aiResponse);
        throw new Error("No email content received from AI");
      }

      // Parse AI response
      console.log("Parsing AI response...");
      const emailData = JSON.parse(aiResponse.generatedText);
      console.log("Email data parsed successfully");

      // Use the first variant as the primary email body for backward compatibility
      const primaryVariant = emailData.variants && emailData.variants[0] 
        ? emailData.variants[0] 
        : { body: emailData.emailBody || "", subject_lines: emailData.subjectLines || [], ctas: emailData.ctas || [] };

      // Analyze readability on primary variant
      const metrics = analyzeReadability(primaryVariant.body);
      const readerFocus = calculateReaderFocus(primaryVariant.body);

      // Prepare metadata
      const metadata: any = { metrics, readerFocus };
      if (emailData.uniqueMechanism) {
        metadata.uniqueMechanism = emailData.uniqueMechanism;
      }

      // Save email with all new fields
      const { data: email, error: emailError } = await supabase
        .from("emails")
        .insert([{
          campaign_id: campaign.id,
          sequence_position: 1,
          subject_lines: primaryVariant.subject_lines,
          body: primaryVariant.body,
          ctas: primaryVariant.ctas,
          metadata: metadata as any,
          variants: emailData.variants || [],
          critique: emailData.critique || {},
          subject_line_variants: emailData.subject_line_variants || [],
          testing_recommendations: emailData.testing_recommendations || [],
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
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        details: error?.details,
        full: error
      });
      
      let errorMessage = "Failed to generate email. Please try again.";
      
      if (error?.message?.includes("aborted")) {
        errorMessage = "Request timed out. The AI took too long to respond. Try simplifying your inputs.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {existingCampaignId ? "Generate Another Email" : "Campaign Details"}
          </h1>
          <p className="text-muted-foreground">
            {existingCampaignId 
              ? `Reusing settings from: ${formData.productName}` 
              : `Type: ${formData.campaignType}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe your product or paste a sales page URL..."
                rows={4}
                required
                disabled={isFetchingUrl}
              />
              {isFetchingUrl && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching page content...
                </p>
              )}
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

          {/* Voice & Tone */}
          <VoiceToneSelector
            value={formData.voiceTone}
            examples={formData.voiceExamples}
            onChange={(value) => setFormData({ ...formData, voiceTone: value })}
            onExamplesChange={(examples) => setFormData({ ...formData, voiceExamples: examples })}
          />

          {/* Specific Objections */}
          <ObjectionsInput
            value={formData.specificObjections}
            onChange={(value) => setFormData({ ...formData, specificObjections: value })}
          />

          {/* Differentiation */}
          <DifferentiationInput
            value={formData.differentiation}
            onChange={(value) => setFormData({ ...formData, differentiation: value })}
          />

          {/* Transformation Timeline */}
          <TransformationTimelineInput
            value={formData.transformationTimeline}
            onChange={(value) => setFormData({ ...formData, transformationTimeline: value })}
          />

          {/* Funnel Context */}
          <FunnelContextInput
            value={formData.funnelContext}
            onChange={(value) => setFormData({ ...formData, funnelContext: value })}
          />

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
                {existingCampaignId ? "Generate Another Email" : "Generate Campaign"}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
