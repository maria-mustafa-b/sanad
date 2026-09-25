import { ApplicationDetail } from "@/components/workspace/application-detail";
export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Application journey</p>
      <h1>Progress and evidence.</h1>
      <ApplicationDetail id={id} />
    </main>
  );
}
