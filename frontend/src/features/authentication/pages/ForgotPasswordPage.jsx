import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/authentication.css";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="auth-welcome">
      <div className="auth-container">
        <img
          src="/images/fitcircle-logo.png"
          alt="FitCircle Logo"
          className="auth-logo"
        />

        <h1>Forgot Password?</h1>

        <p className="auth-subtitle">
          {submitted
            ? `If an account exists for ${email}, a password reset link has been sent.`
            : "Enter your registered email address to receive reset instructions."}
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="auth-actions">
            <input
              type="email"
              placeholder="Enter your email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="auth-button auth-primary">
              Send Password Reset Link
            </button>
          </form>
        ) : (
          <div className="auth-actions">
            <Link to="/login" className="auth-button auth-primary">
              Return to Sign In
            </Link>
          </div>
        )}

        <p className="auth-footer">
          Remember password? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
