import AppRouter from "./router";
import ErrorBoundary from "./error/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
