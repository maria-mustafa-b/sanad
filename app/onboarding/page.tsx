import { AccountForm } from "@/components/workspace/account-form";

export const dynamic = "force-dynamic";

export default function Onboarding() {
  return (
    <main id="main" className="narrow">
      <p className="eyebrow">Welcome to SANAD</p>
      <h1>Begin a clearer journey.</h1>
      <AccountForm demoEnabled={true} />
    </main>
  );
}
