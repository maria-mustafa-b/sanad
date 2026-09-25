import { Dashboard } from "@/components/workspace/dashboard";
export default function DashboardPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Your space</p>
      <h1>Good to have you here.</h1>
      <p className="lede">
        Your situation, support resources and application updates in one place.
      </p>
      <Dashboard />
    </main>
  );
}
