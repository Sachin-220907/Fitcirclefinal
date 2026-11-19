import "../styles/intro.css";

export function IntroAnimation() {
  return (
    <div className="intro-screen">
      <div className="intro-logo-container">
        <img
          src="/images/fitcircle-logo.png"
          alt="FitCircle Logo"
          className="intro-logo"
        />
        <div className="intro-loading-bar">
          <div className="intro-loading-fill"></div>
        </div>
      </div>
    </div>
  );
}

export default IntroAnimation;
