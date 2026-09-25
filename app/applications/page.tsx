import { Records } from "@/components/workspace/records";
export default function ApplicationsPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Follow progress</p>
      <h1>My applications</h1>
      <p className="notice">
        These SANAD journeys are simulations; use official sources for actual
        submissions.
      </p>
      <Records type="applications" />
    </main>
  );
}
