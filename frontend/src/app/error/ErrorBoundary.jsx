import { Component } from "react";

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FitCircle Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            We encountered an unexpected error while loading this page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/dashboard";
            }}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Go to Dashboard
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
