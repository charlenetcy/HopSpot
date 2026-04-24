import { Link } from "react-router-dom";

export function SignUpPage() {
  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <section className="form-card" style={{ maxWidth: "34rem", margin: "0 auto" }}>
        <h1 className="page-title" style={{ marginTop: 0 }}>
          Create account
        </h1>
        <p className="muted">
          This follows the PRD shape: email, password, display name, and optional username.
        </p>
        <div className="results-list">
          <input className="input" placeholder="Display name" />
          <input className="input" placeholder="Username (optional)" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Password" type="password" />
          <button className="button" type="button">
            Sign up
          </button>
        </div>
        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
