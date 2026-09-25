import { AdminDashboard } from "@/components/workspace/admin-dashboard";
export default function AdminPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Authorized administrators</p>
      <h1>Service oversight.</h1>
      <AdminDashboard />
    </main>
  );
}
