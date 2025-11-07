import html2pdf from 'html2pdf.js';
import { PortfolioInfo } from '../types/portfolio';
import { formatDate } from './dateFormatter';

export async function downloadCVAsPDF(info: PortfolioInfo): Promise<void> {
  try {
    // Build a self-contained CV node with inline styles (no Tailwind)
    const cvNode = document.createElement('div');
    cvNode.style.width = '210mm'; // A4 width
    cvNode.style.padding = '15mm';
    cvNode.style.background = '#ffffff';
    cvNode.style.color = '#111827';
    cvNode.style.fontFamily = "Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
    cvNode.style.fontSize = '11pt';
    cvNode.style.lineHeight = '1.5';
    cvNode.style.boxSizing = 'border-box';

    const sectionTitle = (text: string) => `<h2 style="margin:16px 0 8px; padding-bottom:6px; border-bottom:2px solid #e5e7eb; font-size:14pt; font-weight:700; color:#1f2937; page-break-after:avoid;">${text}</h2>`;

    // Header (skip image to avoid CORS issues)
    const headerHtml = `
      <div style="margin-bottom:16px; page-break-after:avoid;">
        <div style="font-size:22pt; font-weight:700; margin-bottom:6px; color:#1f2937;">${info.name || ''}</div>
        <div style="color:#4b5563; font-size:11pt; margin-bottom:4px;">${info.bio || ''}</div>
        <div style="color:#6b7280; font-size:10pt;">
          ${info.email || ''}${info.email && info.location ? ' • ' : ''}${info.location || ''}${(info.email || info.location) && info.linkedin ? ' • ' : ''}${info.linkedin || ''}
        </div>
        ${info.languages && info.languages.length > 0 ? `<div style="color:#6b7280; font-size:10pt; margin-top:4px;">Languages: ${info.languages.join(', ')}</div>` : ''}
      </div>
    `;

    // Summary
    const summaryHtml = info.professionalSummary ? `${sectionTitle('Summary')}<div style="color:#374151; page-break-inside:avoid;">${info.professionalSummary}</div>` : '';

    // Core Competencies
    const competenciesHtml = (info.coreCompetencies && info.coreCompetencies.length)
      ? `${sectionTitle('Core Competencies')}
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px;">
            ${info.coreCompetencies.map(c => `<div style="padding:8px; background:#f9fafb; border-left:3px solid #2563eb; page-break-inside:avoid;"><div style="font-weight:600; color:#2563eb; margin-bottom:4px;">${c.category}</div><div style="font-size:10pt; color:#4b5563;">${c.description}</div></div>`).join('')}
          </div>`
      : '';

    // Skills grouped by proficiency level
    const skillsByProficiency = info.skills.reduce((acc, s) => {
      const proficiency = s.proficiency || 'Other';
      if (!acc[proficiency]) acc[proficiency] = {} as Record<string, string[]>;
      if (!acc[proficiency][s.category]) acc[proficiency][s.category] = [];
      acc[proficiency][s.category].push(s.name);
      return acc;
    }, {} as Record<string, Record<string, string[]>>);

    const proficiencyOrder = ['Expert', 'Expert Level', 'Advanced'];
    const proficiencyColors: Record<string, string> = {
      'Expert': '#2563eb',
      'Expert Level': '#2563eb',
      'Advanced': '#10b981',
    };

    let skillsHtml = '';
    if (Object.keys(skillsByProficiency).length > 0) {
      skillsHtml = sectionTitle('Technical Skills');

      proficiencyOrder.forEach(profLevel => {
        if (skillsByProficiency[profLevel]) {
          const color = proficiencyColors[profLevel] || '#1f2937';
          skillsHtml += `<div style="margin-bottom:12px; page-break-inside:avoid;"><h3 style="font-size:12pt; font-weight:600; color:${color}; margin-bottom:6px; page-break-after:avoid;">${profLevel}</h3>`;

          Object.entries(skillsByProficiency[profLevel]).forEach(([category, skills]) => {
            skillsHtml += `<div style="margin:4px 0;"><span style="font-weight:600; color:#1f2937; font-size:10pt;">${category}:</span> <span style="color:#4b5563; font-size:10pt;">${skills.join(', ')}</span></div>`;
          });

          skillsHtml += '</div>';
        }
      });

      // Add any other proficiency levels not in the order
      Object.keys(skillsByProficiency).forEach(profLevel => {
        if (!proficiencyOrder.includes(profLevel)) {
          skillsHtml += `<div style="margin-bottom:12px; page-break-inside:avoid;"><h3 style="font-size:12pt; font-weight:600; color:#6b7280; margin-bottom:6px; page-break-after:avoid;">${profLevel}</h3>`;

          Object.entries(skillsByProficiency[profLevel]).forEach(([category, skills]) => {
            skillsHtml += `<div style="margin:4px 0;"><span style="font-weight:600; color:#1f2937; font-size:10pt;">${category}:</span> <span style="color:#4b5563; font-size:10pt;">${skills.join(', ')}</span></div>`;
          });

          skillsHtml += '</div>';
        }
      });
    }

    // Projects / Experience
    const projectsHtml = (info.projects && info.projects.length)
      ? `${sectionTitle('Professional Experience')}
          <div>
            ${info.projects.map(p => `<div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #e5e7eb; page-break-inside:avoid;"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><div><div style="font-weight:600; color:#1f2937; font-size:11pt;">${p.name}</div>${p.website ? `<div style="font-size:9pt; color:#2563eb;">${p.website}</div>` : ''}</div><div style="font-size:9pt; color:#6b7280; white-space:nowrap; font-style:italic;">${formatDate(p.date)}${p.endDate ? ` - ${formatDate(p.endDate)}` : ' - Present'}</div></div><div style="color:#374151; font-size:10pt; margin-bottom:4px;">${p.description}</div>${p.technologiesUsed?.length ? `<div style="font-size:9pt; color:#6b7280;"><span style="font-weight:600;">Technologies:</span> ${p.technologiesUsed.join(', ')}</div>` : ''}</div>`).join('')}
          </div>`
      : '';

    // Education
    const educationHtml = (info.education && info.education.length)
      ? `${sectionTitle('Education')}
          <div>
            ${info.education.map(e => `<div style="display:flex; justify-content:space-between; margin-bottom:6px; page-break-inside:avoid;"><div><div style="font-weight:600; color:#1f2937;">${e.name}</div><div style="color:#4b5563; font-size:10pt;">${e.degree}</div></div><div style="font-size:9pt; color:#6b7280; white-space:nowrap; font-style:italic;">${formatDate(e.startDate)} - ${e.endDate ? formatDate(e.endDate) : 'Present'}</div></div>`).join('')}
          </div>`
      : '';

    // Additional Details
    const addDetailsHtml = (info.additionalDetails && info.additionalDetails.length)
      ? `${sectionTitle('Additional Information')}
          <div>
            ${info.additionalDetails.map(d => `<div style="margin-bottom:6px; padding-left:12px; border-left:2px solid #e5e7eb; page-break-inside:avoid;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px;">${d.category}</div><div style="font-size:10pt; color:#4b5563;">${d.description}</div></div>`).join('')}
          </div>`
      : '';

    // Certificates
    const certificatesHtml = (info.certificates && info.certificates.length)
      ? `${sectionTitle('Certificates')}
          <div>
            ${info.certificates.map(c => `<div style="margin-bottom:6px; padding-left:12px; border-left:2px solid #2563eb; page-break-inside:avoid;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px;">${c.name}</div><div style="font-size:10pt; color:#4b5563;">${c.issuer} - ${c.date}</div><div style="font-size:9pt; color:#2563eb;">${c.url}</div></div>`).join('')}
          </div>`
      : '';

    // Events
    const eventsHtml = (info.events && info.events.length)
      ? `${sectionTitle('Events')}
          <div>
            ${info.events.map(e => `<div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #e5e7eb; page-break-inside:avoid;"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><div style="font-weight:600; color:#1f2937; font-size:11pt;">${e.title}</div><div style="font-size:9pt; color:#6b7280; white-space:nowrap; font-style:italic;">${e.date}</div></div><div style="color:#374151; font-size:10pt;">${e.description}</div></div>`).join('')}
          </div>`
      : '';

    // AI Experience
    const aiHtml = (info.aiExperience && (info.aiExperience.description || info.aiExperience.currentInvestigation || info.aiExperience.achievements?.length || info.aiExperience.projects?.length))
      ? `${sectionTitle('AI Experience')}
          <div>
            ${info.aiExperience.description ? `<div style="margin-bottom:6px; page-break-inside:avoid;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px;">Overview</div><div style="font-size:10pt; color:#4b5563;">${info.aiExperience.description}</div></div>` : ''}
            ${info.aiExperience.currentInvestigation ? `<div style="margin-bottom:6px; page-break-inside:avoid;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px;">Current Investigation</div><div style="font-size:10pt; color:#4b5563;">${info.aiExperience.currentInvestigation}</div></div>` : ''}
            ${info.aiExperience.projects?.length ? `<div style="margin-bottom:10px;"><div style="font-weight:600; color:#6366f1; margin-bottom:6px; font-size:11pt; page-break-after:avoid;">AI Projects</div>${info.aiExperience.projects.map(p => `<div style="margin-bottom:8px; padding:8px; background:#f9fafb; border-left:3px solid #6366f1; page-break-inside:avoid;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px;">${p.title}</div><div style="font-size:10pt; color:#4b5563; margin-bottom:2px;">${p.description}</div>${p.technologies?.length ? `<div style="font-size:9pt; color:#6b7280;"><span style="font-weight:600;">Technologies:</span> ${p.technologies.join(', ')}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${info.aiExperience.achievements?.length ? `<div style="page-break-inside:avoid;"><div style="font-weight:600; color:#1f2937; margin-bottom:4px;">Key Achievements</div><ul style="margin:0; padding-left:20px;">${info.aiExperience.achievements.map(a => `<li style="font-size:10pt; color:#4b5563; margin-bottom:2px;">${a}</li>`).join('')}</ul></div>` : ''}
          </div>`
      : '';

    cvNode.innerHTML = headerHtml + summaryHtml + competenciesHtml + skillsHtml + projectsHtml + educationHtml + addDetailsHtml + certificatesHtml + eventsHtml + aiHtml;

    // Validate content is not empty
    if (!cvNode.innerHTML || cvNode.innerHTML.trim().length === 0) {
      throw new Error('Generated CV content is empty');
    }

    // Use html2pdf.js for proper page break handling
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `${info.name.replace(/\s+/g, '_')}_CV.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().set(opt).from(cvNode).save();

    console.log('PDF generated successfully');
  } catch (e) {
    console.error('PDF generation error:', e);
    throw new Error(`Failed to generate PDF: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}
