import { useState } from "react";
import { useAuth } from "../../authentication/context/AuthContext";
import "./ProfilePage.css";

const ACHIEVEMENTS = [
  { id: 1, title: "14-Day Consistency Streak", icon: "🔥", desc: "Logged workouts and nutrition for 14 straight days", date: "Earned Nov 17, 2026", progress: 100 },
  { id: 2, title: "100K Steps Milestone", icon: "👟", desc: "Accumulated over 100,000 steps this month", date: "Earned Nov 12, 2026", progress: 100 },
  { id: 3, title: "Century Club (100kg+ Bench)", icon: "🏋️", desc: "Hit personal record bench press exceeding 100 kg", date: "Earned Nov 5, 2026", progress: 100 },
  { id: 4, title: "Hydration Hero", icon: "💧", desc: "Met 3.0L water goal for 10 consecutive days", date: "Earned Oct 28, 2026", progress: 85 }
];

export function ProfilePage() {
  const { user, updateUser, checkUsernameAvailable } = useAuth();

  const avatarInitial = (user?.email || user?.gmail || user?.username || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  const [displayName, setDisplayName] = useState(user?.displayName || "Alex Mercer");
  const [username, setUsername] = useState(user?.username || "alexmercer");
  const [bio, setBio] = useState(
    user?.bio || "Fitness enthusiast, marathon runner & wellness advocate. Working on personal endurance records!"
  );
  const [gender, setGender] = useState(user?.gender || "Male");

  const [height, setHeight] = useState(user?.stats?.height || 178);
  const [heightUnit, setHeightUnit] = useState(user?.stats?.heightUnit || "cm");

  const [weight, setWeight] = useState(user?.stats?.weight || 72.5);
  const [weightUnit, setWeightUnit] = useState(user?.stats?.weightUnit || "kg");

  const [targetWeight, setTargetWeight] = useState(user?.stats?.targetWeight || 70);
  const [targetWeightUnit, setTargetWeightUnit] = useState(user?.stats?.targetWeightUnit || "kg");

  const [fitnessGoal, setFitnessGoal] = useState(user?.stats?.fitnessGoal || "Endurance & Lean Muscle");

  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  let heightInMeters = 1.78;

  if (heightUnit === "cm") heightInMeters = Number(height) / 100;
  else if (heightUnit === "m") heightInMeters = Number(height);
  else if (heightUnit === "ft") heightInMeters = Number(height) * 0.3048;

  let weightInKg = 72.5;

  if (weightUnit === "kg") weightInKg = Number(weight);
  else if (weightUnit === "lbs") weightInKg = Number(weight) * 0.453592;

  const bmiValue =
    heightInMeters > 0
      ? (weightInKg / (heightInMeters * heightInMeters)).toFixed(1)
      : 22.9;

  let bmiCategory = "Normal Weight";
  let bmiColor = "#10b981";

  if (bmiValue < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "#f59e0b";
  } else if (bmiValue >= 25 && bmiValue < 30) {
    bmiCategory = "Overweight";
    bmiColor = "#f59e0b";
  } else if (bmiValue >= 30) {
    bmiCategory = "Obese";
    bmiColor = "#ef4444";
  }

  const isUsernameValid = checkUsernameAvailable(username, user?.id);

  function handleSaveProfile(e) {
    e.preventDefault();
    setSaveError("");

    if (!displayName.trim()) {
      setSaveError("Display name cannot be empty.");
      return;
    }

    if (!username.trim() || !isUsernameValid) {
      setSaveError("Please choose a unique, valid username.");
      return;
    }

    updateUser({
      displayName: displayName.trim(),
      username: username.trim().toLowerCase().replace(/^@/, ""),
      bio,
      gender,
      stats: {
        ...(user?.stats || {}),
        height: Number(height),
        heightUnit,
        weight: Number(weight),
        weightUnit,
        targetWeight: Number(targetWeight),
        targetWeightUnit,
        fitnessGoal
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  }

  return (
    <div className="profile-page-wrapper">
      <section className="profile-lively-hero">
        <div className="hero-banner-accent">
          <div className="hero-floating-pattern"></div>
        </div>

        <div className="hero-profile-core">
          <div className="hero-avatar-area">
            <div className="avatar-frame">
              <div className="hero-main-avatar avatar-initial">
                {avatarInitial}
              </div>
            </div>

            <span className="athlete-tier-ribbon">
              🏆 {user?.stats?.level || "Gold Tier Athlete"}
            </span>
          </div>

          <div className="hero-identity-area">
            <div className="identity-title-row">
              <h2>{displayName}</h2>
              <span className="verified-check" title="Verified Athlete">✓</span>
              <span className="identity-handle">@{username}</span>
            </div>

            <p className="identity-bio">{bio}</p>

            <div className="identity-meta-chips">
              <span className="meta-chip">⚧ {gender || "Athlete"}</span>
              <span className="meta-chip">🎯 {fitnessGoal}</span>
              <span className="meta-chip">📍 Global Member</span>
            </div>

            <div className="hero-lively-metrics">
              <div className="metric-tile streak-tile">
                <span className="tile-icon">🔥</span>
                <div>
                  <strong>{user?.stats?.streakDays || 14} Days</strong>
                  <small>Active Streak</small>
                </div>
              </div>

              <div className="metric-tile points-tile">
                <span className="tile-icon">⭐</span>
                <div>
                  <strong>{user?.stats?.points || "2,890"} pts</strong>
                  <small>FitCircle Score</small>
                </div>
              </div>

              <div className="metric-tile workouts-tile">
                <span className="tile-icon">🏋️</span>
                <div>
                  <strong>48 Done</strong>
                  <small>Workouts Logged</small>
                </div>
              </div>

              <div className="metric-tile water-tile">
                <span className="tile-icon">💧</span>
                <div>
                  <strong>94% Target</strong>
                  <small>Hydration Health</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="profile-columns-layout">
        <div className="profile-col-left">
          <div className="profile-panel-card">
            <div className="panel-card-heading">
              <div>
                <h3>Body Composition & BMI</h3>
                <p>Real-time physical biometric analysis</p>
              </div>
              <span className="panel-badge-green">Live Analysis</span>
            </div>

            <div className="bmi-gauge-display">
              <div className="bmi-meter-circle" style={{ borderColor: bmiColor }}>
                <span className="bmi-score-number" style={{ color: bmiColor }}>
                  {bmiValue}
                </span>
                <span className="bmi-score-unit">BMI</span>
              </div>

              <div className="bmi-analysis-info">
                <div
                  className="bmi-badge-pill"
                  style={{ background: `${bmiColor}18`, color: bmiColor }}
                >
                  {bmiCategory}
                </div>

                <p>
                  Calculated from height ({height} {heightUnit}) and weight ({weight} {weightUnit}).
                  Normal adult healthy baseline is 18.5 – 24.9.
                </p>
              </div>
            </div>

            <div className="measurements-trio">
              <div className="trio-cell">
                <span className="trio-label">Height</span>
                <strong>{height} <small>{heightUnit}</small></strong>
              </div>

              <div className="trio-cell">
                <span className="trio-label">Current Weight</span>
                <strong>{weight} <small>{weightUnit}</small></strong>
              </div>

              <div className="trio-cell">
                <span className="trio-label">Target Weight</span>
                <strong>{targetWeight} <small>{targetWeightUnit}</small></strong>
              </div>
            </div>
          </div>

          <div className="profile-panel-card">
            <div className="panel-card-heading">
              <div>
                <h3>Trophy Cabinet & Milestones 🏆</h3>
                <p>Badges unlocked through consistency</p>
              </div>
            </div>

            <div className="achievements-vertical-list">
              {ACHIEVEMENTS.map((ach) => (
                <div key={ach.id} className="trophy-row-card">
                  <span className="trophy-badge-icon">{ach.icon}</span>

                  <div className="trophy-info">
                    <h4>{ach.title}</h4>
                    <p>{ach.desc}</p>
                    <small>{ach.date}</small>
                  </div>

                  <span className="trophy-status-pill">Unlocked</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-col-right">
          <div className="profile-panel-card">
            <div className="panel-card-heading">
              <div>
                <h3>Edit Profile & Measurements</h3>
                <p>Customize identity and measurement units</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-edit-body">
              {isSaved && (
                <div className="alert-box success">
                  ✓ Profile and biometrics updated successfully!
                </div>
              )}

              {saveError && (
                <div className="alert-box error">
                  {saveError}
                </div>
              )}

              <div className="form-row-duo">
                <div className="form-group-block">
                  <label>Display Name <small>(Common name allowed)</small></label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-block">
                  <label>Unique Username <small>(Must be unique)</small></label>
                  <div className="unique-uname-wrapper">
                    <span className="uname-prefix">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                      }
                      required
                    />
                    <span className={`uname-validity-tag ${isUsernameValid ? "ok" : "err"}`}>
                      {isUsernameValid ? "✓ Valid" : "✕ Taken"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group-block">
                <label>Bio / Fitness Statement</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="form-row-duo">
                <div className="form-group-block">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">♂ Male</option>
                    <option value="Female">♀ Female</option>
                    <option value="Other">⚧ Non-Binary / Other</option>
                  </select>
                </div>

                <div className="form-group-block">
                  <label>Fitness Focus</label>
                  <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                    <option value="Endurance & Lean Muscle">Endurance & Lean Muscle</option>
                    <option value="Fat Loss & Toning">Fat Loss & Toning</option>
                    <option value="Hypertrophy & Strength">Hypertrophy & Strength</option>
                    <option value="General Health">General Health</option>
                  </select>
                </div>
              </div>

              <div className="form-group-block">
                <div className="label-with-unit">
                  <label>Height</label>

                  <div className="unit-pill-selector">
                    {["cm", "m", "ft"].map((u) => (
                      <button
                        key={u}
                        type="button"
                        className={heightUnit === u ? "active" : ""}
                        onClick={() => setHeightUnit(u)}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="number"
                  step="0.01"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-duo">
                <div className="form-group-block">
                  <div className="label-with-unit">
                    <label>Current Weight</label>

                    <div className="unit-pill-selector">
                      {["kg", "lbs"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          className={weightUnit === u ? "active" : ""}
                          onClick={() => setWeightUnit(u)}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-block">
                  <div className="label-with-unit">
                    <label>Target Weight</label>

                    <div className="unit-pill-selector">
                      {["kg", "lbs"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          className={targetWeightUnit === u ? "active" : ""}
                          onClick={() => setTargetWeightUnit(u)}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-save-profile-action">
                Save & Update Athlete Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;