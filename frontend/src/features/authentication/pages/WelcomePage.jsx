import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import "../styles/authentication.css";

export function WelcomePage() {
  const { loginWithDemo } = useAuth();
  const navigate = useNavigate();

  async function handleInstantDemo() {
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

        <h1>Welcome to FitCircle</h1>

        <p className="auth-subtitle">
          Your complete fitness, nutrition & community journey starts here.
        </p>

        {/* Instant Demo Access Button using same blue colour grading with proper icon */}
        <button
          type="button"
          className="auth-button auth-demo-btn"
          onClick={handleInstantDemo}
        >
          <span className="btn-icon-symbol">🚀</span>
          <span>Instant Demo Access (No Password)</span>
        </button>

        <div className="auth-divider">
          <span>OR SIGN IN</span>
        </div>

        <div className="auth-actions">
          <Link to="/login" className="auth-button auth-primary">
            Sign In with Email
          </Link>

          <Link to="/signup" className="auth-button auth-secondary">
            Create an Account
          </Link>
        </div>

        <div className="auth-divider">
          <span>OR SOCIAL</span>
        </div>

        {/* Social login area with well-spaced, uncluttered alignment */}
        <div className="social-login-stack">
          <div className="google-btn-wrapper">
            <GoogleSignInButton />
          </div>

          <Link to="/login/phone" className="auth-button auth-phone">
            <span>📱 Continue with Phone Number</span>
          </Link>
        </div>

        <p className="auth-footer">
          Phone verification is optional for email and Google registration.
        </p>
      </div>
    </main>
  );
}

export default WelcomePage;
