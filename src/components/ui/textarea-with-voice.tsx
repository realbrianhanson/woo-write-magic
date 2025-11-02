import * as React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useVoiceInput } from "@/hooks/useVoiceInput";

export interface TextareaWithVoiceProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onTranscriptionComplete?: (text: string) => void;
}

const TextareaWithVoice = React.forwardRef<HTMLTextAreaElement, TextareaWithVoiceProps>(
  ({ className, onTranscriptionComplete, onChange, value, ...props }, ref) => {
    const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput();

    const handleVoiceClick = async () => {
      if (isRecording) {
        try {
          const transcription = await stopRecording();
          const currentValue = value?.toString() || '';
          const newValue = currentValue ? `${currentValue}\n\n${transcription}` : transcription;
          
          // Create synthetic event
          const syntheticEvent = {
            target: { value: newValue }
          } as React.ChangeEvent<HTMLTextAreaElement>;
          
          onChange?.(syntheticEvent);
          onTranscriptionComplete?.(transcription);
        } catch (error) {
          console.error('Failed to stop recording:', error);
        }
      } else {
        await startRecording();
      }
    };

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "ghost"}
          className={cn(
            "absolute right-2 top-2 h-8 w-8",
            isRecording && "animate-pulse"
          )}
          onClick={handleVoiceClick}
          disabled={isTranscribing}
          title={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isTranscribing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

TextareaWithVoice.displayName = "TextareaWithVoice";

export { TextareaWithVoice };
