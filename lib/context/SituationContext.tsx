"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SituationProfile {
  summary: string;
  residency_status: string;
  employment_status: string;
  target_service: string;
  service_category: string;
  eligible: boolean;
  reasons: string[];
  documents_ready: string[];
  documents_needed: string[];
  next_steps: string[];
  last_updated?: string;
  confidence: number;
  /** Facts the user explicitly stated, keyed by a stable id. */
  facts?: Record<string, { label: string; value: string; confirmed?: boolean; source?: string }>;
  /** Catalogue services the assistant matched. */
  services?: { id: string; title: string; category: string; url: string; why?: string }[];
  missing_info?: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "sanad";
  text: string;
  audioUrl?: string;
  timestamp: string;
  structuredQuestions?: string[];
  quickActions?: { label: string; href: string }[];
}

interface SituationContextType {
  profile: SituationProfile | null;
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateProfile: (updates: Partial<SituationProfile>) => void;
  resetContext: () => void;
  clearChat: () => void;
}

const SituationContext = createContext<SituationContextType | null>(null);

export function SituationProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SituationProfile | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sanad_situation_profile");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null; // NO HARDCODED MOCK DATA
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sanad_chat_history");
      if (saved) {
        try { 
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return []; // FRESH EMPTY CONVERSATION
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (profile) {
        localStorage.setItem("sanad_situation_profile", JSON.stringify(profile));
      } else {
        localStorage.removeItem("sanad_situation_profile");
      }
    }
  }, [profile]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sanad_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const updateProfile = (updates: Partial<SituationProfile>) => {
    setProfile((prev) => {
      const base: SituationProfile = prev || {
        // Nothing is assumed: every field starts empty until the user states it.
        summary: "",
        residency_status: "",
        employment_status: "",
        target_service: "",
        service_category: "",
        eligible: false,
        reasons: [],
        documents_ready: [],
        documents_needed: [],
        next_steps: [],
        last_updated: "Just now",
        confidence: 0
      };
      return {
        ...base,
        ...updates,
        last_updated: "Just now"
      };
    });
  };

  const clearChat = () => {
    setMessages([]);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sanad_chat_history");
      localStorage.removeItem("sanad_situation_profile");
    }
  };

  const resetContext = () => {
    clearChat();
  };

  return (
    <SituationContext.Provider
      value={{
        profile,
        messages,
        addMessage,
        updateProfile,
        resetContext,
        clearChat
      }}
    >
      {children}
    </SituationContext.Provider>
  );
}

export function useSituation() {
  const context = useContext(SituationContext);
  if (!context) {
    throw new Error("useSituation must be used within a SituationProvider");
  }
  return context;
}
