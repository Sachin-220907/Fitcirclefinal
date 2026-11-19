export function GlobalErrorPage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Application Error</h1>
      <p>An unexpected problem occurred. Please refresh the page.</p>
      <button onClick={() => window.location.reload()} style={{ marginTop: "16px", padding: "8px 16px" }}>
        Refresh
      </button>
    </div>
  );
}

export default GlobalErrorPage;
