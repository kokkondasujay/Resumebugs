import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, GraduationCap, Wrench, FolderOpen, Award,
  ChevronRight, ChevronLeft, Plus, Trash2, Eye, Download, Check,
  CheckCircle2, Sparkles
} from 'lucide-react';
import {
  buildAndDownload, type ResumeData, type ExperienceItem,
  type EducationItem, type ProjectItem, type TemplateId,
} from '@/utils/pdfGenerator';
import { templates } from '@/data/templates';

const steps = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: Briefcase },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certifications', label: 'Certs', icon: Award },
];

const emptyResume: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedIn: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic');
  const [currentStep, setCurrentStep] = useState(0);
  const [resume, setResume] = useState<ResumeData>(emptyResume);
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const updatePersonal = (field: string, value: string) => {
    setResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [''],
    };
    setResume(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp),
    }));
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex ? { ...exp, bullets: exp.bullets.map((b, bi) => bi === bulletIndex ? value : b) } : exp
      ),
    }));
  };

  const addBullet = (expIndex: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      ),
    }));
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex ? { ...exp, bullets: exp.bullets.filter((_, bi) => bi !== bulletIndex) } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    const newEdu: EducationItem = { degree: '', school: '', location: '', graduationDate: '', gpa: '' };
    setResume(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu),
    }));
  };

  const removeEducation = (index: number) => {
    setResume(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const addProject = () => {
    const newProj: ProjectItem = { name: '', description: '', technologies: '', link: '' };
    setResume(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => i === index ? { ...proj, [field]: value } : proj),
    }));
  };

  const removeProject = (index: number) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const addCert = () => {
    if (certInput.trim()) {
      setResume(prev => ({ ...prev, certifications: [...prev.certifications, certInput.trim()] }));
      setCertInput('');
    }
  };

  const removeCert = (index: number) => {
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));
  };

  const handleDownload = () => {
    buildAndDownload(resume, selectedTemplate);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const templateColors: Record<TemplateId, { primary: string; accent: string }> = {
    classic: { primary: '#0f172a', accent: '#0f172a' },
    modern: { primary: '#0038a1', accent: '#0038a1' },
    minimal: { primary: '#0a0a0a', accent: '#0a0a0a' },
    executive: { primary: '#1e1e1e', accent: '#1e1e1e' },
    creative: { primary: '#dc2626', accent: '#0038a1' },
    chronological: { primary: '#0f172a', accent: '#0f172a' },
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="mono-label text-ink-muted">/STEP_01</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Personal information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" value={resume.personalInfo.fullName} onChange={e => updatePersonal('fullName', e.target.value)} className="input-sharp" />
              <input type="email" placeholder="Email *" value={resume.personalInfo.email} onChange={e => updatePersonal('email', e.target.value)} className="input-sharp" />
              <input type="tel" placeholder="Phone *" value={resume.personalInfo.phone} onChange={e => updatePersonal('phone', e.target.value)} className="input-sharp" />
              <input type="text" placeholder="Location (City, State)" value={resume.personalInfo.location} onChange={e => updatePersonal('location', e.target.value)} className="input-sharp" />
              <input type="text" placeholder="LinkedIn URL" value={resume.personalInfo.linkedIn} onChange={e => updatePersonal('linkedIn', e.target.value)} className="input-sharp" />
              <input type="text" placeholder="Portfolio / Website" value={resume.personalInfo.website} onChange={e => updatePersonal('website', e.target.value)} className="input-sharp" />
            </div>
          </div>
        );
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2"><span className="mono-label text-ink-muted">/STEP_02</span></div>
            <h3 className="text-2xl font-bold tracking-tight">Professional summary</h3>
            <textarea value={resume.summary} onChange={e => setResume(prev => ({ ...prev, summary: e.target.value }))} placeholder="3-4 sentences about your background, key achievements, and career goals..." className="input-sharp h-40 resize-none" />
            <p className="text-xs text-ink-light font-mono">Tip: Mirror keywords from your target job description.</p>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><div className="flex items-center gap-2 mb-2"><span className="mono-label text-ink-muted">/STEP_03</span></div><h3 className="text-2xl font-bold tracking-tight">Work experience</h3></div>
              <button onClick={addExperience} className="btn-primary px-4 py-2.5 text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add experience</button>
            </div>
            {resume.experience.map((exp, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 sharp-card-light space-y-3">
                <div className="flex items-center justify-between">
                  <span className="mono-xs text-ink-light">ENTRY #{String(i + 1).padStart(2, '0')}</span>
                  <button onClick={() => removeExperience(i)} className="text-danger hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Job Title *" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} className="input-sharp" />
                  <input type="text" placeholder="Company *" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} className="input-sharp" />
                  <input type="text" placeholder="Location" value={exp.location} onChange={e => updateExperience(i, 'location', e.target.value)} className="input-sharp" />
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Start Date" value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} className="input-sharp flex-1" />
                    {!exp.current && <input type="text" placeholder="End Date" value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} className="input-sharp flex-1" />}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-ink-muted font-mono"><input type="checkbox" checked={exp.current} onChange={e => updateExperience(i, 'current', e.target.checked)} /> Currently working here</label>
                <div className="space-y-2">
                  <span className="mono-xs text-ink-light">ACHIEVEMENTS</span>
                  {exp.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex gap-2">
                      <input type="text" placeholder="Start with an action verb..." value={bullet} onChange={e => updateBullet(i, bi, e.target.value)} className="input-sharp text-sm py-2.5 flex-1" />
                      <button onClick={() => removeBullet(i, bi)} className="text-danger hover:text-red-700 px-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => addBullet(i)} className="mono-xs text-brand hover:text-brand-hover font-medium">+ ADD BULLET</button>
                </div>
              </motion.div>
            ))}
            {resume.experience.length === 0 && <div className="text-center py-16 text-ink-light sharp-card-light"><Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="mono-xs">No entries yet</p></div>}
          </div>
        );
      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><div className="flex items-center gap-2 mb-2"><span className="mono-label text-ink-muted">/STEP_04</span></div><h3 className="text-2xl font-bold tracking-tight">Education</h3></div>
              <button onClick={addEducation} className="btn-primary px-4 py-2.5 text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add education</button>
            </div>
            {resume.education.map((edu, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 sharp-card-light space-y-3">
                <div className="flex items-center justify-between"><span className="mono-xs text-ink-light">ENTRY #{String(i + 1).padStart(2, '0')}</span><button onClick={() => removeEducation(i)} className="text-danger hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Degree *" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className="input-sharp" />
                  <input type="text" placeholder="School *" value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} className="input-sharp" />
                  <input type="text" placeholder="Location" value={edu.location} onChange={e => updateEducation(i, 'location', e.target.value)} className="input-sharp" />
                  <div className="flex gap-3"><input type="text" placeholder="Graduation Date" value={edu.graduationDate} onChange={e => updateEducation(i, 'graduationDate', e.target.value)} className="input-sharp flex-1" /><input type="text" placeholder="GPA" value={edu.gpa} onChange={e => updateEducation(i, 'gpa', e.target.value)} className="input-sharp w-24" /></div>
                </div>
              </motion.div>
            ))}
            {resume.education.length === 0 && <div className="text-center py-16 text-ink-light sharp-card-light"><GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="mono-xs">No entries yet</p></div>}
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2"><span className="mono-label text-ink-muted">/STEP_05</span></div>
            <h3 className="text-2xl font-bold tracking-tight">Skills</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Add a skill and press Enter" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} className="input-sharp flex-1" />
              <button onClick={addSkill} className="btn-primary px-5"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-sm font-medium">{skill}<button onClick={() => removeSkill(i)} className="hover:text-red-300"><Trash2 className="w-3 h-3" /></button></span>
              ))}
            </div>
            <p className="text-xs text-ink-light font-mono">Tip: Mix hard skills (Python, React) with soft skills (Leadership).</p>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><div className="flex items-center gap-2 mb-2"><span className="mono-label text-ink-muted">/STEP_06</span></div><h3 className="text-2xl font-bold tracking-tight">Projects</h3></div>
              <button onClick={addProject} className="btn-primary px-4 py-2.5 text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add project</button>
            </div>
            {resume.projects.map((proj, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 sharp-card-light space-y-3">
                <div className="flex items-center justify-between"><span className="mono-xs text-ink-light">ENTRY #{String(i + 1).padStart(2, '0')}</span><button onClick={() => removeProject(i)} className="text-danger hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Project Name *" value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} className="input-sharp" />
                  <input type="text" placeholder="Technologies Used" value={proj.technologies} onChange={e => updateProject(i, 'technologies', e.target.value)} className="input-sharp" />
                </div>
                <input type="text" placeholder="Link (GitHub, live demo)" value={proj.link} onChange={e => updateProject(i, 'link', e.target.value)} className="input-sharp" />
                <textarea placeholder="Description *" value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} className="input-sharp h-20 resize-none" />
              </motion.div>
            ))}
            {resume.projects.length === 0 && <div className="text-center py-16 text-ink-light sharp-card-light"><FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="mono-xs">No projects yet</p></div>}
          </div>
        );
      case 'certifications':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2"><span className="mono-label text-ink-muted">/STEP_07</span></div>
            <h3 className="text-2xl font-bold tracking-tight">Certifications</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Add a certification" value={certInput} onChange={e => setCertInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCert()} className="input-sharp flex-1" />
              <button onClick={addCert} className="btn-primary px-5"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2">
              {resume.certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 sharp-card-light"><span className="text-sm font-medium text-ink">{cert}</span><button onClick={() => removeCert(i)} className="text-danger hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="grid-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 bg-brand" /><span className="mono-label text-ink-muted">/RESUME_BUILDER</span></div>
          <h1 className="display-heading text-5xl sm:text-6xl">Build a resume that <span className="text-brand">converts</span>.</h1>
          <p className="text-lg text-ink-muted mt-3 max-w-xl">Pick a proven ATS template, fill in the blanks, download a polished PDF.</p>
        </motion.div>

        {/* Template picker */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div><div className="mono-label text-ink-muted mb-1">/STEP_00 · TEMPLATE</div><h3 className="text-xl font-bold tracking-tight">Choose your template</h3></div>
            <span className="mono-xs text-ink-light">{templates.filter(t => t.popular).length} ATS-verified</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {templates.map((t) => (
              <button key={t.id} onClick={() => setSelectedTemplate(t.id as TemplateId)} className={`template-card p-3 text-left ${selectedTemplate === t.id ? 'selected' : ''}`}>
                <div className="aspect-[8.5/11] bg-white border border-border-light mb-2 relative overflow-hidden">
                  <div className="absolute inset-2 flex flex-col gap-1">
                    <div className="h-2 w-3/4" style={{ background: templateColors[t.id as TemplateId].primary }} />
                    <div className="h-0.5 w-full bg-border-lighter" />
                    <div className="h-1 w-full bg-border-lighter" />
                    <div className="h-1 w-5/6 bg-border-lighter" />
                    <div className="h-0.5 w-full bg-border-lighter mt-1" />
                    <div className="h-1 w-1/2" style={{ background: templateColors[t.id as TemplateId].accent }} />
                    <div className="h-1 w-full bg-border-lighter" />
                    <div className="h-1 w-4/5 bg-border-lighter" />
                    <div className="h-1 w-full bg-border-lighter" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {t.popular && <Sparkles className="w-3 h-3 text-brand" />}
                  <span className="font-semibold text-xs">{t.name}</span>
                </div>
                <div className="mono-xs text-ink-light mt-0.5">{t.category}</div>
                {selectedTemplate === t.id && <div className="absolute top-3 right-3 w-5 h-5 bg-brand text-white flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3} /></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2"><div className="mono-label text-ink-muted">/PROGRESS</div><div className="mono-xs text-ink-light">{Math.round(progress)}%</div></div>
          <div className="h-1 bg-border-light overflow-hidden"><motion.div className="h-full bg-brand" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} /></div>
          <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-2">
            {steps.map((step, i) => {
              const active = i === currentStep;
              const done = i < currentStep;
              return (
                <button key={step.id} onClick={() => setCurrentStep(i)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${active ? 'bg-black text-white' : done ? 'bg-brand-light text-brand' : 'bg-surface-alt text-ink-light hover:bg-border-lighter'}`}>
                  {done ? <Check className="w-3 h-3" strokeWidth={3} /> : <step.icon className="w-3 h-3" />}
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="sharp-card bg-white p-6 sm:p-8">
                {renderStep()}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-black">
                  <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="btn-ghost px-5 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /> Previous</button>
                  {currentStep < steps.length - 1 ? (
                    <button onClick={() => setCurrentStep(currentStep + 1)} className="btn-primary px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={handleDownload} className="btn-primary px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                      {downloaded ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                      {downloaded ? 'Downloaded!' : 'Download PDF'}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Eye className="w-4 h-4" /><span className="mono-xs font-semibold">/LIVE_PREVIEW</span></div>
                <span className="mono-xs text-ink-light">{templates.find(t => t.id === selectedTemplate)?.name}</span>
              </div>
              <div className="sharp-card bg-slate-100 p-4">
                <div className="resume-page p-5 text-[9px] leading-snug" style={{ minHeight: 380, color: templateColors[selectedTemplate].primary }}>
                  {resume.personalInfo.fullName && (
                    <>
                      <div className="font-bold text-base uppercase tracking-wide" style={{ color: templateColors[selectedTemplate].primary }}>
                        {selectedTemplate === 'classic' || selectedTemplate === 'executive' || selectedTemplate === 'chronological' ? resume.personalInfo.fullName.toUpperCase() : resume.personalInfo.fullName}
                      </div>
                      <div className="mono-xs text-ink-light mt-1 flex flex-wrap gap-x-2">
                        {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                        {resume.personalInfo.phone && <span>· {resume.personalInfo.phone}</span>}
                      </div>
                      {selectedTemplate !== 'minimal' && <hr className="my-2" style={{ borderColor: templateColors[selectedTemplate].accent, borderWidth: 1 }} />}
                    </>
                  )}

                  {resume.summary && (
                    <>
                      <div className="font-bold text-[10px] uppercase tracking-wide mt-2" style={{ color: templateColors[selectedTemplate].accent }}>PROFESSIONAL SUMMARY</div>
                      {selectedTemplate !== 'minimal' && <div className="h-px w-full mt-0.5 mb-1" style={{ background: templateColors[selectedTemplate].accent }} />}
                      <p className="text-ink-muted mt-1">{resume.summary}</p>
                    </>
                  )}

                  {resume.experience.length > 0 && (
                    <>
                      <div className="font-bold text-[10px] uppercase tracking-wide mt-3" style={{ color: templateColors[selectedTemplate].accent }}>EXPERIENCE</div>
                      {selectedTemplate !== 'minimal' && <div className="h-px w-full mt-0.5 mb-1" style={{ background: templateColors[selectedTemplate].accent }} />}
                      {resume.experience.map((exp, i) => (
                        <div key={i} className="mb-2 mt-1">
                          <div className="flex justify-between items-baseline"><span className="font-semibold text-ink">{exp.title}</span><span className="text-ink-light">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span></div>
                          <div className="text-ink-light italic">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                          <ul className="mt-1 space-y-0.5">{exp.bullets.filter(b => b).map((b, bi) => <li key={bi} className="text-ink-muted">• {b}</li>)}</ul>
                        </div>
                      ))}
                    </>
                  )}

                  {resume.education.length > 0 && (
                    <>
                      <div className="font-bold text-[10px] uppercase tracking-wide mt-3" style={{ color: templateColors[selectedTemplate].accent }}>EDUCATION</div>
                      {selectedTemplate !== 'minimal' && <div className="h-px w-full mt-0.5 mb-1" style={{ background: templateColors[selectedTemplate].accent }} />}
                      {resume.education.map((edu, i) => (
                        <div key={i} className="mb-1 mt-1">
                          <div className="flex justify-between"><span className="font-semibold text-ink">{edu.degree}</span><span className="text-ink-light">{edu.graduationDate}</span></div>
                          <div className="text-ink-light italic">{edu.school}{edu.location && ` · ${edu.location}`}</div>
                        </div>
                      ))}
                    </>
                  )}

                  {resume.skills.length > 0 && (
                    <>
                      <div className="font-bold text-[10px] uppercase tracking-wide mt-3" style={{ color: templateColors[selectedTemplate].accent }}>SKILLS</div>
                      {selectedTemplate !== 'minimal' && <div className="h-px w-full mt-0.5 mb-1" style={{ background: templateColors[selectedTemplate].accent }} />}
                      <div className="text-ink-muted mt-1">{resume.skills.join(' · ')}</div>
                    </>
                  )}

                  {resume.projects.length > 0 && (
                    <>
                      <div className="font-bold text-[10px] uppercase tracking-wide mt-3" style={{ color: templateColors[selectedTemplate].accent }}>PROJECTS</div>
                      {selectedTemplate !== 'minimal' && <div className="h-px w-full mt-0.5 mb-1" style={{ background: templateColors[selectedTemplate].accent }} />}
                      {resume.projects.map((proj, i) => (
                        <div key={i} className="mb-1 mt-1"><span className="font-semibold text-ink">{proj.name}</span>{proj.technologies && <div className="text-ink-light italic">Tech: {proj.technologies}</div>}<p className="text-ink-muted mt-0.5">{proj.description}</p></div>
                      ))}
                    </>
                  )}

                  {resume.certifications.length > 0 && (
                    <>
                      <div className="font-bold text-[10px] uppercase tracking-wide mt-3" style={{ color: templateColors[selectedTemplate].accent }}>CERTIFICATIONS</div>
                      {selectedTemplate !== 'minimal' && <div className="h-px w-full mt-0.5 mb-1" style={{ background: templateColors[selectedTemplate].accent }} />}
                      <ul className="mt-1 space-y-0.5">{resume.certifications.map((cert, i) => <li key={i} className="text-ink-muted">• {cert}</li>)}</ul>
                    </>
                  )}

                  {!resume.personalInfo.fullName && resume.experience.length === 0 && resume.education.length === 0 && resume.skills.length === 0 && (
                    <div className="text-center py-16 text-ink-light"><Eye className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="mono-xs">Start filling the form</p></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
