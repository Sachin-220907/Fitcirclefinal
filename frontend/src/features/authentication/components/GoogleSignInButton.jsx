import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
  .replace(/\/+$/, "");

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT Decode error:", e);
    return null;
  }
}

export function GoogleSignInButton() {
  const navigate = useNavigate();
  const { loginWithGoogleProfile, loginWithDemo } = useAuth();

  async function handleGoogleLogin(credential) {
    // 1. First parse the real Google OAuth credential
    const googleProfile = parseJwt(credential);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential })
      });

      if (response.ok) {
        const data = await response.json();
        const authedUser = data.user || data;
        loginWithGoogleProfile(authedUser);
        navigate("/dashboard");
        return;
      }
    } catch {
      // Backend not running
    }

    // 2. Authenticate directly with the real Google user profile data
    if (googleProfile) {
      loginWithGoogleProfile({
        name: googleProfile.name || googleProfile.given_name || "Google Athlete",
        email: googleProfile.email,
        picture: googleProfile.picture,
        sub: googleProfile.sub
      });
      navigate("/dashboard");
    } else {
      loginWithDemo().then(() => navigate("/dashboard"));
    }
  }

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            handleGoogleLogin(credentialResponse.credential);
          } else {
            loginWithDemo().then(() => navigate("/dashboard"));
          }
        }}
        onError={() => {
          console.warn("Google sign-in canceled or unconfigured.");
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
