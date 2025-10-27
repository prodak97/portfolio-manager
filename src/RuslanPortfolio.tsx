import { useContext, useState } from 'react';
import { FaNodeJs, FaReact, FaDocker, FaAws, FaAngular } from 'react-icons/fa';
import { SiMongodb,SiJavascript,SiNestjs,SiPostgresql,SiNextdotjs} from 'react-icons/si';



interface WebsitePreviewProps {
  name: string;
  description: string;
  imageUrl?: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ name, description, imageUrl }) => {
  return (
    <div className="relative group">
      {/* Browser Window Mockup */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Browser Header */}
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex-1 text-center text-sm text-gray-500 font-medium">{name}</div>
        </div>
        {/* Browser Content */}
        <div className="relative aspect-video w-full bg-gray-50">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center p-4">
                <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Overlay with description */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <p className="text-white text-sm px-4 text-center">{description}</p>
      </div>
    </div>
  );
};
import { LiaCubesSolid, LiaInfinitySolid} from 'react-icons/lia';
import { PortfolioContext } from './PortfolioProvider';
import { downloadCVAsPDF } from './utils/downloadCV';
const TechnologyIcon = ({ name }: { name: string }) => {
  const iconProps = { className: "inline-block w-6 h-6 mr-2", title: name };
  switch (name.toLowerCase()) {
    case 'node.js': return <FaNodeJs {...iconProps} />;
    case 'react': return <FaReact {...iconProps} />;
    case 'docker': return <FaDocker {...iconProps} />;
    case 'aws': return <FaAws {...iconProps} />;
    case 'mongodb': return <SiMongodb {...iconProps} />;
    case 'javascript': return <SiJavascript {...iconProps} />;
    case 'angular': return <FaAngular {...iconProps} />;
    case 'nestjs': return <SiNestjs {...iconProps} />;
    case 'postgresql': return <SiPostgresql {...iconProps} />;
    case 'ci/cd' : return <LiaInfinitySolid {...iconProps} />;
    case 'microservices' : return <LiaCubesSolid {...iconProps} />;
    case 'next.js' : return <SiNextdotjs {...iconProps} />;
    default: return null;
  }
};

const RuslanPortfolio = () => {
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
      {/* Header/Nav */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 flex items-center justify-between px-8 py-4">
        <div className="text-2xl font-bold">Ruslan Alekseyev</div>
        <div className="flex gap-6 items-center">
          <a href="#home" className="base-link font-medium">Home</a>
          <a href="#projects" className="base-link font-medium">Projects</a>
          <a href="#skills" className="base-link font-medium">Skills</a>
          <a href="#contact" className="base-link font-medium">Contact</a>
          <a href="/cv" className="base-link font-medium">View CV</a>
          <button
            onClick={handleDownloadCV}
            disabled={isDownloading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium disabled:opacity-50"
            style={{textDecoration: 'none'}}
          >
            {isDownloading ? 'Generating...' : 'Download CV'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Summary Section */}
          <section id="home" className="mb-16">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <img src="/img/Ruslan.png" alt="Ruslan Alekseyev" className="w-40 h-40 rounded-full object-cover shadow-lg" />
              <div>
                <h1 className="text-3xl font-bold mb-2">Ruslan Alekseyev</h1>
            <div className="text-lg text-blue-600 font-medium mb-4">Experienced Developer | Microservices | Strong Leadership | Proven Success</div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              With over 12 years of development experience, I am a versatile and skilled developer well-versed in both frontend and backend technologies. 
              I specialize in microservices architecture, delivering scalable and efficient solutions. My leadership skills have driven successful project 
              outcomes, and I have a track record of exceeding client expectations. Let's connect and achieve greatness together.
            </p>
            <div className="flex gap-4 text-gray-600">
              <span>📍 Latvia</span>
              <span>🌐 12+ years experience</span>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Featured Projects</h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl">BuySellVouchers.com</h3>
                <span className="text-gray-600">June 2023 - June 2025</span>
              </div>
              <div className="text-blue-600 font-medium mb-3">Technical Lead • Latvia</div>
              <div className="mb-6">
                <WebsitePreview
                  name="BuySellVouchers.com"
                  description="A secure platform for buying and selling gift cards and vouchers"
                  imageUrl="src/img/buysellvouchers.png"
                />
              </div>
              <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
                <li>Guided and managed the development team at BuySellVouchers.com, ensuring efficient workflows and making strategic technology decisions.</li>
                <li>Maintained server stability, security and scalability to ensure uninterrupted operations.</li>
                <li>Developed new features, optimized performance and resolved technical challenges to drive innovation and efficiency.</li>
              </ul>
              <div className="flex flex-wrap gap-3 mb-4">
                {['Node.js', 'React', 'Microservices', 'Docker', 'AWS', 'MongoDB'].map((tech) => (
                  <div key={tech} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <TechnologyIcon name={tech} />
                    {tech}
                  </div>
                ))}
              </div>
              <a href="https://buysellvouchers.com" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <span>Visit Website</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:scale-[1.02] transition-transform m-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl">PayAggregator.com</h3>
              <span className="text-gray-600">January 2024 - March 2025</span>
            </div>
            <div className="text-blue-600 font-medium mb-3">Technical Lead & Solution Architect  • Nicosia, Cyprus</div>
            <div className="mb-6">
              <WebsitePreview
                name="PayAggregator.com"
                description="Advanced payment processing platform with multi-service integration"
                imageUrl="src/img/payaggregator.png"
              />
            </div>
            <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
              <li>Led the development of cutting-edge microservices architecture for seamless proxy payment transactions.</li>
              <li>Managed a team of engineers to optimise system performance and security at high transaction volumes.</li>
              <li>Collaborated cross-functionality to ensure the platform met market demands and delivered exceptional user experiences.</li>
            </ul>
            <div className="flex flex-wrap gap-3 mb-4">
              {['Node.js', 'Javascript', 'NestJS', 'PostgreSQL', 'Microservices', 'Next.js', 'Angular', 'Docker', 'CI/CD'].map((tech) => (
                <div key={tech} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <TechnologyIcon name={tech} />
                  {tech}
                </div>
              ))}
            </div>
            <a href="https://payaggregator.com" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <span>Visit Website</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:scale-[1.02] transition-transform m-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl">Refoks Ltd.</h3>
              <span className="text-gray-600">November 2020 - March 2023</span>
            </div>
            <div className="text-blue-600 font-medium mb-3">Software Architect and Developer  • Riga, Latvia</div>
            <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
              <li>Led the recruitment and mentoring of technical staff, building a high-performing team that launched four gaming brands with 100k deposits per month.</li>
              <li>Designed scalable, data-intensive architectures to ensure robust performance and high client satisfaction.</li>
              <li>Coordinated project roadmaps and milestones, delivering solutions on time and within budget.</li>
            </ul>
            <div className="flex flex-wrap gap-3 mb-4">
              {['Javascript', 'NestJS', 'PostgreSQL', 'Microservices', 'Next.js', 'Angular', 'Docker', 'CI/CD'].map((tech) => (
                <div key={tech} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <TechnologyIcon name={tech} />
                  {tech}
                </div>
              ))}
            </div>
            <a href="https://refoks.com" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <span>Visit Website</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Core Competencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-3">Leadership</h3>
              <p className="text-gray-700">Technical team leadership, strategic planning, and project management</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-3">Architecture</h3>
              <p className="text-gray-700">Microservices architecture design and implementation</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-3">Backend</h3>
              <p className="text-gray-700">Node.js, Express, MongoDB, RESTful APIs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-3">Frontend</h3>
              <p className="text-gray-700">React, TypeScript, Modern JavaScript</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-3">DevOps</h3>
              <p className="text-gray-700">Docker, AWS, CI/CD, Server Management</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-3">Security</h3>
              <p className="text-gray-700">Application security, encryption, authentication</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Contact</h2>
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-4 text-gray-700">
              <a href="mailto:ruslan.alekseyev@example.com" className="flex items-center hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                ruslan.alekseyev@example.com
              </a>
              <a href="https://linkedin.com/in/ruslan-alekseyev" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
                LinkedIn Profile
              </a>
            </div>
          </div>
        </section>
      </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © {new Date().getFullYear()} Ruslan Alekseyev. All rights reserved.
        </div>
      </footer>

      {/* Edit button */}
      <a href="/edit" className="fixed right-8 bottom-8 bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700 transition-colors" style={{zIndex:1000}}>
        Edit Portfolio
      </a>
    </div>
  );
};

export default RuslanPortfolio;