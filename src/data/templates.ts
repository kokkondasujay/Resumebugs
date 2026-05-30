export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  popular: boolean;
}

export const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic Harvard',
    category: 'Traditional',
    description: 'Single-column, conservative layout. Used by Ivy League career centers.',
    popular: true,
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    category: 'Modern',
    description: 'Two-column with sidebar. Strong for tech and design roles.',
    popular: true,
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    category: 'Minimal',
    description: 'Maximum whitespace, ultra-clean typography. ATS-perfect.',
    popular: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'Traditional',
    description: 'Bold headers, formal structure. Best for senior roles.',
    popular: false,
  },
  {
    id: 'creative',
    name: 'Creative Edge',
    category: 'Creative',
    description: 'Subtle accents with ATS-safe structure. Great for design roles.',
    popular: false,
  },
  {
    id: 'chronological',
    name: 'Chronological',
    category: 'Traditional',
    description: 'Experience-first layout. Ideal for career progression stories.',
    popular: true,
  },
];
