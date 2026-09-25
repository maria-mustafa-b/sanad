import { Records } from "@/components/workspace/records";
export default function ClaimsPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Your records</p>
      <h1>My situations</h1>
      <Records type="claims" />
    </main>
  );
}
