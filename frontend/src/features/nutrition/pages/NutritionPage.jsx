import { useState } from "react";
import "./NutritionPage.css";

const TEN_BASIC_FOODS = [
  {
    id: "f1",
    name: "Oats",
    image: "https://imgs.search.brave.com/frcGOHvQekgsVq79W8J7Ap-30bfUkZLHzRKXQoRELAM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODk5/Nzk2NTI0L3Bob3Rv/L29hdC1mbGFrZXMt/aW4tYS1nbGFzcy1i/b3dsLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1vU3I0SUI5/cjJFSXduMjRIU2dU/Nm1SZ0dHU3BmbWdC/SmtCSEFXS29OMlc4/PQ",
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
    name: "WholeEggs",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80",
    serving: "1 egg",
    calories: 140,
    protein: 6,
    carbs: 1,
    fats: 10,
    category: "breakfast",
    tag: "Bioavailable Protein"
  },
  {
    id: "f3",
    name: "Chicken Breast Cooked",
    image: "https://imgs.search.brave.com/iy8PzE8Xadp3rg0tpyx0i0P3EWgJnfU2qmPydokPg20/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzUv/NjIzLzMxOC9zbWFs/bC9ncmlsbGVkLWNo/aWNrZW4tYnJlYXN0/LW9uLWJsYWNrLXBs/YXRlLXdpdGgtaGVy/YnMtcGhvdG8uanBn",
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
    name: "Bread",
    image: "https://imgs.search.brave.com/XOUdzVvJeeowsJ02Sn_wuXbK24z1TUM24mo3NNf6jNM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDgx/NTk4ODAwL3Bob3Rv/L3BsYWluLWJyZWFk/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1BNjZhWnZXaUtV/eXJaMGpVMHBzcVc4/STV6ZHBkeWdrZ3Vf/N25UbllvczFVPQ",
    serving: "200g",
    calories: 530,
    protein: 18,
    carbs: 98,
    fats: 6,
    category: "breakfast",
    tag: "Complex Carbs & Fiber"
  },
  {
    id: "f5",
    name: "Rice",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    serving: "1 cup cooked (150g)",
    calories: 215,
    protein: 5,
    carbs: 45,
    fats: 2,
    category: "lunch",
    tag: "Glycogen Fuel"
  },
  {
    id: "f6",
    name: "Greek Yogurt",
    image: "https://imgs.search.brave.com/QgmoZ2ipMKoAfuOFF6VKlFquQv0D5hBC_T3Q-KbwKwA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTQ1/MzQwMTU2L3Bob3Rv/L2Jvd2wtb2Ytd2hp/dGUteW9naHVydC13/aXRoLWJlcnJpZXMt/aXNvbGF0ZWQtb24t/d2hpdGUtYmFjLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz0z/RWUxdDU2QUcwd19F/Tlo3dDZweVBKNjhu/ei1CZ0RZdUpxM1NB/T3BqSExJPQ",
    serving: "1 cup (170g)",
    calories: 130,
    protein: 18,
    carbs: 6,
    fats: 4,
    category: "snacks",
    tag: "Slow-Release Casein"
  },
  {
    id: "f7",
    name: "Banana",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80",
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
    name: "Chapati",
    image: "https://imgs.search.brave.com/IFvj6FUI6wbH6rBktzk3E8mC17CxxZT_U8luvsWi7Ho/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/Njg0OTY1OS9waG90/by9jaGFwYXRpLXRh/dmEtcm90aS1hbHNv/LWtub3duLWFzLWlu/ZGlhbi1icmVhZC1v/ci1mdWxrYS1waHVs/a2EtbWFpbi1pbmdy/ZWRpZW50LW9mLWx1/bmNoLWRpbm5lci5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/SWxzMVBGOTRwbklu/SHB1NnNmN2dfNzhB/bU5tS2N3amJ2M29l/VnFWdGFXMD0",
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
    name: "Salmon (Cooked)",
    image: "https://imgs.search.brave.com/7LUDzJ7Fi8BboQjep6Qqdz6sBMjzFqROoszgdm92Gjw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE1LzY0LzkyLzM3/LzM2MF9GXzE1NjQ5/MjM3NzZfNk1INjV2/UlJuMXQ4Y0dDN3Bm/MG9La2UyRm94VXVx/OHguanBn",
    serving: "1 scoop (30g)",
    calories: 130,
    protein: 25,
    carbs: 3,
    fats: 1.5,
    category: "snacks",
    tag: "Fast Post-Workout Anabolism"
  }
];

const MEAL_CATEGORIES = [
  {
    key: "breakfast",
    label: "Breakfast",
    timing: "Morning Fuel (07:00 - 10:00)",
    icon: "🍳",
    image: "https://imgs.search.brave.com/-srOY4LXtP6wA_0AbkhK68XBrO4BPyCMRrgMnLOJyUY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTAv/ODU4LzIzNy9zbWFs/bC90YXN0eS1icmVh/a2Zhc3Qtd2l0aC1l/Z2dzLXNhdXNhZ2Vz/LXRvYXN0cy1hbmQt/Y3VwLW9mLWNvZmZl/ZS1hbWVyaWNhbi1i/cmVha2Zhc3QtcGhv/dG8uanBn",
  },
  {
    key: "lunch",
    label: "Lunch",
    timing: "Midday Sustenance (12:00 - 14:30)",
    icon: "🥗",
    image: "https://imgs.search.brave.com/7LUDzJ7Fi8BboQjep6Qqdz6sBMjzFqROoszgdm92Gjw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE1LzY0LzkyLzM3/LzM2MF9GXzE1NjQ5/MjM3NzZfNk1INjV2/UlJuMXQ4Y0dDN3Bm/MG9La2UyRm94VXVx/OHguanBn",
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
    { id: 1, name: "Oats (Oatmeal)", calories: 300, protein: 10, carbs: 54, fats: 5, serving: "1 cup (80g dry)" },
    { id: 2, name: "Whole Eggs", calories: 140, protein: 6, carbs: 1, fats: 10, serving: "1 egg" }
  ],
  lunch: [
    { id: 3, name: "Grilled Chicken Breast", calories: 220, protein: 46, carbs: 0, fats: 3.5, serving: "150g cooked" },
    { id: 4, name: "Brown Rice & Quinoa", calories: 215, protein: 5, carbs: 45, fats: 2, serving: "1 cup cooked (150g)" }
  ],
  dinner: [
    { id: 5, name: "Atlantic Salmon Fillet", calories: 280, protein: 34, carbs: 0, fats: 15, serving: "150g fillet" },
    { id: 6, name: "Steamed Fresh Broccoli", calories: 55, protein: 3.7, carbs: 11, fats: 0.6, serving: "1.5 cups (150g)" }
  ],
  snacks: [
    { id: 7, name: "Whey Protein Shake", calories: 130, protein: 25, carbs: 3, fats: 1.5, serving: "1 scoop in water" }
  ]
};

export function NutritionPage() {
  const [meals, setMeals] = useState(INITIAL_LOGGED);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("breakfast");

  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodProtein, setFoodProtein] = useState("");
  const [foodCarbs, setFoodCarbs] = useState("");
  const [foodFats, setFoodFats] = useState("");
  const [foodServing, setFoodServing] = useState("1 standard serving");

  const allFoods = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snacks];
  const totalCalories = allFoods.reduce((acc, f) => acc + f.calories, 0);
  const totalProtein = allFoods.reduce((acc, f) => acc + f.protein, 0);
  const totalCarbs = allFoods.reduce((acc, f) => acc + f.carbs, 0);
  const totalFats = allFoods.reduce((acc, f) => acc + f.fats, 0);

  const calorieGoal = 2200;
  const proteinGoal = 150;
  const carbsGoal = 220;
  const fatsGoal = 65;

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

    setMeals((prev) => ({
      ...prev,
      [targetCat]: [...prev[targetCat], newEntry]
    }));
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

    setMeals((prev) => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], newEntry]
    }));

    setFoodName("");
    setFoodCalories("");
    setFoodProtein("");
    setFoodCarbs("");
    setFoodFats("");
    setIsAddModalOpen(false);
  }

  function handleDeleteFood(catKey, foodId) {
    setMeals((prev) => ({
      ...prev,
      [catKey]: prev[catKey].filter((f) => f.id !== foodId)
    }));
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