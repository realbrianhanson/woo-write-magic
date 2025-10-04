import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Mail, FileText, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const CAMPAIGN_TYPES = [
  {
    id: "product-launch",
    icon: "🚀",
    title: "Product Launch",
    description: "Perfect for new offers, cart open/close",
    details: "Includes: Pre-launch, urgency, deadline",
    emails: "3-7 emails",
  },
  {
    id: "lead-to-sale",
    icon: "💸",
    title: "Lead-to-Sale",
    description: "Perfect for converting prospects",
    details: "Framework: Problem-Solution storytelling",
    emails: "1-3 emails",
  },
  {
    id: "deadline",
    icon: "⏰",
    title: "Deadline & Scarcity",
    description: "Perfect for countdown campaigns",
    details: "Includes: 48hr, 24hr, last chance",
    emails: "1-4 emails",
  },
  {
    id: "reengagement",
    icon: "♻️",
    title: "Re-Engagement",
    description: "Perfect for waking up cold leads",
    details: "Framework: Pattern interrupt + value",
    emails: "1-3 emails",
  },
  {
    id: "nurture",
    icon: "📚",
    title: "Nurture & Value",
    description: "Perfect for content between promos",
    details: "Style: Educational, story-driven",
    emails: "1-5 emails",
  },
  {
    id: "post-purchase",
    icon: "🎁",
    title: "Post-Purchase",
    description: "Perfect for onboarding, retention",
    details: "Framework: Delight, ascension, loyalty",
    emails: "1-5 emails",
  },
];

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (!error && data) {
      setCampaigns(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Come back soon!",
    });
    navigate("/");
  };

  const handleCampaignSelect = (typeId: string) => {
    navigate(`/campaign/new?type=${typeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">WooWrite</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Main Action */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">What would you like to create?</h2>
          <p className="text-xl text-muted-foreground">Choose a campaign type to get started</p>
        </div>

        {/* Campaign Types Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGN_TYPES.map((type) => (
            <Card
              key={type.id}
              className="group cursor-pointer overflow-hidden p-6 transition-all hover:shadow-lg"
              onClick={() => handleCampaignSelect(type.id)}
            >
              <div className="mb-4 text-4xl">{type.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{type.title}</h3>
              <p className="mb-2 text-sm text-muted-foreground">{type.description}</p>
              <p className="mb-3 text-xs text-muted-foreground">{type.details}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{type.emails}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-bold">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => navigate("/campaign/new?quick=true")}
              >
                <Mail className="h-8 w-8 text-primary" />
                <span className="font-semibold">Single Email</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => navigate("/campaigns")}
              >
                <FileText className="h-8 w-8 text-primary" />
                <span className="font-semibold">Browse My Campaigns</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-8 w-8 text-primary" />
                <span className="font-semibold">Settings</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Campaigns */}
        {campaigns.length > 0 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Recent Campaigns</h3>
              <Button variant="link" onClick={() => navigate("/campaigns")}>
                View all
              </Button>
            </div>
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="flex cursor-pointer items-center justify-between p-4 transition-all hover:shadow-md"
                  onClick={() => navigate(`/campaign/${campaign.id}`)}
                >
                  <div>
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.campaign_type} • {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
