import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Plus, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  campaign_type: string;
  voice_tone: string;
  voice_examples: string[];
  specific_objections: string[];
  funnel_context: any;
  differentiation: any;
  transformation_timeline: any;
  created_at: string;
  updated_at: string;
}

interface Email {
  id: string;
  created_at: string;
  sequence_position: number;
  subject_lines: string[];
}

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaignData();
  }, [id]);

  const loadCampaignData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load campaign
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (campaignError) throw campaignError;
      setCampaign(campaignData);

      // Load emails from this campaign
      const { data: emailsData, error: emailsError } = await supabase
        .from("emails")
        .select("id, created_at, sequence_position, subject_lines")
        .eq("campaign_id", id)
        .order("created_at", { ascending: false });

      if (emailsError) throw emailsError;
      setEmails(emailsData || []);
    } catch (error) {
      console.error("Error loading campaign:", error);
      toast({
        title: "Error",
        description: "Failed to load campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    navigate(`/campaign/new?campaignId=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Campaign Not Found</CardTitle>
            <CardDescription>This campaign doesn't exist or you don't have access to it.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{campaign.campaign_type}</Badge>
                <span>•</span>
                <span>Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</span>
              </div>
            </div>
            <Button onClick={handleGenerateAnother} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Generate Another Email
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Campaign Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign.voice_tone && (
                  <div>
                    <h3 className="font-semibold mb-1">Voice & Tone</h3>
                    <p className="text-sm text-muted-foreground">{campaign.voice_tone}</p>
                  </div>
                )}

                {campaign.voice_examples && campaign.voice_examples.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Voice Examples</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {campaign.voice_examples.map((example, idx) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {campaign.specific_objections && campaign.specific_objections.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-1">Specific Objections</h3>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {campaign.specific_objections.map((objection, idx) => (
                          <li key={idx}>{objection}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {campaign.funnel_context && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-1">Funnel Context</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium">Stage:</span> {campaign.funnel_context.funnel_stage}</p>
                        <p><span className="font-medium">Temperature:</span> {campaign.funnel_context.traffic_temperature}</p>
                      </div>
                    </div>
                  </>
                )}

                {campaign.differentiation && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-1">Differentiation</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {campaign.differentiation.vs_competitors && (
                          <p><span className="font-medium">Vs Competitors:</span> {campaign.differentiation.vs_competitors}</p>
                        )}
                        {campaign.differentiation.unfair_advantage && (
                          <p><span className="font-medium">Unfair Advantage:</span> {campaign.differentiation.unfair_advantage}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {campaign.transformation_timeline && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-1">Transformation Timeline</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {campaign.transformation_timeline.time_to_first_results && (
                          <p><span className="font-medium">Time to Results:</span> {campaign.transformation_timeline.time_to_first_results}</p>
                        )}
                        {campaign.transformation_timeline.specific_metrics && (
                          <p><span className="font-medium">Metrics:</span> {campaign.transformation_timeline.specific_metrics}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Emails List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Generated Emails
                </CardTitle>
                <CardDescription>
                  {emails.length} email{emails.length !== 1 ? 's' : ''} generated
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emails.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No emails generated yet</p>
                    <Button
                      variant="link"
                      onClick={handleGenerateAnother}
                      className="mt-2"
                    >
                      Generate your first email
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emails.map((email) => (
                      <Card
                        key={email.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => navigate(`/email/${email.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              Email #{email.sequence_position}
                            </Badge>
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium line-clamp-2 mb-1">
                            {email.subject_lines?.[0] || "Untitled Email"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(email.created_at), { addSuffix: true })}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
