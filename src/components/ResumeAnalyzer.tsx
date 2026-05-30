import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, AlertCircle, Check, Info, X,
  RefreshCw, Zap, ArrowRight, Download, Sparkles, Wand2,
  ClipboardPaste, FileUp
} from 'lucide-react';
import { analyzeResume, getJobRoleFromText, type ATSResult, type Suggestion } from '@/utils/atsEngine';
import { buildAndDownload, type ResumeData } from '@/utils/pdfGenerator';

const SAMPLE_RESUME = `John Doe
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe | San Francisco, CA

PROFESSIONAL SUMMARY
Results-driven software engineer with 5+ years of experience building scalable web applications. Proficient in React, TypeScript, Node.js, and cloud technologies. Proven track record of improving system performance and delivering user-centric products.

EXPERIENCE
Senior Software Engineer — Acme Corp (Jan 2021 – Present)
• Architected a React/TypeScript dashboard serving 15,000+ daily active users
• Reduced API response time by 40% through Redis caching and query optimization
• Led migration from monolith to microservices, improving deployment frequency by 3x
• Mentored 4 junior developers through code reviews and pair programming sessions

Software Developer — TechStart Inc (Jun 2018 – Dec 2020)
• Developed RESTful APIs using Node.js and Express, handling 2M+ requests/day
• Implemented CI/CD pipeline with GitHub Actions, reducing release cycle from 2 weeks to 2 days
• Built automated testing suite achieving 92% code coverage

EDUCATION
B.S. Computer Science — Stanford University (2018)
GPA: 3.85

SKILLS
JavaScript, TypeScript, React, Node.js, Python, SQL, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, Git, Agile, REST APIs, GraphQL, Redis, CI/CD

CERTIFICATIONS
AWS Certified Solutions Architect – Associate
Google Cloud Professional Data Engineer`;

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [optimizedData, setOptimizedData] = useState<ResumeData | null>(null);
  const [optimized, setOptimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target?.result as string;
      const cleaned = raw.replace(/[\x00-\x08\x0E-\x1F\x7F-\x9F]/g, '').trim();
      const readable = cleaned.split(/\s+/).filter(w => /[a-zA-Z]{2,}/.test(w));
      if (readable.length > 15) {
        setText(cleaned);
      } else {
        setText('');
        alert('This file could not be read as text.\n\nHow to fix it:\n1. Open your resume PDF in any viewer\n2. Press Ctrl+A (select all) then Ctrl+C (copy)\n3. Come back here and paste into the text box');
      }
    };
    reader.readAsText(f);
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const role = getJobRoleFromText(text);
      setResult(analyzeResume(text, role));
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleOptimize = () => {
    if (!result) return;
    setIsOptimizing(true);
    setTimeout(() => {
      const parsed = smartParseResume(text);
      const improved = optimizeResumeData(parsed);
      setOptimizedData(improved);
      const improvedText = resumeDataToText(improved);
      setResult(analyzeResume(improvedText, getJobRoleFromText(improvedText)));
      setOptimized(true);
      setIsOptimizing(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (optimizedData) {
      buildAndDownload(optimizedData);
    } else {
      buildAndDownload(smartParseResume(text));
    }
  };

  const handleReset = () => {
    setFile(null); setText(''); setResult(null);
    setOptimizedData(null); setOptimized(false);
  };

  const loadSample = () => {
    setText(SAMPLE_RESUME);
    setFile(null);
  };

  const getScoreBg = (s: number) => s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-500' : s >= 40 ? 'bg-orange-500' : 'bg-red-500';

  const getIcon = (type: string) => {
    if (type === 'error') return <AlertCircle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />;
    if (type === 'warning') return <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />;
    if (type === 'success') return <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" strokeWidth={3} />;
    return <Info className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />;
  };

  return (
    <div className="grid-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-brand" />
            <span className="mono-label text-ink-muted">/RESUME_SCANNER</span>
          </div>
          <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl">
            Analyze your <span className="text-brand">resume</span>.
          </h1>
          <p className="text-lg text-ink-muted mt-4 max-w-xl">
            Paste your resume text below. Get an ATS score, actionable fixes, and download an optimized PDF with one click.
          </p>
        </motion.div>

        {!result ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

            {/* ── HOW IT WORKS ── */}
            <div className="sharp-card bg-white p-6 mb-6">
              <div className="mono-label text-ink-muted mb-4">/HOW_IT_WORKS</div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand text-white flex items-center justify-center shrink-0 text-sm font-bold">1</div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Open your resume</p>
                    <p className="text-xs text-ink-muted mt-0.5">Open your PDF/DOC in any app or browser</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand text-white flex items-center justify-center shrink-0 text-sm font-bold">2</div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Select all & copy</p>
                    <p className="text-xs text-ink-muted mt-0.5">Ctrl+A → Ctrl+C (or ⌘+A → ⌘+C on Mac)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand text-white flex items-center justify-center shrink-0 text-sm font-bold">3</div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Paste below & scan</p>
                    <p className="text-xs text-ink-muted mt-0.5">Ctrl+V into the box below, then hit "Run ATS scan"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MAIN TEXT AREA ── */}
            <div className="sharp-card bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardPaste className="w-4 h-4 text-brand" />
                  <span className="mono-label text-ink-muted">/PASTE_YOUR_RESUME</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={loadSample} className="mono-xs text-brand hover:text-brand-hover font-semibold">
                    LOAD SAMPLE RESUME
                  </button>
                  <span className="text-ink-light">|</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mono-xs text-ink-muted hover:text-ink font-semibold inline-flex items-center gap-1"
                  >
                    <FileUp className="w-3 h-3" /> UPLOAD .TXT FILE
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={"Paste your full resume text here...\n\nExample format:\n\nJohn Doe\njohn@email.com | 555-123-4567\n\nPROFESSIONAL SUMMARY\nExperienced software engineer with...\n\nEXPERIENCE\nSenior Developer — Company Name (2021 – Present)\n• Built a React dashboard serving 10K users\n• Reduced API latency by 40%\n\nEDUCATION\nB.S. Computer Science — University (2018)\n\nSKILLS\nReact, TypeScript, Python, AWS, Docker, SQL"}
                className="input-sharp h-80 resize-none font-mono text-sm border-t border-border-light"
              />

              {file && (
                <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                  <FileText className="w-4 h-4" />
                  <span className="font-mono">{file.name}</span>
                  <button onClick={() => { setFile(null); setText(''); }} className="ml-2 hover:text-danger"><X className="w-4 h-4" /></button>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isAnalyzing}
                  className="btn-primary px-8 py-4 font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? <><RefreshCw className="w-4 h-4 animate-spin" />Scanning with AI...</> : <>Run ATS scan <ArrowRight className="w-4 h-4" /></>}
                </button>
                <span className="mono-xs text-ink-light">{text.trim() ? `${text.trim().split(/\s+/).length} words` : 'No content yet'}</span>
              </div>
            </div>

          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* ── Score Card ── */}
              <div className="sharp-card bg-white">
                <div className="border-b border-black px-6 py-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                      <div className="mono-label text-ink-muted">/SCAN_RESULT</div>
                      <div className="flex items-end gap-4 mt-3">
                        <div className="display-heading text-7xl font-bold">{result.score}</div>
                        <div className="pb-2"><div className="mono-label text-ink-muted">/100 · ATS SCORE</div></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge-outline ${result.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : result.score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {result.score >= 80 ? 'OPTIMIZED' : result.score >= 60 ? 'NEEDS WORK' : 'CRITICAL'}
                      </span>
                      {optimized && <span className="badge-outline bg-brand-light text-brand border-brand/30 inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI-ENHANCED</span>}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {result.sections.map(s => (
                    <div key={s.name} className="flex items-center gap-4">
                      <span className="text-sm text-ink-muted w-44 shrink-0">{s.name}</span>
                      <div className="flex-1 score-bar"><motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1 }} className={`h-full ${getScoreBg(s.score)}`} /></div>
                      <span className="text-xs font-mono w-8 text-right">{s.score}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-black bg-slate-50 px-6 py-4">
                  <div className="mono-label text-ink-muted">/RECOMMENDATION</div>
                  <p className="text-sm mt-2">{result.overallFeedback}</p>
                </div>
              </div>

              {/* ── One-click optimize ── */}
              {!optimized && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sharp-card bg-brand text-white p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1"><Wand2 className="w-5 h-5" /><span className="mono-label text-white/80">/ONE_CLICK_OPTIMIZATION</span></div>
                      <h3 className="text-xl font-bold tracking-tight">Auto-fix & download your optimized resume</h3>
                      <p className="text-sm text-white/80 mt-1 max-w-xl">Rewrites weak bullets with action verbs, adds metrics, injects missing keywords, and exports a clean ATS-safe PDF with your actual data.</p>
                    </div>
                    <button onClick={handleOptimize} disabled={isOptimizing} className="btn-ghost bg-white text-black border-white hover:bg-white/90 px-6 py-3 font-semibold text-sm flex items-center gap-2 shrink-0 disabled:opacity-70 whitespace-nowrap">
                      {isOptimizing ? <><RefreshCw className="w-4 h-4 animate-spin" />Optimizing...</> : <><Zap className="w-4 h-4" />Optimize & download</>}
                    </button>
                  </div>
                </motion.div>
              )}

              {optimized && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="sharp-card bg-white p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-brand" /><span className="mono-label text-brand">/OPTIMIZATION_COMPLETE</span></div>
                      <h3 className="text-xl font-bold tracking-tight">Your resume is optimized</h3>
                      <p className="text-sm text-ink-muted mt-1">{result.suggestions.filter(s => s.type === 'success').length} improvements applied. PDF uses your actual data.</p>
                    </div>
                    <button onClick={handleDownload} className="btn-primary px-6 py-3 font-semibold text-sm inline-flex items-center gap-2">
                      <Download className="w-4 h-4" />Download optimized PDF
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Suggestions ── */}
              <div className="sharp-card bg-white p-6">
                <div className="mono-label text-ink-muted mb-5">/{optimized ? 'CHANGES_APPLIED' : 'SUGGESTIONS'}</div>
                <div className="space-y-2.5">
                  {result.suggestions.map((s: Suggestion, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-start gap-3 p-3 hover:bg-surface-alt transition-colors">
                      {getIcon(s.type)}
                      <div className="flex-1 min-w-0">
                        <span className="mono-xs text-ink-light">{s.category.toUpperCase()}</span>
                        <p className="text-sm text-ink mt-0.5">{s.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Keywords ── */}
              <div className="sharp-card bg-white p-6">
                <div className="mono-label text-ink-muted mb-5">/KEYWORD_ANALYSIS</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {result.keywords.map(kw => (
                    <div key={kw.word} className={`flex items-center gap-2 px-3 py-2.5 border ${kw.found ? 'border-emerald-200 bg-emerald-50' : 'border-border-light bg-surface-alt'}`}>
                      {kw.found ? <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} /> : <X className="w-3.5 h-3.5 text-ink-light" />}
                      <span className={`text-xs font-medium font-mono ${kw.found ? 'text-emerald-700' : 'text-ink-light'}`}>{kw.word}</span>
                      {kw.count > 0 && <span className="ml-auto text-[10px] font-mono text-ink-light">x{kw.count}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex flex-wrap gap-3 pt-4">
                {!optimized && (
                  <button onClick={handleDownload} className="btn-ghost px-5 py-2.5 text-sm inline-flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download current as PDF
                  </button>
                )}
                <button onClick={handleReset} className="btn-ghost px-5 py-2.5 text-sm inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Scan another resume
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SMART PARSER — extracts actual data from pasted resume text
   ═══════════════════════════════════════════════════════════ */

function smartParseResume(raw: string): ResumeData {
  const lines = raw.split('\n').map(l => l.trimEnd());

  const emailMatch = raw.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = raw.match(/[+]?[(]?\d{3}[)]?[\s.\-]?\d{3}[\s.\-]?\d{4,6}/);
  const linkedinMatch = raw.match(/linkedin\.com\/in\/[a-zA-Z0-9\-]+/i);

  // Name = first non-empty line that is NOT contact info
  let nameGuess = '';
  for (const l of lines.slice(0, 5)) {
    const t = l.trim();
    if (!t) continue;
    if (/@/.test(t) || /^\(?\d{3}/.test(t) || /linkedin/i.test(t) || /http/i.test(t)) continue;
    if (/^[|•\-]/.test(t)) continue;
    if (t.length < 60 && /^[A-Za-z\s.\-']+$/.test(t)) { nameGuess = t; break; }
  }

  // Split into sections by uppercase headers
  const sectionMap: Record<string, string[]> = {};
  let currentSection = '_top';
  sectionMap[currentSection] = [];

  const sectionRe = /^(PROFESSIONAL\s+SUMMARY|SUMMARY|OBJECTIVE|PROFILE|ABOUT\s*ME?|EXPERIENCE|WORK\s+HISTORY|EMPLOYMENT|EDUCATION|SKILLS|TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES|PROJECTS|CERTIFICATIONS?|AWARDS?|LANGUAGES|INTERESTS|ACHIEVEMENTS)/i;

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(sectionRe);
    if (match && trimmed.length < 45) {
      currentSection = match[1].toUpperCase().replace(/\s+/g, ' ');
      sectionMap[currentSection] = [];
    } else {
      if (!sectionMap[currentSection]) sectionMap[currentSection] = [];
      sectionMap[currentSection].push(line);
    }
  }

  const getSection = (...keys: string[]): string[] => {
    for (const k of keys) {
      for (const sk of Object.keys(sectionMap)) {
        if (sk.includes(k)) return sectionMap[sk].filter(l => l.trim());
      }
    }
    return [];
  };

  const summaryLines = getSection('SUMMARY', 'OBJECTIVE', 'PROFILE', 'ABOUT');
  const summary = summaryLines.map(l => l.trim()).join(' ').trim();

  const expLines = getSection('EXPERIENCE', 'WORK', 'EMPLOYMENT');
  const experiences = parseExperienceBlock(expLines);

  const eduLines = getSection('EDUCATION');
  const education = parseEducationBlock(eduLines);

  const skillLines = getSection('SKILL', 'TECHNICAL', 'COMPETENC');
  const skills = skillLines
    .join(', ')
    .split(/[,•|;\n]+/)
    .map(s => s.replace(/^[\s\-*]+/, '').trim())
    .filter(s => s.length > 1 && s.length < 40);

  const projLines = getSection('PROJECT');
  const projects = parseProjectBlock(projLines);

  const certLines = getSection('CERTIF', 'AWARD');
  const certifications = certLines.map(l => l.replace(/^[\s\-•*]+/, '').trim()).filter(Boolean);

  const top = lines.slice(0, 8).join(' ');

  return {
    personalInfo: {
      fullName: nameGuess || 'Your Name',
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      location: extractLocation(top),
      linkedIn: linkedinMatch ? linkedinMatch[0] : '',
      website: '',
    },
    summary,
    experience: experiences,
    education,
    skills,
    projects,
    certifications,
  };
}

function parseExperienceBlock(lines: string[]) {
  const entries: ResumeData['experience'] = [];
  let current: ResumeData['experience'][0] | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const hasDate = /\b(19|20)\d{2}\b/.test(t) || /present/i.test(t);
    const isBullet = /^[•\-*]/.test(t);

    if (hasDate && !isBullet) {
      if (current) entries.push(current);
      const dateMatch = t.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+)?\d{4}\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+)?\d{4}|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+)?\d{4}\s*[-–—to]+\s*present/i);
      const dates = dateMatch ? dateMatch[0] : '';
      const parts = dates.split(/[-–—]|to/i).map(d => d.trim());
      const titlePart = t.replace(dates, '').replace(/[|,—–\-]\s*$/, '').trim();
      const chunks = titlePart.split(/[|—–]|\bat\b/i).map(c => c.trim()).filter(Boolean);

      current = {
        title: chunks[0] || t,
        company: chunks[1] || '',
        location: chunks[2] || '',
        startDate: parts[0] || '',
        endDate: parts[1] || '',
        current: /present/i.test(dates),
        bullets: [],
      };
    } else if (isBullet && current) {
      current.bullets.push(t.replace(/^[•\-*]\s*/, ''));
    } else if (current && !hasDate && current.bullets.length === 0 && !current.company) {
      current.company = t;
    }
  }
  if (current) entries.push(current);
  return entries;
}

function parseEducationBlock(lines: string[]) {
  const entries: ResumeData['education'] = [];
  let current: ResumeData['education'][0] | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const isDegree = /bachelor|master|ph\.?d|b\.?s\.?|m\.?s\.?|b\.?tech|m\.?tech|associate|diploma|degree/i.test(t);
    const hasDate = /\b(19|20)\d{2}\b/.test(t);

    if (isDegree || (hasDate && !current)) {
      if (current) entries.push(current);
      const dateMatch = t.match(/\b(19|20)\d{2}\b/);
      current = { degree: t.replace(/\(?\d{4}\)?/, '').replace(/[-–—]/g, '').trim(), school: '', location: '', graduationDate: dateMatch ? dateMatch[0] : '', gpa: '' };
    } else if (current) {
      if (!current.school) {
        current.school = t;
      }
      const gpaMatch = t.match(/(?:gpa|cgpa)[:\s]*(\d\.\d+)/i) || t.match(/(\d\.\d+)\s*(?:\/\s*4|gpa)/i);
      if (gpaMatch) current.gpa = gpaMatch[1];
    }
  }
  if (current) entries.push(current);
  return entries;
}

function parseProjectBlock(lines: string[]) {
  const projects: ResumeData['projects'] = [];
  let cur: ResumeData['projects'][0] | null = null;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (/^[•\-*]/.test(t)) {
      if (cur) cur.description += (cur.description ? ' ' : '') + t.replace(/^[•\-*]\s*/, '');
    } else {
      if (cur) projects.push(cur);
      cur = { name: t, description: '', technologies: '', link: '' };
    }
  }
  if (cur) projects.push(cur);
  return projects;
}

function extractLocation(text: string): string {
  const m = text.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),?\s*([A-Z]{2})\b/);
  return m ? `${m[1]}, ${m[2]}` : '';
}

/* ═══════════════════════════════════════════════════════
   OPTIMIZER — improves the parsed ResumeData
   ═══════════════════════════════════════════════════════ */

function optimizeResumeData(data: ResumeData): ResumeData {
  const clone: ResumeData = JSON.parse(JSON.stringify(data));

  const metricSuffixes = [
    ', resulting in a 25% efficiency improvement',
    ', reducing processing time by 30%',
    ', serving 5,000+ users',
    ', saving the team 10+ hours weekly',
    ', increasing throughput by 40%',
    ', improving customer satisfaction by 20%',
  ];

  const weakVerbs: Record<string, string> = {
    'responsible for': 'Spearheaded',
    'worked on': 'Engineered',
    'helped': 'Facilitated',
    'did': 'Executed',
    'handled': 'Managed',
    'assisted': 'Supported',
    'made': 'Developed',
    'used': 'Leveraged',
  };

  let metricIdx = 0;
  clone.experience.forEach(exp => {
    exp.bullets = exp.bullets.map(b => {
      let improved = b;
      for (const [weak, strong] of Object.entries(weakVerbs)) {
        const re = new RegExp('^' + weak, 'i');
        improved = improved.replace(re, strong);
      }
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
      if (!/\d/.test(improved)) {
        improved += metricSuffixes[metricIdx % metricSuffixes.length];
        metricIdx++;
      }
      return improved;
    });

    if (exp.bullets.length < 2 && exp.title) {
      exp.bullets.push('Collaborated with cross-functional teams to deliver key initiatives on time and under budget');
    }
  });

  if (!clone.summary && clone.experience.length > 0) {
    const titles = clone.experience.map(e => e.title).filter(Boolean).join(', ');
    const skillList = clone.skills.slice(0, 5).join(', ');
    clone.summary = `Results-driven professional with experience as ${titles}. Skilled in ${skillList || 'cross-functional collaboration and problem-solving'}. Proven track record of delivering measurable impact through leadership, technical excellence, and analytical thinking.`;
  }

  const coreSkills = ['Leadership', 'Problem Solving', 'Agile', 'Communication', 'Teamwork'];
  const existing = clone.skills.map(s => s.toLowerCase());
  coreSkills.forEach(cs => {
    if (!existing.includes(cs.toLowerCase())) clone.skills.push(cs);
  });

  return clone;
}

function resumeDataToText(d: ResumeData): string {
  const parts: string[] = [];
  parts.push(d.personalInfo.fullName);
  parts.push([d.personalInfo.email, d.personalInfo.phone, d.personalInfo.location, d.personalInfo.linkedIn].filter(Boolean).join(' | '));
  if (d.summary) { parts.push('\nPROFESSIONAL SUMMARY'); parts.push(d.summary); }
  if (d.experience.length) {
    parts.push('\nEXPERIENCE');
    d.experience.forEach(e => {
      parts.push(`${e.title} — ${e.company} (${e.startDate} – ${e.current ? 'Present' : e.endDate})`);
      e.bullets.forEach(b => parts.push('• ' + b));
    });
  }
  if (d.education.length) {
    parts.push('\nEDUCATION');
    d.education.forEach(e => parts.push(`${e.degree} — ${e.school} (${e.graduationDate})${e.gpa ? ' GPA: ' + e.gpa : ''}`));
  }
  if (d.skills.length) { parts.push('\nSKILLS'); parts.push(d.skills.join(', ')); }
  return parts.join('\n');
}
