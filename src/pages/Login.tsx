import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <section className="form-card" style={{ maxWidth: "34rem", margin: "0 auto" }}>
        <h1 className="page-title" style={{ marginTop: 0 }}>
          Log in
        </h1>
        <p className="muted">
          The UI is ready for Supabase Auth wiring with email and password.
        </p>
        <div className="results-list">
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Password" type="password" />
          <button className="button" type="button">
            Continue
          </button>
        </div>
        <p className="muted">
          No account yet? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
}
