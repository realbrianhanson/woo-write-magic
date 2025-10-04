import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIxNyA5MSUgNjAlIC8gMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Powered by AI
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Write emails that
              </span>
              <br />
              <span className="text-foreground">win customers</span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Stop wrestling with email copy. Get high-converting emails in minutes.
            </p>
            
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg font-semibold"
              >
                Watch Demo
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {[
                "Product launches that sell out",
                "Re-engagement emails that revive dead lists",
                "Deadline campaigns that create urgency",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Campaign Builder</h3>
            <p className="text-muted-foreground">
              Create complete email sequences for product launches, re-engagement, and more. Choose from proven frameworks.
            </p>
          </div>

          <div className="group rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">AI-Powered</h3>
            <p className="text-muted-foreground">
              Leverage advanced AI trained on direct response techniques. Get emails that hook, persuade, and convert.
            </p>
          </div>

          <div className="group rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Proven Results</h3>
            <p className="text-muted-foreground">
              Built on frameworks from legendary copywriters. Optimize with critique mode and A/B testing.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-semibold">Trusted by marketers worldwide</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <CheckCircle2 key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-lg italic text-foreground">
                "I went from 2% to 12% open rates in just two weeks. The email sequences are incredible."
              </p>
              <p className="font-semibold text-muted-foreground">— Sarah K., Course Creator</p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <CheckCircle2 key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-lg italic text-foreground">
                "Finally, emails that actually make sales. WooWrite paid for itself in the first campaign."
              </p>
              <p className="font-semibold text-muted-foreground">— Mike R., E-commerce Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary to-accent p-12 text-center text-white shadow-xl">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to transform your email marketing?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of marketers creating high-converting emails with AI.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg font-semibold shadow-lg"
            onClick={() => navigate("/auth")}
          >
            Start Writing Better Emails
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
