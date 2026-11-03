import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { SituationProvider } from "@/lib/context/SituationContext";

export const metadata: Metadata = {
  title: "SANAD | Your Guide to UAE Government Support",
  description: "Conversation-first UAE government services assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
      </head>
      <body className="bg-[#FAFBF8] text-[#202A27] font-sans antialiased min-h-screen flex flex-col">
        <Script id="google-translate-init" strategy="beforeInteractive">
          {"function googleTranslateElementInit() { new window.google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,ar,ur,hi,bn,ml', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element'); }"}
        </Script>
        <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <SituationProvider>
          <Shell>
            {children}
          </Shell>
        </SituationProvider>
      </body>
    </html>
  );
}
