import { useState } from "react";
import "./QuickLogModal.css";

export function QuickLogModal({ isOpen, onClose, onSave, activeTab = "meal" }) {
  const [tab, setTab] = useState(activeTab);

  // Meal form state
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");

  // Workout form state
  const [workoutType, setWorkoutType] = useState("Running");
  const [workoutDuration, setWorkoutDuration] = useState("30");
  const [workoutCalories, setWorkoutCalories] = useState("250");

  // Water form state
  const [waterAmount, setWaterAmount] = useState(250);

  // Weight form state
  const [weight, setWeight] = useState("72.5");

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (tab === "meal") {
      onSave({
        type: "meal",
        title: mealName || "Logged Meal",
        category: mealType,
        calories: Number(mealCalories) || 350,
        protein: Number(mealProtein) || 20
      });
    } else if (tab === "workout") {
      onSave({
        type: "workout",
        title: workoutType,
        duration: Number(workoutDuration) || 30,
        calories: Number(workoutCalories) || 200
      });
    } else if (tab === "water") {
      onSave({
        type: "water",
        amount: Number(waterAmount) || 250
      });
    } else if (tab === "weight") {
      onSave({
        type: "weight",
        weight: Number(weight) || 70
      });
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Quick Log Activity</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${tab === "meal" ? "active" : ""}`}
            onClick={() => setTab("meal")}
          >
            🥗 Meal
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === "workout" ? "active" : ""}`}
            onClick={() => setTab("workout")}
          >
            ⚡ Workout
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === "water" ? "active" : ""}`}
            onClick={() => setTab("water")}
          >
            💧 Water
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === "weight" ? "active" : ""}`}
            onClick={() => setTab("weight")}
          >
            ⚖️ Weight
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {tab === "meal" && (
            <>
              <div className="form-group">
                <label>Meal Category</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <div className="form-group">
                <label>Food Item / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Grilled Chicken & Quinoa"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 35"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {tab === "workout" && (
            <>
              <div className="form-group">
                <label>Workout Type</label>
                <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
                  <option value="Strength Training">🏋️ Strength Training</option>
                  <option value="Running">🏃 Running / Jogging</option>
                  <option value="Cycling">🚴 Cycling</option>
                  <option value="HIIT Cardio">🔥 HIIT Cardio</option>
                  <option value="Yoga / Mobility">🧘 Yoga & Stretching</option>
                  <option value="Swimming">🏊 Swimming</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Calories Burned (kcal)</label>
                  <input
                    type="number"
                    value={workoutCalories}
                    onChange={(e) => setWorkoutCalories(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {tab === "water" && (
            <div className="water-log-area">
              <p>Quickly add water consumption:</p>
              <div className="water-quick-buttons">
                <button
                  type="button"
                  className={`water-chip ${waterAmount === 250 ? "active" : ""}`}
                  onClick={() => setWaterAmount(250)}
                >
                  +250 ml (1 glass)
                </button>
                <button
                  type="button"
                  className={`water-chip ${waterAmount === 500 ? "active" : ""}`}
                  onClick={() => setWaterAmount(500)}
                >
                  +500 ml (1 bottle)
                </button>
                <button
                  type="button"
                  className={`water-chip ${waterAmount === 750 ? "active" : ""}`}
                  onClick={() => setWaterAmount(750)}
                >
                  +750 ml
                </button>
              </div>
            </div>
          )}

          {tab === "weight" && (
            <div className="form-group">
              <label>Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-confirm">
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickLogModal;
