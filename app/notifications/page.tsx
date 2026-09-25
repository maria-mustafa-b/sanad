import { Records } from "@/components/workspace/records";
export default function NotificationsPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Meaningful updates</p>
      <h1>Notifications</h1>
      <Records type="notifications" />
    </main>
  );
}
