import html2pdf from 'html2pdf.js';
import { PortfolioInfo } from '../types/portfolio';
import { formatDate } from './dateFormatter';

export async function downloadCVAsPDF(info: PortfolioInfo): Promise<void> {
  try {
    // Build a self-contained CV node with inline styles (no Tailwind)
    const cvNode = document.createElement('div');
    cvNode.style.width = '100%';
    cvNode.style.maxWidth = '650px';
    cvNode.style.padding = '6mm';
    cvNode.style.background = '#ffffff';
    cvNode.style.color = '#111827';
    cvNode.style.fontFamily = "Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
    cvNode.style.fontSize = '11pt';
    cvNode.style.lineHeight = '1.25';
    cvNode.style.boxSizing = 'border-box';
    cvNode.style.overflow = 'hidden';
    cvNode.style.wordWrap = 'break-word';
    cvNode.style.overflowWrap = 'break-word';
    cvNode.style.margin = '0 auto';

    const sectionTitle = (text: string) => `<h2 style="margin:6px 0 3px; padding-bottom:2px; border-bottom:1.5px solid #e5e7eb; font-size:13pt; font-weight:700; color:#1f2937; page-break-after:avoid;">${text}</h2>`;

    // Header with profile image
    const headerHtml = `
      <div style="display:flex; align-items:flex-start; margin-bottom:8px; page-break-after:avoid;">
        ${info.imageUrl ? `<img src="${info.imageUrl}" alt="${info.name}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; margin-right:12px; flex-shrink:0;" crossorigin="anonymous" />` : ''}
        <div style="flex:1;">
          <div style="font-size:16pt; font-weight:700; margin-bottom:2px; color:#1f2937;">${info.name || ''}</div>
          <div style="color:#4b5563; font-size:11pt; margin-bottom:2px;">${info.bio || ''}</div>
          <div style="color:#6b7280; font-size:11pt;">
            ${info.email || ''}${info.email && info.location ? ' • ' : ''}${info.location || ''}${(info.email || info.location) && info.linkedin ? ' • ' : ''}${info.linkedin || ''}
          </div>
          ${info.languages && info.languages.length > 0 ? `<div style="color:#6b7280; font-size:11pt; margin-top:2px;">Languages: ${info.languages.join(', ')}</div>` : ''}
        </div>
      </div>
    `;

    // Summary
    const summaryHtml = info.professionalSummary ? `${sectionTitle('Summary')}<div style="color:#374151; font-size:11pt; page-break-inside:avoid; overflow-wrap:break-word;">${info.professionalSummary}</div>` : '';

    // Core Competencies - Grouped by category
    let competenciesHtml = '';
    if (info.coreCompetencies && info.coreCompetencies.length) {
      // Group competencies by category
      const groupedCompetencies = info.coreCompetencies.reduce((acc, comp) => {
        if (!acc[comp.category]) {
          acc[comp.category] = [];
        }
        acc[comp.category].push(comp);
        return acc;
      }, {} as Record<string, typeof info.coreCompetencies>);

      competenciesHtml = sectionTitle('Core Competencies');
      competenciesHtml += '<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:4px;">';

      Object.entries(groupedCompetencies).forEach(([category, competencies]) => {
        if (competencies.length > 1) {
          // Add category header if multiple competencies in the same category
          competenciesHtml += `<div style="grid-column:1/-1; font-weight:700; color:#1f2937; margin-top:5px; padding-bottom:2px; border-bottom:1px solid #d1d5db; font-size:11pt; page-break-after:avoid;">${category}</div>`;
          competencies.forEach(comp => {
            competenciesHtml += `<div style="padding:4px; background:#f9fafb; border-left:2px solid #2563eb; page-break-inside:avoid;"><div style="font-size:11pt; color:#4b5563; line-height:1.3;">${comp.description}</div></div>`;
          });
        } else {
          // Single competency shows its category as title
          competenciesHtml += `<div style="padding:4px; background:#f9fafb; border-left:2px solid #2563eb; page-break-inside:avoid;"><div style="font-weight:600; color:#2563eb; margin-bottom:2px; font-size:11pt;">${competencies[0].category}</div><div style="font-size:11pt; color:#4b5563; line-height:1.3;">${competencies[0].description}</div></div>`;
        }
      });

      competenciesHtml += '</div>';
    }

    // Skills grouped by category
    const skillsByCategory = info.skills.reduce((acc, s) => {
      const category = s.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(s.name);
      return acc;
    }, {} as Record<string, string[]>);

    let skillsHtml = '';
    if (Object.keys(skillsByCategory).length > 0) {
      skillsHtml = sectionTitle('Skills');

      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        skillsHtml += `<div style="margin-bottom:5px; page-break-inside:avoid;">`;
        skillsHtml += `<div style="margin:2px 0;"><span style="font-weight:600; color:#1f2937; font-size:11pt;">${category}:</span> <span style="color:#4b5563; font-size:11pt;">${skills.join(', ')}</span></div>`;
        skillsHtml += '</div>';
      });
    }

    // Projects / Experience
    const projectsHtml = (info.projects && info.projects.length)
      ? `${sectionTitle('Professional Experience')}
          <div>
            ${info.projects.map(p => `<div style="margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid #e5e7eb; page-break-inside:avoid;"><div style="display:block; margin-bottom:3px;"><div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;"><div style="flex:1; min-width:0; overflow-wrap:break-word;"><div style="font-weight:600; color:#1f2937; font-size:11pt;">${p.name}</div>${p.website ? `<div style="font-size:11pt; color:#2563eb; word-break:break-all;">${p.website}</div>` : ''}</div><div style="font-size:11pt; color:#6b7280; font-style:italic; text-align:right; flex-shrink:0; min-width:90px;">${formatDate(p.date)}${p.endDate ? ` - ${formatDate(p.endDate)}` : ' - Present'}</div></div></div><div style="color:#374151; font-size:11pt; line-height:1.4; overflow-wrap:break-word;">${p.description}</div></div>`).join('')}
          </div>`
      : '';

    // Education
    const educationHtml = (info.education && info.education.length)
      ? `${sectionTitle('Education')}
          <div>
            ${info.education.map(e => `
              <div style="margin-bottom:7px; page-break-inside:avoid;">
                <div style="display:block; margin-bottom:3px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
                    <div style="flex:1; min-width:0; overflow-wrap:break-word;">
                      <div style="font-weight:600; color:#1f2937; font-size:12pt;">${e.name}</div>
                      <div style="color:#4b5563; font-size:11pt;">${e.degree}</div>
                    </div>
                    <div style="font-size:11pt; color:#6b7280; font-style:italic; text-align:right; flex-shrink:0; min-width:90px;">${formatDate(e.startDate)} - ${e.endDate ? formatDate(e.endDate) : 'Present'}</div>
                  </div>
                </div>
                ${e.images && e.images.length > 0 ? `
                  <div style="display:grid; grid-template-columns:${e.images.length === 1 ? '1fr' : 'repeat(2, 1fr)'}; gap:4px; margin-top:5px;">
                    ${e.images.map((img, imgIdx) => `<img src="${img}" alt="${e.name} ${imgIdx + 1}" style="width:100%; height:auto; max-height:110px; object-fit:contain; border-radius:3px; border:1px solid #e5e7eb;" crossorigin="anonymous" />`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>`
      : '';

    // Additional Details
    const addDetailsHtml = (info.additionalDetails && info.additionalDetails.length)
      ? `${sectionTitle('Additional Information')}
          <div>
            ${info.additionalDetails.map(d => `
              <div style="margin-bottom:6px; padding-left:8px; border-left:2px solid #e5e7eb; page-break-inside:avoid; overflow-wrap:break-word;">
                <div style="font-weight:600; color:#1f2937; margin-bottom:2px; font-size:11pt;">${d.category}</div>
                <div style="font-size:11pt; color:#4b5563; margin-bottom:3px; line-height:1.4; overflow-wrap:break-word;">${d.description}</div>
                ${d.image ? `<img src="${d.image}" alt="${d.category}" style="width:auto; max-width:220px; height:auto; max-height:130px; margin-top:4px; border-radius:3px; border:1px solid #e5e7eb; object-fit:contain;" crossorigin="anonymous" />` : ''}
              </div>
            `).join('')}
          </div>`
      : '';

    // Certificates
    const certificatesHtml = (info.certificates && info.certificates.length)
      ? `${sectionTitle('Certificates')}
          <div>
            ${info.certificates.map(c => `
              <div style="margin-bottom:7px; padding-left:8px; border-left:2px solid #2563eb; page-break-inside:avoid; overflow-wrap:break-word;">
                <div style="font-weight:600; color:#1f2937; margin-bottom:2px; font-size:11pt;">${c.name}</div>
                <div style="font-size:11pt; color:#4b5563;">${c.issuer} - ${c.date}</div>
                <div style="font-size:11pt; color:#2563eb; margin-bottom:3px; word-break:break-all;">${c.url}</div>
                ${c.images && c.images.length > 0 ? `
                  <div style="display:grid; grid-template-columns:${c.images.length === 1 ? '1fr' : 'repeat(2, 1fr)'}; gap:4px; margin-top:5px;">
                    ${c.images.map((img, imgIdx) => `<img src="${img}" alt="${c.name} ${imgIdx + 1}" style="width:100%; height:auto; max-height:110px; object-fit:contain; border-radius:3px; border:1px solid #e5e7eb;" crossorigin="anonymous" />`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>`
      : '';

    // Events
    const eventsHtml = (info.events && info.events.length)
      ? `${sectionTitle('Events')}
          <div>
            ${info.events.map(e => `<div style="margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid #e5e7eb; page-break-inside:avoid;"><div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3px; gap:6px;"><div style="font-weight:600; color:#1f2937; font-size:11pt; flex:1; min-width:0; overflow-wrap:break-word;">${e.title}</div><div style="font-size:11pt; color:#6b7280; font-style:italic; text-align:right; flex-shrink:0; min-width:70px;">${e.date}</div></div><div style="color:#374151; font-size:11pt; line-height:1.4; overflow-wrap:break-word;">${e.description}</div></div>`).join('')}
          </div>`
      : '';

    // AI Experience
    const aiHtml = (info.aiExperience && (info.aiExperience.description || info.aiExperience.currentInvestigation || info.aiExperience.achievements?.length || info.aiExperience.projects?.length))
      ? `${sectionTitle('AI Experience')}
          <div>
            ${info.aiExperience.description ? `<div style="margin-bottom:5px; page-break-inside:avoid; overflow-wrap:break-word;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px; font-size:11pt;">Overview</div><div style="font-size:11pt; color:#4b5563; line-height:1.4; overflow-wrap:break-word;">${info.aiExperience.description}</div></div>` : ''}
            ${info.aiExperience.currentInvestigation ? `<div style="margin-bottom:5px; page-break-inside:avoid; overflow-wrap:break-word;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px; font-size:11pt;">Current Investigation</div><div style="font-size:11pt; color:#4b5563; line-height:1.4; overflow-wrap:break-word;">${info.aiExperience.currentInvestigation}</div></div>` : ''}
            ${info.aiExperience.projects?.length ? `<div style="margin-bottom:6px;"><div style="font-weight:600; color:#6366f1; margin-bottom:3px; font-size:11pt; page-break-after:avoid;">AI Projects</div>${info.aiExperience.projects.map(p => `<div style="margin-bottom:5px; padding:4px; background:#f9fafb; border-left:2px solid #6366f1; page-break-inside:avoid; overflow-wrap:break-word;"><div style="font-weight:600; color:#1f2937; margin-bottom:2px; font-size:11pt;">${p.title}</div><div style="font-size:11pt; color:#4b5563; margin-bottom:2px; line-height:1.4; overflow-wrap:break-word;">${p.description}</div>${p.technologies?.length ? `<div style="font-size:11pt; color:#6b7280; overflow-wrap:break-word;"><span style="font-weight:600;">Technologies:</span> ${p.technologies.join(', ')}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${info.aiExperience.achievements?.length ? `<div style="page-break-inside:avoid;"><div style="font-weight:600; color:#1f2937; margin-bottom:3px; font-size:11pt;">Key Achievements</div><ul style="margin:0; padding-left:16px;">${info.aiExperience.achievements.map(a => `<li style="font-size:11pt; color:#4b5563; margin-bottom:2px; line-height:1.4; overflow-wrap:break-word;">${a}</li>`).join('')}</ul></div>` : ''}
          </div>`
      : '';

    cvNode.innerHTML = headerHtml + summaryHtml + competenciesHtml + skillsHtml + projectsHtml + educationHtml + addDetailsHtml + certificatesHtml + eventsHtml + aiHtml;

    // Validate content is not empty
    if (!cvNode.innerHTML || cvNode.innerHTML.trim().length === 0) {
      throw new Error('Generated CV content is empty');
    }

    // Use html2pdf.js for proper page break handling
    const opt = {
      margin: [6, 6, 6, 6] as [number, number, number, number],
      filename: `${info.name.replace(/\s+/g, '_')}_CV.pdf`,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true,
        backgroundColor: '#ffffff'
      },
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
