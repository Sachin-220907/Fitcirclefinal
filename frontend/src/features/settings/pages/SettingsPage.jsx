import { useState } from "react";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useAuth } from "../../authentication/context/AuthContext";
import "./SettingsPage.css";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser, logout } = useAuth();

  // Unit system preferences
  const [heightUnit, setHeightUnit] = useState(user?.stats?.heightUnit || "cm");
  const [weightUnit, setWeightUnit] = useState(user?.stats?.weightUnit || "kg");
  const [waterUnit, setWaterUnit] = useState("ml");
  const [distanceUnit, setDistanceUnit] = useState("km");

  // Daily target goals
  const [dailyCalories, setDailyCalories] = useState(2200);
  const [dailyProtein, setDailyProtein] = useState(150);
  const [dailyWater, setDailyWater] = useState(3000);
  const [dailySteps, setDailySteps] = useState(10000);

  // Notifications
  const [hydrationAlerts, setHydrationAlerts] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [communityMentions, setCommunityMentions] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Privacy
  const [publicProfile, setPublicProfile] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);

  const [savedBanner, setSavedBanner] = useState(false);

  function handleSaveAllSettings(e) {
    e.preventDefault();
    updateUser({
      stats: {
        ...(user?.stats || {}),
        heightUnit,
        weightUnit
      }
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2200);
  }

  function handleExportData() {
    const exportPayload = {
      profile: user,
      exportTimestamp: new Date().toISOString(),
      appVersion: "1.0.0",
      stats: {
        caloriesGoal: dailyCalories,
        proteinGoal: dailyProtein,
        waterGoalMl: dailyWater,
        stepGoal: dailySteps
      }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fitcircle_athlete_${user?.username || "data"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className="settings-page-wrapper">
      <header className="settings-header">
        <div>
          <h1>Settings & System Preferences ⚙️</h1>
          <p>Customize measurement systems, daily nutritional thresholds, privacy, and notifications.</p>
        </div>

        <button
          type="button"
          className="btn-primary-save"
          onClick={handleSaveAllSettings}
        >
          Save All Changes
        </button>
      </header>

      {savedBanner && (
        <div className="settings-saved-banner">
          ✓ All preferences and unit configurations updated successfully!
        </div>
      )}

      <div className="settings-sections-stack">
        {/* Appearance & Theme */}
        <section className="settings-card">
          <div className="card-heading-row">
            <div>
              <h3>Display Appearance</h3>
              <p>Switch between light and dark visual aesthetics</p>
            </div>
            <button
              type="button"
              className="theme-switch-btn"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙 Enable Dark Theme" : "☀️ Enable Light Theme"}
            </button>
          </div>
        </section>

        {/* Measurement Units */}
        <section className="settings-card">
          <div className="card-heading-row">
            <div>
              <h3>Units of Measurement</h3>
              <p>Configure how your physical data, liquids, and weights are presented</p>
            </div>
          </div>

          <div className="unit-selectors-grid">
            <div className="unit-row-item">
              <span className="unit-label">Height Measurement:</span>
              <div className="unit-choice-pills">
                {["cm", "m", "ft"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    className={`u-pill ${heightUnit === u ? "active" : ""}`}
                    onClick={() => setHeightUnit(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="unit-row-item">
              <span className="unit-label">Body Weight:</span>
              <div className="unit-choice-pills">
                {["kg", "lbs"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    className={`u-pill ${weightUnit === u ? "active" : ""}`}
                    onClick={() => setWeightUnit(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="unit-row-item">
              <span className="unit-label">Water & Hydration Volume:</span>
              <div className="unit-choice-pills">
                {[
                  { key: "ml", label: "Milliliters (ml)" },
                  { key: "floz", label: "Fluid Ounces (fl oz)" }
                ].map((u) => (
                  <button
                    key={u.key}
                    type="button"
                    className={`u-pill ${waterUnit === u.key ? "active" : ""}`}
                    onClick={() => setWaterUnit(u.key)}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="unit-row-item">
              <span className="unit-label">Running & Cycling Distance:</span>
              <div className="unit-choice-pills">
                {["km", "miles"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    className={`u-pill ${distanceUnit === u ? "active" : ""}`}
                    onClick={() => setDistanceUnit(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Custom Daily Target Thresholds */}
        <section className="settings-card">
          <div className="card-heading-row">
            <div>
              <h3>Daily Target Thresholds</h3>
              <p>Tune your individual calorie, macronutrient, and hydration baselines</p>
            </div>
          </div>

          <div className="goals-inputs-grid">
            <div className="goal-input-box">
              <label>Daily Calorie Target (kcal)</label>
              <input
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(Number(e.target.value))}
              />
            </div>

            <div className="goal-input-box">
              <label>Protein Target (g)</label>
              <input
                type="number"
                value={dailyProtein}
                onChange={(e) => setDailyProtein(Number(e.target.value))}
              />
            </div>

            <div className="goal-input-box">
              <label>Hydration Target (ml)</label>
              <input
                type="number"
                step="250"
                value={dailyWater}
                onChange={(e) => setDailyWater(Number(e.target.value))}
              />
            </div>

            <div className="goal-input-box">
              <label>Daily Step Goal</label>
              <input
                type="number"
                step="500"
                value={dailySteps}
                onChange={(e) => setDailySteps(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Notifications & Reminders */}
        <section className="settings-card">
          <div className="card-heading-row">
            <div>
              <h3>Alerts & Push Notifications</h3>
              <p>Control what nudges and motivation alerts you receive</p>
            </div>
          </div>

          <div className="settings-toggles-list">
            <label className="settings-toggle-row">
              <div>
                <strong>Smart Hydration Reminders</strong>
                <p>Nudge every 2 hours if current water intake is behind target</p>
              </div>
              <input
                type="checkbox"
                checked={hydrationAlerts}
                onChange={(e) => setHydrationAlerts(e.target.checked)}
              />
            </label>

            <label className="settings-toggle-row">
              <div>
                <strong>Workout & Streak Protection</strong>
                <p>Alert at 5:00 PM if daily activity hasn't been logged</p>
              </div>
              <input
                type="checkbox"
                checked={workoutReminders}
                onChange={(e) => setWorkoutReminders(e.target.checked)}
              />
            </label>

            <label className="settings-toggle-row">
              <div>
                <strong>Community Mentions & Reactions</strong>
                <p>Notify when fellow athletes like or comment on your workouts</p>
              </div>
              <input
                type="checkbox"
                checked={communityMentions}
                onChange={(e) => setCommunityMentions(e.target.checked)}
              />
            </label>

            <label className="settings-toggle-row">
              <div>
                <strong>Weekly Performance Digest</strong>
                <p>Summary of total calories, distance, and PR milestones every Monday</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              />
            </label>
          </div>
        </section>

        {/* Privacy & Visibility */}
        <section className="settings-card">
          <div className="card-heading-row">
            <div>
              <h3>Privacy & Community Visibility</h3>
              <p>Configure which data fellow FitCircle athletes can see</p>
            </div>
          </div>

          <div className="settings-toggles-list">
            <label className="settings-toggle-row">
              <div>
                <strong>Public Athlete Profile</strong>
                <p>Allow members to view your unlocked trophies and bio</p>
              </div>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
              />
            </label>

            <label className="settings-toggle-row">
              <div>
                <strong>Show on Weekly Leaderboards</strong>
                <p>Display your streak and step points in community rankings</p>
              </div>
              <input
                type="checkbox"
                checked={leaderboardVisible}
                onChange={(e) => setLeaderboardVisible(e.target.checked)}
              />
            </label>
          </div>
        </section>

        {/* Data Portability & Account Session */}
        <section className="settings-card">
          <div className="card-heading-row">
            <div>
              <h3>Data Portability & Session</h3>
              <p>Export your full fitness records or sign out</p>
            </div>
            <div className="session-actions-row">
              <button
                type="button"
                className="btn-export-json"
                onClick={handleExportData}
              >
                📥 Export Data (JSON)
              </button>
              <button
                type="button"
                className="btn-signout"
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
