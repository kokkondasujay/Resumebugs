import { useState } from "react";
import Analyzer from "./components/Analyzer";
import Builder from "./components/Builder";
import Jobs from "./components/Jobs";
import type { ResumeData } from "./lib/resume";

type View = "home" | "analyze" | "build" | "jobs";
type AuthMode = "signin" | "signup";

const BRAND = "Resumebugs";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [builderSeed, setBuilderSeed] = useState<Partial<ResumeData> | null>(null);
  const [jobSeed, setJobSeed] = useState<{ role: string | null; skills: string[] }>({ role: null, skills: [] });
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [nextView, setNextView] = useState<View | null>(null);
  const [user, setUser] = useState<string | null>(null);

  const go = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAuth = (mode: AuthMode, next?: View) => {
    setAuthMode(mode);
    setNextView(next || null);
    setAuthOpen(true);
  };

  const completeAuth = (name: string) => {
    setUser(name);
    setAuthOpen(false);
    if (nextView) go(nextView);
  };

  const handleBuildFromResume = (data: Partial<ResumeData>, role: string | null, skills: string[]) => {
    setBuilderSeed({ ...data, title: role || data.title, skills: skills.length ? skills.map(cap) : [] });
    go("build");
  };

  const handleFindJobs = (role: string | null, skills: string[]) => {
    setJobSeed({ role, skills });
    go("jobs");
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-black grid-bg">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfbfa]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button onClick={() => go("home")} className="flex items-center gap-3">
            <span className="h-3.5 w-3.5 bg-[#003eac]" />
            <span className="text-base font-black tracking-tight">{BRAND}</span>
            <span className="font-mono text-xs text-black/50">v1.0</span>
          </button>

          <nav className="hidden items-center gap-7 text-sm md:flex">
            <button onClick={() => go("analyze")} className="hover:text-[#003eac]">Analyzer</button>
            <button onClick={() => go("build")} className="hover:text-[#003eac]">Templates</button>
            <button onClick={() => go("jobs")} className="hover:text-[#003eac]">Jobs</button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <span className="hidden text-sm text-black/60 sm:inline">{user}</span>
            ) : (
              <button onClick={() => openAuth("signin")} className="hidden text-sm hover:text-[#003eac] sm:inline">
                Sign in
              </button>
            )}
            <button onClick={() => (user ? go("analyze") : openAuth("signup", "analyze"))} className="bg-[#003eac] px-5 py-3 text-sm font-bold text-white hover:bg-black">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto border-b border-black/10 bg-[#fbfbfa] px-5 py-2 md:hidden">
        {([["analyze", "Analyzer"], ["build", "Templates"], ["jobs", "Jobs"]] as [View, string][]).map(([next, label]) => (
          <button key={next} onClick={() => go(next)} className={`whitespace-nowrap border px-4 py-2 text-sm ${view === next ? "border-[#003eac] bg-[#003eac] text-white" : "border-black/10 bg-white"}`}>
            {label}
          </button>
        ))}
      </div>

      <main className={view === "home" ? "" : "px-4 py-8 sm:py-12"}>
        {view === "home" && <Home onStart={() => go("analyze")} onBuild={() => go("build")} onJobs={() => go("jobs")} onGetStarted={() => openAuth("signup", "analyze")} />}
        {view === "analyze" && <Analyzer onBuildFromResume={handleBuildFromResume} onFindJobs={handleFindJobs} />}
        {view === "build" && <Builder initial={builderSeed} />}
        {view === "jobs" && <Jobs initialRole={jobSeed.role} initialSkills={jobSeed.skills} />}
      </main>

      <footer className="border-t border-black/10 bg-[#fbfbfa] py-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-black/45">
        <p>{BRAND} - AI resume analyzer, one-click optimizer, templates, and live job matching.</p>
      </footer>

      {authOpen && <AuthModal mode={authMode} onClose={() => setAuthOpen(false)} onComplete={completeAuth} onSwitch={setAuthMode} />}
    </div>
  );
}

function cap(value: string) {
  return value.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function Home({ onStart, onBuild, onJobs, onGetStarted }: { onStart: () => void; onBuild: () => void; onJobs: () => void; onGetStarted: () => void }) {
  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-70px)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <div className="hero-copy">
          <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-black/55">
            <span className="h-2.5 w-2.5 bg-[#003eac]" />
            AI <span>/</span> ATS <span>/</span> Career OS
          </div>
          <h1 className="max-w-4xl text-[clamp(3.4rem,8vw,7.8rem)] font-black leading-[0.92] tracking-[-0.07em]">
            The resume your <span className="text-[#003eac]">recruiter</span> can't ignore.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/62 sm:text-xl">
            Upload your resume. Get an honest ATS score, line-by-line fixes, and a polished 100-ready version - then apply directly to live openings at top MNCs.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={onStart} className="bg-[#003eac] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black">
              Analyze my resume {"->"}
            </button>
            <button onClick={onBuild} className="border border-black/15 bg-white px-7 py-4 text-sm font-bold transition hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white">
              Build from scratch
            </button>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-black/50">
            <TrustItem label="Free ATS scan" />
            <TrustItem label="No watermark PDF" />
            <TrustItem label="Live jobs" />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ReportPanel />
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-0 px-5 py-10 md:grid-cols-3">
          <FeatureLine kicker="01" title="Single-click optimizer" text="Rewrite bullets, add role keywords, fix sections, and download a clean ATS PDF in one action." action="Optimize now" onClick={onBuild} />
          <FeatureLine kicker="02" title="Recruiter-grade templates" text="Classic ATS, Harvard Clean, Jake's ATS, Executive MNC, Modern Minimal, and Tech Compact." action="View templates" onClick={onBuild} />
          <FeatureLine kicker="03" title="Direct job apply" text="Filter openings by work mode, experience, salary, source, company type, and minimum match score." action="Find jobs" onClick={onJobs} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#003eac]">Founder-ready product</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Built to attract recruiters and HR teams.</h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-2">
            {[
              ["ATS score", "Weighted scan for structure, keywords, impact, formatting, and contact data."],
              ["Auto-fix", "One click transforms raw data into a polished resume using ATS-safe rules."],
              ["Templates", "Popular single-column formats designed for parsers and hiring managers."],
              ["Jobs", "Matched listings with JD preview and direct apply searches across major job boards."],
            ].map(([title, text]) => (
              <div key={title} className="bg-[#fbfbfa] p-7">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-black/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <button onClick={onGetStarted} className="bg-black px-9 py-4 text-sm font-bold text-white hover:bg-[#003eac]">
            Create free account {"->"}
          </button>
        </div>
      </section>
    </div>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full border border-emerald-500 bg-emerald-50" />
      {label}
    </span>
  );
}

function ReportPanel() {
  const bars = [
    ["Formatting", 98],
    ["Keywords", 92],
    ["Impact", 89],
    ["Skills", 96],
  ];

  return (
    <div className="report-float w-full max-w-[420px] border-2 border-black bg-[#fbfbfa] shadow-[14px_14px_0_#003eac]">
      <div className="p-7">
        <div className="h-px bg-black/50" />
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.35em] text-black/45">/scan_result</p>
        <div className="mt-8 flex items-end justify-between border-b border-black/10 pb-4">
          <div>
            <p className="text-7xl font-black tracking-[-0.06em]">94</p>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/50">/100 - ATS score</p>
          </div>
          <span className="border border-[#003eac]/30 bg-[#003eac]/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#003eac]">Optimized</span>
        </div>
        <div className="mt-8 space-y-5">
          {bars.map(([label, value]) => (
            <div key={label as string} className="grid grid-cols-[1fr_1.3fr_28px] items-center gap-4 text-sm">
              <span>{label}</span>
              <span className="h-2 bg-black/5">
                <span className="block h-full bg-[#003eac] progress-load" style={{ width: `${value}%` }} />
              </span>
              <span className="text-right font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t-2 border-black bg-black/[0.035] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-black/45">/recommendation</p>
        <p className="mt-4 text-sm"><strong>Add metrics to bullet #2</strong> - recruiters skim numbers first.</p>
      </div>
    </div>
  );
}

function FeatureLine({ kicker, title, text, action, onClick }: { kicker: string; title: string; text: string; action: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group border-black/10 p-7 text-left transition hover:bg-[#003eac] hover:text-white md:border-r md:last:border-r-0">
      <p className="font-mono text-xs uppercase tracking-[0.25em] opacity-60">/{kicker}</p>
      <h3 className="mt-5 text-2xl font-black tracking-[-0.03em]">{title}</h3>
      <p className="mt-3 min-h-20 leading-7 opacity-65">{text}</p>
      <span className="mt-5 inline-block text-sm font-bold">{action} {"->"}</span>
    </button>
  );
}

function AuthModal({ mode, onClose, onComplete, onSwitch }: { mode: AuthMode; onClose: () => void; onComplete: (name: string) => void; onSwitch: (mode: AuthMode) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const title = mode === "signin" ? "Sign in to Resumebugs" : "Create your Resumebugs account";

  const submit = () => {
    const name = email ? email.split("@")[0] : "Founder";
    onComplete(name);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md border-2 border-black bg-[#fbfbfa] p-6 shadow-[10px_10px_0_#003eac]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#003eac]">secure access</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{title}</h2>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-black/50 hover:text-black">x</button>
        </div>

        <div className="mt-6 grid gap-3">
          <AuthProvider label="Continue with Google" mark="G" onClick={() => onComplete("Google user")} />
          <AuthProvider label="Continue with GitHub" mark="GH" onClick={() => onComplete("GitHub user")} />
          <AuthProvider label="Continue with LinkedIn" mark="in" onClick={() => onComplete("LinkedIn user")} />
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/10" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">or email</span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-black/55">Email</label>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-[#003eac]" placeholder="founder@email.com" />
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-black/55">Password</label>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-[#003eac]" placeholder="8+ characters" />
          <button onClick={submit} disabled={!email || password.length < 4} className="w-full bg-[#003eac] px-5 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-black/20">
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-black/55">
          {mode === "signin" ? "New here?" : "Already have an account?"} {" "}
          <button onClick={() => onSwitch(mode === "signin" ? "signup" : "signin")} className="font-bold text-[#003eac] hover:underline">
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </p>
        <p className="mt-3 text-center text-xs text-black/40">Prototype auth UI. Connect Firebase, Supabase, or OAuth in production.</p>
      </div>
    </div>
  );
}

function AuthProvider({ label, mark, onClick }: { label: string; mark: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-3 border border-black/15 bg-white px-4 py-3 text-sm font-bold hover:border-black hover:bg-black hover:text-white">
      <span className="grid h-7 w-7 place-items-center border border-current font-mono text-[10px]">{mark}</span>
      {label}
    </button>
  );
}