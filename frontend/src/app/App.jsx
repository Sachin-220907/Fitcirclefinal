import AppRouter from "./router";
import ErrorBoundary from "./error/ErrorBoundary";
import NutrientGlossyBackground from "./components/NutrientGlossyBackground";

export function App() {
  return (
    <ErrorBoundary>
      <NutrientGlossyBackground />
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
