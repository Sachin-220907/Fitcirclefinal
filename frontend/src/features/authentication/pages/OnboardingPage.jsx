import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./OnboardingPage.css";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80"
];

export function OnboardingPage() {
  const { user, completeOnboarding, checkUsernameAvailable } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form states
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || AVATAR_PRESETS[0]);
  const [gender, setGender] = useState("");

  // Height and measurement
  const [height, setHeight] = useState("175");
  const [heightUnit, setHeightUnit] = useState("cm");

  // Weight and measurement
  const [weight, setWeight] = useState("70");
  const [weightUnit, setWeightUnit] = useState("kg");

  // Target weight
  const [targetWeight, setTargetWeight] = useState("68");
  const [targetWeightUnit, setTargetWeightUnit] = useState("kg");

  const [fitnessGoal, setFitnessGoal] = useState("Endurance & Lean Muscle");
  const [error, setError] = useState("");

  // Custom photo upload handler
  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const isUsernameAvailable = checkUsernameAvailable(username, user?.id);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!displayName.trim()) {
      setError("Please provide your display name.");
      return;
    }
    if (!username.trim() || !isUsernameAvailable) {
      setError("Please choose a unique, valid username.");
      return;
    }
    if (!gender) {
      setError("Please select your gender. This is required for metabolic calibration.");
      return;
    }
    if (!height || Number(height) <= 0) {
      setError("Please enter a valid height measurement.");
      return;
    }
    if (!weight || Number(weight) <= 0) {
      setError("Please enter a valid current weight.");
      return;
    }
    if (!targetWeight || Number(targetWeight) <= 0) {
      setError("Please specify your target goal weight.");
      return;
    }

    completeOnboarding({
      displayName: displayName.trim(),
      username: username.trim().toLowerCase().replace(/^@/, ""),
      avatarUrl,
      gender,
      height: Number(height),
      heightUnit,
      weight: Number(weight),
      weightUnit,
      targetWeight: Number(targetWeight),
      targetWeightUnit,
      fitnessGoal
    });

    navigate("/dashboard");
  }

  return (
    <main className="onboarding-page-shell">
      <div className="onboarding-card">
        <header className="onboarding-header">
          <img src="/images/fitcircle-logo.png" alt="FitCircle" className="onboarding-logo" />
          <h2>Personalize Your Fitness Profile</h2>
          <p>Complete your mandatory baseline measurements to unlock your custom dashboard.</p>
        </header>

        {error && <div className="onboarding-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          {/* Section 1: Profile Picture & Unique Username */}
          <div className="onboarding-section">
            <span className="step-tag">Step 1: Identity & Avatar</span>
            <div className="avatar-picker-row">
              <div className="current-avatar-preview">
                <img src={avatarUrl} alt="Selected Avatar" />
                <button
                  type="button"
                  className="upload-overlay-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload picture from your computer"
                >
                  📷 Upload Custom Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>

              <div className="preset-avatars-box">
                <span className="preset-label">Or choose an avatar:</span>
                <div className="presets-row">
                  {AVATAR_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`preset-thumb ${avatarUrl === p ? "selected" : ""}`}
                      onClick={() => setAvatarUrl(p)}
                    >
                      <img src={p} alt="Preset" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-two-cols">
              <div className="form-field">
                <label>Display Name <small>(Can be common, e.g. Alex)</small></label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Unique Username <small>(Must be unique)</small>
                </label>
                <div className="username-input-wrap">
                  <span className="at-prefix">@</span>
                  <input
                    type="text"
                    placeholder="e.g. alex99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    required
                  />
                  {username && (
                    <span className={`uname-status ${isUsernameAvailable ? "valid" : "taken"}`}>
                      {isUsernameAvailable ? "✓ Available" : "✕ Taken"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Mandatory Physical & Body Measurements */}
          <div className="onboarding-section">
            <span className="step-tag">Step 2: Mandatory Measurements</span>

            <div className="form-field">
              <label>Biological Gender <small>(Required for accurate BMR & TDEE)</small></label>
              <div className="gender-options-grid">
                {["Male", "Female", "Prefer not to say"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`gender-chip ${gender === g ? "active" : ""}`}
                    onClick={() => setGender(g)}
                  >
                    {g === "Male" ? "♂ Male" : g === "Female" ? "♀ Female" : "⚧ Other"}
                  </button>
                ))}
              </div>
            </div>

            <div className="measurements-grid">
              {/* Height with custom unit */}
              <div className="measurement-card">
                <div className="m-card-top">
                  <label>Height</label>
                  <div className="unit-selector-pill">
                    <button
                      type="button"
                      className={heightUnit === "cm" ? "active" : ""}
                      onClick={() => setHeightUnit("cm")}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      className={heightUnit === "m" ? "active" : ""}
                      onClick={() => setHeightUnit("m")}
                    >
                      m
                    </button>
                    <button
                      type="button"
                      className={heightUnit === "ft" ? "active" : ""}
                      onClick={() => setHeightUnit("ft")}
                    >
                      ft
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder={heightUnit === "cm" ? "e.g. 178" : heightUnit === "m" ? "e.g. 1.78" : "e.g. 5.9"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>

              {/* Current Weight with custom unit */}
              <div className="measurement-card">
                <div className="m-card-top">
                  <label>Current Weight</label>
                  <div className="unit-selector-pill">
                    <button
                      type="button"
                      className={weightUnit === "kg" ? "active" : ""}
                      onClick={() => setWeightUnit("kg")}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      className={weightUnit === "lbs" ? "active" : ""}
                      onClick={() => setWeightUnit("lbs")}
                    >
                      lbs
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="0.1"
                  placeholder={weightUnit === "kg" ? "e.g. 72.5" : "e.g. 160"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>

              {/* Target Weight with custom unit */}
              <div className="measurement-card">
                <div className="m-card-top">
                  <label>Target Goal Weight</label>
                  <div className="unit-selector-pill">
                    <button
                      type="button"
                      className={targetWeightUnit === "kg" ? "active" : ""}
                      onClick={() => setTargetWeightUnit("kg")}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      className={targetWeightUnit === "lbs" ? "active" : ""}
                      onClick={() => setTargetWeightUnit("lbs")}
                    >
                      lbs
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="0.1"
                  placeholder={targetWeightUnit === "kg" ? "e.g. 70" : "e.g. 154"}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Goal */}
          <div className="onboarding-section">
            <span className="step-tag">Step 3: Primary Fitness Focus</span>
            <div className="goals-options-grid">
              {[
                { title: "Lose Fat & Tone", icon: "🔥", desc: "Caloric deficit & cardiovascular endurance" },
                { title: "Build Lean Muscle", icon: "💪", desc: "Hypertrophy & high protein nutrition" },
                { title: "Endurance & Speed", icon: "⚡", desc: "Cardio conditioning & stamina" },
                { title: "Health & Longevity", icon: "🥗", desc: "Daily mobility, water & steady habits" }
              ].map((item) => (
                <div
                  key={item.title}
                  className={`goal-card-option ${fitnessGoal === item.title ? "active" : ""}`}
                  onClick={() => setFitnessGoal(item.title)}
                >
                  <span className="goal-icon">{item.icon}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="onboarding-submit-btn">
            Save Measurements & Open Dashboard ➔
          </button>
        </form>
      </div>
    </main>
  );
}

export default OnboardingPage;
