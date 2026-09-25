import { ProfileForm } from "@/components/workspace/profile-form";
export default function ProfilePage() {
  return (
    <main id="main" className="narrow">
      <p className="eyebrow">Your preferences</p>
      <h1>Profile and accessibility.</h1>
      <ProfileForm />
    </main>
  );
}
