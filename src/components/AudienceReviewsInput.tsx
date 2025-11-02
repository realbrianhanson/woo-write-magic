import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TextareaWithVoice } from "@/components/ui/textarea-with-voice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileText, MessageSquare, ThumbsUp, ThumbsDown, Loader2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UrlContentPreview } from "./UrlContentPreview";

interface AudienceReviewsInputProps {
  value: string;
  onChange: (value: string) => void;
  url?: string;
  onUrlChange?: (url: string) => void;
}

export function AudienceReviewsInput({ value, onChange, url = "", onUrlChange }: AudienceReviewsInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlPreview, setUrlPreview] = useState<{
    url: string;
    content: string;
    metadata?: { title?: string; description?: string };
  } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB for reviews

    if (file.size > maxSize) {
      alert("File too large. Maximum size is 5MB.");
      return;
    }

    try {
      const text = await file.text();
      onChange(value ? `${value}\n\n---\n\n${text}` : text);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read file. Please try pasting text instead.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleClear = () => {
    onChange("");
  };

  const handleFetchUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "No URL provided",
        description: "Please enter a review page URL first.",
        variant: "destructive",
      });
      return;
    }

    setIsFetchingUrl(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-webpage', {
        body: { url: url.trim() }
      });

      if (error) throw error;

      if (data?.success) {
        setUrlPreview({
          url: url.trim(),
          content: data.content,
          metadata: data.metadata
        });
      } else {
        throw new Error(data?.error || 'Failed to fetch webpage');
      }
    } catch (error: any) {
      console.error('Error fetching URL:', error);
      toast({
        title: "Failed to fetch URL",
        description: error.message || "Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleApproveUrlContent = (editedContent: string) => {
    onChange(value ? `${value}\n\n---\n\n${editedContent}` : editedContent);
    toast({
      title: "Content added!",
      description: "Review page content has been added to your campaign.",
    });
    setUrlPreview(null);
  };

  const handleCancelUrlContent = () => {
    setUrlPreview(null);
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <Label className="text-base font-semibold">Audience Reviews & Feedback (Optional)</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Add customer reviews, testimonials, or feedback about competitor products. We'll use their language and pain points.
            </p>
          </div>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Alert className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <MessageSquare className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800 dark:text-purple-200 text-sm">
            Customer reviews reveal exact language, pain points, and desires. This makes your copy resonate more.
          </AlertDescription>
        </Alert>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop review files here, or
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("reviews-file-upload")?.click()}
            type="button"
          >
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <input
            id="reviews-file-upload"
            type="file"
            accept=".txt,.csv,.xlsx,.pdf,.md"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Accepts: .txt, .csv, .xlsx, .pdf, .md (max 5MB)
          </p>
        </div>

        {/* URL Fetch Section */}
        <div className="space-y-3">
          <Label htmlFor="reviews-url" className="text-sm font-medium">
            Review Page URL
          </Label>
          <p className="text-xs text-muted-foreground">
            Paste a link to a review page (Amazon, Trustpilot, G2, etc.)
          </p>
          <div className="flex gap-2">
            <Input
              id="reviews-url"
              type="url"
              value={url}
              onChange={(e) => onUrlChange?.(e.target.value)}
              placeholder="https://www.amazon.com/product-reviews/..."
              className="flex-1"
              disabled={isFetchingUrl}
            />
            <Button
              type="button"
              onClick={handleFetchUrl}
              disabled={isFetchingUrl || !url.trim()}
              variant="secondary"
            >
              {isFetchingUrl ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Fetch
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Text Paste Area */}
        <div>
          <Label htmlFor="reviews-text" className="text-sm font-medium">
            Customer Reviews & Feedback
          </Label>
          <p className="text-xs text-muted-foreground mb-2">
            Or paste review text directly here
          </p>
          <TextareaWithVoice
            id="reviews-text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste customer reviews, testimonials, or feedback...

WHAT THEY LIKE:
- 'Finally something that actually works!'
- 'Saved me 10 hours a week'
- 'Way easier than [competitor]'

WHAT THEY DISLIKE:
- 'Too complicated to set up'
- 'Customer support is slow'
- 'Missing key features like X'

PAIN POINTS MENTIONED:
- 'I was spending 3 hours every morning just...'
- 'My team was frustrated because...'
- 'Before this I tried 5 different tools and...'
"
            className="mt-2 min-h-[250px] font-mono text-sm"
          />
          {value && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{value.split(/\s+/).length} words</span>
              <span>•</span>
              <span>{value.split('\n\n').length} sections</span>
              {value.toLowerCase().includes('like') && (
                <span className="flex items-center gap-1 text-green-600">
                  <ThumbsUp className="h-3 w-3" />
                  Positives found
                </span>
              )}
              {value.toLowerCase().includes('dislike') && (
                <span className="flex items-center gap-1 text-red-600">
                  <ThumbsDown className="h-3 w-3" />
                  Pain points found
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">💡 Pro tip:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Include exact quotes from reviews (with quotation marks)</li>
            <li>Separate what they LIKE vs. DISLIKE</li>
            <li>Note specific pain points and frustrations</li>
            <li>Include Reddit comments, Amazon reviews, survey responses</li>
          </ul>
        </div>
      </CardContent>

      <UrlContentPreview
        open={!!urlPreview}
        onOpenChange={(open) => !open && setUrlPreview(null)}
        url={urlPreview?.url || ""}
        content={urlPreview?.content || ""}
        metadata={urlPreview?.metadata}
        onApprove={handleApproveUrlContent}
        onCancel={handleCancelUrlContent}
      />
    </Card>
  );
}
