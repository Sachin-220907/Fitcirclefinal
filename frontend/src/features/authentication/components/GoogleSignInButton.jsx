import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
  .replace(/\/+$/, "");

export function GoogleSignInButton() {
  const navigate = useNavigate();
  const { loginWithGoogleProfile } = useAuth();
  const [error, setError] = useState("");

  async function handleGoogleLogin(credential) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential })
      });
      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
        throw new Error(message || "Google sign-in failed. Please try again.");
      }

      if (!data.user) {
        throw new Error("Google sign-in did not return a user.");
      }

      loginWithGoogleProfile(data.user);
      navigate("/dashboard");
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Google sign-in failed. Please try again."
      );
    }
  }

  return (
    <div className="google-login-container">
      {error && <div className="auth-error-banner" role="alert">{error}</div>}
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            handleGoogleLogin(credentialResponse.credential);
          } else {
            setError("Google did not return a sign-in credential. Please try again.");
          }
        }}
        onError={() => {
          setError("Google sign-in was cancelled or could not be completed.");
        }}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        shape="rectangular"
      />
    </div>
  );
}

export default GoogleSignInButton;
