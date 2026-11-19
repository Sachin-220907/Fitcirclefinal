import { useState, useEffect } from "react";
import "./ActivityPage.css";

const PRESET_EXERCISES = [
  { id: "e1", name: "Barbell Back Squats", category: "Strength", target: "Quadriceps & Glutes", pr: "140 kg" },
  { id: "e2", name: "Flat Barbell Bench Press", category: "Strength", target: "Chest & Triceps", pr: "105 kg" },
  { id: "e3", name: "Conventional Deadlift", category: "Strength", target: "Hamstrings & Lower Back", pr: "185 kg" },
  { id: "e4", name: "Overhead Military Press", category: "Strength", target: "Deltoids & Traps", pr: "70 kg" },
  { id: "e5", name: "Treadmill High Incline Walk", category: "Cardio", target: "Cardiovascular & Calorie Burn", pr: "45 min / 400 kcal" },
  { id: "e6", name: "Outdoor 5K Tempo Run", category: "Cardio", target: "Aerobic Capacity", pr: "22:15 min" },
  { id: "e7", name: "HIIT Tabata Kettlebell Circuit", category: "HIIT", target: "Full Body Conditioning", pr: "8 rounds" },
  { id: "e8", name: "Vinyasa Mobility Flow", category: "Mobility", target: "Hips, Spine & Flexibility", pr: "30 min" }
];

const INITIAL_LOGGED_WORKOUTS = [
  {
    id: 1,
    name: "Barbell Back Squats",
    category: "Strength",
    duration: 35,
    calories: 220,
    sets: [
      { set: 1, reps: 10, weight: 100 },
      { set: 2, reps: 8, weight: 120 },
      { set: 3, reps: 6, weight: 135 }
    ]
  },
  {
    id: 2,
    name: "Outdoor 5K Tempo Run",
    category: "Cardio",
    duration: 25,
    calories: 280,
    distance: "5.1 km",
    sets: []
  }
];

export function ActivityPage() {
  const [workouts, setWorkouts] = useState(INITIAL_LOGGED_WORKOUTS);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Live Workout Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function formatTimer(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hrs = Math.floor(mins / 60);
    return `${hrs > 0 ? String(hrs).padStart(2, "0") + ":" : ""}${String(mins % 60).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Workout form states
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Strength");
  const [formDuration, setFormDuration] = useState("30");
  const [formCalories, setFormCalories] = useState("200");
  const [formSetsCount, setFormSetsCount] = useState("3");
  const [formWeight, setFormWeight] = useState("60");
  const [formReps, setFormReps] = useState("10");

  function handleAddWorkout(e) {
    e.preventDefault();
    if (!formName) return;

    const setsArray = [];
    const count = Number(formSetsCount) || 3;
    for (let i = 1; i <= count; i++) {
      setsArray.push({
        set: i,
        reps: Number(formReps) || 10,
        weight: Number(formWeight) || 50
      });
    }

    const newWorkout = {
      id: Date.now(),
      name: formName,
      category: formCategory,
      duration: Number(formDuration) || 30,
      calories: Number(formCalories) || 200,
      sets: setsArray
    };

    setWorkouts([newWorkout, ...workouts]);
    setFormName("");
    setIsModalOpen(false);
  }

  function handleStartExercise(exercise) {
    setFormName(exercise.name);
    setFormCategory(exercise.category);
    setIsModalOpen(true);
  }

  const filteredExercises = PRESET_EXERCISES.filter((ex) => {
    const matchesTab = activeTab === "All" || ex.category === activeTab;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalMinutes = workouts.reduce((acc, w) => acc + w.duration, 0);
  const totalBurn = workouts.reduce((acc, w) => acc + w.calories, 0);

  return (
    <div className="activity-page">
      <header className="activity-header">
        <div>
          <h1>Activity & Workout Hub ⚡</h1>
          <p>Track your resistance training, cardio milestones, and personal records.</p>
        </div>

        <button className="btn-log-workout" onClick={() => setIsModalOpen(true)}>
          + Log Custom Workout
        </button>
      </header>

      {/* Top Session Stopwatch & Daily Summary */}
      <section className="activity-top-grid">
        <div className="stopwatch-card">
          <div className="stopwatch-header">
            <div>
              <h3>Active Session Stopwatch</h3>
              <p>Track workout duration in real time</p>
            </div>
            <span className="stopwatch-pulse-dot" style={{ background: isTimerRunning ? "#10b981" : "#94a3b8" }}></span>
          </div>

          <div className="stopwatch-display">
            {formatTimer(timerSeconds)}
          </div>

          <div className="stopwatch-actions">
            {!isTimerRunning ? (
              <button
                className="sw-btn sw-start"
                onClick={() => setIsTimerRunning(true)}
              >
                ▶ Start Workout
              </button>
            ) : (
              <button
                className="sw-btn sw-pause"
                onClick={() => setIsTimerRunning(false)}
              >
                ⏸ Pause
              </button>
            )}

            <button
              className="sw-btn sw-reset"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div className="activity-metrics-card">
          <h3>Today's Workout Output</h3>
          <div className="metrics-row">
            <div className="a-metric-box">
              <span className="a-label">Active Time</span>
              <strong>{totalMinutes} min</strong>
              <small>Goal: 60 min</small>
            </div>
            <div className="a-metric-box">
              <span className="a-label">Calories Burned</span>
              <strong>{totalBurn} kcal</strong>
              <small>Goal: 500 kcal</small>
            </div>
            <div className="a-metric-box">
              <span className="a-label">Workouts</span>
              <strong>{workouts.length}</strong>
              <small>Completed</small>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Logged Workouts */}
      <section className="logged-workouts-section">
        <div className="section-title-row">
          <h3>Logged Today ({workouts.length})</h3>
        </div>

        <div className="logged-workouts-grid">
          {workouts.map((w) => (
            <div key={w.id} className="logged-card">
              <div className="logged-card-top">
                <div>
                  <span className="workout-badge">{w.category}</span>
                  <h4>{w.name}</h4>
                </div>
                <div className="workout-stats-pill">
                  <span>⏱ {w.duration} min</span>
                  <span>🔥 {w.calories} kcal</span>
                </div>
              </div>

              {w.sets && w.sets.length > 0 && (
                <div className="sets-table">
                  <div className="sets-header">
                    <span>Set</span>
                    <span>Weight</span>
                    <span>Reps</span>
                  </div>
                  {w.sets.map((s) => (
                    <div key={s.set} className="sets-row">
                      <span>Set {s.set}</span>
                      <strong>{s.weight} kg</strong>
                      <span>{s.reps} reps</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Exercise Library & Search */}
      <section className="exercise-library-section">
        <div className="library-header">
          <div>
            <h3>Exercise Library</h3>
            <p>Select any movement to log sets or record personal bests</p>
          </div>

          <div className="library-search-box">
            <input
              type="text"
              placeholder="Search exercise or muscle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="category-pills">
          {["All", "Strength", "Cardio", "HIIT", "Mobility"].map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="exercise-cards-grid">
          {filteredExercises.map((ex) => (
            <div key={ex.id} className="exercise-card">
              <div className="ex-card-top">
                <span className="ex-category-tag">{ex.category}</span>
                <span className="ex-pr-tag">PR: {ex.pr}</span>
              </div>
              <h4>{ex.name}</h4>
              <p className="ex-target">Target: {ex.target}</p>
              <button
                className="btn-start-ex"
                onClick={() => handleStartExercise(ex)}
              >
                + Log This Exercise
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Log Workout Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log Workout Session</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddWorkout} className="modal-form">
              <div className="form-group">
                <label>Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Barbell Incline Bench"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Mobility">Mobility</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (mins)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              {formCategory === "Strength" && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Sets</label>
                    <input
                      type="number"
                      value={formSetsCount}
                      onChange={(e) => setFormSetsCount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      value={formWeight}
                      onChange={(e) => setFormWeight(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Reps per Set</label>
                    <input
                      type="number"
                      value={formReps}
                      onChange={(e) => setFormReps(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Estimated Calories Burned (kcal)</label>
                <input
                  type="number"
                  value={formCalories}
                  onChange={(e) => setFormCalories(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityPage;
