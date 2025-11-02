import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Copy, Save, RefreshCw, AlertCircle, FileSearch, AlignLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailMetrics } from "@/components/EmailMetrics";
import { UniqueMechanismDisplay } from "@/components/UniqueMechanismDisplay";
import { CritiquePanel } from "@/components/CritiquePanel";
import { ParagraphPreviewDialog } from "@/components/ParagraphPreviewDialog";
import { ReaderFocusDisplay } from "@/components/ReaderFocusDisplay";
import { FrameworkDisplay } from "@/components/FrameworkDisplay";
import { EmailFeedback } from "@/components/EmailFeedback";
import { analyzeReadability, type ReadabilityMetrics } from "@/lib/readability";
import { buildEmailPrompt } from "@/lib/prompts";
import { hasPostScript, buildPostScriptPrompt } from "@/lib/postscript";
import { 
  detectBannedWords, 
  findSentencesWithBannedWords, 
  buildBannedWordReplacementPrompt 
} from "@/lib/bannedWords";
import { critiqueEmail, buildCritiqueFixPrompt, type CritiqueResult } from "@/lib/critique";
import {
  findLongParagraphs,
  buildParagraphFormattingPrompt,
  applyFormattedParagraphs,
} from "@/lib/paragraphFormatter";
import { 
  calculateReaderFocus, 
  buildReaderFocusPrompt,
  type ReaderFocusMetrics 
} from "@/lib/readerFocus";
import { checkBlandness, buildHumanizePrompt, type BlandnessResult } from "@/lib/blandnessCheck";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface UniqueMechanism {
  nickname: string;
  rootCause: string;
  metaphor: string;
}

export default function EmailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState<any>(null);
  const [campaign, setCampaign] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [selectedCta, setSelectedCta] = useState(0);
  const [emailBody, setEmailBody] = useState("");
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null);
  const [readerFocusMetrics, setReaderFocusMetrics] = useState<ReaderFocusMetrics | null>(null);
  const [uniqueMechanism, setUniqueMechanism] = useState<UniqueMechanism | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [isRegeneratingMechanism, setIsRegeneratingMechanism] = useState(false);
  const [isAddingPS, setIsAddingPS] = useState(false);
  const [showPSWarning, setShowPSWarning] = useState(false);
  const [bannedWordsFound, setBannedWordsFound] = useState<string[]>([]);
  const [isReplacingBannedWords, setIsReplacingBannedWords] = useState(false);
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResult | null>(null);
  const [showCritique, setShowCritique] = useState(false);
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);
  const [longParagraphCount, setLongParagraphCount] = useState(0);
  const [isFormattingParagraphs, setIsFormattingParagraphs] = useState(false);
  const [showParagraphPreview, setShowParagraphPreview] = useState(false);
  const [paragraphComparisons, setParagraphComparisons] = useState<
    Array<{ original: string; formatted: string; sentenceCount: number }>
  >([]);
  const [pendingFormattedText, setPendingFormattedText] = useState("");
  const [isIncreasingReaderFocus, setIsIncreasingReaderFocus] = useState(false);
  const [frameworkInfo, setFrameworkInfo] = useState<{ id: string; name: string } | null>(null);
  const [blandnessResult, setBlandnessResult] = useState<BlandnessResult | null>(null);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [emailFeeling, setEmailFeeling] = useState<string>("");

  useEffect(() => {
    loadEmail();
  }, [id]);

  useEffect(() => {
    if (emailBody) {
      setMetrics(analyzeReadability(emailBody));
      setReaderFocusMetrics(calculateReaderFocus(emailBody));
      setShowPSWarning(!hasPostScript(emailBody));
      setBannedWordsFound(detectBannedWords(emailBody));
      setBlandnessResult(checkBlandness(emailBody));
      
      // Check for long paragraphs
      const longParas = findLongParagraphs(emailBody, 3);
      setLongParagraphCount(longParas.length);
    }
  }, [emailBody]);

  const loadEmail = async () => {
    const { data, error } = await supabase
      .from("emails")
      .select("*, campaigns(*)")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error loading email",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setEmail(data);
    setCampaign(data.campaigns);
    setEmailBody(data.body);
    if (data.metadata && typeof data.metadata === 'object' && 'metrics' in data.metadata) {
      setMetrics(data.metadata.metrics as unknown as ReadabilityMetrics);
    }
    if (data.metadata && typeof data.metadata === 'object' && 'readerFocus' in data.metadata) {
      setReaderFocusMetrics(data.metadata.readerFocus as unknown as ReaderFocusMetrics);
    }
    if (data.metadata && typeof data.metadata === 'object' && 'uniqueMechanism' in data.metadata) {
      setUniqueMechanism(data.metadata.uniqueMechanism as unknown as UniqueMechanism);
    }
    if (data.metadata && typeof data.metadata === 'object' && 'framework' in data.metadata) {
      setFrameworkInfo(data.metadata.framework as unknown as { id: string; name: string });
    }
  };

  const handleCopy = () => {
    const fullEmail = `Subject: ${email.subject_lines[selectedSubject]}

${emailBody}

${email.ctas[selectedCta]}`;

    navigator.clipboard.writeText(fullEmail);
    toast({ title: "Copied to clipboard!" });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("emails")
      .update({ 
        body: emailBody,
        metadata: { 
          ...email.metadata,
          metrics
        } as any
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Email saved!" });
    }
  };

  const handleSimplify = async () => {
    setIsSimplifying(true);
    try {
      const prompt = buildEmailPrompt(
        campaign.settings,
        email.sequence_position,
        1,
        true // Enable simplification mode
      );

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      const emailData = JSON.parse(aiResponse.generatedText);
      setEmailBody(emailData.emailBody);

      toast({
        title: "Email simplified!",
        description: "Regenerated with stricter simplicity requirements.",
      });
    } catch (error: any) {
      toast({
        title: "Simplification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleRegenerateMechanism = async () => {
    setIsRegeneratingMechanism(true);
    try {
      const prompt = buildEmailPrompt(
        { ...campaign.settings, useUniqueMechanism: true },
        email.sequence_position,
        1,
        false
      );

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      const emailData = JSON.parse(aiResponse.generatedText);
      
      if (emailData.uniqueMechanism) {
        setUniqueMechanism(emailData.uniqueMechanism);
        
        // Save the new mechanism
        const currentMetadata = email.metadata || {};
        await supabase
          .from("emails")
          .update({ 
            metadata: { 
              ...currentMetadata, 
              uniqueMechanism: emailData.uniqueMechanism 
            } as any 
          })
          .eq("id", id);

        toast({
          title: "Mechanism regenerated!",
          description: "New unique mechanism created for your email.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Regeneration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingMechanism(false);
    }
  };

  const handleAddPS = async () => {
    setIsAddingPS(true);
    try {
      const prompt = buildPostScriptPrompt(
        emailBody,
        campaign.settings.productName || campaign.name,
        campaign.settings.desiredResult || "transformation",
        email.ctas?.[selectedCta] || "Click here"
      );

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      const psText = aiResponse.generatedText.trim();
      
      // Append P.S. to email body
      const updatedBody = emailBody + "\n\n" + psText;
      setEmailBody(updatedBody);
      setShowPSWarning(false);

      toast({
        title: "P.S. added!",
        description: "Strategic P.S. section appended to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to add P.S.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingPS(false);
    }
  };

  const handleReplaceBannedWords = async () => {
    setIsReplacingBannedWords(true);
    try {
      const problematicSentences = findSentencesWithBannedWords(emailBody);
      
      if (problematicSentences.length === 0) {
        toast({
          title: "No banned words found",
          description: "Email is clean!",
        });
        return;
      }

      const prompt = buildBannedWordReplacementPrompt(
        problematicSentences,
        emailBody
      );

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      // Parse the replacement sentences
      const replacements = JSON.parse(aiResponse.generatedText);
      
      // Replace sentences in the email body
      let updatedBody = emailBody;
      problematicSentences.forEach((original, index) => {
        if (replacements[index]) {
          updatedBody = updatedBody.replace(original, replacements[index]);
        }
      });

      setEmailBody(updatedBody);
      setBannedWordsFound(detectBannedWords(updatedBody));

      toast({
        title: "Banned words replaced!",
        description: `Rewrote ${problematicSentences.length} sentence(s) to sound more human.`,
      });
    } catch (error: any) {
      toast({
        title: "Replacement failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsReplacingBannedWords(false);
    }
  };

  const handleCritique = () => {
    const result = critiqueEmail(emailBody);
    setCritiqueResult(result);
    setShowCritique(true);
  };

  const handleApplyCritiqueFixes = async () => {
    if (!critiqueResult || critiqueResult.issues.length === 0) return;
    
    setIsApplyingFixes(true);
    try {
      const prompt = buildCritiqueFixPrompt(emailBody, critiqueResult.issues);

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      const fixedEmail = aiResponse.generatedText.trim();
      setEmailBody(fixedEmail);
      
      // Re-analyze after fixes
      const newResult = critiqueEmail(fixedEmail);
      setCritiqueResult(newResult);

      toast({
        title: "Fixes applied!",
        description: `Score improved from ${critiqueResult.score} to ${newResult.score}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to apply fixes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsApplyingFixes(false);
    }
  };

  const handleAutoFormatParagraphs = async () => {
    setIsFormattingParagraphs(true);
    try {
      const longParas = findLongParagraphs(emailBody, 3);
      
      if (longParas.length === 0) {
        toast({
          title: "No long paragraphs found",
          description: "Email formatting looks good!",
        });
        return;
      }

      // Build prompt to format paragraphs
      const prompt = buildParagraphFormattingPrompt(longParas.map(p => p.text));

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      // Parse formatted paragraphs
      const formattedParagraphs = JSON.parse(aiResponse.generatedText);
      
      // Apply formatting
      const formattedText = applyFormattedParagraphs(
        emailBody,
        longParas,
        formattedParagraphs
      );

      // Prepare comparisons for preview
      const comparisons = longParas.map((lp, index) => ({
        original: lp.text,
        formatted: formattedParagraphs[index] || lp.text,
        sentenceCount: lp.sentenceCount,
      }));

      setParagraphComparisons(comparisons);
      setPendingFormattedText(formattedText);
      setShowParagraphPreview(true);
    } catch (error: any) {
      toast({
        title: "Formatting failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsFormattingParagraphs(false);
    }
  };

  const handleApproveParagraphFormatting = () => {
    setEmailBody(pendingFormattedText);
    setShowParagraphPreview(false);
    setParagraphComparisons([]);
    setPendingFormattedText("");
    
    toast({
      title: "Formatting applied!",
      description: "Paragraphs have been broken for better readability.",
    });
  };

  const handleCancelParagraphFormatting = () => {
    setShowParagraphPreview(false);
    setParagraphComparisons([]);
    setPendingFormattedText("");
  };

  const handleIncreaseReaderFocus = async () => {
    setIsIncreasingReaderFocus(true);
    try {
      const prompt = buildReaderFocusPrompt(emailBody);

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      const improvedEmail = aiResponse.generatedText.trim();
      const newMetrics = calculateReaderFocus(improvedEmail);
      
      setEmailBody(improvedEmail);
      setReaderFocusMetrics(newMetrics);

      toast({
        title: "Reader focus improved!",
        description: `Increased from ${readerFocusMetrics?.ratio}% to ${newMetrics.ratio}%`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to improve reader focus",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsIncreasingReaderFocus(false);
    }
  };

  const handleHumanize = async () => {
    setIsHumanizing(true);
    try {
      const prompt = buildHumanizePrompt(emailBody);

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        "generate-email",
        { body: { prompt } }
      );

      if (aiError) throw aiError;

      // The AI returns JSON with subject and body, we only need the body
      let humanizedEmail: string;
      try {
        const parsedResponse = JSON.parse(aiResponse.generatedText);
        humanizedEmail = parsedResponse.body || aiResponse.generatedText;
      } catch {
        // If parsing fails, use the raw text
        humanizedEmail = aiResponse.generatedText.trim();
      }
      
      setEmailBody(humanizedEmail);
      
      // Recheck blandness
      const newBlandness = checkBlandness(humanizedEmail);
      setBlandnessResult(newBlandness);

      toast({
        title: "Email humanized!",
        description: newBlandness.isBland 
          ? "Some template language still detected" 
          : "Sounds much more natural now",
      });
    } catch (error: any) {
      toast({
        title: "Failed to humanize",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsHumanizing(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Email Is Ready</h1>
          <p className="text-muted-foreground">
            Campaign: {campaign?.name} — Email {email.sequence_position}
          </p>
        </div>

        {/* Email Feedback - Right after title */}
        <div className="mb-8">
          <EmailFeedback
            onFeedbackSelected={setEmailFeeling}
            onHumanize={handleHumanize}
            isHumanizing={isHumanizing}
            blandPhrasesFound={blandnessResult?.foundPhrases}
          />
        </div>

        {/* Subject Lines */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Subject Lines (Pick One)</h2>
          <div className="space-y-2">
            {email.subject_lines?.map((subject: string, idx: number) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all ${
                  selectedSubject === idx
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedSubject(idx)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span>{subject}</span>
                    {selectedSubject === idx && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Body */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Email Body</h2>
            <div className="flex gap-2">
              {longParagraphCount > 0 && (
                <Button
                  onClick={handleAutoFormatParagraphs}
                  variant="outline"
                  size="sm"
                  disabled={isFormattingParagraphs}
                >
                  {isFormattingParagraphs ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Formatting...
                    </>
                  ) : (
                    <>
                      <AlignLeft className="mr-2 h-4 w-4" />
                      Auto-Format Paragraphs
                    </>
                  )}
                </Button>
              )}
              {showPSWarning && (
                <Button
                  onClick={handleAddPS}
                  variant="outline"
                  size="sm"
                  disabled={isAddingPS}
                >
                  {isAddingPS ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Adding P.S...
                    </>
                  ) : (
                    "Add P.S."
                  )}
                </Button>
              )}
            </div>
          </div>

          {longParagraphCount > 0 && (
            <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                Found {longParagraphCount} long paragraph{longParagraphCount > 1 ? 's' : ''} ({">"}3 sentences). Click "Auto-Format Paragraphs" to break them up for better readability.
              </AlertDescription>
            </Alert>
          )}
          
          {showPSWarning && (
            <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                Missing P.S. section - this is critical for conversions. Click "Add P.S." to append one.
              </AlertDescription>
            </Alert>
          )}

          {/* BLANDNESS WARNING */}
          {blandnessResult?.isBland && (
            <Alert className="mb-4 border-red-600 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-red-900 dark:text-red-100 text-lg mb-1">
                        ❌ TEMPLATE LANGUAGE DETECTED
                      </p>
                      <p className="text-red-800 dark:text-red-200 mb-2">
                        This sounds like every other marketing email.
                      </p>
                      <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                        Found {blandnessResult.count} template phrase{blandnessResult.count > 1 ? 's' : ''}:
                      </p>
                      <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                        {blandnessResult.foundPhrases.map((phrase, idx) => (
                          <li key={idx}>"{phrase}"</li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={handleHumanize}
                      variant="destructive"
                      size="sm"
                      disabled={isHumanizing}
                      className="shrink-0"
                    >
                      {isHumanizing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Humanizing...
                        </>
                      ) : (
                        "Make It Human"
                      )}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {bannedWordsFound.length > 0 && (
            <Alert className="mb-4 border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <div className="flex items-start justify-between">
                  <div>
                    <strong>Detected AI-sounding words:</strong> {bannedWordsFound.join(", ")}
                    <br />
                    <span className="text-sm">These make your email sound robotic. Click "Replace Banned Words" to fix.</span>
                  </div>
                  <Button
                    onClick={handleReplaceBannedWords}
                    variant="destructive"
                    size="sm"
                    disabled={isReplacingBannedWords}
                    className="ml-4 shrink-0"
                  >
                    {isReplacingBannedWords ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Replacing...
                      </>
                    ) : (
                      "Replace Banned Words"
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={20}
            className="font-mono text-sm"
          />
        </div>

        {/* Readability Metrics */}
        {metrics && !showCritique && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Readability Analysis</h2>
            <EmailMetrics metrics={metrics} />
          </div>
        )}

        {/* Reader Focus */}
        {readerFocusMetrics && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Reader Focus</h2>
            <ReaderFocusDisplay 
              metrics={readerFocusMetrics}
              onIncreaseReaderFocus={handleIncreaseReaderFocus}
              isIncreasing={isIncreasingReaderFocus}
            />
          </div>
        )}

        {/* Framework Display */}
        {frameworkInfo && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Framework Used</h2>
            <FrameworkDisplay 
              frameworkId={frameworkInfo.id}
              frameworkName={frameworkInfo.name}
            />
          </div>
        )}

        {/* Critique Panel */}
        {showCritique && critiqueResult && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Email Critique</h2>
              <Button
                onClick={() => setShowCritique(false)}
                variant="ghost"
                size="sm"
              >
                Hide Critique
              </Button>
            </div>
            <CritiquePanel
              result={critiqueResult}
              onApplyFixes={handleApplyCritiqueFixes}
              isApplyingFixes={isApplyingFixes}
            />
          </div>
        )}

        {/* Unique Mechanism */}
        {uniqueMechanism && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Unique Mechanism</h2>
              <Button
                onClick={handleRegenerateMechanism}
                variant="outline"
                size="sm"
                disabled={isRegeneratingMechanism}
              >
                {isRegeneratingMechanism ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Mechanism
                  </>
                )}
              </Button>
            </div>
            <UniqueMechanismDisplay mechanism={uniqueMechanism} />
          </div>
        )}

        {/* CTAs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Call-to-Action Options</h2>
          <div className="space-y-2">
            {email.ctas?.map((cta: string, idx: number) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all ${
                  selectedCta === idx
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedCta(idx)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span>{cta}</span>
                    {selectedCta === idx && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCritique} variant="outline">
            <FileSearch className="mr-2 h-4 w-4" />
            {showCritique ? "Update Critique" : "Critique This"}
          </Button>
          <Button onClick={handleCopy} variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Email
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          <Button 
            onClick={handleSimplify}
            variant="secondary"
            disabled={isSimplifying}
          >
            {isSimplifying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Simplifying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Simplify Language
              </>
            )}
          </Button>
        </div>

        {/* Paragraph Preview Dialog */}
        <ParagraphPreviewDialog
          open={showParagraphPreview}
          onOpenChange={setShowParagraphPreview}
          comparisons={paragraphComparisons}
          onApprove={handleApproveParagraphFormatting}
          onCancel={handleCancelParagraphFormatting}
        />
      </div>
    </div>
  );
}
