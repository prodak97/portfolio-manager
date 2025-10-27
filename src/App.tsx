import React, { useState, useEffect, useContext, useRef } from 'react';
import { PortfolioContext } from './PortfolioProvider';
import './App.css';

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
  website?: string;
};

type EducationEntry = {
  name: string;
  degree: string;
  startDate: string;
  endDate: string;
};

export type PortfolioInfo = {
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
  name: 'Hui Sobachiy',
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

function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function saveToLocalStorage(data: PortfolioInfo): { success: boolean; error?: string } {
  try {
    if (!isLocalStorageAvailable()) {
      return { success: false, error: 'Local storage is not available (possibly blocked or in private mode).' };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Backup system
    try {
      let backups: string[] = safeJsonParse<string[]>(localStorage.getItem(BACKUP_KEY), []);
      backups.unshift(JSON.stringify(data));
      backups = backups.slice(0, 3); // Keep last 3 backups
      // Try to persist backups, trim if quota is exceeded
      while (true) {
        try {
          localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
          break;
        } catch (e: any) {
          const isQuota = e && (e.name === 'QuotaExceededError' || e.code === 22);
          if (isQuota && backups.length > 1) {
            backups.pop();
            continue;
          }
          // If still failing with 0 or 1 backups, skip backups entirely
          try {
            localStorage.removeItem(BACKUP_KEY);
          } catch {}
          // eslint-disable-next-line no-console
          console.warn('Backup skipped due to storage quota. Primary data saved.');
          break;
        }
      }
    } catch (backupErr) {
      // eslint-disable-next-line no-console
      console.warn('Backup step failed:', backupErr);
    }
    return { success: true };
  } catch (err: any) {
    const message = err && err.message ? err.message : 'Unknown storage error';
    return { success: false, error: message };
  }
}


const App: React.FC = () => {
  // Ensure the component returns JSX
  const { info, setInfo } = useContext(PortfolioContext);
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
          const saveResult = saveToLocalStorage(edit);
          if (saveResult.success) {
            setInfo(edit);
            setSaveMsg('✅ All changes saved');
            setError('');
          } else {
            setError(`Storage error: ${saveResult.error || 'Could not save data.'}`);
            setSaveMsg('');
            // Optional console hint for developers
            // eslint-disable-next-line no-console
            console.warn('Save failed:', saveResult.error);
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
  //function deleteCoreCompetency(idx: number) {
    //setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.filter((_, i) => i !== idx) });
  //}

  // Additional Details management
  function addAdditionalDetail() {
    setEdit({ ...edit, additionalDetails: [...(edit.additionalDetails || []), { category: '', description: '' }] });
  }
  //function deleteAdditionalDetail(idx: number) {
    //setEdit({ ...edit, additionalDetails: (edit.additionalDetails || []).filter((_, i) => i !== idx) });
  //}

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

  // Import data from JSON file
  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const raw = JSON.parse(text);
        const normalized: PortfolioInfo = {
          ...defaultInfo,
          ...raw,
          languages: Array.isArray(raw.languages) ? raw.languages : [],
          education: Array.isArray(raw.education) ? raw.education : [],
          skills: Array.isArray(raw.skills) ? raw.skills : [],
          projects: Array.isArray(raw.projects) ? raw.projects : [],
          coreCompetencies: Array.isArray(raw.coreCompetencies) ? raw.coreCompetencies : [],
          additionalDetails: Array.isArray(raw.additionalDetails) ? raw.additionalDetails : [],
          resumeUrl: typeof raw.resumeUrl === 'string' ? raw.resumeUrl : '',
        };
        if (!validateData(normalized)) {
          setError('Import validation error: name and email are required.');
          return;
        }
        setEdit(normalized);
        setInfo(normalized);
        const res = saveToLocalStorage(normalized);
        if (!res.success) {
          setError(`Storage error after import: ${res.error || 'Unknown error'}`);
        } else {
          setSaveMsg('✅ Imported and saved');
          setError('');
        }
      } catch (e: any) {
        setError(`Failed to import JSON: ${e?.message || 'Unknown error'}`);
      }
    };
    input.click();
  }

  // Clear all data
  function clearAll() {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setEdit(defaultInfo);
      setInfo(defaultInfo);
      saveToLocalStorage(defaultInfo);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md py-4 px-8 mb-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Portfolio Editor</h1>
          <div className="flex gap-4">
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">View Portfolio</a>
            <a href="/cv" className="text-blue-600 hover:text-blue-800 font-medium">View CV</a>
          </div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row gap-10 p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Editing Section */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pr-8">
            <h2 className="text-xl font-semibold mb-4">Edit Portfolio</h2>
            <div className="mb-2 text-sm text-gray-500">
              {saving ? 'Saving...' : saveMsg ? saveMsg : null}
              {error && <div className="text-red-500">{error}</div>}
            </div>
        <label className="block mb-2 font-medium">
          Name:
          <input id="name" name="name" autoComplete="name" value={edit.name} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Bio:
          <textarea id="bio" name="bio" autoComplete="off" value={edit.bio} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Professional Summary:
          <textarea id="professionalSummary" name="professionalSummary" autoComplete="off" value={edit.professionalSummary} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Email:
          <input id="email" name="email" autoComplete="email" value={edit.email} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          LinkedIn:
          <input id="linkedin" name="linkedin" autoComplete="url" value={edit.linkedin} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Resume URL:
          <input id="resumeUrl" name="resumeUrl" autoComplete="url" value={edit.resumeUrl || ''} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Location:
          <input id="location" name="location" autoComplete="address-level2" value={edit.location} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Image URL:
          <input id="imageUrl" name="imageUrl" autoComplete="url" value={edit.imageUrl} onChange={handleChange} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <label className="block mb-2 font-medium">
          Languages (comma separated):
          <input id="languages" name="languages" autoComplete="off" value={Array.isArray(edit.languages) ? edit.languages.join(', ') : ''} onChange={e => setEdit({ ...edit, languages: e.target.value.split(',').map(l => l.trim()) })} className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50" />
        </label>
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        {(Array.isArray(edit.education) ? edit.education : []).map((edu, idx) => (
          <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
            <input id={`education-name-${idx}`} name={`education-name-${idx}`} autoComplete="organization" placeholder="Institution Name" value={edu.name} onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, name: e.target.value } : ed) })} className="w-full mb-2 p-2 border rounded" />
            <input id={`education-degree-${idx}`} name={`education-degree-${idx}`} autoComplete="off" placeholder="Degree" value={edu.degree} onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, degree: e.target.value } : ed) })} className="w-full mb-2 p-2 border rounded" />
            <input id={`education-start-${idx}`} name={`education-start-${idx}`} autoComplete="off" placeholder="Start Date" value={edu.startDate} onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, startDate: e.target.value } : ed) })} className="w-full mb-2 p-2 border rounded" />
            <input id={`education-end-${idx}`} name={`education-end-${idx}`} autoComplete="off" placeholder="End Date" value={edu.endDate} onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, endDate: e.target.value } : ed) })} className="w-full mb-2 p-2 border rounded" />
            <button type="button" className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => setEdit({ ...edit, education: edit.education.filter((_, i) => i !== idx) })}>Delete</button>
          </div>
        ))}
        <button onClick={() => setEdit({ ...edit, education: [...edit.education, { name: '', degree: '', startDate: '', endDate: '' }] })} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink">Add Education</button>
        <div className="flex gap-4 mt-4">
          <button onClick={exportData} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover-blink">Export JSON</button>
          <button onClick={importData} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 hover-blink">Import JSON</button>
          <button onClick={clearAll} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover-blink">Clear All</button>
        </div>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Core Competencies</h3>
        {edit.coreCompetencies.map((cat, idx) => (
          <div key={idx} className="mb-2 flex items-center gap-2">
            <input id={`corecomp-category-${idx}`} name={`corecomp-category-${idx}`} autoComplete="off"
              placeholder="Category Name"
              value={cat.category}
              onChange={e => setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.map((c, i) => i === idx ? { ...c, category: e.target.value } : c) })}
              className="flex-1 p-2 border rounded"
            />
            <input id={`corecomp-description-${idx}`} name={`corecomp-description-${idx}`} autoComplete="off"
              placeholder="Description"
              value={cat.description}
              onChange={e => setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.map((c, i) => i === idx ? { ...c, description: e.target.value } : c) })}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.filter((_, i) => i !== idx) })}>Delete</button>
          </div>
        ))}
        <button onClick={addCoreCompetency} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink">Add Core Competency</button>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
        {(edit.additionalDetails || []).map((item, idx) => (
          <div key={idx} className="mb-2 flex items-center gap-2">
            <input id={`add-detail-category-${idx}`} name={`add-detail-category-${idx}`} autoComplete="off"
              placeholder="Category Name"
              value={item.category}
              onChange={e => setEdit({ ...edit, additionalDetails: edit.additionalDetails.map((d, i) => i === idx ? { ...d, category: e.target.value } : d) })}
              className="flex-1 p-2 border rounded"
            />
            <input id={`add-detail-description-${idx}`} name={`add-detail-description-${idx}`} autoComplete="off"
              placeholder="Description"
              value={item.description}
              onChange={e => setEdit({ ...edit, additionalDetails: edit.additionalDetails.map((d, i) => i === idx ? { ...d, description: e.target.value } : d) })}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => setEdit({ ...edit, additionalDetails: edit.additionalDetails.filter((_, i) => i !== idx) })}>Delete</button>
          </div>
        ))}
        <button onClick={addAdditionalDetail} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink">Add Additional Detail</button>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        {edit.skills.map((skill, idx) => (
          <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
            <input id={`skill-name-${idx}`} name={`skill-name-${idx}`} autoComplete="off" placeholder="Skill Name" value={skill.name} onChange={e => handleSkillChange(idx, 'name', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input id={`skill-category-${idx}`} name={`skill-category-${idx}`} autoComplete="off" placeholder="Category" value={skill.category} onChange={e => handleSkillChange(idx, 'category', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input id={`skill-proficiency-${idx}`} name={`skill-proficiency-${idx}`} autoComplete="off" placeholder="Proficiency" value={skill.proficiency} onChange={e => handleSkillChange(idx, 'proficiency', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <button type="button" className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => deleteSkill(idx)}>Delete</button>
          </div>
        ))}
        <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink">Add Skill</button>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Projects</h3>
        {edit.projects.map((project, idx) => (
          <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
            <input id={`project-name-${idx}`} name={`project-name-${idx}`} autoComplete="off" placeholder="Project Name" value={project.name} onChange={e => handleProjectChange(idx, 'name', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <textarea id={`project-description-${idx}`} name={`project-description-${idx}`} autoComplete="off" placeholder="Description" value={project.description} onChange={e => handleProjectChange(idx, 'description', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input id={`project-tech-${idx}`} name={`project-tech-${idx}`} autoComplete="off" placeholder="Technologies Used (comma separated)" value={Array.isArray(project.technologiesUsed) ? project.technologiesUsed.join(', ') : ''} onChange={e => handleProjectChange(idx, 'technologiesUsed', e.target.value.split(',').map(s => s.trim()))} className="w-full mb-2 p-2 border rounded" />
            <input id={`project-date-${idx}`} name={`project-date-${idx}`} autoComplete="off" placeholder="Start Date" value={project.date} onChange={e => handleProjectChange(idx, 'date', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input id={`project-endDate-${idx}`} name={`project-endDate-${idx}`} autoComplete="off" placeholder="End Date" value={project.endDate || ''} onChange={e => handleProjectChange(idx, 'endDate', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input id={`project-website-${idx}`} name={`project-website-${idx}`} autoComplete="off" placeholder="Website" value={project.website || ''} onChange={e => handleProjectChange(idx, 'website', e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <button type="button" className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => deleteProject(idx)}>Delete</button>
          </div>
        ))}
        <button onClick={addProject} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover-blink">Add Project</button>
      </div>
      {/* Display Section (Home preview) can be added here if needed */}
    </div>
    </div>
  );
};

export default App;