import { Link } from "react-router-dom";
import "../styles/authentication.css";

export function EmailAuthPage() {
  return (
    <main className="auth-welcome">
      <div className="auth-container">
        <img
          src="/images/fitcircle-logo.png"
          alt="FitCircle Logo"
          className="auth-logo"
        />

        <h1>Continue with Email</h1>

        <p className="auth-subtitle">
          Choose whether you want to sign in or create an account with email.
        </p>

        <div className="auth-actions">
          <Link to="/login" className="auth-button auth-primary">
            Sign In with Email
          </Link>

          <Link to="/signup" className="auth-button auth-secondary">
            Sign Up with Email
          </Link>
        </div>

        <p className="auth-footer">
          <Link to="/welcome">← Back to Welcome</Link>
        </p>
      </div>
    </main>
  );
}

export default EmailAuthPage;
