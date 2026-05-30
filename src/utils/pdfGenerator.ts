import jsPDF from 'jspdf';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    website: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: string[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'chronological';

/**
 * Reliably downloads a jsPDF document as a file.
 * Uses Blob + anchor click which works everywhere including
 * single-file (inlined) builds where doc.save() may fail.
 */
export function downloadPDF(doc: jsPDF, filename: string) {
  // Always use the blob approach – it works in all modern browsers
  // and avoids the data-URI size limits that doc.save() can hit
  // inside single-file / sandboxed environments.
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.pdf') ? filename : filename + '.pdf';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);

  // Use a small timeout so the browser registers the element
  setTimeout(() => {
    anchor.click();
    // Clean up after a delay so the download can start
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 250);
  }, 0);
}

/**
 * Builds a resume and immediately triggers a download.
 * Single entry-point the UI components should call.
 */
export function buildAndDownload(data: ResumeData, templateId: TemplateId = 'classic') {
  const doc = generateResumePDF(data, templateId);
  const safeName = (data.personalInfo.fullName || 'Resume').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
  downloadPDF(doc, `${safeName}_Resume.pdf`);
}

export function generateResumePDF(data: ResumeData, templateId: TemplateId = 'classic'): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Template-specific styles
  const tplStyles: Record<TemplateId, { headerSize: number; headerColor: [number, number, number]; accentColor: [number, number, number]; useCaps: boolean }> = {
    classic:        { headerSize: 22, headerColor: [15, 23, 42],  accentColor: [15, 23, 42],  useCaps: true  },
    modern:         { headerSize: 24, headerColor: [0, 56, 161],  accentColor: [0, 56, 161],  useCaps: false },
    minimal:        { headerSize: 20, headerColor: [10, 10, 10],  accentColor: [10, 10, 10],  useCaps: false },
    executive:      { headerSize: 26, headerColor: [30, 30, 30],  accentColor: [30, 30, 30],  useCaps: true  },
    creative:       { headerSize: 24, headerColor: [220, 38, 38], accentColor: [0, 56, 161],  useCaps: false },
    chronological:  { headerSize: 22, headerColor: [15, 23, 42],  accentColor: [15, 23, 42],  useCaps: true  },
  };
  const style = tplStyles[templateId];

  // ---------- helpers ----------

  const addText = (text: string | string[], x: number, yPos: number) => {
    doc.text(text, x, yPos);
  };

  const addLine = (yPos: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };

  const sectionHeader = (text: string, yPos: number): number => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
    const headerText = style.useCaps ? text.toUpperCase() : text;
    doc.text(headerText, margin, yPos);
    if (templateId !== 'minimal') {
      doc.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3);
    }
    return yPos + 8;
  };

  const checkPage = () => {
    if (y > 270) { doc.addPage(); y = 20; }
  };

  // ---------- Header ----------

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(style.headerSize);
  doc.setTextColor(style.headerColor[0], style.headerColor[1], style.headerColor[2]);
  const nameText = style.useCaps
    ? (data.personalInfo.fullName || '').toUpperCase()
    : (data.personalInfo.fullName || '');
  addText(nameText, margin, y);
  y += 8;

  // Contact info line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const contactParts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ].filter(Boolean);
  if (data.personalInfo.linkedIn) contactParts.push(data.personalInfo.linkedIn);
  if (data.personalInfo.website) contactParts.push(data.personalInfo.website);

  if (contactParts.length) {
    addText(contactParts.join(' | '), margin, y);
  }
  y += 6;
  addLine(y);
  y += 10;

  // ---------- Summary ----------

  if (data.summary) {
    y = sectionHeader('Professional Summary', y) - 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth - margin * 2);
    addText(summaryLines, margin, y);
    y += summaryLines.length * 4.5 + 8;
  }

  // ---------- Experience ----------

  if (data.experience.length > 0) {
    y = sectionHeader('Professional Experience', y);

    data.experience.forEach((exp) => {
      checkPage();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(style.headerColor[0], style.headerColor[1], style.headerColor[2]);
      addText(exp.title || '', margin, y);

      const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const dateWidth = doc.getTextWidth(dateText);
      addText(dateText, pageWidth - margin - dateWidth, y);
      y += 5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      addText(`${exp.company}${exp.location ? ' | ' + exp.location : ''}`, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      exp.bullets.filter(Boolean).forEach((bullet) => {
        checkPage();
        const bulletLines = doc.splitTextToSize(`• ${bullet}`, pageWidth - margin * 2 - 5);
        addText(bulletLines, margin + 5, y);
        y += bulletLines.length * 4.5 + 1;
      });
      y += 4;
    });
    y += 4;
  }

  // ---------- Education ----------

  if (data.education.length > 0) {
    checkPage();
    y = sectionHeader('Education', y);

    data.education.forEach((edu) => {
      checkPage();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(style.headerColor[0], style.headerColor[1], style.headerColor[2]);
      addText(edu.degree || '', margin, y);

      if (edu.graduationDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const gradWidth = doc.getTextWidth(edu.graduationDate);
        addText(edu.graduationDate, pageWidth - margin - gradWidth, y);
      }
      y += 5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      addText(`${edu.school}${edu.location ? ' | ' + edu.location : ''}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}`, margin, y);
      y += 7;
    });
    y += 4;
  }

  // ---------- Skills ----------

  if (data.skills.length > 0) {
    checkPage();
    y = sectionHeader('Skills', y) - 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const skillsText = data.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, pageWidth - margin * 2);
    addText(skillsLines, margin, y);
    y += skillsLines.length * 4.5 + 8;
  }

  // ---------- Projects ----------

  if (data.projects.length > 0) {
    checkPage();
    y = sectionHeader('Projects', y);

    data.projects.forEach((proj) => {
      checkPage();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(style.headerColor[0], style.headerColor[1], style.headerColor[2]);
      addText(proj.name || '', margin, y);
      y += 5;

      if (proj.technologies) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        addText(`Technologies: ${proj.technologies}`, margin, y);
        y += 5;
      }

      if (proj.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const descLines = doc.splitTextToSize(proj.description, pageWidth - margin * 2);
        addText(descLines, margin, y);
        y += descLines.length * 4.5 + 4;
      }
    });
    y += 4;
  }

  // ---------- Certifications ----------

  if (data.certifications.length > 0) {
    checkPage();
    y = sectionHeader('Certifications', y) - 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    data.certifications.forEach((cert) => {
      addText(`• ${cert}`, margin, y);
      y += 5;
    });
  }

  return doc;
}
