import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SANAD — Support starts with understanding",
  description: "Understand your situation. Prove what matters. Find the support you need.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700&display=optional" />
      </head>
      <body>{children}</body>
    </html>
  );
}
