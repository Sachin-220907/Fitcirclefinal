import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IntroAnimation from "../components/IntroAnimation";

export function IntroPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome", { replace: true });
    }, 2400);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main>
      <IntroAnimation />
    </main>
  );
}

export default IntroPage;
