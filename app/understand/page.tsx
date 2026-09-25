import { SituationFlow } from "@/components/workspace/situation-flow";
export default function Understand() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Your SANAD journey</p>
      <h1>Start with your own words.</h1>
      <p className="lede">
        Describe a situation, review the interpretation, confirm your facts and
        carry a verifiable record to the next step.
      </p>
      <SituationFlow />
    </main>
  );
}
