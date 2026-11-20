import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import "../styles/authentication.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Sign in failed. Please try again.");
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

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Sign in to access your workout and nutrition dashboard.
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        <button
          type="button"
          className="auth-button auth-demo-btn"
          onClick={handleDemoAccess}
        >
          ⚡ One-Click Demo Login
        </button>

        <div className="auth-divider">
          <span>OR SIGN IN</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-actions">
          <input
            type="email"
            placeholder="Email address (e.g. sachin@fitcircle.app)"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="auth-button auth-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <GoogleSignInButton />

        <Link to="/login/phone" className="auth-button auth-phone">
          Continue with Phone Number
        </Link>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
