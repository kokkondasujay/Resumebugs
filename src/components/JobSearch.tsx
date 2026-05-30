import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, DollarSign, Clock, ExternalLink,
  Briefcase, X, ChevronDown, ChevronUp, Bookmark, SlidersHorizontal,
} from 'lucide-react';
import { jobListings, searchJobs } from '@/data/jobs';

const allTags = Array.from(new Set(jobListings.flatMap(j => j.tags))).sort();
const allIndustries = Array.from(new Set(jobListings.map(j => j.industry))).sort();
const allLevels: string[] = ['Entry', 'Mid', 'Senior', 'Lead', 'Staff'];
const allRemote: string[] = ['Remote', 'Hybrid', 'On-site'];
const allTypes: string[] = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export default function JobSearch() {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedRemote, setSelectedRemote] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const filteredJobs = useMemo(() => {
    let jobs = searchJobs(query);
    if (selectedTags.length > 0) jobs = jobs.filter(j => selectedTags.some(t => j.tags.includes(t)));
    if (selectedIndustry) jobs = jobs.filter(j => j.industry === selectedIndustry);
    if (selectedLevel) jobs = jobs.filter(j => j.level === selectedLevel);
    if (selectedRemote) jobs = jobs.filter(j => j.remote === selectedRemote);
    if (selectedType) jobs = jobs.filter(j => j.type === selectedType);
    return jobs;
  }, [query, selectedTags, selectedIndustry, selectedLevel, selectedRemote, selectedType]);

  const toggleTag = (tag: string) => setSelectedTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]);
  const toggleSave = (id: string) => setSavedJobs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const clearAll = () => { setQuery(''); setSelectedTags([]); setSelectedIndustry(''); setSelectedLevel(''); setSelectedRemote(''); setSelectedType(''); };

  const hasFilters = query || selectedTags.length > 0 || selectedIndustry || selectedLevel || selectedRemote || selectedType;

  return (
    <div className="grid-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-brand" />
            <span className="mono-label text-ink-muted">/JOB_BOARD</span>
          </div>
          <h1 className="display-heading text-5xl sm:text-6xl">Live openings at <span className="text-brand">top companies</span>.</h1>
          <p className="text-lg text-ink-muted mt-3 max-w-xl">Curated roles with direct-apply links. No middlemen — click and apply on the company's site.</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-light" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search role, company, skill, or industry..." className="input-sharp pl-12 py-4 text-base" />
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 px-4 py-2 sharp-card-light text-sm font-medium text-ink hover:bg-surface-alt">
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {hasFilters && <span className="w-2 h-2 rounded-full bg-brand ml-1" />}
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-4 p-6 sharp-card bg-white space-y-5">

                  {/* Industry */}
                  <div>
                    <div className="mono-xs text-ink-light mb-2">/INDUSTRY</div>
                    <div className="flex flex-wrap gap-2">
                      {allIndustries.map(i => (
                        <button key={i} onClick={() => setSelectedIndustry(selectedIndustry === i ? '' : i)} className={`filter-chip ${selectedIndustry === i ? 'active' : ''}`}>{i}</button>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div>
                    <div className="mono-xs text-ink-light mb-2">/EXPERIENCE_LEVEL</div>
                    <div className="flex flex-wrap gap-2">
                      {allLevels.map(l => (
                        <button key={l} onClick={() => setSelectedLevel(selectedLevel === l ? '' : l)} className={`filter-chip ${selectedLevel === l ? 'active' : ''}`}>{l}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Remote */}
                    <div>
                      <div className="mono-xs text-ink-light mb-2">/WORK_TYPE</div>
                      <div className="flex flex-wrap gap-2">
                        {allRemote.map(r => (
                          <button key={r} onClick={() => setSelectedRemote(selectedRemote === r ? '' : r)} className={`filter-chip ${selectedRemote === r ? 'active' : ''}`}>{r}</button>
                        ))}
                      </div>
                    </div>
                    {/* Job type */}
                    <div>
                      <div className="mono-xs text-ink-light mb-2">/JOB_TYPE</div>
                      <div className="flex flex-wrap gap-2">
                        {allTypes.map(t => (
                          <button key={t} onClick={() => setSelectedType(selectedType === t ? '' : t)} className={`filter-chip ${selectedType === t ? 'active' : ''}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="mono-xs text-ink-light mb-2">/SKILLS_&_TAGS</div>
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag)} className={`filter-chip text-xs ${selectedTags.includes(tag) ? 'active' : ''}`}>{tag}</button>
                      ))}
                    </div>
                  </div>

                  {hasFilters && (
                    <button onClick={clearAll} className="mono-xs text-danger hover:text-red-700 font-medium inline-flex items-center gap-1">
                      <X className="w-3 h-3" /> CLEAR ALL FILTERS
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="mono-xs text-ink-light">
            <span className="font-mono font-semibold text-ink">{filteredJobs.length}</span> jobs found
          </p>
          {savedJobs.size > 0 && <span className="mono-xs text-ink-muted"><Bookmark className="w-3 h-3 inline mr-1" />{savedJobs.size} saved</span>}
        </div>

        {/* Job Cards */}
        <div className="space-y-3">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              className="sharp-card bg-white hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0 text-sm font-bold">
                        {job.company.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold tracking-tight truncate">{job.title}</h3>
                        <p className="text-sm text-ink-muted">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs mono-xs text-ink-light">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type} · {job.remote}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.postedDate}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="mono-xs px-2 py-1 bg-brand-light text-brand border border-brand/20 font-semibold">{job.level}</span>
                      <span className="mono-xs px-2 py-1 bg-surface-alt text-ink-muted border border-border-lighter">{job.industry}</span>
                      {job.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="mono-xs px-2 py-1 bg-surface-alt text-ink-muted border border-border-lighter">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => toggleSave(job.id)} className={`p-2 transition-colors shrink-0 ${savedJobs.has(job.id) ? 'bg-brand text-white' : 'bg-surface-alt text-ink-light hover:bg-border-lighter'}`}>
                    <Bookmark className={`w-4 h-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Expandable JD */}
                <div className="mt-4">
                  <button onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)} className="mono-xs text-brand hover:text-brand-hover font-semibold flex items-center gap-1">
                    {expandedJob === job.id ? <>HIDE DETAILS <ChevronUp className="w-3 h-3" /></> : <>VIEW JD & APPLY <ChevronDown className="w-3 h-3" /></>}
                  </button>

                  <AnimatePresence>
                    {expandedJob === job.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-black space-y-4">
                          <div>
                            <div className="mono-xs text-ink-light mb-1">/ABOUT_THE_ROLE</div>
                            <p className="text-sm text-ink leading-relaxed">{job.description}</p>
                          </div>
                          <div>
                            <div className="mono-xs text-ink-light mb-2">/REQUIREMENTS</div>
                            <ul className="space-y-1.5">
                              {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-ink">
                                  <span className="w-1 h-1 bg-brand mt-2 shrink-0" />{req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
                            Apply on {job.company}'s website <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-ink-light mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-bold tracking-tight">No matches found</h3>
            <p className="text-sm text-ink-light mt-1 mono-xs">Try adjusting your filters or search query</p>
            <button onClick={clearAll} className="btn-ghost px-5 py-2 text-sm mt-4">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
