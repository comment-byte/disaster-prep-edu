
import './index.css';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Flame,
  Home,
  LifeBuoy,
  MapPin,
  Menu,
  PhoneCall,
  ShieldCheck,
  Siren,
  Waves,
  Zap
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar
} from "recharts";

/**
 * DisasterPrep EDU – Frontend-Only React App (Single-File, Hackathon-Ready)
 * Stack: React + Tailwind + Framer Motion + Recharts + Lucide Icons
 *
 * Tips for the demo:
 * - No backend required. Data is mocked in-memory and persisted to localStorage.
 * - Unique hook: Lightweight virtual drill with timer + consequences + scoring.
 * - Region-aware UI (India) that changes risk focus and alert feed.
 * - Admin dashboard with charts + preparedness score.
 * - Emergency screen with a (mock) panic button and quick contacts.
 *
 * To use: drop this component into a Vite React project and ensure Tailwind is set up.
 * Exported as default <DisasterPrepApp/> for easy mounting.
 */

// ---------- Utilities ----------
const cls = (...c) => c.filter(Boolean).join(" ");
const disasters = [
  { key: "earthquake", name: "Earthquake", icon: Activity, color: "from-sky-500 to-indigo-600" },
  { key: "flood", name: "Flood", icon: Waves, color: "from-cyan-500 to-blue-600" },
  { key: "fire", name: "Fire", icon: Flame, color: "from-amber-500 to-red-600" },
  { key: "cyclone", name: "Cyclone", icon: LifeBuoy, color: "from-emerald-500 to-teal-700" }
];

const indianRegions = [
  { id: "punjab", name: "Punjab", focus: ["flood", "heat"], city: "Chandigarh" },
  { id: "himachal", name: "Himachal Pradesh", focus: ["earthquake", "landslide"], city: "Shimla" },
  { id: "odisha", name: "Odisha", focus: ["cyclone", "flood"], city: "Bhubaneswar" },
  { id: "assam", name: "Assam", focus: ["flood", "earthquake"], city: "Guwahati" },
  { id: "maharashtra", name: "Maharashtra", focus: ["flood", "fire"], city: "Mumbai" },
  { id: "delhi", name: "Delhi", focus: ["heat", "air"], city: "New Delhi" }
];

const regionTips = {
  flood: [
    "Move to higher ground; avoid walking or driving through flood waters.",
    "Switch off main electricity if water enters rooms.",
    "Prepare a go-bag: water, torch, medicines, power bank."
  ],
  earthquake: [
    "Drop, Cover, Hold On under sturdy furniture.",
    "Stay away from windows and heavy hanging objects.",
    "After shaking stops, evacuate to open ground via stairs (no lifts)."
  ],
  fire: [
    "Use the back of your hand to check door heat; crawl low under smoke.",
    "Use extinguishers only if trained and fire is small.",
    "Know your nearest two exits from every room."
  ],
  cyclone: [
    "Secure loose objects; stay indoors away from windows.",
    "Keep battery radio/phone charged; follow official advisories.",
    "After landfall, beware of live wires and flood waters."
  ]
};

const contactsSeed = [
  { name: "Campus Security", phone: "+91-100", type: "Security" },
  { name: "Fire Brigade", phone: "101", type: "Fire" },
  { name: "Ambulance", phone: "108", type: "Medical" },
  { name: "NDMA Helpline", phone: "112", type: "National" },
  { name: "Principal Office", phone: "+91-172-1234567", type: "Admin" }
];

const demoAlerts = (regionId) => {
  const now = new Date();
  const mins = (m) => new Date(now.getTime() - m * 60000).toLocaleTimeString();
  const r = indianRegions.find((x) => x.id === regionId) || indianRegions[0];
  const list = [
    { type: "Earthquake Drill", level: "info", when: mins(2), text: `Campus-wide drill scheduled at 11:00 AM in ${r.city}.` },
    { type: "Weather", level: "warn", when: mins(9), text: `IMD advisory: Moderate ${r.focus.includes("flood") ? "rainfall" : "winds"} expected.` },
    { type: "Safety", level: "ok", when: mins(21), text: "Evacuation route A updated near Block C." },
    { type: "Incident", level: "alert", when: mins(34), text: "Mock fire reported in Lab 204 (Training)." }
  ];
  return list;
};

// ---------- Local storage hooks ----------
const useLocal = (key, initial) => {
  const [v, setV] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
};

// ---------- Main App ----------
export default function DisasterPrepApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useLocal("dp.view", "home");
  const [region, setRegion] = useLocal("dp.region", indianRegions[0].id);
  const [score, setScore] = useLocal("dp.score", 42); // Preparedness score (0-100)
  const [alerts, setAlerts] = useLocal("dp.alerts", demoAlerts(region));

  useEffect(() => {
    setAlerts(demoAlerts(region));
  }, [region]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <TopNav
        view={view}
        setView={setView}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        score={score}
        region={region}
        setRegion={setRegion}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <Landing onStartDrill={() => setView("drill")} onLearn={() => setView("learn")} onEmergency={() => setView("emergency")} region={region} />
              <SectionTitle title="Live Campus Feed" subtitle="Mock alerts for demo – switches with region" icon={Bell} />
              <AlertsFeed alerts={alerts} />
            </motion.div>
          )}

          {view === "learn" && (
            <motion.div key="learn" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <LearningModules score={score} setScore={setScore} />
            </motion.div>
          )}

          {view === "drill" && (
            <motion.div key="drill" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <DrillSimulation score={score} setScore={setScore} />
            </motion.div>
          )}

          {view === "admin" && (
            <motion.div key="admin" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <AdminDashboard score={score} />
            </motion.div>
          )}

          {view === "emergency" && (
            <motion.div key="emergency" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <EmergencyDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

// ---------- UI Building Blocks ----------
function TopNav({ view, setView, menuOpen, setMenuOpen, score, region, setRegion }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur bg-neutral-950/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Siren className="w-6 h-6 text-emerald-400" />
          <span className="font-semibold tracking-tight">DisasterPrep EDU</span>
          <span className="text-xs text-neutral-400 hidden sm:inline">Govt. of Punjab – Demo UI</span>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          <NavBtn icon={Home} active={view === "home"} onClick={() => setView("home")}>Home</NavBtn>
          <NavBtn icon={BookOpen} active={view === "learn"} onClick={() => setView("learn")}>Learn</NavBtn>
          <NavBtn icon={ShieldCheck} active={view === "drill"} onClick={() => setView("drill")}>Drill</NavBtn>
          <NavBtn icon={Award} active={view === "admin"} onClick={() => setView("admin")}>Admin</NavBtn>
          <NavBtn icon={AlertTriangle} active={view === "emergency"} onClick={() => setView("emergency")}>Emergency</NavBtn>
        </nav>
        <div className="flex items-center gap-3">
          <RegionSelect region={region} setRegion={setRegion} />
          <ScoreBadge score={score} />
          <button className="md:hidden p-2 rounded-xl hover:bg-white/5" onClick={() => setMenuOpen((v) => !v)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden border-t border-white/10">
            <div className="px-4 py-2 flex flex-wrap gap-2">
              <NavBtn icon={Home} active={view === "home"} onClick={() => setView("home")}>Home</NavBtn>
              <NavBtn icon={BookOpen} active={view === "learn"} onClick={() => setView("learn")}>Learn</NavBtn>
              <NavBtn icon={ShieldCheck} active={view === "drill"} onClick={() => setView("drill")}>Drill</NavBtn>
              <NavBtn icon={Award} active={view === "admin"} onClick={() => setView("admin")}>Admin</NavBtn>
              <NavBtn icon={AlertTriangle} active={view === "emergency"} onClick={() => setView("emergency")}>Emergency</NavBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavBtn({ icon: Icon, active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm",
        active ? "bg-white/10 ring-1 ring-white/10" : "hover:bg-white/5"
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

function ScoreBadge({ score }) {
  const tone = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 ring-1 ring-white/10">
      <ShieldCheck className={cls("w-4 h-4", tone)} />
      <span className="text-xs">Preparedness</span>
      <span className={cls("font-semibold", tone)}>{score}</span>
    </div>
  );
}

function RegionSelect({ region, setRegion }) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-4 h-4 text-sky-400" />
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="bg-transparent text-sm px-2 py-1 rounded-lg border border-white/10 focus:outline-none"
      >
        {indianRegions.map((r) => (
          <option className="bg-neutral-900" key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionTitle({ title, subtitle, icon: Icon }) {
  return (
    <div className="mt-12 mb-4 flex items-end justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function Card({ children, className }) {
  return (
    <div className={cls("rounded-2xl border border-white/10 bg-white/5 p-4", className)}>{children}</div>
  );
}

function CTAButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/90 hover:bg-emerald-500 text-neutral-900 font-semibold shadow-lg shadow-emerald-500/20"
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// ---------- Pages ----------
function Landing({ onStartDrill, onLearn, onEmergency, region }) {
  const reg = indianRegions.find((x) => x.id === region) || indianRegions[0];
  return (
    <div>
      <Hero onStartDrill={onStartDrill} onLearn={onLearn} />

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Card>
          <h3 className="font-semibold mb-2">Region Focus: {reg.name}</h3>
          <div className="text-sm text-neutral-300">Likely hazards & instant tips for your area.</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {reg.focus.slice(0, 2).map((f) => (
              <motion.div key={f} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3 bg-gradient-to-br from-white/10 to-transparent">
                <div className="text-xs uppercase tracking-wide text-neutral-400">Priority</div>
                <div className="font-semibold capitalize">{f}</div>
                <ul className="mt-2 list-disc list-inside text-sm text-neutral-300">
                  {(regionTips[f] || []).slice(0, 2).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <CTAButton onClick={onStartDrill}><ShieldCheck className="w-4 h-4" /> Start Drill</CTAButton>
            <CTAButton onClick={onLearn}><BookOpen className="w-4 h-4" /> Learn Safety</CTAButton>
            <CTAButton onClick={onEmergency}><PhoneCall className="w-4 h-4" /> Emergency</CTAButton>
          </div>
          <p className="text-xs text-neutral-400 mt-3">Demo: These CTAs navigate without backend. All data is local to the browser.</p>
        </Card>
      </div>

      <SectionTitle title="Disaster Modules" subtitle="Interactive learning with micro-quizzes" icon={BookOpen} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {disasters.map((d) => (
          <DisasterCard key={d.key} d={d} />
        ))}
      </div>
    </div>
  );
}

function Hero({ onStartDrill, onLearn }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6">
      {/* Animated background waves */}
      <motion.div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl"
        animate={{ scale: [1, 1.08, 1], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <Siren className="w-5 h-5" />
          Disaster Preparedness & Response Education
        </div>
        <h1 className="mt-2 text-2xl md:text-4xl font-semibold leading-tight">
          Are you <span className="text-emerald-400">Disaster‑Ready</span>?
        </h1>
        <p className="mt-2 text-neutral-300 max-w-2xl">
          Learn, practice, and excel through immersive micro‑drills, region‑aware tips, and a campus dashboard designed for schools & colleges in India.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <CTAButton onClick={onStartDrill}><ShieldCheck className="w-4 h-4" /> Try a 30‑sec Drill</CTAButton>
          <button onClick={onLearn} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/15 hover:bg-white/5">
            <BookOpen className="w-4 h-4" /> Browse Modules
          </button>
        </div>
      </div>
    </div>
  );
}

function DisasterCard({ d }) {
  const Icon = d.icon;
  return (
    <div className={cls("rounded-2xl p-4 ring-1 ring-white/10 bg-gradient-to-br", d.color)}>
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <div className="font-semibold">{d.name}</div>
      </div>
      <ul className="mt-2 text-sm text-white/90 list-disc list-inside">
        {(regionTips[d.key] || ["Basic safety guidance."]).slice(0, 3).map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-white/80">Open the Learn tab to take the quiz.</div>
    </div>
  );
}

function AlertsFeed({ alerts }) {
  const color = { info: "bg-sky-500/15", warn: "bg-amber-500/15", ok: "bg-emerald-500/15", alert: "bg-red-500/15" };
  const icon = { info: Bell, warn: AlertTriangle, ok: ShieldCheck, alert: Siren };
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {alerts.map((a, i) => {
        const Icon = icon[a.level] || Bell;
        return (
          <div key={i} className={cls("rounded-2xl p-3 border border-white/10", color[a.level] || "bg-white/5") }>
            <div className="flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4" />
              <span className="font-medium">{a.type}</span>
              <span className="ml-auto text-xs text-neutral-400">{a.when}</span>
            </div>
            <div className="mt-1 text-sm text-neutral-200">{a.text}</div>
          </div>
        );
      })}
    </div>
  );
}

function LearningModules({ score, setScore }) {
  return (
    <div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold">Interactive Micro‑Quizzes</h3>
          <p className="text-sm text-neutral-400 mb-3">Answer correctly to boost your Preparedness Score. Immediate feedback with best practice.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {disasters.map((d) => (
              <QuizCard key={d.key} disaster={d.key} onDelta={(delta) => setScore((s) => Math.max(0, Math.min(100, s + delta)))} />
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Why this matters</h3>
          <ul className="list-disc list-inside text-sm text-neutral-300 space-y-2 mt-2">
            <li>India is highly disaster‑prone; awareness reduces fatalities.</li>
            <li>Preparedness drills turn panic into muscle memory.</li>
            <li>Region‑specific learning avoids one‑size‑fits‑all gaps.</li>
          </ul>
          <div className="mt-4">
            <div className="text-sm text-neutral-400">Your Preparedness</div>
            <div className="h-2 w-full bg-white/10 rounded-xl overflow-hidden mt-1">
              <div className="h-full bg-emerald-500" style={{ width: `${score}%` }} />
            </div>
            <div className="text-xs text-neutral-400 mt-1">Score updates with each correct answer.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const quizBank = {
  earthquake: {
    q: "Shaking starts while you are in class. What's your first move?",
    options: [
      { t: "Run to the corridor immediately", ok: false, why: "Running during shaking risks falls & debris." },
      { t: "Drop, cover, hold on under a desk", ok: true, why: "Best practice to protect from falling objects." },
      { t: "Stand near a window for fresh air", ok: false, why: "Windows can shatter." }
    ]
  },
  flood: {
    q: "Water level is rising outside campus. Best preparation?",
    options: [
      { t: "Walk through knee‑deep water to buy snacks", ok: false, why: "Flood waters hide hazards & disease." },
      { t: "Move to higher floors and switch off mains", ok: true, why: "Prevents electrocution & keeps you safe." },
      { t: "Use the lift to get to the terrace", ok: false, why: "Power outages can trap you." }
    ]
  },
  fire: {
    q: "Smoke in the lab corridor. You should…",
    options: [
      { t: "Crawl low and check doors with back of hand", ok: true, why: "Avoid smoke, test for heat safely." },
      { t: "Open all windows to let smoke out", ok: false, why: "Oxygen feeds fire; risky." },
      { t: "Take the elevator for fast exit", ok: false, why: "Never use elevators in fire." }
    ]
  },
  cyclone: {
    q: "Cyclone warning 12 hours away. Smart prep?",
    options: [
      { t: "Tape the windows and go for a drive", ok: false, why: "Unnecessary exposure to hazards." },
      { t: "Charge devices, stock water, stay indoors", ok: true, why: "Ensures comms & essentials when power fails." },
      { t: "Stand on balcony to record videos", ok: false, why: "Extreme windborne debris risk." }
    ]
  }
};

function QuizCard({ disaster, onDelta }) {
  const [chosen, setChosen] = useState(null);
  const [done, setDone] = useState(false);
  const data = quizBank[disaster];
  const meta = disasters.find((d) => d.key === disaster);

  function pick(i) {
    if (done) return;
    setChosen(i);
    setDone(true);
    const correct = data.options[i].ok;
    onDelta(correct ? +5 : -2);
  }

  return (
    <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
      <div className="flex items-center gap-2">
        {meta?.icon && <meta.icon className="w-4 h-4" />}
        <div className="font-medium">{meta?.name}</div>
      </div>
      <div className="mt-2 text-sm">{data.q}</div>
      <div className="mt-3 grid gap-2">
        {data.options.map((o, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={cls(
              "text-left px-3 py-2 rounded-xl border transition",
              chosen === i
                ? o.ok
                  ? "bg-emerald-500/15 border-emerald-500/30"
                  : "bg-red-500/15 border-red-500/30"
                : "hover:bg-white/5 border-white/10"
            )}
          >
            <div className="text-sm">{o.t}</div>
            {done && chosen === i && (
              <div className={cls("text-xs mt-1", o.ok ? "text-emerald-300" : "text-red-300")}>{o.why}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function DrillSimulation({ score, setScore }) {
  const [time, setTime] = useState(30);
  const [phase, setPhase] = useState("idle"); // idle | running | result
  const [result, setResult] = useState(null); // success | fail
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (phase !== "running") return;
    if (time <= 0) { end("fail", "You ran out of time. Always act quickly and safely."); return; }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, phase]);

  function start() {
    setTime(30);
    setPhase("running");
    setResult(null);
    setLog(["Shaking detected. Drop, Cover, Hold On!"]);
  }

  function act(option) {
    if (phase !== "running") return;
    if (option === "desk") {
      addLog("You get under a sturdy desk and hold the leg.");
      setTimeout(() => addLog("Good. Keep your head covered; wait till shaking stops."), 800);
      setTimeout(() => end("success", "Excellent response. Now evacuate via stairs to open ground."), 1600);
    } else if (option === "run") {
      end("fail", "Running during shaking is dangerous. Drop, Cover, Hold On first.");
    } else if (option === "lift") {
      end("fail", "Never use lifts in an earthquake. Use stairs after shaking stops.");
    }
  }

  function addLog(s) { setLog((L) => [...L, s]); }
  function end(outcome, message) {
    setPhase("result");
    setResult({ outcome, message });
    setScore((s) => Math.max(0, Math.min(100, s + (outcome === "success" ? 8 : -5))));
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">30‑Second Virtual Drill • Earthquake</h3>
          <div className="text-sm text-neutral-400">Time Left: <span className="font-mono text-neutral-100">{phase === "running" ? time : 30}</span>s</div>
        </div>

        {/* Scene */}
        <div className="mt-4 relative h-56 rounded-2xl overflow-hidden border border-white/10">
          {/* room bg */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.08),transparent_50%)]" />
          {/* table */}
          <motion.div
            animate={phase === "running" ? { rotate: [0, -1.2, 1.2, 0] } : { rotate: 0 }}
            transition={phase === "running" ? { repeat: Infinity, duration: 0.8 } : {}}
            className="absolute left-6 bottom-6 w-40 h-24 bg-white/10 border border-white/10 rounded-xl"
          />
          {/* bookshelf */}
          <motion.div
            animate={phase === "running" ? { y: [0, -2, 0] } : { y: 0 }}
            transition={phase === "running" ? { repeat: Infinity, duration: 0.6 } : {}}
            className="absolute right-6 bottom-6 w-24 h-32 bg-white/10 border border-white/10 rounded-xl"
          />
          {/* window */}
          <div className="absolute right-32 top-6 w-24 h-16 bg-sky-500/20 border border-white/10 rounded-xl" />
          {/* floor label */}
          <div className="absolute left-4 top-4 text-xs text-neutral-400">Classroom 204</div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <button onClick={start} className="px-4 py-2 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-neutral-900 font-semibold">Start Drill</button>
          <button disabled={phase !== "running"} onClick={() => act("desk")} className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5 disabled:opacity-50">Hide under desk</button>
          <button disabled={phase !== "running"} onClick={() => act("run")} className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5 disabled:opacity-50">Run to corridor</button>
          <button disabled={phase !== "running"} onClick={() => act("lift")} className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5 disabled:opacity-50">Take the lift</button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {phase === "result" && result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4">
              <div className={cls("px-4 py-3 rounded-xl", result.outcome === "success" ? "bg-emerald-500/15" : "bg-red-500/15") }>
                <div className="font-medium flex items-center gap-2">
                  {result.outcome === "success" ? <ShieldCheck className="w-4 h-4 text-emerald-300" /> : <AlertTriangle className="w-4 h-4 text-red-300" />}
                  {result.outcome === "success" ? "Great job" : "Not safe"}
                </div>
                <div className="text-sm text-neutral-200 mt-1">{result.message}</div>
                <div className="text-xs text-neutral-400 mt-1">Score auto‑updated.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Card>
        <h3 className="font-semibold">Drill Log</h3>
        <div className="mt-2 text-sm min-h-[8rem] max-h-48 overflow-auto space-y-1">
          {log.map((l, i) => (
            <div key={i} className="text-neutral-300">• {l}</div>
          ))}
          {log.length === 0 && <div className="text-neutral-500">Start the drill to see live guidance.</div>}
        </div>
        <div className="mt-3">
          <div className="text-sm text-neutral-400">Preparedness impact</div>
          <div className="h-2 w-full bg-white/10 rounded-xl overflow-hidden mt-1">
            <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function AdminDashboard({ score }) {
  // Mock analytics
  const participation = [
    { name: "Class A", drills: 12, score: 72 },
    { name: "Class B", drills: 9, score: 65 },
    { name: "Class C", drills: 15, score: 80 },
    { name: "Class D", drills: 7, score: 58 }
  ];
  const monthly = [
    { month: "May", drills: 8, avg: 61 },
    { month: "Jun", drills: 11, avg: 67 },
    { month: "Jul", drills: 14, avg: 72 },
    { month: "Aug", drills: 19, avg: 78 }
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Participation by Class</h3>
          <div className="text-sm text-neutral-400">Live demo analytics</div>
        </div>
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participation}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ color: "#ddd" }} />
              <Bar dataKey="drills" fill="#22c55e" />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold">Campus Preparedness</h3>
        <div className="text-sm text-neutral-400">Your demo score</div>
        <div className="text-3xl font-bold mt-1">{score}<span className="text-neutral-400 text-lg">/100</span></div>
        <div className="mt-3 h-2 bg-white/10 rounded-xl overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${score}%` }} />
        </div>
        <div className="text-xs text-neutral-400 mt-2">Improve via quizzes & successful drills.</div>
      </Card>

      <Card className="lg:col-span-3">
        <h3 className="font-semibold">Monthly Drills & Avg Score</h3>
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ color: "#ddd" }} />
              <Line type="monotone" dataKey="drills" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function EmergencyDashboard() {
  const [pressed, setPressed] = useState(false);
  const [contacts, setContacts] = useLocal("dp.contacts", contactsSeed);

  function panic() {
    setPressed(true);
    setTimeout(() => setPressed(false), 2000);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <h3 className="font-semibold">Emergency Controls</h3>
        <p className="text-sm text-neutral-400">Mock actions for demo. In production, integrate calls/SMS/notifications.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button onClick={panic} className={cls("px-5 py-3 rounded-2xl font-semibold inline-flex items-center gap-2",
            pressed ? "bg-red-500 text-white" : "bg-red-500/90 hover:bg-red-500 text-white")}> <Siren className="w-5 h-5"/> PANIC BUTTON</button>
          <button className="px-5 py-3 rounded-2xl font-semibold inline-flex items-center gap-2 border border-white/15 hover:bg-white/5">
            <PhoneCall className="w-5 h-5"/> Notify Guardians</button>
          <button className="px-5 py-3 rounded-2xl font-semibold inline-flex items-center gap-2 border border-white/15 hover:bg-white/5">
            <Zap className="w-5 h-5"/> Send Campus Broadcast</button>
        </div>
        {pressed && (
          <div className="mt-3 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-sm">
            Broadcast sent to Security, Admin, and Guardians (demo).
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-medium">Evacuation Map (Placeholder)</h4>
          <div className="mt-2 h-56 rounded-xl border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] flex items-center justify-center text-neutral-500">
            Place your campus map / QR here
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold">Quick Contacts</h3>
        <div className="mt-2 grid gap-2">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl border border-white/10">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-neutral-400">{c.type}</div>
              </div>
              <a href={`tel:${c.phone}`} className="text-sm text-emerald-400 hover:underline">{c.phone}</a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-neutral-400 flex flex-col sm:flex-row items-center gap-2 justify-between">
        <div>© {new Date().getFullYear()} DisasterPrep EDU · Built for Hackathon demo</div>
        <div className="flex items-center gap-3">
          <span>Made with</span>
          <span className="text-neutral-200">React</span>
          <span>·</span>
          <span className="text-neutral-200">Tailwind</span>
          <span>·</span>
          <span className="text-neutral-200">Framer Motion</span>
          <span>·</span>
          <span className="text-neutral-200">Recharts</span>
        </div>
      </div>
    </footer>
  );
}
