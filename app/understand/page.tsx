import { SituationDraft } from "@/components/claims/situation-draft";
export default function Understand() {
  return (
    <main id="main" className="narrow">
      <p className="eyebrow">01 / Your situation</p>
      <h1>Start with your own words.</h1>
      <p className="lede">
        This foundation preview lets you try the input experience. AI analysis
        and account storage will be connected in the next phases.
      </p>
      <SituationDraft />
    </main>
  );
}
