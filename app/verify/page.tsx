export default function Verify() {
  return (
    <main id="main" className="narrow">
      <p className="eyebrow">Independent verification</p>
      <h1>A record you can check.</h1>
      <p className="lede">
        Public credential lookup will be added in phase 9. No credentials have
        been issued by this foundation build.
      </p>
      <section className="form-card">
        <h2>What verification will establish</h2>
        <ul className="bullets">
          <li>Which issuer created a record and when.</li>
          <li>Whether its content matches the issued hash.</li>
          <li>Whether the issuer has revoked it.</li>
        </ul>
        <p className="notice">
          Verification does not prove the underlying claim is true. Personal
          details and private documents will not be displayed here.
        </p>
      </section>
    </main>
  );
}
