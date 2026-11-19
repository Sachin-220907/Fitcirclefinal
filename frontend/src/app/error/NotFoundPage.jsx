import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "5rem", color: "var(--accent-color)", fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: "1.75rem", margin: "10px 0" }}>Page Not Found</h2>
      <p style={{ color: "var(--text-secondary)", maxWidth: "400px", marginBottom: "25px" }}>
        The page you are looking for doesn't exist or has been moved to another section.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "12px 24px",
          background: "var(--accent-color)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Return to Dashboard
      </button>
    </main>
  );
}

export default NotFoundPage;
