import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="narrow">
      <h1>Page not found</h1>
      <p>This page may not have been built yet.</p>
      <Link href="/">Return to SANAD</Link>
    </main>
  );
}
