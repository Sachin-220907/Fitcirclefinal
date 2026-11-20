import { useMemo } from "react";
import "./NutrientGlossyBackground.css";

const NUTRIENT_PARTICLES = [
  {
    id: 1,
    name: "Protein",
    code: "AMINO-9",
    icon: "🥩",
    type: "protein",
    size: 110,
    top: "12%",
    left: "8%",
    duration: 22,
    delay: 0,
    blur: 0
  },
  {
    id: 2,
    name: "Hydration",
    code: "H₂O",
    icon: "💧",
    type: "hydration",
    size: 95,
    top: "22%",
    left: "84%",
    duration: 19,
    delay: 2,
    blur: 0
  },
  {
    id: 3,
    name: "Omega-3",
    code: "EPA/DHA",
    icon: "🥑",
    type: "lipid",
    size: 105,
    top: "68%",
    left: "6%",
    duration: 26,
    delay: 4,
    blur: 0
  },
  {
    id: 4,
    name: "Complex Carbs",
    code: "GLYCOGEN",
    icon: "🌾",
    type: "carbs",
    size: 100,
    top: "62%",
    left: "88%",
    duration: 24,
    delay: 1,
    blur: 0
  },
  {
    id: 5,
    name: "Vit-C & Zinc",
    code: "ANTIOXIDANT",
    icon: "🫐",
    type: "vitamin",
    size: 88,
    top: "40%",
    left: "14%",
    duration: 21,
    delay: 3,
    blur: 0
  },
  {
    id: 6,
    name: "Electrolytes",
    code: "Na⁺ / K⁺",
    icon: "⚡",
    type: "mineral",
    size: 84,
    top: "35%",
    left: "76%",
    duration: 20,
    delay: 5,
    blur: 0
  },
  {
    id: 7,
    name: "Chlorophyll",
    code: "PHYTO",
    icon: "🥬",
    type: "greens",
    size: 92,
    top: "84%",
    left: "44%",
    duration: 25,
    delay: 2.5,
    blur: 0
  },
  {
    id: 8,
    name: "Metabolism",
    code: "ATP-ENERGY",
    icon: "🔥",
    type: "energy",
    size: 80,
    top: "8%",
    left: "52%",
    duration: 18,
    delay: 3.5,
    blur: 0
  }
];

export function NutrientGlossyBackground() {
  const particles = useMemo(() => NUTRIENT_PARTICLES, []);

  return (
    <div className="nutrient-glossy-canvas" aria-hidden="true">
      {/* Glossy liquid refraction wave sweeping across the page */}
      <div className="glossy-sheen-wave"></div>
      <div className="glossy-sheen-wave-secondary"></div>

      {/* Floating 3D Glossy Nutrient Spheres */}
      <div className="nutrient-spheres-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`nutrient-sphere nutrient-${p.type}`}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: p.top,
              left: p.left,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`
            }}
          >
            {/* Specular high-gloss curved reflections */}
            <div className="sphere-specular-glint"></div>
            <div className="sphere-rim-light"></div>
            <div className="sphere-inner-glow"></div>

            {/* Nutrient identity and formula tag */}
            <div className="sphere-content">
              <span className="sphere-icon">{p.icon}</span>
              <span className="sphere-label">{p.name}</span>
              <span className="sphere-code">{p.code}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ambient nutrient cellular micro-bubbles */}
      <div className="nutrient-cellular-mesh"></div>
    </div>
  );
}

export default NutrientGlossyBackground;
