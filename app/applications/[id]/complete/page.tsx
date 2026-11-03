import { redirect } from "next/navigation";

// The old demo form is retired; guided applications follow the service SANAD matched.
export default function CompleteApplicationPage() {
  redirect("/applications/family-sponsorship");
}
