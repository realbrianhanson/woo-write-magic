import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Users, Megaphone, Rocket } from "lucide-react";

interface PersonalStoryInputProps {
  personalStories: string;
  customerStories: string;
  controversialOpinions: string;
  originStory: string;
  onPersonalStoriesChange: (value: string) => void;
  onCustomerStoriesChange: (value: string) => void;
  onControversialOpinionsChange: (value: string) => void;
  onOriginStoryChange: (value: string) => void;
}

export function PersonalStoryInput({
  personalStories,
  customerStories,
  controversialOpinions,
  originStory,
  onPersonalStoriesChange,
  onCustomerStoriesChange,
  onControversialOpinionsChange,
  onOriginStoryChange,
}: PersonalStoryInputProps) {
  const getStatus = (value: string) => {
    if (!value) return "text-muted-foreground";
    return value.length > 100 ? "text-green-500" : "text-yellow-500";
  };

  return (
    <div className="space-y-4 bg-card p-6 rounded-lg border">
      <div>
        <h2 className="text-xl font-semibold mb-2">Personal Story Bank</h2>
        <p className="text-sm text-muted-foreground">
          Add your real stories to make AI-generated emails sound authentic and personal.
          The more specific details you provide, the better the results.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className={`w-4 h-4 ${getStatus(personalStories)}`} />
          <Label htmlFor="personalStories">Personal Experiences (Optional)</Label>
        </div>
        <Textarea
          id="personalStories"
          value={personalStories}
          onChange={(e) => onPersonalStoriesChange(e.target.value)}
          placeholder="Share specific moments from your journey. Include names, dates, amounts, locations.

Example: 'Three years ago I spent $47,000 on a growth agency that got me 9,847 fake emails. It was August 2021. I was desperate. Maxed out my credit card thinking this was finally the answer...'

The more specific, the more believable and engaging your emails will be."
          rows={6}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Real moments, failures, breakthroughs. Include specific numbers, dates, and names.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className={`w-4 h-4 ${getStatus(customerStories)}`} />
          <Label htmlFor="customerStories">Customer Success Stories (Optional)</Label>
        </div>
        <Textarea
          id="customerStories"
          value={customerStories}
          onChange={(e) => onCustomerStoriesChange(e.target.value)}
          placeholder="Share specific customer results with names and numbers.

Example: 'Sarah from Austin went from $4K to $15K in 6 weeks. She texted me at 11pm: Holy shit, I just closed 3 clients in one day. Started in March, hit her goal by May.'

Use real names (or pseudonyms), actual metrics, direct quotes, and timelines."
          rows={6}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Real customers, real results, real quotes. Specifics make it believable.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Megaphone className={`w-4 h-4 ${getStatus(controversialOpinions)}`} />
          <Label htmlFor="controversialOpinions">Controversial Opinions (Optional)</Label>
        </div>
        <Textarea
          id="controversialOpinions"
          value={controversialOpinions}
          onChange={(e) => onControversialOpinionsChange(e.target.value)}
          placeholder="What do you believe that most in your industry disagree with?

Example: 'Email courses are a waste of time. Nobody finishes them. You're better off sending one good email per week than a 7-day sequence that loses 80% by day 3.'

These beliefs differentiate you and make your voice unique."
          rows={4}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Your unique perspective. What makes you different from everyone else.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Rocket className={`w-4 h-4 ${getStatus(originStory)}`} />
          <Label htmlFor="originStory">Your Origin Story (Optional)</Label>
        </div>
        <Textarea
          id="originStory"
          value={originStory}
          onChange={(e) => onOriginStoryChange(e.target.value)}
          placeholder="Why did you start? What was the moment that changed everything?

Example: 'It was 2:47am on a Tuesday. I'd been staring at my laptop for 3 hours trying to write ONE email. My daughter woke up crying. I realized I was missing her childhood to run a business I didn't even enjoy anymore...'

Your origin story creates connection and context for everything else."
          rows={6}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          The moment that started it all. Make it specific and emotional.
        </p>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg border border-muted">
        <h3 className="text-sm font-semibold mb-2">💡 Pro Tip</h3>
        <p className="text-xs text-muted-foreground">
          These stories are optional but highly recommended. When filled out, the AI will use YOUR
          real experiences instead of making up generic examples. This makes emails sound
          authentic and personal - like you actually wrote them - instead of robotic AI copy.
        </p>
      </div>
    </div>
  );
}
