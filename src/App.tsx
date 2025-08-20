import React, { useState } from 'react';
import './styles/main.css';

type PortfolioInfo = {
  name: string;
  bio: string;
  email: string;
  linkedin: string;
  skills: string[];
  projects: { name: string; description: string }[];
};

const defaultInfo: PortfolioInfo = {
  name: 'Jane Doe',
  bio: 'Web Developer | Designer | Programmer',
  email: 'jane.doe@email.com',
  linkedin: 'linkedin.com/in/janedoe',
  skills: ['React', 'TypeScript', 'CSS', 'Node.js'],
  projects: [
    { name: 'Project One', description: 'Description of project one.' },
    { name: 'Project Two', description: 'Description of project two.' },
  ],
};

export default function App() {
  const [info, setInfo] = useState<PortfolioInfo>(defaultInfo);
  const [edit, setEdit] = useState<PortfolioInfo>(defaultInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEdit({ ...edit, [name]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEdit({ ...edit, skills: e.target.value.split(',').map(s => s.trim()) });
  };

  const handleProjectChange = (idx: number, field: 'name' | 'description', value: string) => {
    const newProjects = edit.projects.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setEdit({ ...edit, projects: newProjects });
  };

  const handleSave = () => setInfo(edit);

  return (
    <div className="flex gap-10 p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      {/* Editing Section */}
      <div className="flex-1 border-r border-gray-200 pr-8">
        <h2 className="text-xl font-semibold mb-4">Edit Portfolio</h2>
        <label className="block mb-2 font-medium">
          Name:
          <input
            name="name"
            value={edit.name}
            onChange={handleChange}
            className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
          />
        </label>
        <label className="block mb-2 font-medium">
          Bio:
          <textarea
            name="bio"
            value={edit.bio}
            onChange={handleChange}
            className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
          />
        </label>
        <label className="block mb-2 font-medium">
          Email:
          <input
            name="email"
            value={edit.email}
            onChange={handleChange}
            className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
          />
        </label>
        <label className="block mb-2 font-medium">
          LinkedIn:
          <input
            name="linkedin"
            value={edit.linkedin}
            onChange={handleChange}
            className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
          />
        </label>
        <label className="block mb-2 font-medium">
          Skills (comma separated):
          <textarea
            value={edit.skills.join(', ')}
            onChange={handleSkillsChange}
            className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
          />
        </label>
        <h3 className="text-lg font-semibold mt-6 mb-2">Projects</h3>
        {edit.projects.map((project, idx) => (
          <div key={idx} className="mb-4">
            <input
              placeholder="Project Name"
              value={project.name}
              onChange={e => handleProjectChange(idx, 'name', e.target.value)}
              className="w-full mb-2 p-2 border rounded bg-gray-50"
            />
            <textarea
              placeholder="Project Description"
              value={project.description}
              onChange={e => handleProjectChange(idx, 'description', e.target.value)}
              className="w-full p-2 border rounded bg-gray-50"
            />
          </div>
        ))}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Save
        </button>
      </div>

      {/* Display Section */}
      <div className="flex-2 pl-8">
        <h1 className="text-3xl font-bold mb-2">{info.name}</h1>
        <p className="text-gray-700 mb-6">{info.bio}</p>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <ul className="list-disc pl-5">
            {info.skills.map(skill => <li key={skill}>{skill}</li>)}
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <ul className="list-disc pl-5">
            {info.projects.map((project, idx) => (
              <li key={idx}>
                <span className="font-bold">{project.name}</span>: {project.description}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>Email: <span className="text-blue-700">{info.email}</span></p>
          <p>LinkedIn: <span className="text-blue-700">{info.linkedin}</span></p>
        </section>
      </div>
    </div>
  );
}