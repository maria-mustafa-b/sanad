import { redirect } from "next/navigation";

// Credential details come only from the public verifier, which checks the real registry.
export default async function CredentialDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/verify?id=${encodeURIComponent(id)}`);
}
