import { useContext, useState } from 'react';
import { PortfolioContext } from './PortfolioProvider';
import { downloadCVAsPDF } from './utils/downloadCV';
import './styles/main.css'; // Ensure you have Tailwind CSS set up

export default function PortfolioHome() {
  const { info } = useContext(PortfolioContext);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCV = async () => {
    setIsDownloading(true);
    try {
      await downloadCVAsPDF(info);
    } catch (error) {
      alert('Failed to download CV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Tab Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 flex items-center justify-between px-8 py-4">
        <div className="text-2xl font-bold">Ruslan Alekseyev</div>
        <div className="flex gap-6 items-center">
          <a href="#home" className="base-link font-medium">Home</a>
          <a href="#contact" className="base-link font-medium">Contact</a>
          <a href="#works" className="base-link font-medium">Works</a>
          <a href="/cv" className="base-link font-medium">View CV</a>
          <button
            onClick={handleDownloadCV}
            disabled={isDownloading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-xs disabled:opacity-50"
            style={{marginTop:'2px',marginLeft:'8px',marginBottom:'2px',padding:'6px 14px',lineHeight:'1.1'}}
            title="Download CV"
          >
            {isDownloading ? 'Generating...' : 'Download CV'}
          </button>
        </div>
  <a href="/edit" className="fixed right-8 bottom-8 bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700 base-link" style={{zIndex:1000}}>Edit Portfolio</a>
      </nav>
        <style>{`
          /* Overwrite base styles for <a> */
          a {
            color: #2563eb;
            text-decoration: none;
            font-size: 1rem;
            margin: 0 0.5rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            transition: background-color 0.3s, color 0.3s;
          }
          a:hover {
            background-color: #e0e7ff;
            color: #1e40af;
          }
        `}</style>
      {/* Main Content */}
      <main className="pt-24 px-8 max-w-4xl mx-auto">
        {/* Summary & Photo */}
        <section id="home" className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <img src={info.imageUrl || "img/Ruslan.png"} alt="Profile" className="w-40 h-40 rounded-full object-cover shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold mb-2">{info.name || 'Ruslan Alekseyev'}</h1>
            <p className="text-gray-700 mb-4">Experienced Developer | Microservices | Strong Leadership | Proven Success
With over 12 years of development experience, I am a versatile
and skilled developer well-versed in both frontend and backend
technologies. I specialize in microservices architecture, delivering
scalable and efficient solutions. My leadership skills have driven
successful project outcomes, and I have a track record of exceeding
client expectations. Let's connect and achieve greatness together.</p>
            <div className="flex gap-4 text-gray-600">
              <span>San Francisco, CA</span>
              <span>English, Spanish</span>
            </div>
          </div>
        </section>

        {/* Works Section */}
        <section id="works" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Example Work Card */}
            <div className="bg-white rounded-lg shadow p-6 hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" fill="#2563eb"/><path d="M6 9l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                Project One
              </h3>
              <p className="text-gray-700 mb-2">Description of project one.</p>
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#38bdf8"/></svg>
                React, CSS
              </div>
              <div className="text-xs text-gray-400">01/01/24 - 03/01/24</div>
              <a href="https://example.com/project-one" target="_blank" rel="noopener" className="text-blue-600 text-xs mt-2 inline-block">Visit Website</a>
            </div>
            <div className="bg-white rounded-lg shadow p-6 hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" fill="#2563eb"/><path d="M6 9l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                Project Two
              </h3>
              <p className="text-gray-700 mb-2">Description of project two.</p>
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#38bdf8"/></svg>
                TypeScript, Node.js
              </div>
              <div className="text-xs text-gray-400">02/01/24 - 04/01/24</div>
              <a href="https://example.com/project-two" target="_blank" rel="noopener" className="text-blue-600 text-xs mt-2 inline-block">Visit Website</a>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Education</h2>
          <ul className="list-disc pl-5">
            <li><span className="font-bold">Stanford University</span> — B.Sc. in Computer Science (09/15 - 06/19)</li>
            <li><span className="font-bold">MIT</span> — M.Sc. in Software Engineering (09/19 - 06/21)</li>
          </ul>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Skills</h2>
          <div className="flex flex-wrap gap-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" fill="#2563eb"/><path d="M6 9l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              React
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" fill="#2563eb"/><path d="M6 9l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              TypeScript
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" fill="#2563eb"/><path d="M6 9l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              Node.js
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="3" fill="#2563eb"/><path d="M6 9l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              CSS
            </span>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Contact</h2>
          <div className="flex flex-col gap-2 text-gray-700">
            <span>Email: jane.doe@email.com</span>
            <span>LinkedIn: linkedin.com/in/janedoe</span>
          </div>
        </section>
      </main>
    </div>
  );
}
