"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="narrow">
      <h1>We couldn’t load this page.</h1>
      <p>Please try again.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
