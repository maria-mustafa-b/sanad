import { PublicVerifier } from "@/components/workspace/public-verifier";
export default function Verify() {
  return (
    <main id="main" className="narrow">
      <p className="eyebrow">Independent verification</p>
      <h1>A record you can check.</h1>
      <p className="lede">
        Use a credential ID or QR link to check issuance, integrity and
        revocation without seeing someone’s personal information.
      </p>
      <PublicVerifier />
    </main>
  );
}
