"use client";
import { useState, useMemo } from "react";
import paddlesRaw from "@/data/paddles.json";
import { Paddle, num, formatStat, statLabels } from "@/types/paddle";
import PaddleCard, { PaddleImage } from "@/components/PaddleCard";

const paddles = paddlesRaw as Paddle[];

interface Question {
  id: string;
  question: string;
  emoji: string;
  options: { label: string; value: string; emoji: string }[];
}

const questions: Question[] = [
  {
    id: "skill",
    question: "What's your skill level?",
    emoji: "🎓",
    options: [
      { label: "Beginner", value: "beginner", emoji: "🌱" },
      { label: "Intermediate", value: "intermediate", emoji: "📈" },
      { label: "Advanced", value: "advanced", emoji: "⚡" },
      { label: "Pro", value: "pro", emoji: "🏆" },
    ],
  },
  {
    id: "style",
    question: "How would you describe your play style?",
    emoji: "🎭",
    options: [
      { label: "Aggressive Power", value: "power", emoji: "💥" },
      { label: "All-Court Balanced", value: "balanced", emoji: "⚖️" },
      { label: "Control & Touch", value: "control", emoji: "🎯" },
    ],
  },
  {
    id: "game",
    question: "What do you play most?",
    emoji: "🏸",
    options: [
      { label: "Mostly Singles", value: "singles", emoji: "1️⃣" },
      { label: "Mostly Doubles", value: "doubles", emoji: "2️⃣" },
      { label: "Both equally", value: "both", emoji: "🤝" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    emoji: "⭐",
    options: [
      { label: "Power", value: "power", emoji: "💪" },
      { label: "Spin", value: "spin", emoji: "🌀" },
      { label: "Control", value: "control", emoji: "🎯" },
      { label: "Forgiveness", value: "forgiveness", emoji: "🛡️" },
    ],
  },
  {
    id: "shape",
    question: "Preferred paddle shape?",
    emoji: "📐",
    options: [
      { label: "Elongated", value: "elongated", emoji: "📏" },
      { label: "Hybrid", value: "hybrid", emoji: "🔀" },
      { label: "Widebody", value: "widebody", emoji: "🟩" },
      { label: "Not sure", value: "any", emoji: "🤷" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget?",
    emoji: "💰",
    options: [
      { label: "Under $100", value: "low", emoji: "💵" },
      { label: "$100 – $200", value: "mid", emoji: "💳" },
      { label: "$200 – $300", value: "high", emoji: "💎" },
      { label: "$300+", value: "premium", emoji: "👑" },
      { label: "No budget", value: "any", emoji: "♾️" },
    ],
  },
  {
    id: "grip",
    question: "Grip size preference?",
    emoji: "✋",
    options: [
      { label: "Small (4\")", value: "4", emoji: "🤏" },
      { label: "Medium (4.125\")", value: "4.125", emoji: "✋" },
      { label: "Large (4.25\")", value: "4.25", emoji: "🖐️" },
      { label: "Not sure", value: "any", emoji: "🤷" },
    ],
  },
];

interface Answers {
  [key: string]: string;
}

function scorePaddle(p: Paddle, answers: Answers): number {
  let score = 0;
  const sw = num(p.swingweight);
  const tw = num(p.twistweight);
  const power = num(p.power_mph);
  const spin = num(p.spin_rpm);
  const weight = num(p.weight_oz);
  const thickness = num(p.core_thickness_mm);

  // Skill level
  if (answers.skill === "beginner") {
    // Beginners want forgiveness: high TW, wider shapes, thicker cores
    if (tw >= 6) score += 3;
    if (thickness >= 16) score += 2;
    if (p.shape.trim() === "Widebody") score += 2;
    if (sw < 115) score += 1; // lighter swing
  } else if (answers.skill === "intermediate") {
    if (tw >= 5.5) score += 2;
    if (thickness >= 14) score += 1;
  } else if (answers.skill === "advanced" || answers.skill === "pro") {
    // More specialized is fine
    score += 1;
  }

  // Play style
  if (answers.style === "power") {
    if (sw >= 118) score += 3;
    if (power >= 55) score += 2;
    if (p.paddle_type === "Power") score += 3;
  } else if (answers.style === "control") {
    if (sw <= 115) score += 2;
    if (tw >= 6) score += 3;
    if (p.paddle_type === "Control") score += 3;
    if (thickness >= 16) score += 1;
  } else if (answers.style === "balanced") {
    if (p.paddle_type === "All-Court" || p.paddle_type === "All Court") score += 3;
    if (sw >= 110 && sw <= 120) score += 2;
  }

  // Game type
  if (answers.game === "singles") {
    if (sw >= 115) score += 2; // more power for singles
    if (p.shape.trim() === "Elongated") score += 1; // reach
  } else if (answers.game === "doubles") {
    if (tw >= 6) score += 2; // maneuverability at net
    if (sw <= 118) score += 1;
  }

  // Priority
  if (answers.priority === "power") {
    if (power >= 55) score += 3;
    if (sw >= 118) score += 2;
  } else if (answers.priority === "spin") {
    if (spin >= 1900) score += 3;
    if (p.spin_rating === "Very High") score += 2;
    if (p.grit_type && p.grit_type !== "") score += 1;
  } else if (answers.priority === "control") {
    if (tw >= 6) score += 3;
    if (thickness >= 16) score += 2;
  } else if (answers.priority === "forgiveness") {
    if (tw >= 6.5) score += 3;
    if (p.shape.trim() === "Widebody") score += 2;
    if (thickness >= 16) score += 2;
  }

  // Shape preference
  if (answers.shape !== "any") {
    const shapeMap: Record<string, string> = { elongated: "Elongated", hybrid: "Hybrid", widebody: "Widebody" };
    if (p.shape.trim() === shapeMap[answers.shape]) score += 3;
  }

  // Grip preference
  if (answers.grip !== "any") {
    if (p.grip_size_in === answers.grip) score += 2;
  }

  // Prefer newer paddles slightly
  if (num(p.year_released) >= 2024) score += 1;

  // Prefer paddles with complete data
  if (sw > 0 && tw > 0 && power > 0 && spin > 0) score += 1;

  return score;
}

function getRecommendationDescription(answers: Answers): string {
  const parts: string[] = [];
  
  if (answers.style === "power") parts.push("a power-oriented paddle with high swingweight for maximum drive");
  else if (answers.style === "control") parts.push("a control-focused paddle with high twistweight for stability and touch");
  else parts.push("an all-court paddle that balances power and control");

  if (answers.shape === "elongated") parts.push("in an elongated shape for extra reach");
  else if (answers.shape === "widebody") parts.push("in a widebody shape for a larger sweet spot");
  else if (answers.shape === "hybrid") parts.push("in a hybrid shape for versatility");

  if (answers.priority === "spin") parts.push("with emphasis on spin generation");
  else if (answers.priority === "forgiveness") parts.push("with emphasis on forgiveness");

  return `Based on your answers, you'd do best with ${parts.join(", ")}. Here are our top picks:`;
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => setShowResults(true), 200);
    }
  };

  const recommendations = useMemo(() => {
    if (!showResults) return [];
    return paddles
      .map(p => ({ paddle: p, score: scorePaddle(p, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(r => r.paddle);
  }, [showResults, answers]);

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-extrabold mb-4">Your Perfect Paddles</h1>
          <p className="text-gray-500 max-w-xl mx-auto">{getRecommendationDescription(answers)}</p>
        </div>
        <div className="space-y-4">
          {recommendations.map((p, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="bg-white rounded-xl border border-gray-200 hover:border-lime-300 overflow-hidden transition-all hover:shadow-md">
                <div className="relative">
                  <PaddleImage src={p.image_url} alt={`${p.brand} ${p.paddle_name}`} height={140} />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-lime-500 text-white font-bold flex items-center justify-center text-sm shadow">
                    {i + 1}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-medium text-lime-600 uppercase tracking-wide">{p.brand}</div>
                  <h3 className="font-bold text-lg text-gray-900">{p.paddle_name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                    {p.shape && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.shape.trim()}</span>}
                    {p.paddle_type && <span className="text-xs px-2 py-0.5 rounded-full bg-lime-50 text-lime-700">{p.paddle_type}</span>}
                    {p.build_style && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.build_style}</span>}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
                    <Stat label="SW" val={p.swingweight} />
                    <Stat label="TW" val={p.twistweight} />
                    <Stat label="Weight" val={p.weight_oz ? `${p.weight_oz}oz` : "—"} />
                    <Stat label="Spin" val={p.spin_rpm || "—"} />
                    <Stat label="Power" val={p.power_mph || "—"} />
                    <Stat label="Core" val={p.core_thickness_mm ? `${p.core_thickness_mm}mm` : "—"} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={restart} className="px-6 py-3 bg-lime-500 text-white rounded-full font-semibold hover:bg-lime-600 transition-colors">
            🔄 Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-lime-500 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8 animate-fade-in" key={step}>
        <div className="text-5xl mb-4">{q.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-900">{q.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3 animate-slide-up" key={`opts-${step}`}>
        {q.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(q.id, opt.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 hover:border-lime-400 hover:bg-lime-50 hover:shadow-md ${
              answers[q.id] === opt.value
                ? "border-lime-400 bg-lime-50 ring-2 ring-lime-200"
                : "border-gray-200 bg-white"
            }`}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="font-medium text-gray-800">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Back button */}
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

function Stat({ label, val }: { label: string; val: string }) {
  return (
    <div>
      <div className="text-[10px] text-gray-400 uppercase">{label}</div>
      <div className="text-xs font-semibold text-gray-700">{val || "—"}</div>
    </div>
  );
}
