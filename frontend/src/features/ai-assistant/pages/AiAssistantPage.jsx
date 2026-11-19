import { useState, useRef, useEffect } from "react";
import "./AiAssistantPage.css";

const COACH_PERSONAS = [
  { id: "alex", name: "Coach Alex", title: "Strength & Hypertrophy", avatar: "🏋️", intro: "Hey! I'm Coach Alex. Let's optimize your training volume, technique, and progressive overload." },
  { id: "maya", name: "Dr. Maya", title: "Nutrition & Dietetics", avatar: "🥗", intro: "Hello! I'm Dr. Maya. I specialize in evidence-based nutrition, macro balancing, and metabolic health." },
  { id: "elena", name: "Elena", title: "HIIT, Endurance & Mobility", avatar: "⚡", intro: "Welcome! I'm Elena. Whether it's marathon prep, kettlebell circuits, or mobility, I've got your back." }
];

const SUGGESTED_PROMPTS = [
  "Build a 4-day Upper/Lower workout split",
  "Calculate my optimal daily protein intake",
  "Quick 20-minute full body hotel room workout",
  "How to break through a bench press plateau?",
  "High protein meal prep under 500 kcal per meal"
];

const KNOWLEDGE_RESPONSES = {
  split: `Here is a high-yield **4-Day Upper / Lower Workout Split**:

### Day 1: Upper Power
- **Flat Barbell Bench Press**: 4 sets × 5-6 reps (RPE 8)
- **Barbell Bent-Over Row**: 4 sets × 6-8 reps
- **Overhead Dumbbell Press**: 3 sets × 8-10 reps
- **Incline Dumbbell Curl + Tricep Rope Pushdown**: 3 supersets × 12 reps

### Day 2: Lower Power
- **Barbell Back Squats**: 4 sets × 5 reps
- **Romanian Deadlifts (RDL)**: 3 sets × 8 reps
- **Leg Press / Walking Lunges**: 3 sets × 12 reps per leg
- **Standing Calf Raises**: 4 sets × 15 reps

### Day 3: Rest & Active Recovery (Light 30m walk)

### Day 4: Upper Hypertrophy
- **Incline Dumbbell Press**: 4 sets × 8-10 reps
- **Lat Pulldowns (Neutral Grip)**: 4 sets × 10-12 reps
- **Dumbbell Lateral Raises**: 4 sets × 15 reps
- **Cable Chest Flyes**: 3 sets × 12-15 reps

### Day 5: Lower Hypertrophy
- **Front Squats or Hack Squats**: 3 sets × 8-10 reps
- **Hamstring Lying Curls**: 4 sets × 12 reps
- **Bulgarian Split Squats**: 3 sets × 10 reps/leg
- **Hanging Leg Raises**: 3 sets × 15 reps`,

  protein: `For optimal muscle hypertrophy and recovery:
- **Daily Target**: **1.6 to 2.2 grams of protein per kilogram of body weight** (0.7 - 1.0g per lb).
- For a 72kg (160 lb) individual, that equates to **120g – 160g of protein daily**.
- **Distribution Tip**: Spread this across 3-4 meals with ~30-40g of high-leucine protein per feeding to maximize Muscle Protein Synthesis (MPS).`,

  hotel: `Here is a high-intensity **20-Minute No-Equipment Hotel Routine**:
Perform 4 rounds with 45 seconds of work followed by 15 seconds rest:
1. **Air Squats with 2-second pause** (Lower body quads/glutes)
2. **Tempo Push-ups** (3 seconds down, explosive up)
3. **Alternating Reverse Lunges into High Knee**
4. **Mountain Climbers** (Core & cardiovascular sprint)
5. **Plank Shoulder Taps**
*Rest 1 minute between full rounds!*`,

  plateau: `To break through a **Bench Press Plateau**:
1. **Micro-load**: Add 0.5kg to 1.25kg fractional plates instead of forcing 5kg jumps.
2. **Target Weak Link**: If you fail off the chest, add 2-second Pause Bench. If you fail at lockout, prioritize close-grip bench and heavy tricep work.
3. **Dial Back Fatigue**: Take a 1-week deload at 50% volume to allow connective tissue to resensitize.
4. **Increase Frequency**: Bench twice per week with one heavy day and one technique/hypertrophy day.`,

  meal: `Here is a **High-Protein Meal Prep Recipe (4 Servings)**:
### Sheet-Pan Chipotle Chicken & Fajita Bowls
- **Ingredients**: 800g Chicken breast sliced, 2 Bell peppers, 1 Red onion, 1 tbsp Olive oil, Fajita seasoning, 200g Brown rice (dry weight), 1 can Black beans.
- **Nutrition per container**: 485 kcal | **48g Protein** | 52g Carbs | 9g Healthy Fats.
- Stores in the fridge for up to 4 days with top-notch freshness!`
};

export function AiAssistantPage() {
  const [selectedCoach, setSelectedCoach] = useState(COACH_PERSONAS[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "coach",
      text: selectedCoach.intro,
      time: "Just now"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function handleSelectCoach(coach) {
    setSelectedCoach(coach);
    setMessages([
      {
        id: Date.now(),
        sender: "coach",
        text: coach.intro,
        time: "Just now"
      }
    ]);
  }

  function handleSendMessage(textToSend) {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      const lower = text.toLowerCase();
      if (lower.includes("split") || lower.includes("workout plan") || lower.includes("routine")) {
        replyText = KNOWLEDGE_RESPONSES.split;
      } else if (lower.includes("protein") || lower.includes("macro") || lower.includes("gram")) {
        replyText = KNOWLEDGE_RESPONSES.protein;
      } else if (lower.includes("hotel") || lower.includes("bodyweight") || lower.includes("quick")) {
        replyText = KNOWLEDGE_RESPONSES.hotel;
      } else if (lower.includes("bench") || lower.includes("plateau") || lower.includes("squat") || lower.includes("deadlift")) {
        replyText = KNOWLEDGE_RESPONSES.plateau;
      } else if (lower.includes("meal") || lower.includes("recipe") || lower.includes("food") || lower.includes("prep")) {
        replyText = KNOWLEDGE_RESPONSES.meal;
      } else {
        replyText = `Great question regarding **${text}**! Based on your current training consistency and goals:

1. **Consistency**: Prioritize adherence over perfection. Small weekly progressive steps yield the greatest sustainable gains.
2. **Recovery**: Ensure you're sleeping 7-8 hours and meeting your 2.5L+ hydration quota.
3. **Tracking**: Log your weights and sets in the Activity tab so we can analyze your progressive overload trend!

Would you like me to generate a tailored workout or meal plan for this?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "coach",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsTyping(false);
    }, 900);
  }

  return (
    <div className="ai-assistant-page">
      <header className="ai-header">
        <div>
          <h1>FitCircle AI Assistant 🤖</h1>
          <p>Instant expert fitness, nutrition, and recovery guidance powered by intelligent coaching models.</p>
        </div>

        <button
          className="btn-clear-chat"
          onClick={() => {
            setMessages([
              {
                id: Date.now(),
                sender: "coach",
                text: selectedCoach.intro,
                time: "Just now"
              }
            ]);
          }}
        >
          🗑️ Clear Conversation
        </button>
      </header>

      {/* Coach Persona Selector */}
      <section className="coach-selector-bar">
        <span className="selector-label">Select Your AI Coach:</span>
        <div className="coach-tabs">
          {COACH_PERSONAS.map((coach) => (
            <button
              key={coach.id}
              className={`coach-pill ${selectedCoach.id === coach.id ? "active" : ""}`}
              onClick={() => handleSelectCoach(coach)}
            >
              <span className="coach-pill-avatar">{coach.avatar}</span>
              <div className="coach-pill-text">
                <strong>{coach.name}</strong>
                <small>{coach.title}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Chat Interface */}
      <div className="chat-window-card">
        {/* Messages Stream */}
        <div className="messages-stream">
          {messages.map((m) => (
            <div key={m.id} className={`message-row ${m.sender}`}>
              {m.sender === "coach" && (
                <div className="coach-chat-avatar">{selectedCoach.avatar}</div>
              )}
              <div className="message-bubble">
                <div className="message-sender-name">
                  {m.sender === "coach" ? selectedCoach.name : "You"}
                </div>
                <div className="message-text">
                  {m.text.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
                <div className="message-timestamp">{m.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-row coach">
              <div className="coach-chat-avatar">{selectedCoach.avatar}</div>
              <div className="message-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="chat-suggested-shelf">
          <span className="suggested-title">💡 Prompt Ideas:</span>
          <div className="suggested-pills-list">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="suggested-prompt-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          className="chat-input-area"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            placeholder={`Ask ${selectedCoach.name} anything about workouts, diet, or recovery...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="chat-send-btn" disabled={!inputValue.trim()}>
            Send ➔
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiAssistantPage;
