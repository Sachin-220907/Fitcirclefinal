import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import "../styles/authentication.css";

export function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { signup, loginWithDemo } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await signup({ displayName: fullName, email, password });
      // Mandatory onboarding step before dashboard!
      navigate("/onboarding");
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemoAccess() {
    await loginWithDemo();
    navigate("/dashboard");
  }

  return (
    <main className="auth-welcome">
      <div className="auth-container">
        <img
          src="/images/fitcircle-logo.png"
          alt="FitCircle Logo"
          className="auth-logo"
        />

        <h1>Join FitCircle</h1>

        <p className="auth-subtitle">
          Start logging meals, workouts, and connecting with fitness buddies.
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        <button
          type="button"
          className="auth-button auth-demo-btn"
          onClick={handleDemoAccess}
        >
          ⚡ Quick Demo Access (Explore Directly)
        </button>

        <div className="auth-divider">
          <span>OR SIGN UP</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-actions">
          <input
            type="text"
            placeholder="Full Name (e.g. Sachin)"
            className="auth-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 8 characters)"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="auth-button auth-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Continue to Measurement Setup ➔"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <GoogleSignInButton />

        <Link to="/signup/phone" className="auth-button auth-phone">
          Sign Up with Phone Number
        </Link>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
}

export default SignupPage;
