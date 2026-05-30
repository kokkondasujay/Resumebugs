export interface ATSResult {
  score: number;
  sections: SectionScore[];
  keywords: KeywordResult[];
  suggestions: Suggestion[];
  overallFeedback: string;
}

export interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface KeywordResult {
  word: string;
  found: boolean;
  count: number;
  importance: 'high' | 'medium' | 'low';
}

export interface Suggestion {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  category: string;
}

const COMMON_KEYWORDS: Record<string, string[]> = {
  software: ['javascript', 'typescript', 'react', 'node', 'python', 'sql', 'git', 'api', 'aws', 'docker', 'kubernetes', 'agile', 'scrum'],
  data: ['python', 'sql', 'machine learning', 'data analysis', 'pandas', 'numpy', 'tableau', 'statistics', 'excel', 'r'],
  marketing: ['seo', 'google analytics', 'social media', 'content marketing', 'crm', 'email marketing', 'ppc', 'branding'],
  design: ['figma', 'adobe', 'ui/ux', 'prototyping', 'wireframing', 'user research', 'design systems', 'sketch'],
  finance: ['financial modeling', 'excel', 'valuation', 'accounting', 'budgeting', 'forecasting', 'risk analysis', 'cfa'],
  general: ['leadership', 'communication', 'teamwork', 'problem solving', 'project management', 'time management', 'analytical', 'creative'],
};

const ACTION_VERBS = [
  'achieved', 'accomplished', 'administered', 'analyzed', 'architected', 'automated', 'built', 'coordinated',
  'created', 'designed', 'developed', 'directed', 'engineered', 'established', 'executed', 'expanded',
  'facilitated', 'generated', 'implemented', 'improved', 'increased', 'initiated', 'integrated', 'launched',
  'led', 'managed', 'mentored', 'negotiated', 'optimized', 'orchestrated', 'oversaw', 'pioneered',
  'planned', 'produced', 'programmed', 'reduced', 'researched', 'resolved', 'spearheaded', 'streamlined',
  'supervised', 'transformed', 'upgraded', 'utilized'
];

function countWord(text: string, word: string): number {
  // Simple case-insensitive substring count — works for multi-word keywords too
  const lower = text.toLowerCase();
  const target = word.toLowerCase();
  let count = 0;
  let pos = 0;
  while (true) {
    const idx = lower.indexOf(target, pos);
    if (idx === -1) break;
    count++;
    pos = idx + target.length;
  }
  return count;
}

export function analyzeResume(text: string, jobRole: string = 'software'): ATSResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const wordCount = words.length;

  const sections: SectionScore[] = [];
  const suggestions: Suggestion[] = [];

  // ── Contact Info ──
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(text);
  const hasGithub = /github\.com/i.test(text);
  const hasPortfolio = /portfolio|website|\.dev|\.io|\.com\/[a-z]/i.test(text);

  let contactScore = 0;
  if (hasEmail) contactScore += 30;
  if (hasPhone) contactScore += 25;
  if (hasLinkedIn) contactScore += 20;
  if (hasGithub) contactScore += 10;
  if (hasPortfolio) contactScore += 15;
  contactScore = Math.min(contactScore, 100);

  sections.push({ name: 'Contact Information', score: contactScore, maxScore: 100, feedback: contactScore >= 70 ? 'Contact info looks complete' : 'Add missing contact details' });
  if (!hasEmail) suggestions.push({ type: 'error', message: 'Add a professional email address', category: 'Contact' });
  if (!hasPhone) suggestions.push({ type: 'warning', message: 'Add a phone number for recruiters to reach you', category: 'Contact' });
  if (!hasLinkedIn) suggestions.push({ type: 'info', message: 'Add your LinkedIn profile URL', category: 'Contact' });

  // ── Summary / Objective ──
  const hasSummary = /summary|objective|profile|about me/i.test(text);
  let summaryScore = 20;
  if (hasSummary) {
    summaryScore = 80;
    // Check if the summary paragraph is long enough
    if (wordCount > 100) summaryScore = 90;
    if (wordCount > 200) summaryScore = 100;
  }
  sections.push({ name: 'Professional Summary', score: summaryScore, maxScore: 100, feedback: hasSummary ? 'Summary section detected' : 'Add a professional summary / about section' });
  if (!hasSummary) suggestions.push({ type: 'error', message: 'Add a Professional Summary or Objective section at the top', category: 'Content' });

  // ── Experience ──
  const hasExperience = /experience|employment|work history/i.test(text);
  const yearMatches = (text.match(/\b(19|20)\d{2}\b/g) || []).length;
  const hasBullets = /[•\-\*]\s/.test(text);
  const hasQuantified = /\d+%|\$\d|saved|increased|reduced|improved.*\d/i.test(text);

  let expScore = 0;
  if (hasExperience) expScore += 25;
  if (yearMatches >= 2) expScore += 25;
  if (hasBullets) expScore += 20;
  if (hasQuantified) expScore += 15;
  if (wordCount > 300) expScore += 15;
  expScore = Math.min(expScore, 100);

  sections.push({ name: 'Work Experience', score: expScore, maxScore: 100, feedback: expScore >= 60 ? 'Experience section is solid' : 'Add more experience detail' });
  if (!hasExperience) suggestions.push({ type: 'error', message: 'Add a Work Experience section with job titles and dates', category: 'Content' });
  if (!hasBullets) suggestions.push({ type: 'warning', message: 'Use bullet points (•) to list achievements', category: 'Formatting' });
  if (!hasQuantified) suggestions.push({ type: 'warning', message: 'Add numbers and metrics to your achievements (e.g. "Increased revenue by 30%")', category: 'Impact' });

  // ── Education ──
  const hasEducation = /education|degree|university|college|bachelor|master|phd|b\.s\.|m\.s\.|b\.tech|m\.tech/i.test(text);
  const hasGPA = /gpa|cgpa|grade point/i.test(text);
  let eduScore = hasEducation ? (hasGPA ? 100 : 85) : 25;
  sections.push({ name: 'Education', score: eduScore, maxScore: 100, feedback: hasEducation ? 'Education section found' : 'Add your education details' });
  if (!hasEducation) suggestions.push({ type: 'error', message: 'Add an Education section', category: 'Content' });

  // ── Skills ──
  const hasSkills = /skills|technical skills|competencies|technologies/i.test(text);
  const skillKeywords = COMMON_KEYWORDS[jobRole] || COMMON_KEYWORDS.general;
  const foundSkills = skillKeywords.filter(k => countWord(lowerText, k) > 0);

  let skillScore = 15;
  if (hasSkills) skillScore += 35;
  skillScore += Math.min(foundSkills.length * 8, 50);
  skillScore = Math.min(skillScore, 100);

  sections.push({ name: 'Skills Section', score: skillScore, maxScore: 100, feedback: `${foundSkills.length}/${skillKeywords.length} relevant keywords found` });
  if (!hasSkills) suggestions.push({ type: 'error', message: 'Add a dedicated Skills section', category: 'Content' });
  if (foundSkills.length < 4) suggestions.push({ type: 'warning', message: `Only ${foundSkills.length} industry keywords detected — aim for 6+`, category: 'Keywords' });

  // ── Formatting & ATS-safety ──
  const hasTables = /\t{2,}/.test(text); // pipes removed — they occur in normal text
  const hasHeaders = /\n[A-Z][A-Z\s]{3,}\n/m.test(text);
  let formatScore = 100;
  if (hasTables) { formatScore -= 25; suggestions.push({ type: 'error', message: 'Avoid tables — ATS systems struggle to parse them', category: 'Formatting' }); }
  if (wordCount > 1000) { formatScore -= 15; suggestions.push({ type: 'warning', message: 'Resume may be too long — keep it under 2 pages', category: 'Formatting' }); }
  if (wordCount < 150) { formatScore -= 25; suggestions.push({ type: 'warning', message: 'Resume is too short — add more content', category: 'Formatting' }); }
  if (!hasHeaders) { formatScore -= 10; suggestions.push({ type: 'info', message: 'Use clear uppercase section headers (EXPERIENCE, EDUCATION, SKILLS)', category: 'Formatting' }); }
  formatScore = Math.max(formatScore, 20);
  sections.push({ name: 'Formatting & Length', score: formatScore, maxScore: 100, feedback: formatScore >= 80 ? 'Formatting is ATS-safe' : 'Some formatting issues detected' });

  // ── Action verbs ──
  const foundVerbs = ACTION_VERBS.filter(v => countWord(lowerText, v) > 0);
  if (foundVerbs.length < 5) {
    suggestions.push({ type: 'info', message: `Use more action verbs — found ${foundVerbs.length}, aim for 8+`, category: 'Content' });
  } else {
    suggestions.push({ type: 'success', message: `Good use of action verbs (${foundVerbs.length} found)`, category: 'Content' });
  }

  // ── Keyword results ──
  const keywords: KeywordResult[] = skillKeywords.slice(0, 12).map(word => {
    const c = countWord(lowerText, word);
    return { word, found: c > 0, count: c, importance: c > 2 ? 'high' : c > 0 ? 'medium' : 'low' };
  });

  // ── Overall score ──
  const sectionAvg = sections.reduce((s, x) => s + x.score, 0) / sections.length;
  const keywordPct = keywords.length > 0 ? (keywords.filter(k => k.found).length / keywords.length) * 100 : 50;
  const overallScore = Math.round(sectionAvg * 0.6 + keywordPct * 0.4);

  let overallFeedback: string;
  if (overallScore >= 85) overallFeedback = 'Excellent! Your resume is well-optimized for ATS systems.';
  else if (overallScore >= 70) overallFeedback = 'Good foundation. A few improvements will boost your score.';
  else if (overallScore >= 50) overallFeedback = 'Your resume needs improvements to reliably pass ATS filters.';
  else overallFeedback = 'Critical issues detected — major revisions recommended before applying.';

  // Success callouts
  if (hasEmail && hasPhone) suggestions.push({ type: 'success', message: 'Email + phone number present', category: 'Contact' });
  if (foundSkills.length >= 6) suggestions.push({ type: 'success', message: `Strong keyword coverage (${foundSkills.length} matches)`, category: 'Keywords' });

  // Sort: errors first, then warnings, info, success
  const order = { error: 0, warning: 1, info: 2, success: 3 };
  suggestions.sort((a, b) => order[a.type] - order[b.type]);

  return { score: overallScore, sections, keywords, suggestions, overallFeedback };
}

export function getJobRoleFromText(text: string): string {
  const t = text.toLowerCase();
  if (/software|developer|engineer|frontend|backend|fullstack|full.stack|coding|programming/.test(t)) return 'software';
  if (/data|analytics|machine learning|ml|ai|deep learning/.test(t)) return 'data';
  if (/marketing|seo|brand|social media|content/.test(t)) return 'marketing';
  if (/design|ui|ux|graphic|figma|sketch/.test(t)) return 'design';
  if (/finance|accounting|investment|banking|cfa/.test(t)) return 'finance';
  return 'general';
}
