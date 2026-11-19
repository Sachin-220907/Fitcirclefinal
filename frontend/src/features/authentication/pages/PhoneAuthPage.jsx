import { Link } from "react-router-dom";
import "../styles/authentication.css";

export function PhoneAuthPage() {
  return (
    <main className="auth-welcome">
      <div className="auth-container">
        <img
          src="/images/fitcircle-logo.png"
          alt="FitCircle Logo"
          className="auth-logo"
        />

        <h1>Continue with Phone</h1>

        <p className="auth-subtitle">
          Choose whether you want to sign in or create a new account.
        </p>

        <div className="auth-actions">
          <Link to="/login/phone" className="auth-button auth-primary">
            Sign In with Phone
          </Link>

          <Link to="/signup/phone" className="auth-button auth-secondary">
            Sign Up with Phone
          </Link>
        </div>

        <p className="auth-footer">
          <Link to="/welcome">← Back to Welcome</Link>
        </p>
      </div>
    </main>
  );
}

export default PhoneAuthPage;
