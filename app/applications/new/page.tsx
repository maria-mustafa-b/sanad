import { redirect } from "next/navigation";

// The guided application flow replaced this demo page.
export default function NewApplicationPage() {
  redirect("/applications/family-sponsorship");
}
