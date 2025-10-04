import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CompetitorCopyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CompetitorCopyInput({ value, onChange }: CompetitorCopyInputProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      alert("File too large. Maximum size is 2MB.");
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

  return (
    <Card className="border-dashed">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <Label className="text-base font-semibold">Competitor Copy (Optional)</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Upload competitor emails or paste their copy. We'll analyze patterns and help you stand out.
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

        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            Add competitor examples to avoid generic patterns and create more differentiated copy.
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
            Drag & drop email files here, or
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("competitor-file-upload")?.click()}
            type="button"
          >
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <input
            id="competitor-file-upload"
            type="file"
            accept=".txt,.eml,.html,.md"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Accepts: .txt, .eml, .html, .md (max 2MB)
          </p>
        </div>

        {/* Text Paste Area */}
        <div>
          <Label htmlFor="competitor-text" className="text-sm font-medium">
            Or paste competitor email copy
          </Label>
          <Textarea
            id="competitor-text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste competitor email copy here...

Example:
Subject: Transform your business today!
Hey [Name],
I wanted to reach out because...
etc."
            className="mt-2 min-h-[200px] font-mono text-sm"
          />
          {value && (
            <p className="text-xs text-muted-foreground mt-2">
              {value.split(/\s+/).length} words • {value.split('\n\n').length} sections
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
