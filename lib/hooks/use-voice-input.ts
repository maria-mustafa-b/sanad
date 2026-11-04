"use client";

import { useRef, useState } from "react";

const SILENCE_LEVEL = 0.015; // RMS below this counts as silence
const SILENCE_STOP_MS = 1800; // stop this long after the user pauses
const NO_SPEECH_STOP_MS = 8000;
const MAX_RECORDING_MS = 30000;

type Options = { onText: (text: string) => void; onError: (message: string) => void };

// Records the microphone, stops when the user pauses, and transcribes on the server
// so the spoken language is detected automatically.
export function useVoiceInput({ onText, onError }: Options) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const handlers = useRef({ onText, onError });
  handlers.current = { onText, onError };

  const stop = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const transcribe = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const form = new FormData();
      form.append("file", blob, blob.type.includes("mp4") ? "speech.mp4" : "speech.webm");
      const res = await fetch("/api/ai/transcribe", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) handlers.current.onError(data.message || "SANAD could not transcribe that. Please try again.");
      else if (data.text) handlers.current.onText(data.text);
      else handlers.current.onError("I didn't catch that. Tap the mic and try again.");
    } catch {
      handlers.current.onError("Network error during transcription. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      handlers.current.onError("Voice input isn't supported in this browser. Please type instead.");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      handlers.current.onError("Microphone access is blocked. Allow the mic in your browser settings, or type instead.");
      return;
    }

    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    const chunks: Blob[] = [];
    let heardSpeech = false;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    audioContext.createMediaStreamSource(stream).connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    const startedAt = Date.now();
    let lastSoundAt = startedAt;

    const monitor = setInterval(() => {
      analyser.getFloatTimeDomainData(samples);
      const rms = Math.sqrt(samples.reduce((sum, v) => sum + v * v, 0) / samples.length);
      const now = Date.now();
      if (rms > SILENCE_LEVEL) {
        heardSpeech = true;
        lastSoundAt = now;
      }
      const pausedAfterSpeech = heardSpeech && now - lastSoundAt > SILENCE_STOP_MS;
      const neverSpoke = !heardSpeech && now - startedAt > NO_SPEECH_STOP_MS;
      if (pausedAfterSpeech || neverSpoke || now - startedAt > MAX_RECORDING_MS) stop();
    }, 150);

    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.onstop = () => {
      clearInterval(monitor);
      stream.getTracks().forEach((t) => t.stop());
      audioContext.close().catch(() => {});
      setIsRecording(false);
      if (!heardSpeech) {
        handlers.current.onError("I didn't hear anything. Tap the mic and try again.");
        return;
      }
      transcribe(new Blob(chunks, { type: recorder.mimeType }));
    };

    recorder.start();
    setIsRecording(true);
  };

  return { isRecording, isTranscribing, toggle: () => (recorderRef.current?.state === "recording" ? stop() : start()) };
}
