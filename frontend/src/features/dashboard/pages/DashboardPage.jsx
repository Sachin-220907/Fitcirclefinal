import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../authentication/context/AuthContext";
import { useSelectedDate } from "../../../app/context/DateContext";
import QuickLogModal from "../components/QuickLogModal";
import "./DashboardPage.css";

function getDateKey(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const INITIAL_LOGS = {
  [getDateKey(new Date())]: {
    calories: 1480,
    calorieGoal: 2200,
    protein: 98,
    proteinGoal: 150,
    carbs: 145,
    carbsGoal: 220,
    fats: 42,
    fatsGoal: 65,
    waterLiters: 2.25,
    waterGoal: 3.0,
    steps: 7650,
    stepGoal: 10000,
    activeMinutes: 48,
    caloriesBurned: 420,
    activities: [
      { id: 1, title: "Morning 5K Jog", time: "07:30 AM", type: "workout", icon: "🏃", metric: "310 kcal • 28 min" },
      { id: 2, title: "Breakfast: Oats & Whole Eggs", time: "08:45 AM", type: "meal", icon: "🍳", metric: "440 kcal • 22g protein" },
      { id: 3, title: "Lunch: Grilled Chicken & Rice", time: "01:15 PM", type: "meal", icon: "🥗", metric: "580 kcal • 48g protein" },
      { id: 4, title: "Upper Body Hypertrophy", time: "05:00 PM", type: "workout", icon: "⚡", metric: "260 kcal • 45 min" }
    ]
  }
};

// Seed previous days
const today = new Date();
for (let i = 1; i <= 7; i++) {
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - i);
  const key = getDateKey(pastDate);
  INITIAL_LOGS[key] = {
    calories: 1850 + (i * 35) % 300,
    calorieGoal: 2200,
    protein: 125 + (i * 5) % 25,
    proteinGoal: 150,
    carbs: 175 + (i * 8) % 40,
    carbsGoal: 220,
    fats: 50 + (i * 2) % 15,
    fatsGoal: 65,
    waterLiters: 2.5 + (i % 3) * 0.25,
    waterGoal: 3.0,
    steps: 8400 + (i * 420) % 2800,
    stepGoal: 10000,
    activeMinutes: 52 + (i * 4) % 20,
    caloriesBurned: 450 + (i * 30) % 180,
    activities: [
      { id: 100 + i, title: "Gym Workout Session", time: "06:00 PM", type: "workout", icon: "🏋️", metric: "380 kcal • 50 min" },
      { id: 200 + i, title: "Healthy Balanced Diet", time: "All Day", type: "meal", icon: "🥗", metric: "3 meals logged" }
    ]
  };
}

export function DashboardPage() {
  const { user } = useAuth();
  const { selectedDate, jumpToToday } = useSelectedDate();
  const [allLogs, setAllLogs] = useState(INITIAL_LOGS);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("meal");

  const dateKey = getDateKey(selectedDate);
  const currentData = allLogs[dateKey] || {
    calories: 0,
    calorieGoal: 2200,
    protein: 0,
    proteinGoal: 150,
    carbs: 0,
    carbsGoal: 220,
    fats: 0,
    fatsGoal: 65,
    waterLiters: 0,
    waterGoal: 3.0,
    steps: 0,
    stepGoal: 10000,
    activeMinutes: 0,
    caloriesBurned: 0,
    activities: []
  };

  const isTodaySelected = dateKey === getDateKey(new Date());

  function updateWater(delta) {
    setAllLogs((prev) => {
      const existing = prev[dateKey] || { ...currentData };
      const newLiters = Math.max(0, Math.round((existing.waterLiters + delta) * 100) / 100);
      return {
        ...prev,
        [dateKey]: {
          ...existing,
          waterLiters: newLiters
        }
      };
    });
  }

  function handleQuickLog(entry) {
    setAllLogs((prev) => {
      const existing = prev[dateKey] || { ...currentData };
      let updated = { ...existing };

      if (entry.type === "meal") {
        updated.calories = (existing.calories || 0) + entry.calories;
        updated.protein = (existing.protein || 0) + (entry.protein || 0);
        updated.activities = [
          {
            id: Date.now(),
            title: `${entry.category}: ${entry.title}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "meal",
            icon: "🥗",
            metric: `${entry.calories} kcal • ${entry.protein || 0}g protein`
          },
          ...(existing.activities || [])
        ];
      } else if (entry.type === "workout") {
        updated.activeMinutes = (existing.activeMinutes || 0) + entry.duration;
        updated.caloriesBurned = (existing.caloriesBurned || 0) + entry.calories;
        updated.activities = [
          {
            id: Date.now(),
            title: entry.title,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "workout",
            icon: "⚡",
            metric: `${entry.calories} kcal • ${entry.duration} min`
          },
          ...(existing.activities || [])
        ];
      } else if (entry.type === "water") {
        updated.waterLiters = Math.round(((existing.waterLiters || 0) + (entry.amount / 1000)) * 100) / 100;
      }

      return {
        ...prev,
        [dateKey]: updated
      };
    });
  }

  const caloriePct = Math.min(100, Math.round((currentData.calories / currentData.calorieGoal) * 100)) || 0;
  const proteinPct = Math.min(100, Math.round((currentData.protein / currentData.proteinGoal) * 100)) || 0;
  const carbsPct = Math.min(100, Math.round((currentData.carbs / currentData.carbsGoal) * 100)) || 0;
  const fatsPct = Math.min(100, Math.round((currentData.fats / currentData.fatsGoal) * 100)) || 0;
  const waterPct = Math.min(100, Math.round((currentData.waterLiters / currentData.waterGoal) * 100)) || 0;

  return (
    <div className="dashboard-page">
      {/* Top Welcome & Summary Header - Defaulted to Sachin */}
      <section className="dashboard-welcome">
        <div>
          <h1>Welcome back, {user?.displayName || "Sachin"}! 👋</h1>
          <p className="welcome-tagline">
            {isTodaySelected
              ? "You're on track to crush your daily fitness and macro targets. Keep the momentum going!"
              : `Reviewing fitness metrics for ${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}.`}
          </p>
        </div>

        <div className="quick-action-pills">
          <button
            className="action-pill primary"
            onClick={() => {
              setModalTab("meal");
              setIsLogModalOpen(true);
            }}
          >
            <span>+</span> Log Meal
          </button>
          <button
            className="action-pill secondary"
            onClick={() => {
              setModalTab("workout");
              setIsLogModalOpen(true);
            }}
          >
            <span>+</span> Log Workout
          </button>
          <button
            className="action-pill outline"
            onClick={() => updateWater(0.25)}
            title="Quick log 250ml water"
          >
            💧 +250ml
          </button>
        </div>
      </section>

      {/* Selected Date Indicator Banner without unnecessary tip text */}
      <div className="selected-date-banner">
        <div className="date-banner-left">
          <span className="calendar-indicator-pill">
            {isTodaySelected ? "📅 Today" : "📆 Selected Date"}
          </span>
          <span className="current-date-text">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </span>
        </div>

        {!isTodaySelected && (
          <button
            type="button"
            className="return-today-btn"
            onClick={jumpToToday}
          >
            Jump to Today
          </button>
        )}
      </div>

      {/* Daily Nutrition & Calorie Stats */}
      <section className="dashboard-stats">
        <div className="dashboard-card calorie-card">
          <div className="card-heading">
            <div>
              <h3>Calories</h3>
              <p className="card-sub">Energy Balance</p>
            </div>
            <span className="card-badge-icon">🔥</span>
          </div>

          <div className="card-metric-block">
            <h2>{currentData.calories.toLocaleString()} <small>kcal</small></h2>
            <p className="metric-context">Consumed for this day</p>
          </div>

          <div className="progress-track">
            <div className="progress-fill calorie-progress" style={{ width: `${caloriePct}%` }}></div>
          </div>

          <div className="calorie-details">
            <span>{currentData.calories.toLocaleString()} consumed</span>
            <span>{Math.max(0, currentData.calorieGoal - currentData.calories).toLocaleString()} remaining</span>
          </div>

          <p className="goal-text">Daily goal: {currentData.calorieGoal.toLocaleString()} kcal ({caloriePct}%)</p>
        </div>

        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Protein</h3>
              <p className="card-sub">Muscle Recovery</p>
            </div>
            <span className="card-badge-icon">💪</span>
          </div>

          <div className="card-metric-block">
            <h2>{currentData.protein} <small>/ {currentData.proteinGoal} g</small></h2>
            <p className="metric-context">Target: {currentData.proteinGoal}g</p>
          </div>

          <div className="progress-track">
            <div className="progress-fill protein-progress" style={{ width: `${proteinPct}%` }}></div>
          </div>

          <p className="goal-text">{proteinPct}% of daily protein goal</p>
        </div>

        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Carbohydrates</h3>
              <p className="card-sub">Primary Fuel</p>
            </div>
            <span className="card-badge-icon">🌾</span>
          </div>

          <div className="card-metric-block">
            <h2>{currentData.carbs} <small>/ {currentData.carbsGoal} g</small></h2>
            <p className="metric-context">Target: {currentData.carbsGoal}g</p>
          </div>

          <div className="progress-track">
            <div className="progress-fill carbs-progress" style={{ width: `${carbsPct}%` }}></div>
          </div>

          <p className="goal-text">{carbsPct}% of daily carb goal</p>
        </div>

        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Healthy Fats</h3>
              <p className="card-sub">Hormone Health</p>
            </div>
            <span className="card-badge-icon">🥑</span>
          </div>

          <div className="card-metric-block">
            <h2>{currentData.fats} <small>/ {currentData.fatsGoal} g</small></h2>
            <p className="metric-context">Target: {currentData.fatsGoal}g</p>
          </div>

          <div className="progress-track">
            <div className="progress-fill fats-progress" style={{ width: `${fatsPct}%` }}></div>
          </div>

          <p className="goal-text">{fatsPct}% of daily fats goal</p>
        </div>
      </section>

      {/* Hydration & Physical Activity Overview */}
      <section className="dashboard-lower">
        <div className="dashboard-card water-card">
          <div className="card-heading">
            <div>
              <h3>Water Intake</h3>
              <p className="card-sub">Target: {currentData.waterGoal} Liters</p>
            </div>
            <span className="card-badge-icon">💧</span>
          </div>

          <div className="water-display">
            <h2>{currentData.waterLiters} <small>/ {currentData.waterGoal} L</small></h2>
            <p className="goal-text">{waterPct}% of daily hydration target</p>
          </div>

          <div className="progress-track">
            <div className="progress-fill water-progress" style={{ width: `${waterPct}%` }}></div>
          </div>

          <div className="water-buttons-row">
            <button className="water-step-btn" onClick={() => updateWater(-0.25)} title="Remove 250ml">
              -250ml
            </button>
            <button className="water-step-btn primary" onClick={() => updateWater(0.25)} title="Add 250ml">
              +250ml
            </button>
            <button className="water-step-btn primary" onClick={() => updateWater(0.5)} title="Add 500ml">
              +500ml
            </button>
          </div>
        </div>

        <div className="dashboard-card activity-card">
          <div className="card-heading">
            <div>
              <h3>Activity & Movement</h3>
              <p className="card-sub">Movement Breakdown</p>
            </div>
            <span className="card-badge-icon">⚡</span>
          </div>

          <div className="activity-items">
            <div className="activity-stat-box">
              <span className="activity-stat-label">Steps Walked</span>
              <strong>{currentData.steps.toLocaleString()}</strong>
              <small className="stat-goal">Goal: 10,000</small>
            </div>

            <div className="activity-stat-box">
              <span className="activity-stat-label">Active Burn</span>
              <strong>{currentData.caloriesBurned}</strong>
              <small className="stat-goal">kcal burned</small>
            </div>

            <div className="activity-stat-box">
              <span className="activity-stat-label">Active Time</span>
              <strong>{currentData.activeMinutes} min</strong>
              <small className="stat-goal">Duration</small>
            </div>
          </div>

          <div className="activity-footer-row">
            <Link to="/activity" className="dashboard-button">
              Open Full Activity Tracker →
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Logged on Selected Date */}
      <section className="dashboard-card activities-timeline-card">
        <div className="card-heading">
          <div>
            <h3>Activities & Meals Logged</h3>
            <p className="card-sub">Entries for {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
          <button
            className="add-entry-btn"
            onClick={() => {
              setModalTab("meal");
              setIsLogModalOpen(true);
            }}
          >
            + Add Entry
          </button>
        </div>

        {currentData.activities && currentData.activities.length > 0 ? (
          <div className="timeline-list">
            {currentData.activities.map((act) => (
              <div key={act.id} className="timeline-item">
                <div className="timeline-icon">{act.icon}</div>
                <div className="timeline-content">
                  <h4>{act.title}</h4>
                  <p>{act.metric}</p>
                </div>
                <div className="timeline-time">{act.time}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="timeline-empty">
            <p>No logged activities recorded for this date yet.</p>
            <button
              className="dashboard-button"
              onClick={() => {
                setModalTab("workout");
                setIsLogModalOpen(true);
              }}
            >
              + Log Activity Now
            </button>
          </div>
        )}
      </section>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleQuickLog}
        activeTab={modalTab}
      />
    </div>
  );
}

export default DashboardPage;
