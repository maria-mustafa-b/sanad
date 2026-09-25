import { ServiceBrowser } from "@/components/workspace/service-browser";
export default function ServicesPage() {
  return (
    <main id="main" className="narrow wide-flow">
      <p className="eyebrow">Official-source directory</p>
      <h1>Explore possible support.</h1>
      <p className="lede">
        Search vetted UAE government information and service links. SANAD does
        not decide eligibility or submit official applications.
      </p>
      <ServiceBrowser />
    </main>
  );
}
