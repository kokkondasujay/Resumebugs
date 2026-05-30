import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

function ScoreCard() {
  const metrics = [
    { name: 'Formatting', value: 98 },
    { name: 'Keywords', value: 92 },
    { name: 'Impact', value: 89 },
    { name: 'Skills', value: 96 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="sharp-card bg-white p-0 max-w-sm ml-auto"
    >
      {/* Header */}
      <div className="border-b border-black px-6 py-4">
        <div className="mono-label text-ink-muted">/SCAN_RESULT</div>
        <div className="flex items-end justify-between mt-4">
          <div>
            <div className="display-heading text-6xl font-bold tracking-tight">94</div>
            <div className="mono-label text-ink-muted mt-1">/100 · ATS SCORE</div>
          </div>
          <span className="badge-outline bg-blue-50 text-blue-700 border-blue-200">OPTIMIZED</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-6 space-y-3">
        {metrics.map((m) => (
          <div key={m.name} className="flex items-center gap-4">
            <span className="text-sm text-ink-muted w-20">{m.name}</span>
            <div className="flex-1 score-bar">
              <div
                className="score-bar-fill"
                style={{ width: `${m.value}%` }}
              />
            </div>
            <span className="text-xs font-mono w-6 text-right">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="border-t border-black bg-slate-50 px-6 py-4">
        <div className="mono-label text-ink-muted">/RECOMMENDATION</div>
        <p className="text-sm mt-2">
          <strong>Add metrics</strong> to bullet #2 — recruiters skim numbers first.
        </p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <div className="grid-bg min-h-screen relative">
      {/* Brand badge */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 15h6" />
            <path d="M9 11h6" />
          </svg>
          Resumebugs
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left column - Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-8"
            >
              <span className="w-2 h-2 bg-brand" />
              <span className="mono-label text-ink-muted">
                RESUMEBUGS · AI · ATS · CAREER OS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display-heading text-6xl sm:text-7xl lg:text-[88px]"
            >
              The resume your{' '}
              <br />
              <span className="text-brand">recruiter</span> can't
              <br />
              ignore.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-ink-muted mt-8 max-w-xl leading-relaxed"
            >
              Upload your resume. Get an honest ATS score, line-by-line fixes, and a polished, 100-ready version — then apply directly to live openings at top MNCs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-10"
            >
              <Link
                to="/analyze"
                className="btn-primary px-6 py-4 font-semibold text-sm inline-flex items-center gap-2"
              >
                Analyze my resume
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/builder"
                className="btn-ghost px-6 py-4 font-semibold text-sm"
              >
                Build from scratch
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Check className="w-4 h-4 text-brand" strokeWidth={3} />
                Free ATS scan
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Check className="w-4 h-4 text-brand" strokeWidth={3} />
                No watermark PDF
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Check className="w-4 h-4 text-brand" strokeWidth={3} />
                Live jobs
              </div>
            </motion.div>
          </div>

          {/* Right column - Score card */}
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <ScoreCard />
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-black sharp-card"
        >
          {[
            { v: '50K+', l: 'Resumes optimized' },
            { v: '85%', l: 'Avg score improvement' },
            { v: '200+', l: 'Partner companies' },
            { v: '4.9/5', l: 'User rating' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6">
              <div className="display-heading text-3xl font-bold">{s.v}</div>
              <div className="mono-xs text-ink-muted mt-2">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom feature strip */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-white" />
            <span className="mono-label text-white/60">/CAPABILITIES</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: '01',
                t: 'One-click optimization',
                d: 'Upload once. Our AI rewrites bullets, injects keywords, and exports a 100-score resume — instant.',
              },
              {
                n: '02',
                t: 'ATS-proof templates',
                d: '5 battle-tested templates used by candidates who landed offers at Google, Stripe, OpenAI and more.',
              },
              {
                n: '03',
                t: 'Direct apply links',
                d: 'Browse curated openings from top MNCs. See the JD. Click apply. Skip the job boards.',
              },
            ].map((f) => (
              <div key={f.n} className="border-t border-white/20 pt-6">
                <div className="mono-xs text-white/50 mb-2">/{f.n}</div>
                <h3 className="text-xl font-bold tracking-tight mb-3">{f.t}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
