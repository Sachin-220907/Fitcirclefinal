import { useState, useEffect } from "react";
import { useSocket } from "../../../app/providers/SocketProvider";
import "./NutritionPage.css";

// EXACT 10 BASIC IMPORTANT FOODS WITH CHECKED HIGH QUALITY RELATABLE IMAGES
const TEN_BASIC_FOODS = [
  {
    id: "f1",
    name: "Oats",
    image: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=600&q=80",
    serving: "1 cup (80g dry)",
    calories: 300,
    protein: 10,
    carbs: 54,
    fats: 5,
    category: "breakfast",
    tag: "Complex Carbs & Fiber"
  },
  {
    id: "f2",
    name: "Whole Eggs",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",
    serving: "2 large eggs",
    calories: 140,
    protein: 12,
    carbs: 1,
    fats: 10,
    category: "breakfast",
    tag: "Bioavailable Protein"
  },
  {
    id: "f3",
    name: "Grilled Chicken Breast",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
    serving: "150g cooked",
    calories: 220,
    protein: 46,
    carbs: 0,
    fats: 3.5,
    category: "lunch",
    tag: "Lean Muscle Repair"
  },
  {
    id: "f4",
    name: "Atlantic Salmon Fillet",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    serving: "150g fillet",
    calories: 280,
    protein: 34,
    carbs: 0,
    fats: 15,
    category: "dinner",
    tag: "Omega-3 & Healthy Fats"
  },
  {
    id: "f5",
    name: "Rice",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80",
    serving: "1 cup cooked (150g)",
    calories: 205,
    protein: 4.5,
    carbs: 45,
    fats: 0.5,
    category: "lunch",
    tag: "Glycogen Fuel"
  },
  {
    id: "f6",
    name: "Plain Yogurt",
    image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80",
    serving: "1 cup (170g)",
    calories: 120,
    protein: 15,
    carbs: 6,
    fats: 3.5,
    category: "breakfast",
    tag: "Gut Health & Casein"
  },
  {
    id: "f7",
    name: "Fresh Banana",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    serving: "1 medium banana",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.3,
    category: "snacks",
    tag: "Pre-Workout Potassium"
  },
  {
    id: "f8",
    name: "Raw Almonds",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80",
    serving: "1 handful (28g)",
    calories: 160,
    protein: 6,
    carbs: 6,
    fats: 14,
    category: "snacks",
    tag: "Magnesium & Vitamin E"
  },
  {
    id: "f9",
    name: "Fresh Broccoli",
    image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80",
    serving: "1.5 cups (150g)",
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fats: 0.6,
    category: "dinner",
    tag: "Micronutrients & Detox"
  },
  {
    id: "f10",
    name: "Bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    serving: "2 slices (70g)",
    calories: 160,
    protein: 7,
    carbs: 28,
    fats: 2,
    category: "breakfast",
    tag: "Daily Energy & Fiber"
  }
];

// MEAL CATEGORIES WITH EXACT RELATABLE COVER PHOTOGRAPHY
const MEAL_CATEGORIES = [
  {
    key: "breakfast",
    label: "Breakfast",
    timing: "Morning Fuel (07:00 - 10:00)",
    icon: "🍳",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
    suggestedKcal: 550
  },
  {
    key: "lunch",
    label: "Lunch",
    timing: "Midday Sustenance (12:00 - 14:30)",
    icon: "🥗",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    suggestedKcal: 700
  },
  {
    key: "dinner",
    label: "Dinner",
    timing: "Evening Recovery (18:30 - 21:00)",
    icon: "🍲",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    suggestedKcal: 650
  },
  {
    key: "snacks",
    label: "Snacks & Treats",
    timing: "Pre / Post Workout & Anytime",
    icon: "🍎",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=600&q=80",
    suggestedKcal: 300
  }
];

const INITIAL_LOGGED = {
  breakfast: [
    { id: 1, name: "Oats", calories: 300, protein: 10, carbs: 54, fats: 5, serving: "1 cup (80g dry)" },
    { id: 2, name: "Whole Eggs", calories: 140, protein: 12, carbs: 1, fats: 10, serving: "2 large eggs" }
  ],
  lunch: [
    { id: 3, name: "Grilled Chicken Breast", calories: 220, protein: 46, carbs: 0, fats: 3.5, serving: "150g cooked" },
    { id: 4, name: "Rice", calories: 205, protein: 4.5, carbs: 45, fats: 0.5, serving: "1 cup cooked (150g)" }
  ],
  dinner: [
    { id: 5, name: "Atlantic Salmon Fillet", calories: 280, protein: 34, carbs: 0, fats: 15, serving: "150g fillet" },
    { id: 6, name: "Fresh Broccoli", calories: 55, protein: 3.7, carbs: 11, fats: 0.6, serving: "1.5 cups (150g)" }
  ],
  snacks: [
    { id: 7, name: "Plain Yogurt", calories: 120, protein: 15, carbs: 6, fats: 3.5, serving: "1 cup (170g)" },
    { id: 8, name: "Fresh Banana", calories: 105, protein: 1.3, carbs: 27, fats: 0.3, serving: "1 medium banana" }
  ]
};

export function NutritionPage() {
  const { emit, on } = useSocket();
  const [meals, setMeals] = useState(INITIAL_LOGGED);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("breakfast");

  // Water Intake State
  const [waterMl, setWaterMl] = useState(() => {
    try {
      const saved = localStorage.getItem("fitcircle_water_ml");
      return saved ? Number(saved) : 2250;
    } catch {
      return 2250;
    }
  });

  const [waterGoalMl, setWaterGoalMl] = useState(() => {
    try {
      const saved = localStorage.getItem("fitcircle_water_goal_ml");
      return saved ? Number(saved) : 3000;
    } catch {
      return 3000;
    }
  });

  const [customWaterInput, setCustomWaterInput] = useState("");
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const [sipLogs, setSipLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("fitcircle_sip_logs");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: 1, amount: 500, time: "08:15 AM", label: "Morning Hydration" },
      { id: 2, amount: 750, time: "11:30 AM", label: "Workout Hydration" },
      { id: 3, amount: 500, time: "02:00 PM", label: "Desk Water Refill" },
      { id: 4, amount: 500, time: "05:15 PM", label: "Post-Run Refreshment" }
    ];
  });

  // Real-time synchronization for water intake across tabs
  useEffect(() => {
    const unsubscribe = on("WATER_LOG_UPDATED", (payload) => {
      if (payload?.waterMl !== undefined) {
        setWaterMl(payload.waterMl);
      }
      if (payload?.waterGoalMl !== undefined) {
        setWaterGoalMl(payload.waterGoalMl);
      }
      if (payload?.sipLogs) {
        setSipLogs(payload.sipLogs);
      }
    });
    return unsubscribe;
  }, [on]);

  // Form states for adding custom food
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodProtein, setFoodProtein] = useState("");
  const [foodCarbs, setFoodCarbs] = useState("");
  const [foodFats, setFoodFats] = useState("");
  const [foodServing, setFoodServing] = useState("1 standard serving");

  // Aggregated totals
  const allFoods = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snacks];
  const totalCalories = allFoods.reduce((acc, f) => acc + f.calories, 0);
  const totalProtein = allFoods.reduce((acc, f) => acc + f.protein, 0);
  const totalCarbs = allFoods.reduce((acc, f) => acc + f.carbs, 0);
  const totalFats = allFoods.reduce((acc, f) => acc + f.fats, 0);

  const calorieGoal = 2200;
  const proteinGoal = 150;
  const carbsGoal = 220;
  const fatsGoal = 65;

  // Add water with custom amount & log sip
  function addWaterAmount(mlToAdd, label = "Water Added") {
    const val = Number(mlToAdd);
    if (!val || val <= 0) return;

    const nextWater = waterMl + val;
    setWaterMl(nextWater);
    localStorage.setItem("fitcircle_water_ml", String(nextWater));

    const newSip = {
      id: Date.now(),
      amount: val,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      label
    };

    const nextSips = [newSip, ...sipLogs];
    setSipLogs(nextSips);
    localStorage.setItem("fitcircle_sip_logs", JSON.stringify(nextSips));
    setCustomWaterInput("");

    // Broadcast in real-time
    emit("WATER_LOG_UPDATED", {
      waterMl: nextWater,
      waterGoalMl,
      sipLogs: nextSips
    });
  }

  function handleUndoWater() {
    const nextWater = Math.max(0, waterMl - 250);
    setWaterMl(nextWater);
    localStorage.setItem("fitcircle_water_ml", String(nextWater));

    let nextSips = sipLogs;
    if (sipLogs.length > 0) {
      nextSips = sipLogs.slice(1);
      setSipLogs(nextSips);
      localStorage.setItem("fitcircle_sip_logs", JSON.stringify(nextSips));
    }

    emit("WATER_LOG_UPDATED", {
      waterMl: nextWater,
      waterGoalMl,
      sipLogs: nextSips
    });
  }

  function handleSaveCustomGoal(e) {
    e?.preventDefault();
    const val = parseFloat(customGoalInput);
    if (val && val > 0) {
      // If user inputs in Liters (e.g. 2.5 or 3), convert to ml
      const goalInMl = val < 20 ? Math.round(val * 1000) : Math.round(val);
      setWaterGoalMl(goalInMl);
      localStorage.setItem("fitcircle_water_goal_ml", String(goalInMl));
      setIsEditingGoal(false);
      setCustomGoalInput("");

      emit("WATER_LOG_UPDATED", {
        waterMl,
        waterGoalMl: goalInMl,
        sipLogs
      });
    }
  }

  function handleAddBasicFood(foodItem) {
    const targetCat = foodItem.category || activeCategory;
    const newEntry = {
      id: Date.now(),
      name: foodItem.name,
      calories: foodItem.calories,
      protein: foodItem.protein,
      carbs: foodItem.carbs,
      fats: foodItem.fats,
      serving: foodItem.serving
    };

    setMeals((prev) => {
      const updated = {
        ...prev,
        [targetCat]: [...prev[targetCat], newEntry]
      };
      emit("MEALS_UPDATED", updated);
      return updated;
    });
  }

  function handleCustomAddSubmit(e) {
    e.preventDefault();
    if (!foodName.trim()) return;

    const newEntry = {
      id: Date.now(),
      name: foodName.trim(),
      calories: Number(foodCalories) || 200,
      protein: Number(foodProtein) || 10,
      carbs: Number(foodCarbs) || 20,
      fats: Number(foodFats) || 5,
      serving: foodServing.trim() || "1 serving"
    };

    setMeals((prev) => {
      const updated = {
        ...prev,
        [activeCategory]: [...prev[activeCategory], newEntry]
      };
      emit("MEALS_UPDATED", updated);
      return updated;
    });

    setFoodName("");
    setFoodCalories("");
    setFoodProtein("");
    setFoodCarbs("");
    setFoodFats("");
    setIsAddModalOpen(false);
  }

  function handleDeleteFood(catKey, foodId) {
    setMeals((prev) => {
      const updated = {
        ...prev,
        [catKey]: prev[catKey].filter((f) => f.id !== foodId)
      };
      emit("MEALS_UPDATED", updated);
      return updated;
    });
  }

  // Determine active vessel type based on logged water:
  // <= 1.0 L (1000ml) -> Glass
  // > 1.0 L && <= 3.0 L (1001ml - 3000ml) -> Bottle
  // > 3.0 L (> 3000ml) -> Jug
  const waterLiters = waterMl / 1000;
  let activeVessel = "glass";
  if (waterMl > 3000) {
    activeVessel = "jug";
  } else if (waterMl > 1000) {
    activeVessel = "bottle";
  }

  const waterPercentage = Math.min(100, Math.round((waterMl / waterGoalMl) * 100));

  // Compute fill height for each vessel type
  let vesselFillPercent = 0;
  if (activeVessel === "glass") {
    // Glass capacity is 1000ml
    vesselFillPercent = Math.min(100, Math.max(5, Math.round((waterMl / 1000) * 100)));
  } else if (activeVessel === "bottle") {
    // Bottle spans 1000ml to 3000ml (2000ml range)
    vesselFillPercent = Math.min(100, Math.max(10, Math.round(((waterMl - 1000) / 2000) * 100)));
  } else {
    // Jug spans > 3000ml up to goal or 5000ml
    const jugMax = Math.max(5000, waterGoalMl);
    vesselFillPercent = Math.min(100, Math.max(20, Math.round((waterMl / jugMax) * 100)));
  }

  return (
    <div className="nutrition-page-wrapper">
      <header className="nutrition-hero-header">
        <div>
          <h1>Nutrition & Meal Architecture 🥗</h1>
          <p>Fuel performance with high-yield whole foods, precise macros, and intelligent hydration.</p>
        </div>

        <button
          className="btn-open-log-modal"
          onClick={() => {
            setActiveCategory("breakfast");
            setIsAddModalOpen(true);
          }}
        >
          + Log Custom Food
        </button>
      </header>

      {/* Daily Macro Barometer */}
      <section className="macro-barometer-grid">
        <div className="macro-box hero-calorie-box">
          <div className="m-box-top">
            <span className="m-tag">Total Calories</span>
            <span className="m-icon">🔥</span>
          </div>
          <h2>{totalCalories} <small>/ {calorieGoal} kcal</small></h2>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (totalCalories / calorieGoal) * 100)}%`, background: "#2563eb" }}
            ></div>
          </div>
          <p className="m-footer-text">
            <strong>{Math.max(0, calorieGoal - totalCalories)} kcal</strong> remaining today
          </p>
        </div>

        <div className="macro-box">
          <div className="m-box-top">
            <span className="m-tag">Protein</span>
            <span className="m-icon">💪</span>
          </div>
          <h2>{totalProtein}g <small>/ {proteinGoal}g</small></h2>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (totalProtein / proteinGoal) * 100)}%`, background: "#3b82f6" }}
            ></div>
          </div>
          <p className="m-footer-text">{Math.round((totalProtein / proteinGoal) * 100)}% of muscle target</p>
        </div>

        <div className="macro-box">
          <div className="m-box-top">
            <span className="m-tag">Carbohydrates</span>
            <span className="m-icon">🌾</span>
          </div>
          <h2>{totalCarbs}g <small>/ {carbsGoal}g</small></h2>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (totalCarbs / carbsGoal) * 100)}%`, background: "#10b981" }}
            ></div>
          </div>
          <p className="m-footer-text">{Math.round((totalCarbs / carbsGoal) * 100)}% of energy fuel</p>
        </div>

        <div className="macro-box">
          <div className="m-box-top">
            <span className="m-tag">Healthy Fats</span>
            <span className="m-icon">🥑</span>
          </div>
          <h2>{totalFats}g <small>/ {fatsGoal}g</small></h2>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (totalFats / fatsGoal) * 100)}%`, background: "#f59e0b" }}
            ></div>
          </div>
          <p className="m-footer-text">{Math.round((totalFats / fatsGoal) * 100)}% of endocrine quota</p>
        </div>
      </section>

      {/* 10 BASIC IMPORTANT FOODS WITH CHECKED EXACT RELATABLE IMAGES */}
      <section className="ten-foods-section">
        <div className="section-header-row">
          <div>
            <h3>The 10 Core Fitness Foods 🌟</h3>
            <p>Scientifically verified essential staples for optimal physique & health. Click any item to log immediately!</p>
          </div>
          <span className="ten-badge">10 Essential Staples</span>
        </div>

        <div className="ten-foods-grid">
          {TEN_BASIC_FOODS.map((food) => (
            <div key={food.id} className="food-staple-card">
              <div className="staple-image-wrapper">
                <img src={food.image} alt={food.name} className="staple-img" />
                <span className="staple-cat-badge">{food.category}</span>
              </div>

              <div className="staple-content">
                <h4>{food.name}</h4>
                <span className="staple-benefit">{food.tag}</span>
                <span className="staple-serving">{food.serving}</span>

                <div className="staple-macro-row">
                  <span><strong>{food.calories}</strong> kcal</span>
                  <span>P: <strong>{food.protein}g</strong></span>
                  <span>C: <strong>{food.carbs}g</strong></span>
                  <span>F: <strong>{food.fats}g</strong></span>
                </div>

                <button
                  type="button"
                  className="btn-quick-log-staple"
                  onClick={() => handleAddBasicFood(food)}
                >
                  + Add to {food.category.toUpperCase()}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEALS BREAKDOWN WITH RELATABLE REAL IMAGES FOR BREAKFAST, LUNCH, DINNER, SNACKS */}
      <section className="meals-breakdown-section">
        <div className="section-header-row">
          <div>
            <h3>Today's Meal Architecture 🍽️</h3>
            <p>Review logged foods across morning, afternoon, evening, and snacking sessions.</p>
          </div>
        </div>

        <div className="meal-categories-grid">
          {MEAL_CATEGORIES.map((cat) => {
            const items = meals[cat.key] || [];
            const catKcal = items.reduce((sum, i) => sum + i.calories, 0);
            const catProt = items.reduce((sum, i) => sum + i.protein, 0);

            return (
              <div key={cat.key} className="meal-cat-box">
                <div className="meal-cover-header">
                  <img src={cat.image} alt={cat.label} className="meal-cover-image" />
                  <div className="meal-cover-overlay">
                    <div className="meal-cover-title">
                      <span className="meal-icon-badge">{cat.icon}</span>
                      <div>
                        <h4>{cat.label}</h4>
                        <small>{cat.timing}</small>
                      </div>
                    </div>
                    <div className="meal-cover-totals">
                      <strong>{catKcal} kcal</strong>
                      <small>{catProt}g protein</small>
                    </div>
                  </div>
                </div>

                <div className="meal-items-body">
                  {items.length > 0 ? (
                    <div className="items-list">
                      {items.map((item) => (
                        <div key={item.id} className="logged-item-row">
                          <div className="item-details">
                            <h5>{item.name}</h5>
                            <small>{item.serving}</small>
                          </div>
                          <div className="item-numbers">
                            <strong>{item.calories} kcal</strong>
                            <small>P:{item.protein}g C:{item.carbs}g F:{item.fats}g</small>
                          </div>
                          <button
                            type="button"
                            className="btn-remove-item"
                            onClick={() => handleDeleteFood(cat.key, item.id)}
                            title="Remove food"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-meal-slot">
                      <p>No food logged for {cat.label} yet.</p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn-add-food-trigger"
                    onClick={() => {
                      setActiveCategory(cat.key);
                      setIsAddModalOpen(true);
                    }}
                  >
                    + Add Food to {cat.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DYNAMIC WATER INTAKE SECTION WITH DYNAMIC VESSEL: GLASS (<=1L), BOTTLE (1L-3L), JUG (>3L) */}
      <section className="water-intake-section">
        <div className="water-intake-header">
          <div>
            <h3>Water Intake 💧</h3>
            <p>Smart real-time hydration tracker with adaptive vessels: Glass for ≤ 1L, Bottle for 1L – 3L, and Jug for &gt; 3L.</p>
          </div>

          <div className="water-target-controls">
            <span className="target-label">Daily Target:</span>
            {!isEditingGoal ? (
              <div className="target-display-chip" onClick={() => setIsEditingGoal(true)}>
                <strong>{(waterGoalMl / 1000).toFixed(1)} L</strong>
                <button type="button" className="btn-edit-target" title="Set custom target">✏️ Edit</button>
              </div>
            ) : (
              <form onSubmit={handleSaveCustomGoal} className="custom-goal-form">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  placeholder="e.g. 3.5"
                  value={customGoalInput}
                  onChange={(e) => setCustomGoalInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-save-goal">Save</button>
                <button type="button" className="btn-cancel-goal" onClick={() => setIsEditingGoal(false)}>✕</button>
              </form>
            )}
          </div>
        </div>

        {/* Vessel Stage Indicators */}
        <div className="vessel-stage-indicator-bar">
          <div className={`vessel-stage-pill ${activeVessel === "glass" ? "active" : ""}`}>
            <span className="v-pill-icon">🥛</span>
            <span>Glass Stage (≤ 1.0 L)</span>
          </div>
          <div className="stage-arrow">→</div>
          <div className={`vessel-stage-pill ${activeVessel === "bottle" ? "active" : ""}`}>
            <span className="v-pill-icon">🧴</span>
            <span>Bottle Stage (1.0 L – 3.0 L)</span>
          </div>
          <div className="stage-arrow">→</div>
          <div className={`vessel-stage-pill ${activeVessel === "jug" ? "active" : ""}`}>
            <span className="v-pill-icon">🫙</span>
            <span>Jug Stage (&gt; 3.0 L)</span>
          </div>
        </div>

        <div className="water-intake-body">
          {/* Dynamic Graphic Vessel Container */}
          <div className="dynamic-vessel-display">
            <div className={`vessel-canvas vessel-${activeVessel}`}>
              {/* GLASS VESSEL (shown when <= 1.0 L) */}
              {activeVessel === "glass" && (
                <div className="svg-vessel glass-vessel">
                  <div className="glass-rim"></div>
                  <div className="glass-body">
                    <div
                      className="vessel-water-fill"
                      style={{ height: `${vesselFillPercent}%` }}
                    >
                      <div className="water-wave-top"></div>
                    </div>
                    <div className="glass-graduations">
                      <span>1.0 L</span>
                      <span>0.5 L</span>
                      <span>0.25 L</span>
                    </div>
                  </div>
                  <span className="vessel-badge">Drinking Glass</span>
                </div>
              )}

              {/* BOTTLE VESSEL (shown when > 1.0 L and <= 3.0 L) */}
              {activeVessel === "bottle" && (
                <div className="svg-vessel bottle-vessel">
                  <div className="bottle-cap"></div>
                  <div className="bottle-neck"></div>
                  <div className="bottle-body">
                    <div
                      className="vessel-water-fill"
                      style={{ height: `${vesselFillPercent}%` }}
                    >
                      <div className="water-wave-top"></div>
                    </div>
                    <div className="bottle-graduations">
                      <span>3.0 L</span>
                      <span>2.0 L</span>
                      <span>1.0 L</span>
                    </div>
                  </div>
                  <span className="vessel-badge">Sports Bottle</span>
                </div>
              )}

              {/* JUG VESSEL (shown when > 3.0 L) */}
              {activeVessel === "jug" && (
                <div className="svg-vessel jug-vessel">
                  <div className="jug-cap"></div>
                  <div className="jug-handle"></div>
                  <div className="jug-body">
                    <div
                      className="vessel-water-fill"
                      style={{ height: `${vesselFillPercent}%` }}
                    >
                      <div className="water-wave-top"></div>
                    </div>
                    <div className="jug-graduations">
                      <span>Max</span>
                      <span>4.0 L</span>
                      <span>3.0 L</span>
                    </div>
                  </div>
                  <span className="vessel-badge">Hydration Jug</span>
                </div>
              )}
            </div>

            <div className="vessel-metrics-summary">
              <strong className="current-water-text">{waterLiters.toFixed(2)} L</strong>
              <span className="goal-subtext">of {(waterGoalMl / 1000).toFixed(1)} L Goal ({waterPercentage}%)</span>
              <span className="hydration-status-banner">
                {waterMl >= waterGoalMl
                  ? "🎉 Daily Target Reached! Outstanding Hydration!"
                  : `${((waterGoalMl - waterMl) / 1000).toFixed(2)} L remaining today`}
              </span>
            </div>
          </div>

          {/* Simple Clean Water Adder Controls */}
          <div className="water-intake-actions">
            <div className="simple-add-water-box">
              <span className="action-box-title">Add Water:</span>
              <div className="quick-step-buttons">
                <button
                  type="button"
                  className="btn-quick-step"
                  onClick={() => addWaterAmount(250, "Glass (+250ml)")}
                >
                  +250 ml
                </button>
                <button
                  type="button"
                  className="btn-quick-step primary"
                  onClick={() => addWaterAmount(500, "Bottle (+500ml)")}
                >
                  +500 ml
                </button>
                <button
                  type="button"
                  className="btn-quick-step"
                  onClick={() => addWaterAmount(1000, "Liter (+1000ml)")}
                >
                  +1,000 ml (1L)
                </button>
                <button
                  type="button"
                  className="btn-quick-step undo"
                  onClick={handleUndoWater}
                  title="Undo 250ml"
                >
                  ↩ -250 ml
                </button>
              </div>

              {/* Custom ml volume input */}
              <div className="custom-water-adder-row">
                <input
                  type="number"
                  placeholder="Enter custom ml (e.g. 330)..."
                  value={customWaterInput}
                  onChange={(e) => setCustomWaterInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-submit-water"
                  onClick={() => addWaterAmount(customWaterInput, "Custom Volume")}
                  disabled={!customWaterInput || Number(customWaterInput) <= 0}
                >
                  + Add Water
                </button>
              </div>
            </div>

            {/* Today's Sip History */}
            <div className="sip-history-card">
              <span className="sip-title">Today's Water Log</span>
              <div className="sip-list-scroll">
                {sipLogs.length > 0 ? (
                  sipLogs.map((sip) => (
                    <div key={sip.id} className="sip-item-row">
                      <div className="sip-item-left">
                        <span className="sip-drop-icon">💧</span>
                        <strong>+{sip.amount} ml</strong>
                      </div>
                      <div className="sip-item-right">
                        <span>{sip.label}</span>
                        <small>{sip.time}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-sips-text">No water entries logged yet today.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for adding custom food item */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log Food to {MEAL_CATEGORIES.find(c => c.key === activeCategory)?.label}</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCustomAddSubmit} className="modal-form">
              <div className="form-group">
                <label>Meal Category</label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option value="breakfast">🍳 Breakfast</option>
                  <option value="lunch">🥗 Lunch</option>
                  <option value="dinner">🍲 Dinner</option>
                  <option value="snacks">🍎 Snacks</option>
                </select>
              </div>

              <div className="form-group">
                <label>Food Description</label>
                <input
                  type="text"
                  placeholder="e.g. Grilled Chicken Salad with Olive Oil"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Portion / Serving Size</label>
                <input
                  type="text"
                  placeholder="e.g. 1 bowl (200g)"
                  value={foodServing}
                  onChange={(e) => setFoodServing(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    value={foodCalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    value={foodProtein}
                    onChange={(e) => setFoodProtein(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Carbohydrates (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={foodCarbs}
                    onChange={(e) => setFoodCarbs(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fats (g)</label>
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    value={foodFats}
                    onChange={(e) => setFoodFats(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save to Meal Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutritionPage;
