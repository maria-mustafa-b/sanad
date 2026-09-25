import { Records } from "@/components/workspace/records";
export default function CredentialsPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Portable records</p>
      <h1>My credentials</h1>
      <p className="lede">
        A valid credential preserves what you confirmed. It does not prove the
        underlying facts.
      </p>
      <Records type="credentials" />
    </main>
  );
}
