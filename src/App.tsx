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

import React, { useState, useEffect, useRef } from 'react';
import './styles/main.css';

// Types
type Skill = {
  name: string;
  category: string;
  proficiency: string;
};

type CoreCompetency = {
  category: string;
  description: string;
};

type AdditionalDetail = {
  category: string;
  description: string;
};
type Project = {
  name: string;
  description: string;
  technologiesUsed: string[];
  date: string;
  endDate?: string;
};

type EducationEntry = {
  name: string;
  degree: string;
  startDate: string;
  endDate: string;
};

type PortfolioInfo = {
  name: string;
  bio: string;
  professionalSummary: string;
  email: string;
  linkedin: string;
  resumeUrl: string;
  location: string;
  imageUrl: string;
  languages: string[];
  education: EducationEntry[];
  skills: Skill[];
  projects: Project[];
  coreCompetencies: CoreCompetency[];
  additionalDetails: AdditionalDetail[];
};
// Default Data
const defaultInfo: PortfolioInfo = {
  name: 'Jane Doe',
  bio: 'Web Developer | Designer | Programmer',
  professionalSummary: 'Experienced full-stack developer with a passion for building scalable web applications and leading engineering teams.',
  email: 'jane.doe@email.com',
  linkedin: 'linkedin.com/in/janedoe',
  resumeUrl: 'https://example.com/jane-doe-resume.pdf',
  location: 'San Francisco, CA',
  imageUrl: '/img/download (2).png',
  languages: ['English', 'Spanish'],
  education: [
    { name: 'Stanford University', degree: 'B.Sc. in Computer Science', startDate: '2015-09-01', endDate: '2019-06-01' },
    { name: 'MIT', degree: 'M.Sc. in Software Engineering', startDate: '2019-09-01', endDate: '2021-06-01' },
  ],
  skills: [
    { name: 'React', category: 'Frontend', proficiency: 'Advanced' },
    { name: 'TypeScript', category: 'Frontend', proficiency: 'Intermediate' },
    { name: 'Node.js', category: 'Backend', proficiency: 'Intermediate' },
    { name: 'CSS', category: 'Frontend', proficiency: 'Advanced' },
  ],
  projects: [
    { name: 'Project One', description: 'Description of project one.', technologiesUsed: ['React', 'CSS'], date: '2024-01-01', endDate: '2024-03-01' },
    { name: 'Project Two', description: 'Description of project two.', technologiesUsed: ['TypeScript', 'Node.js'], date: '2024-02-01', endDate: '2024-04-01' },
  ],
  coreCompetencies: [
    { category: 'Frontend', description: 'Frontend development skills' },
    { category: 'Backend', description: 'Backend development skills' },
    { category: 'Tools', description: 'Development tools and utilities' },
  ],
  additionalDetails: [],
};

// LocalStorage keys
const STORAGE_KEY = 'portfolio-data';
const BACKUP_KEY = 'portfolio-backups';

// Safe JSON parse helper
function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function saveToLocalStorage(data: PortfolioInfo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Backup system
    let backups: string[] = safeJsonParse<string[]>(localStorage.getItem(BACKUP_KEY), []);
    backups.unshift(JSON.stringify(data));
    backups = backups.slice(0, 3); // Keep last 3 backups
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
    return true;
  } catch {
    return false;
  }
}

function loadFromLocalStorage(): PortfolioInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return defaultInfo;
  } catch {
    // Try backup recovery
    const backups = safeJsonParse<string[]>(localStorage.getItem(BACKUP_KEY), []);
    if (backups.length > 0) return JSON.parse(backups[0]);
    return defaultInfo;
  }
}

export default function App() {
  const [info, setInfo] = useState<PortfolioInfo>(() => {
    const loaded = loadFromLocalStorage();
    // Ensure coreCompetencies is always defined
    return {
      ...loaded,
      coreCompetencies: loaded.coreCompetencies || [],
      additionalDetails: (loaded as any).additionalDetails || [],
      resumeUrl: (loaded as any).resumeUrl || '',
    };
  });
  const [edit, setEdit] = useState<PortfolioInfo>(info);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-save
  useEffect(() => {
    setSaving(true);
    setSaveMsg('Saving...');
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        if (validateData(edit)) {
          if (saveToLocalStorage(edit)) {
            setInfo(edit);
            setSaveMsg('✅ All changes saved');
            setError('');
          } else {
            setError('Storage error: Could not save data.');
            setSaveMsg('');
          }
        } else {
          setError('Validation error: Please check your data.');
          setSaveMsg('');
        }
      } catch {
        setError('Unknown error occurred during save.');
        setSaveMsg('');
      }
      setSaving(false);
    }, 500);
    // eslint-disable-next-line
  }, [edit]);

  // Data validation
  function validateData(data: PortfolioInfo) {
    // Basic validation: required fields
    if (!data.name || !data.email) return false;
    return true;
  }

  // Add/Delete Project
  function addProject() {
    setEdit({ ...edit, projects: [...edit.projects, { name: '', description: '', technologiesUsed: [], date: '', endDate: '' }] });
  }
  function deleteProject(idx: number) {
    setEdit({ ...edit, projects: edit.projects.filter((_, i) => i !== idx) });
  }

  // Add/Delete Skill
  function addSkill() {
    setEdit({ ...edit, skills: [...edit.skills, { name: '', category: '', proficiency: '' }] });
  }
  function deleteSkill(idx: number) {
    setEdit({ ...edit, skills: edit.skills.filter((_, i) => i !== idx) });
  }

  // Handle field changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEdit({ ...edit, [name]: value });
  }
  function handleSkillChange(idx: number, field: keyof Skill, value: string) {
    const newSkills = edit.skills.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setEdit({ ...edit, skills: newSkills });
  }
  function handleProjectChange(idx: number, field: keyof Project, value: any) {
    const newProjects = edit.projects.map((p, i) => {
      if (i === idx) {
        if (field === 'technologiesUsed' && typeof value === 'string') {
          return { ...p, technologiesUsed: value.split(',').map((s: string) => s.trim()) };
        }
        return { ...p, [field]: value };
      }
      return p;
    });
    setEdit({ ...edit, projects: newProjects });
  }

  // Core Competencies management
  function addCoreCompetency() {
    setEdit({ ...edit, coreCompetencies: [...edit.coreCompetencies, { category: '', description: '' }] });
  }
  function deleteCoreCompetency(idx: number) {
    setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.filter((_, i) => i !== idx) });
  }

  // Additional Details management
  function addAdditionalDetail() {
    setEdit({ ...edit, additionalDetails: [...(edit.additionalDetails || []), { category: '', description: '' }] });
  }
  function deleteAdditionalDetail(idx: number) {
    setEdit({ ...edit, additionalDetails: (edit.additionalDetails || []).filter((_, i) => i !== idx) });
  }

  // Export data
  function exportData() {
    const dataStr = JSON.stringify(info, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Clear all data
  function clearAll() {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setEdit(defaultInfo);
      setInfo(defaultInfo);
      saveToLocalStorage(defaultInfo);
    }
  }

  // Responsive UI and feedback
  return (
    <div className="flex flex-col md:flex-row gap-10 p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg mt-6" id="portfolio-root">
      {/* Editing Section */}
      <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pr-8">
        <h2 className="text-xl font-semibold mb-4">Edit Portfolio</h2>
        <div className="mb-2 text-sm text-gray-500">
          {saving ? <span>{saveMsg}</span> : saveMsg ? <span>{saveMsg}</span> : null}
          {error && <span className="text-red-600">{error}</span>}
        </div>
        <label className="block mb-2 font-medium">
          Name:
          <input name="name" value={edit.name} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Bio:
          <textarea name="bio" value={edit.bio} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Professional Summary:
          <textarea name="professionalSummary" value={edit.professionalSummary} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Email:
          <input name="email" value={edit.email} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          LinkedIn:
          <input name="linkedin" value={edit.linkedin} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Resume URL:
          <input name="resumeUrl" value={(edit as any).resumeUrl || ''} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Location:
          <input name="location" value={edit.location} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Image URL:
          <input name="imageUrl" value={edit.imageUrl} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Languages (comma separated):
          <input name="languages" value={Array.isArray(edit.languages) ? edit.languages.join(', ') : ''} onChange={e => setEdit({ ...edit, languages: e.target.value.split(',').map(l => l.trim()) })} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <h3 className="text-lg font-semibold mb-2">Education</h3>
  {(Array.isArray(edit.education) ? edit.education : []).map((edu, idx) => (
          <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
            <input placeholder="Institution Name" value={edu.name} onChange={e => {
              const updated = { ...edu, name: e.target.value };
              const newList = edit.education.map((e_, i) => i === idx ? updated : e_);
              setEdit({ ...edit, education: newList });
            }} className="w-full mb-2 p-2 border rounded" />
            <input placeholder="Degree" value={edu.degree} onChange={e => {
              const updated = { ...edu, degree: e.target.value };
              const newList = edit.education.map((e_, i) => i === idx ? updated : e_);
              setEdit({ ...edit, education: newList });
            }} className="w-full mb-2 p-2 border rounded" />
            <div className="flex gap-2">
              <input type="date" value={edu.startDate} onChange={e => {
                const updated = { ...edu, startDate: e.target.value };
                const newList = edit.education.map((e_, i) => i === idx ? updated : e_);
                setEdit({ ...edit, education: newList });
              }} className="w-full mb-2 p-2 border rounded" placeholder="Start Date" />
              <input type="date" value={edu.endDate} onChange={e => {
                const updated = { ...edu, endDate: e.target.value };
                const newList = edit.education.map((e_, i) => i === idx ? updated : e_);
                setEdit({ ...edit, education: newList });
              }} className="w-full mb-2 p-2 border rounded" placeholder="End Date" />
            </div>
            <button onClick={() => setEdit({ ...edit, education: edit.education.filter((_, i) => i !== idx) })} className="bg-red-500 text-white px-2 rounded">Delete</button>
          </div>
        ))}
        <button onClick={() => setEdit({ ...edit, education: [...edit.education, { name: '', degree: '', startDate: '', endDate: '' }] })} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">Add Education</button>
        <div className="flex gap-4 mt-4">
          <button onClick={exportData} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Export JSON</button>
          <button onClick={clearAll} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Clear All</button>
        </div>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Core Competencies</h3>
        {edit.coreCompetencies.map((cat, idx) => (
          <div key={idx} className="mb-2 flex items-center gap-2">
            <input
              placeholder="Category Name"
              value={cat.category}
              onChange={e => {
                const updated = { ...cat, category: e.target.value };
                const newList = edit.coreCompetencies.map((c, i) => i === idx ? updated : c);
                setEdit({ ...edit, coreCompetencies: newList });
              }}
              className="flex-1 p-2 border rounded"
            />
            <input
              placeholder="Description"
              value={cat.description}
              onChange={e => {
                const updated = { ...cat, description: e.target.value };
                const newList = edit.coreCompetencies.map((c, i) => i === idx ? updated : c);
                setEdit({ ...edit, coreCompetencies: newList });
              }}
              className="flex-1 p-2 border rounded"
            />
            <button onClick={() => deleteCoreCompetency(idx)} className="bg-red-500 text-white px-2 rounded">Delete</button>
          </div>
        ))}
        <button onClick={addCoreCompetency} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">Add Core Competency</button>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
        {(edit.additionalDetails || []).map((item, idx) => (
          <div key={idx} className="mb-2 flex items-center gap-2">
            <input
              placeholder="Category Name"
              value={item.category}
              onChange={e => {
                const updated = { ...item, category: e.target.value };
                const newList = (edit.additionalDetails || []).map((c, i) => i === idx ? updated : c);
                setEdit({ ...edit, additionalDetails: newList });
              }}
              className="flex-1 p-2 border rounded"
            />
            <input
              placeholder="Description"
              value={item.description}
              onChange={e => {
                const updated = { ...item, description: e.target.value };
                const newList = (edit.additionalDetails || []).map((c, i) => i === idx ? updated : c);
                setEdit({ ...edit, additionalDetails: newList });
              }}
              className="flex-1 p-2 border rounded"
            />
            <button onClick={() => deleteAdditionalDetail(idx)} className="bg-red-500 text-white px-2 rounded">Delete</button>
          </div>
        ))}
        <button onClick={addAdditionalDetail} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">Add Additional Detail</button>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        {edit.skills.map((skill, idx) => (
          <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
            <div className="flex gap-2 mb-2">
              <input placeholder="Skill Name" value={skill.name} onChange={e => handleSkillChange(idx, 'name', e.target.value)} className="flex-1 p-2 border rounded" />
              <input placeholder="Category" value={skill.category} onChange={e => handleSkillChange(idx, 'category', e.target.value)} className="flex-1 p-2 border rounded" />
              <input placeholder="Proficiency" value={skill.proficiency} onChange={e => handleSkillChange(idx, 'proficiency', e.target.value)} className="flex-1 p-2 border rounded" />
              <button onClick={() => deleteSkill(idx)} className="bg-red-500 text-white px-2 rounded">Delete</button>
            </div>
          </div>
        ))}
        <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">Add Skill</button>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Projects</h3>
        {edit.projects.map((project, idx) => (
          <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
            <input placeholder="Project Name" value={project.name} onChange={e => handleProjectChange(idx, 'name', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <textarea placeholder="Description" value={project.description} onChange={e => handleProjectChange(idx, 'description', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input placeholder="Technologies Used (comma separated)" value={Array.isArray(project.technologiesUsed) ? project.technologiesUsed.join(', ') : ''} onChange={e => handleProjectChange(idx, 'technologiesUsed', e.target.value.split(',').map(s => s.trim()))} className="w-full mb-2 p-2 border rounded" />
            <div className="flex gap-2">
              <input type="date" value={project.date} onChange={e => handleProjectChange(idx, 'date', e.target.value)} className="w-full mb-2 p-2 border rounded" />
              <input type="date" value={project.endDate || ''} onChange={e => handleProjectChange(idx, 'endDate', e.target.value)} className="w-full mb-2 p-2 border rounded" placeholder="End Date" />
            </div>
            <button onClick={() => deleteProject(idx)} className="bg-red-500 text-white px-2 rounded">Delete</button>
          </div>
        ))}
        <button onClick={addProject} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Project</button>
      </div>

      {/* Display Section */}
      <div className="flex-2 pl-0 md:pl-8">
        <div className="flex items-center gap-6 mb-4">
          {info.imageUrl && <img src={info.imageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />}
          <div>
            <h1 className="text-3xl font-bold mb-2">{info.name}</h1>
            <p className="text-gray-700 mb-2">{info.location}</p>
            <p className="text-gray-700 mb-2">{info.email}</p>
            <p className="text-gray-700 mb-2">{info.linkedin}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{info.bio}</p>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
          <p className="text-gray-700">{info.professionalSummary}</p>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Languages</h2>
          <ul className="list-disc pl-5">
            {(Array.isArray(info.languages) ? info.languages : []).map((lang, idx) => (
              <li key={idx}>{lang}</li>
            ))}
          </ul>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <ul className="list-disc pl-5">
            {(Array.isArray(info.education) ? info.education : []).map((edu, idx) => (
              <li key={idx}>
                <span className="font-bold">{edu.name}</span> — {edu.degree} ({formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'})
              </li>
            ))}
          </ul>
        </section>
        {/* Core Competencies Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Core Competencies</h2>
          <ul className="list-disc pl-5">
            {info.coreCompetencies.map((cat, idx) => (
              <li key={idx}>
                <span className="font-bold">{cat.category}</span>: {cat.description}
              </li>
            ))}
          </ul>
        </section>
        {/* Additional Details Section */}
        {info.additionalDetails && info.additionalDetails.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Additional Details</h2>
            <ul className="list-disc pl-5">
              {info.additionalDetails.map((item, idx) => (
                <li key={idx}>
                  <span className="font-bold">{item.category}</span>: {item.description}
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          {Object.entries(
            info.skills.reduce((acc, skill) => {
              acc[skill.category] = acc[skill.category] || [];
              acc[skill.category].push(skill);
              return acc;
            }, {} as Record<string, Skill[]>)
          ).map(([cat, skills]) => (
            <div key={cat} className="mb-2">
              <h3 className="font-bold text-gray-800">{cat}</h3>
              <ul className="list-disc pl-5">
                {skills.map((skill, idx) => (
                  <li key={idx}>{skill.name} <span className="text-xs text-gray-500">({skill.proficiency})</span></li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <ul className="list-disc pl-5">
            {info.projects.map((project, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-bold">{project.name}</span> ({formatDate(project.date)}
                {project.endDate ? ` - ${formatDate(project.endDate)}` : ' - Present'}): {project.description}
                <br />
                <span className="text-xs text-gray-500">Technologies Used: {(project.technologiesUsed && Array.isArray(project.technologiesUsed) ? project.technologiesUsed.join(', ') : '')}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>Email: <span className="text-blue-700">{info.email}</span></p>
          <p>LinkedIn: <span className="text-blue-700">{info.linkedin}</span></p>
          {info.resumeUrl && (
            <p>Resume: <a href={info.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">View Resume</a></p>
          )}
        </section>
      </div>
      {/* Fixed button to scroll to portfolio */}
      <button
        onClick={() => {
          const el = document.getElementById('portfolio-root');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        title="Go to Portfolio"
      >
        View Portfolio
      </button>
    </div>
  );
}