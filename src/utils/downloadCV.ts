import { jsPDF } from 'jspdf';
import { PortfolioInfo } from '../App';

// Helper to format date as dd/mm/yy
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export async function downloadCVAsPDF(info: PortfolioInfo): Promise<void> {
  try {
    // Build a self-contained CV node with inline styles (no Tailwind)
    const cvNode = document.createElement('div');
    cvNode.style.width = '800px';
    cvNode.style.padding = '28px';
    cvNode.style.background = '#ffffff';
    cvNode.style.color = '#111827';
    cvNode.style.fontFamily = "Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
    cvNode.style.fontSize = '12pt';
    cvNode.style.lineHeight = '1.4';
    // Place inside viewport and nearly invisible to ensure browsers paint it
    cvNode.style.position = 'fixed';
    cvNode.style.left = '0';
    cvNode.style.top = '0';
    cvNode.style.opacity = '0.01';
    cvNode.style.pointerEvents = 'none';
    cvNode.style.zIndex = '9999';

    const sectionTitle = (text: string) => `<h2 style="margin:16px 0 6px; padding-bottom:4px; border-bottom:1px solid #e5e7eb; font-size:14pt; color:#1f2937;">${text}</h2>`;

    // Header (preload image to avoid taint/blank)
    let profileImgHtml = '';
    if (info.imageUrl) {
      try {
        const loadedOk = await new Promise<boolean>((resolve) => {
          const testImg = new Image();
          testImg.crossOrigin = 'anonymous';
          testImg.onload = () => resolve(true);
          testImg.onerror = () => resolve(false);
          testImg.src = info.imageUrl;
        });
        if (loadedOk) {
          profileImgHtml = `<img src="${info.imageUrl}" alt="Profile" crossOrigin="anonymous" style="width:64px; height:64px; border-radius:9999px; object-fit:cover; border:1px solid #e5e7eb;" />`;
        }
      } catch {}
    }
    const headerHtml = `
      <div style="display:flex; gap:16px; align-items:center; margin-bottom:8px;">${profileImgHtml}
        <div>
          <div style="font-size:22pt; font-weight:700; margin-bottom:2px;">${info.name || ''}</div>
          <div style="color:#374151;">${info.location || ''}</div>
          <div style="color:#374151;">${info.email || ''}${info.linkedin ? ` • ${info.linkedin}` : ''}</div>
        </div>
      </div>
      ${info.bio ? `<div style="margin:6px 0 10px; color:#374151;">${info.bio}</div>` : ''}
    `;

    // Summary
    const summaryHtml = info.professionalSummary ? `${sectionTitle('Summary')}<div style="color:#374151;">${info.professionalSummary}</div>` : '';

    // Core Competencies
    const competenciesHtml = (info.coreCompetencies && info.coreCompetencies.length)
      ? `${sectionTitle('Core Competencies')}
          <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px;">
            ${info.coreCompetencies.map(c => `<div style="padding:8px; background:#f9fafb; border-left:3px solid #2563eb;"><div style="font-weight:600; color:#2563eb; margin-bottom:4px;">${c.category}</div><div style="font-size:10pt; color:#4b5563;">${c.description}</div></div>`).join('')}
          </div>`
      : '';

    // Skills (condensed)
    const skillsByCat = info.skills.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [] as string[];
      acc[s.category].push(`${s.name}${s.proficiency ? ` (${s.proficiency})` : ''}`);
      return acc;
    }, {} as Record<string, string[]>);
    const skillsHtml = Object.keys(skillsByCat).length
      ? `${sectionTitle('Technical Skills')}
        <div>
          ${Object.entries(skillsByCat).map(([cat, arr]) => `<div style="margin:2px 0;"><span style="font-weight:600; color:#1f2937;">${cat}:</span> <span style="color:#374151;">${arr.join(', ')}</span></div>`).join('')}
        </div>`
      : '';

    // Projects / Experience
    const projectsHtml = (info.projects && info.projects.length)
      ? `${sectionTitle('Professional Experience')}
          <div>
            ${info.projects.map(p => `<div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #e5e7eb;"><div style="display:flex; justify-content:space-between; margin-bottom:6px;"><div><div style="font-weight:600; color:#1f2937; font-size:11pt;">${p.name}</div>${p.website ? `<div style="font-size:9pt; color:#2563eb;">${p.website}</div>` : ''}</div><div style="font-size:9pt; color:#6b7280; white-space:nowrap; font-style:italic;">${formatDate(p.date)}${p.endDate ? ` - ${formatDate(p.endDate)}` : ' - Present'}</div></div><div style="color:#374151; font-size:10pt; margin-bottom:6px;">${p.description}</div>${p.technologiesUsed?.length ? `<div style="font-size:9pt; color:#6b7280;"><span style="font-weight:600;">Technologies:</span> ${p.technologiesUsed.join(', ')}</div>` : ''}</div>`).join('')}
          </div>`
      : '';

    // Education
    const educationHtml = (info.education && info.education.length)
      ? `${sectionTitle('Education')}
          <div>
            ${info.education.map(e => `<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><div><div style="font-weight:600; color:#1f2937;">${e.name}</div><div style="color:#4b5563; font-size:10pt;">${e.degree}</div></div><div style="font-size:9pt; color:#6b7280; white-space:nowrap; font-style:italic;">${formatDate(e.startDate)} - ${e.endDate ? formatDate(e.endDate) : 'Present'}</div></div>`).join('')}
          </div>`
      : '';

    // Additional Details
    const addDetailsHtml = (info.additionalDetails && info.additionalDetails.length)
      ? `${sectionTitle('Additional Information')}
          <div>
            ${info.additionalDetails.map(d => `<div style="margin-bottom:8px; padding-left:12px; border-left:2px solid #e5e7eb;"><div style="font-weight:600; color:#1f2937; margin-bottom:4px;">${d.category}</div><div style="font-size:10pt; color:#4b5563;">${d.description}</div></div>`).join('')}
          </div>`
      : '';

    cvNode.innerHTML = headerHtml + summaryHtml + competenciesHtml + skillsHtml + projectsHtml + educationHtml + addDetailsHtml;
    document.body.appendChild(cvNode);

    // Ensure layout is flushed before capture
    await new Promise(requestAnimationFrame);
    await (document as any).fonts?.ready?.catch?.(() => {});

    // Use jsPDF's HTML renderer directly
    const pdf = new jsPDF('p', 'pt', 'a4');
    await new Promise<void>((resolve) => {
      (pdf as any).html(cvNode, {
        x: 0,
        y: 0,
        html2canvas: {
          scale: Math.min(2, window.devicePixelRatio || 1.5),
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          foreignObjectRendering: false,
          windowWidth: 800,
          scrollX: 0,
          scrollY: 0,
        },
        callback: () => {
          document.body.removeChild(cvNode);
          resolve();
        },
      });
    });

    pdf.save(`${info.name.replace(/\s+/g, '_')}_CV.pdf`);
  } catch (e) {
    console.error('PDF generation error', e);
    throw new Error('Failed to generate PDF');
  }
}
