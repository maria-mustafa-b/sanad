import Link from "next/link";
import {
  ArrowRight,
  Languages,
  FileCheck2,
  BellRing,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoMode } from "@/lib/database/repository";
export const dynamic = "force-dynamic";
export default function Home() {
  const demo = demoMode();
  return (
    <main id="main">
      <section className="hero">
        <div>
          <p className="eyebrow">A little clarity. A way forward.</p>
          <h1>
            Your situation is unique.
            <br />
            <em>Your next step can be clear.</em>
          </h1>
          <p className="lede">
            Explain what’s happening in your own words. SANAD helps you confirm
            the facts, carry a verifiable record, and find potentially relevant
            support.
          </p>
          <div className="actions">
            <Button asChild>
              <Link href="/onboarding">
                {demo ? "Try Demo" : "Get started"}{" "}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/verify">About verification</Link>
            </Button>
          </div>
          <p className="small-note">
            English · العربية · हिन्दी · اردو — planned language support
          </p>
        </div>
        <aside className="story-card" aria-label="Illustrative journey">
          <div className="card-top">
            <span className="eyebrow">One connected journey</span>
            <span className="example">Illustration</span>
          </div>
          <blockquote>
            “Meri job chali gayi hai aur August ki salary bhi nahi mili.”
          </blockquote>
          <p className="translation">
            “I lost my job, and I haven’t received my August salary.”
          </p>
          <div className="example-facts">
            <span>
              Employment situation<strong>Job loss</strong>
            </span>
            <span>
              Reported concern<strong>Unpaid wages</strong>
            </span>
          </div>
          <p className="trust">
            <Check size={18} aria-hidden="true" /> You review the facts before a
            record is issued.
          </p>
        </aside>
      </section>
      <section className="journey">
        <p className="eyebrow">Designed around you</p>
        <h2>From uncertainty to a next step.</h2>
        <div className="feature-grid">
          {[
            {
              icon: Languages,
              title: "Explain naturally",
              text: "Mixed languages and imperfect spelling belong here. You should not need the perfect words to ask for help.",
            },
            {
              icon: FileCheck2,
              title: "Carry a clear record",
              text: "Confirm what was understood. A portable credential can show that your record has not been altered or revoked.",
            },
            {
              icon: BellRing,
              title: "Stay informed",
              text: "Follow your application with visible updates and screen-reader announcements when something changes.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <article key={title}>
              <div className="feature-top">
                <Icon size={25} aria-hidden="true" />
                <span>0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="trust-banner">
        <Shield />
        <div>
          <h2>Trust starts with knowing what a record proves.</h2>
          <p>
            A valid credential proves issuance and integrity. It does not
            establish that a reported claim is true, or guarantee eligibility
            for support.
          </p>
        </div>
      </section>
    </main>
  );
}
function Shield() {
  return <FileCheck2 size={34} aria-hidden="true" />;
}
