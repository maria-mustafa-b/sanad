"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AccessibleStatusAnnouncer } from "@/components/accessibility/accessible-status-announcer";
import { extractSituationFacts } from "@/lib/actions/extract";

export function SituationDraft() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition (Web Speech API)
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setMessage("Recording stopped.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Let it detect the language automatically as best as possible
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setText((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setMessage("Error occurred in recognition.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setMessage("Listening... Speak now.");
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setMessage("Please enter some text to analyze.");
      return;
    }

    setIsLoading(true);
    setMessage("Analyzing situation with AI...");

    const result = await extractSituationFacts(text);

    setIsLoading(false);
    if (result.success && result.data) {
      setAiData(result.data);
      setMessage("Analysis complete. See extracted facts below.");

      // Automatic Text-To-Speech for the AI response
      if ("speechSynthesis" in window && result.data.clarificationMessage) {
        const utterance = new SpeechSynthesisUtterance(result.data.clarificationMessage);
        window.speechSynthesis.speak(utterance);
      }

    } else {
      setMessage("Failed to analyze. Please try again.");
    }
  };

  return (
    <section className="form-card flex flex-col gap-4">
      <div>
        <label htmlFor="situation">What is happening?</label>
        <p id="input-help">
          Type your situation, or click the microphone to speak. You can mix languages.
        </p>
      </div>

      <textarea
        id="situation"
        dir="auto"
        aria-describedby="input-help"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setMessage("");
        }}
        maxLength={4000}
        rows={6}
        placeholder="e.g. Meri job chali gayi hai aur August ki salary bhi nahi mili."
        className="w-full p-3 border rounded-md"
      />

      <div className="actions flex gap-2 flex-wrap">
        <Button
          variant={isRecording ? "destructive" : "secondary"}
          onClick={toggleRecording}
        >
          {isRecording ? "🛑 Stop Recording" : "🎤 Speak"}
        </Button>
        <Button
          onClick={() => {
            setText("Meri job chali gayi hai aur August ki salary bhi nahi mili.");
            setMessage("Example loaded. You can edit the situation text.");
            setAiData(null);
          }}
          variant="outline"
        >
          Load example
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setText("");
            setAiData(null);
            setMessage("Situation text cleared.");
          }}
        >
          Clear
        </Button>
      </div>

      <div className="mt-4">
        <Button
          className="w-full"
          onClick={handleAnalyze}
          disabled={isLoading || !text}
        >
          {isLoading ? "Analyzing..." : "Analyze Situation"}
        </Button>
      </div>

      {aiData && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2">AI Extraction Results</h3>

          <div className="space-y-4">
            <div>
              <span className="font-medium text-sm text-primary">Intent:</span>
              <p>{aiData.intent}</p>
            </div>

            <div>
              <span className="font-medium text-sm text-primary">Extracted Facts:</span>
              <ul className="list-disc pl-5">
                {aiData.facts.map((fact: string, idx: number) => (
                  <li key={idx}>{fact}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-medium text-sm text-primary">Missing Information:</span>
              <ul className="list-disc pl-5">
                {aiData.missingInformation.map((info: string, idx: number) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-secondary/20 rounded-md border border-secondary/50">
              <span className="font-medium text-sm text-primary">AI Clarification Response:</span>
              <p className="italic mt-1">"{aiData.clarificationMessage}"</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  if ("speechSynthesis" in window) {
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance(aiData.clarificationMessage));
                  }
                }}
              >
                🔊 Read Aloud
              </Button>
            </div>
          </div>
        </div>
      )}

      <p aria-hidden="true" className="text-sm text-muted-foreground mt-2">{message}</p>
      <AccessibleStatusAnnouncer message={message} />
    </section>
  );
}
