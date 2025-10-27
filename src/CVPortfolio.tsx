import { useContext, useState } from 'react';
import { PortfolioContext } from './PortfolioProvider';
import { jsPDF } from 'jspdf';
import './styles/cv.css';

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

export default function CVPortfolio() {
  const { info } = useContext(PortfolioContext);
  const [isDownloading, setIsDownloading] = useState(false);

  // Download CV as PDF
  const downloadCV = async () => {
    setIsDownloading(true);
    try {
      const cvElement = document.querySelector('.cv-page') as HTMLElement;
      if (!cvElement) {
        alert('CV content not found');
        return;
      }

      // Hide the navigation footer before capturing
      const navFooter = document.querySelector('.cv-nav-footer') as HTMLElement;
      const originalDisplay = navFooter ? navFooter.style.display : '';
      if (navFooter) navFooter.style.display = 'none';

      // Create PDF
      const pdf = new jsPDF('p', 'pt', 'a4');

      await new Promise<void>((resolve) => {
        (pdf as any).html(cvElement, {
          x: 0,
          y: 0,
          html2canvas: {
            scale: Math.min(2, window.devicePixelRatio || 1.5),
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            foreignObjectRendering: false,
            windowWidth: 850,
            scrollX: 0,
            scrollY: -window.scrollY,
          },
          callback: () => resolve(),
        });
      });

      // Restore navigation footer
      if (navFooter) navFooter.style.display = originalDisplay;

      pdf.save(`${info.name.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (e) {
      console.error('PDF generation error', e);
      alert('Failed to generate PDF. Please try using the Print function instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Group skills by category
  const skillsByCategory = info.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof info.skills>);

  return (
    <div className="cv-container">
      <div className="cv-page">
        {/* Header Section */}
        <header className="cv-header">
          <div className="cv-header-content">
            <div className="cv-profile-section">
              {info.imageUrl && (
                <img
                  src={info.imageUrl}
                  alt={info.name}
                  className="cv-profile-image"
                />
              )}
              <div className="cv-header-text">
                <h1 className="cv-name">{info.name}</h1>
                <p className="cv-bio">{info.bio}</p>
              </div>
            </div>

            <div className="cv-contact-info">
              {info.email && (
                <div className="cv-contact-item">
                  <svg className="cv-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{info.email}</span>
                </div>
              )}
              {info.linkedin && (
                <div className="cv-contact-item">
                  <svg className="cv-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                  <span>{info.linkedin}</span>
                </div>
              )}
              {info.location && (
                <div className="cv-contact-item">
                  <svg className="cv-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{info.location}</span>
                </div>
              )}
              {info.languages && info.languages.length > 0 && (
                <div className="cv-contact-item">
                  <svg className="cv-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                  <span>{info.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Professional Summary */}
        {info.professionalSummary && (
          <section className="cv-section">
            <h2 className="cv-section-title">Professional Summary</h2>
            <p className="cv-summary">{info.professionalSummary}</p>
          </section>
        )}

        {/* Core Competencies */}
        {info.coreCompetencies && info.coreCompetencies.length > 0 && (
          <section className="cv-section">
            <h2 className="cv-section-title">Core Competencies</h2>
            <div className="cv-competencies-grid">
              {info.coreCompetencies.map((comp, idx) => (
                <div key={idx} className="cv-competency-item">
                  <h3 className="cv-competency-title">{comp.category}</h3>
                  <p className="cv-competency-desc">{comp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {info.skills && info.skills.length > 0 && (
          <section className="cv-section">
            <h2 className="cv-section-title">Technical Skills</h2>
            <div className="cv-skills-container">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="cv-skill-category">
                  <h3 className="cv-skill-category-name">{category}</h3>
                  <div className="cv-skills-list">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="cv-skill-badge">
                        {skill.name}
                        {skill.proficiency && (
                          <span className="cv-skill-proficiency"> - {skill.proficiency}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Experience / Projects */}
        {info.projects && info.projects.length > 0 && (
          <section className="cv-section">
            <h2 className="cv-section-title">Professional Experience</h2>
            {info.projects.map((project, idx) => (
              <div key={idx} className="cv-experience-item">
                <div className="cv-experience-header">
                  <div>
                    <h3 className="cv-experience-title">{project.name}</h3>
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-experience-link"
                      >
                        {project.website}
                      </a>
                    )}
                  </div>
                  <span className="cv-experience-date">
                    {formatDate(project.date)}
                    {project.endDate && ` - ${formatDate(project.endDate)}`}
                    {!project.endDate && ' - Present'}
                  </span>
                </div>
                <p className="cv-experience-description">{project.description}</p>
                {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                  <div className="cv-technologies">
                    <span className="cv-tech-label">Technologies:</span>
                    <span className="cv-tech-list">{project.technologiesUsed.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {info.education && info.education.length > 0 && (
          <section className="cv-section">
            <h2 className="cv-section-title">Education</h2>
            {info.education.map((edu, idx) => (
              <div key={idx} className="cv-education-item">
                <div className="cv-education-header">
                  <div>
                    <h3 className="cv-education-title">{edu.name}</h3>
                    <p className="cv-education-degree">{edu.degree}</p>
                  </div>
                  <span className="cv-education-date">
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Additional Details */}
        {info.additionalDetails && info.additionalDetails.length > 0 && (
          <section className="cv-section">
            <h2 className="cv-section-title">Additional Information</h2>
            <div className="cv-additional-details">
              {info.additionalDetails.map((detail, idx) => (
                <div key={idx} className="cv-additional-item">
                  <h3 className="cv-additional-title">{detail.category}</h3>
                  <p className="cv-additional-desc">{detail.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Resume Link */}
        {info.resumeUrl && (
          <section className="cv-section">
            <a
              href={info.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-resume-link"
            >
              View Full Resume PDF
            </a>
          </section>
        )}

        {/* Navigation Footer */}
        <div className="cv-nav-footer">
          <a href="/" className="cv-nav-button">Back to Portfolio</a>
          <a href="/edit" className="cv-nav-button">Edit Portfolio</a>
          <button
            onClick={downloadCV}
            className="cv-nav-button cv-print-button"
            disabled={isDownloading}
          >
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button onClick={() => window.print()} className="cv-nav-button">
            Print CV
          </button>
        </div>
      </div>
    </div>
  );
}
