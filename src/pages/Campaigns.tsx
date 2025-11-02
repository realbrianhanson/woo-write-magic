import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Campaigns = () => {
  const [user, setUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCampaigns(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">My Campaigns</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="mb-4 text-lg text-muted-foreground">No campaigns yet</p>
            <Button onClick={() => navigate("/dashboard")}>Create Your First Campaign</Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="flex cursor-pointer items-center justify-between p-6 transition-all hover:shadow-md"
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              >
                <div>
                  <h4 className="mb-1 text-lg font-semibold">{campaign.name}</h4>
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
        )}
      </div>
    </div>
  );
};

export default Campaigns;
