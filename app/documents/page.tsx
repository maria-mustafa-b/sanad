import { DocumentVault } from "@/components/workspace/document-vault";
export default function DocumentsPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Your evidence</p>
      <h1>Private documents.</h1>
      <DocumentVault />
    </main>
  );
}
