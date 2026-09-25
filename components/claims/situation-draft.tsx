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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aiData, setAiData] = useState<Record<string, any> | null>(null);
  const [editableFacts, setEditableFacts] = useState<string[]>([]);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!replyText.trim() || !aiData) return;

    setIsLoading(true);
    setMessage("Processing follow-up with AI...");

    // Call the same action but pass the previous facts and the previous question it asked
    const result = await extractSituationFacts(replyText, aiData.facts, aiData.clarificationMessage);

    setIsLoading(false);
    if (result.success && result.data) {
      setAiData(result.data);
      if (result.data.facts) setEditableFacts(result.data.facts);
      setReplyText("");
      setMessage("Follow-up analysis complete.");

      if (result.data.clarificationMessage) {
        speakText(result.data.clarificationMessage, result.data.detectedLanguage);
      }
    } else {
      setMessage("Failed to analyze follow-up. Please try again.");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);



  const speakText = (textContent: string, targetLanguage?: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(textContent);

    const langToUse = targetLanguage || "mr-IN";

    // Get all available browser voices
    const voices = window.speechSynthesis.getVoices();

    // Try to find a voice that matches the exact language (e.g., mr-IN)
    const baseLang = langToUse.split('-')[0];
    const bestVoice =
      voices.find(v => v.lang === langToUse) ||
      voices.find(v => v.lang.startsWith(baseLang)) ||
      voices.find(v => v.lang === 'hi-IN') || // Fallback to Hindi if Marathi voice doesn't exist
      null;

    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    utterance.lang = langToUse;

    window.speechSynthesis.speak(utterance);
  };

  const [isRecordingReply, setIsRecordingReply] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const replyRecognitionRef = useRef<any>(null);

  type SpeechRecognitionCtor = new () => {
    continuous: boolean;
    interimResults: boolean;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  };
  type ExtendedWindow = typeof window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  function getSpeechRecognition(): SpeechRecognitionCtor | undefined {
    const w = window as ExtendedWindow;
    return w.SpeechRecognition || w.webkitSpeechRecognition;
  }

  const toggleRecordingReply = () => {
    if (isRecordingReply) {
      replyRecognitionRef.current?.stop();
      setIsRecordingReply(false);
      setMessage("Reply recording stopped.");
      return;
    }
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + " ";
      }
      if (finalTranscript) setReplyText((prev) => prev + finalTranscript);
    };
    recognition.onerror = () => { setIsRecordingReply(false); setMessage("Error in reply recognition."); };
    recognition.onend = () => setIsRecordingReply(false);
    recognition.start();
    replyRecognitionRef.current = recognition;
    setIsRecordingReply(true);
    setMessage("Listening for reply... Speak now.");
  };

  // Initialize Speech Recognition (Web Speech API)
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setMessage("Recording stopped.");
      return;
    }

    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
      if (result.data.facts) setEditableFacts(result.data.facts);
      setMessage("Analysis complete. See extracted facts below.");

      // Automatic Text-To-Speech for the AI response matching the language they used
      if (result.data.clarificationMessage) {
        speakText(result.data.clarificationMessage, result.data.detectedLanguage);
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

      <div className="actions flex gap-2 flex-wrap items-center">
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">AI Extraction Results</h3>
            {aiData.confidence && (
              <div className="text-sm font-medium px-3 py-1 bg-white border rounded-full shadow-sm flex items-center gap-2">
                Confidence:
                <span className={
                  aiData.confidence >= 90 ? "text-green-600" :
                    aiData.confidence >= 70 ? "text-yellow-600" : "text-red-600"
                }>
                  {aiData.confidence}%
                </span>
                {aiData.confidence < 70 && (
                  <span className="text-xs text-muted-foreground ml-1">(Needs clarity)</span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="font-medium text-sm text-primary">Intent:</span>
              <p>{aiData.intent}</p>
            </div>

            <div className="bg-white p-3 rounded-md border">
              <span className="font-medium text-sm text-primary flex items-center justify-between">
                Extracted Facts:
                <span className="text-xs font-normal text-muted-foreground">Click to edit if incorrect</span>
              </span>
              <ul className="mt-2 space-y-2">
                {editableFacts.map((fact: string, idx: number) => (
                  <li key={idx} className="flex">
                    <input
                      type="text"
                      value={fact}
                      onChange={(e) => {
                        const newFacts = [...editableFacts];
                        newFacts[idx] = e.target.value;
                        setEditableFacts(newFacts);
                        // Also update underlying aiData for follow-ups
                        setAiData({ ...aiData, facts: newFacts });
                      }}
                      className="w-full text-sm p-1.5 border-b border-transparent focus:border-teal-500 focus:outline-none hover:bg-stone-50 transition-colors"
                    />
                  </li>
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
              <p className="italic mt-1">&ldquo;{aiData.clarificationMessage}&rdquo;</p>
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => speakText(aiData.clarificationMessage, aiData.detectedLanguage)}
              >
                🔊 Read Aloud
              </Button>
            </div>

            {aiData.processGuide && aiData.processGuide.length > 0 && (
              <div className="mt-4 p-4 border border-teal-200 bg-teal-50 rounded-md">
                <h4 className="font-semibold text-teal-900 mb-2">Recommended Next Steps & Guidance</h4>
                <ol className="list-decimal pl-5 space-y-1 mb-3 text-sm text-teal-800">
                  {aiData.processGuide.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
                {aiData.serviceLinks && aiData.serviceLinks.length > 0 && (
                  <div className="text-sm">
                    <span className="font-semibold text-teal-900">Official Links:</span>
                    <ul className="list-disc pl-5">
                      {aiData.serviceLinks.map((link: string, idx: number) => (
                        <li key={idx}><a href="#" className="text-blue-600 underline">{link}</a></li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-teal-200">
                  <input type="file" id="docUpload" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setMessage(`Document '${e.target.files[0].name}' attached successfully! Analysis updated.`);
                    }
                  }} />
                  <Button onClick={() => document.getElementById('docUpload')?.click()}>
                    📎 Upload Requested Required Documents
                  </Button>
                </div>
              </div>
            )}

            {(!aiData.processGuide || aiData.processGuide.length === 0) && (
              <div className="mt-4 p-4 border rounded-md bg-background">
                <label htmlFor="followup" className="block text-sm font-medium mb-2">
                  Reply to AI to provide missing information or documents:
                </label>
                <div className="flex gap-2 mb-2">
                  <input type="file" id="docUploadFollowup" className="hidden" onChange={(e) => {
                    const files = e.target.files;
                    if (files && files[0]) {
                      setReplyText(prev => prev + ` [Attached Document: ${files[0].name}] `);
                    }
                  }} />
                  <Button variant="outline" onClick={() => document.getElementById('docUploadFollowup')?.click()}>
                    📎 Attach Document
                  </Button>
                  <Button
                    variant={isRecordingReply ? "destructive" : "outline"}
                    onClick={toggleRecordingReply}
                  >
                    {isRecordingReply ? "🛑 Stop" : "🎤 Speak Reply"}
                  </Button>
                </div>
                <textarea
                  id="followup"
                  dir="auto"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  placeholder="Type your reply here..."
                  className="w-full p-3 border rounded-md mb-2"
                />
                <Button
                  onClick={handleReply}
                  disabled={isLoading || !replyText.trim()}
                >
                  {isLoading ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <p aria-hidden="true" className="text-sm text-muted-foreground mt-2">{message}</p>
      <AccessibleStatusAnnouncer message={message} />
    </section>
  );
}
