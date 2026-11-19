import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppProviders from "./app/providers/AppProviders";
import App from "./app/App";
import "./index.css";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "519477137056-64qtmbrabthchrdqerfg6sfpprteb16i.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppProviders>
        <App />
      </AppProviders>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
