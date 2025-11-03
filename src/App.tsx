import React from 'react';
import { defaultInfo } from './PortfolioProvider';
import { usePortfolioEditor } from './hooks/usePortfolioEditor';
import { exportData, importData, clearAllData } from './utils/dataManagement';
import './App.css';

const App: React.FC = () => {
  const {
    edit,
    setEdit,
    saving,
    saveMsg,
    error,
    handleChange,
    addProject,
    deleteProject,
    handleProjectChange,
    addSkill,
    deleteSkill,
    handleSkillChange,
    addCoreCompetency,
    addAdditionalDetail,
    addEducation,
    deleteEducation,
    addCertificate,
    deleteCertificate,
    handleCertificateChange,
    addEvent,
    deleteEvent,
    handleEventChange,
    handleAIExperienceChange,
    addAIAchievement,
    deleteAIAchievement,
    handleAIAchievementChange,
    addAIProject,
    deleteAIProject,
    handleAIProjectChange,
  } = usePortfolioEditor();

  const handleExport = () => exportData(edit);

  const handleImport = () => {
    importData(
      defaultInfo,
      (data) => {
        setEdit(data);
      },
      (errorMsg) => {
        // Error is already handled in the hook
        alert(errorMsg);
      }
    );
  };

  const handleClearAll = () => {
    clearAllData(defaultInfo, (data) => {
      setEdit(data);
    });
  };

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

          {/* Basic Information */}
          <label className="block mb-2 font-medium">
            Name:
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={edit.name}
              onChange={handleChange}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          <label className="block mb-2 font-medium">
            Bio:
            <textarea
              id="bio"
              name="bio"
              autoComplete="off"
              value={edit.bio}
              onChange={handleChange}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          <label className="block mb-2 font-medium">
            Professional Summary:
            <textarea
              id="professionalSummary"
              name="professionalSummary"
              autoComplete="off"
              value={edit.professionalSummary}
              onChange={handleChange}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          <label className="block mb-2 font-medium">
            Email:
            <input
              id="email"
              name="email"
              autoComplete="email"
              value={edit.email}
              onChange={handleChange}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          <label className="block mb-2 font-medium">
            LinkedIn:
            <input
              id="linkedin"
              name="linkedin"
              autoComplete="url"
              value={edit.linkedin}
              onChange={handleChange}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          <label className="block mb-2 font-medium">
            Location:
            <input
              id="location"
              name="location"
              autoComplete="address-level2"
              value={edit.location}
              onChange={handleChange}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          <label className="block mb-2 font-medium">
            Image URL:
            <input
              id="imageUrl"
              name="imageUrl"
              autoComplete="url"
              value={edit.imageUrl}
              onChange={handleChange}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          <label className="block mb-2 font-medium">
            Languages (comma separated):
            <input
              id="languages"
              name="languages"
              autoComplete="off"
              value={Array.isArray(edit.languages) ? edit.languages.join(', ') : ''}
              onChange={e => setEdit({ ...edit, languages: e.target.value.split(',').map(l => l.trim()) })}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
            />
          </label>

          {/* Education */}
          <h3 className="text-lg font-semibold mb-2">Education</h3>
          {(Array.isArray(edit.education) ? edit.education : []).map((edu, idx) => (
            <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
              <input
                id={`education-name-${idx}`}
                name={`education-name-${idx}`}
                autoComplete="organization"
                placeholder="Institution Name"
                value={edu.name}
                onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, name: e.target.value } : ed) })}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`education-degree-${idx}`}
                name={`education-degree-${idx}`}
                autoComplete="off"
                placeholder="Degree"
                value={edu.degree}
                onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, degree: e.target.value } : ed) })}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`education-start-${idx}`}
                name={`education-start-${idx}`}
                autoComplete="off"
                placeholder="Start Date"
                value={edu.startDate}
                onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, startDate: e.target.value } : ed) })}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`education-end-${idx}`}
                name={`education-end-${idx}`}
                autoComplete="off"
                placeholder="End Date"
                value={edu.endDate}
                onChange={e => setEdit({ ...edit, education: edit.education.map((ed, i) => i === idx ? { ...ed, endDate: e.target.value } : ed) })}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteEducation(idx)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink"
          >
            Add Education
          </button>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover-blink"
            >
              Export JSON
            </button>
            <button
              onClick={handleImport}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 hover-blink"
            >
              Import JSON
            </button>
            <button
              onClick={handleClearAll}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover-blink"
            >
              Clear All
            </button>
          </div>

          <hr className="my-6" />

          {/* Core Competencies */}
          <h3 className="text-lg font-semibold mb-2">Core Competencies</h3>
          {edit.coreCompetencies.map((cat, idx) => (
            <div key={idx} className="mb-2 flex items-center gap-2">
              <input
                id={`corecomp-category-${idx}`}
                name={`corecomp-category-${idx}`}
                autoComplete="off"
                placeholder="Category Name"
                value={cat.category}
                onChange={e => setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.map((c, i) => i === idx ? { ...c, category: e.target.value } : c) })}
                className="flex-1 p-2 border rounded"
              />
              <input
                id={`corecomp-description-${idx}`}
                name={`corecomp-description-${idx}`}
                autoComplete="off"
                placeholder="Description"
                value={cat.description}
                onChange={e => setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.map((c, i) => i === idx ? { ...c, description: e.target.value } : c) })}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.filter((_, i) => i !== idx) })}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addCoreCompetency}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink"
          >
            Add Core Competency
          </button>

          <hr className="my-6" />

          {/* Additional Details */}
          <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
          {(edit.additionalDetails || []).map((item, idx) => (
            <div key={idx} className="mb-2 flex items-center gap-2">
              <input
                id={`add-detail-category-${idx}`}
                name={`add-detail-category-${idx}`}
                autoComplete="off"
                placeholder="Category Name"
                value={item.category}
                onChange={e => setEdit({ ...edit, additionalDetails: edit.additionalDetails.map((d, i) => i === idx ? { ...d, category: e.target.value } : d) })}
                className="flex-1 p-2 border rounded"
              />
              <input
                id={`add-detail-description-${idx}`}
                name={`add-detail-description-${idx}`}
                autoComplete="off"
                placeholder="Description"
                value={item.description}
                onChange={e => setEdit({ ...edit, additionalDetails: edit.additionalDetails.map((d, i) => i === idx ? { ...d, description: e.target.value } : d) })}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => setEdit({ ...edit, additionalDetails: edit.additionalDetails.filter((_, i) => i !== idx) })}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addAdditionalDetail}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink"
          >
            Add Additional Detail
          </button>

          <hr className="my-6" />

          {/* Skills */}
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          {edit.skills.map((skill, idx) => (
            <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
              <input
                id={`skill-name-${idx}`}
                name={`skill-name-${idx}`}
                autoComplete="off"
                placeholder="Skill Name"
                value={skill.name}
                onChange={e => handleSkillChange(idx, 'name', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`skill-category-${idx}`}
                name={`skill-category-${idx}`}
                autoComplete="off"
                placeholder="Category"
                value={skill.category}
                onChange={e => handleSkillChange(idx, 'category', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`skill-proficiency-${idx}`}
                name={`skill-proficiency-${idx}`}
                autoComplete="off"
                placeholder="Proficiency"
                value={skill.proficiency}
                onChange={e => handleSkillChange(idx, 'proficiency', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteSkill(idx)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addSkill}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 hover-blink"
          >
            Add Skill
          </button>

          <hr className="my-6" />

          {/* Projects */}
          <h3 className="text-lg font-semibold mb-2">Projects</h3>
          {edit.projects.map((project, idx) => (
            <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
              <input
                id={`project-name-${idx}`}
                name={`project-name-${idx}`}
                autoComplete="off"
                placeholder="Project Name"
                value={project.name}
                onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                id={`project-description-${idx}`}
                name={`project-description-${idx}`}
                autoComplete="off"
                placeholder="Description"
                value={project.description}
                onChange={e => handleProjectChange(idx, 'description', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`project-tech-${idx}`}
                name={`project-tech-${idx}`}
                autoComplete="off"
                placeholder="Technologies Used (comma separated)"
                value={Array.isArray(project.technologiesUsed) ? project.technologiesUsed.join(', ') : ''}
                onChange={e => handleProjectChange(idx, 'technologiesUsed', e.target.value.split(',').map(s => s.trim()))}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`project-date-${idx}`}
                name={`project-date-${idx}`}
                autoComplete="off"
                placeholder="Start Date"
                value={project.date}
                onChange={e => handleProjectChange(idx, 'date', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`project-endDate-${idx}`}
                name={`project-endDate-${idx}`}
                autoComplete="off"
                placeholder="End Date"
                value={project.endDate || ''}
                onChange={e => handleProjectChange(idx, 'endDate', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`project-website-${idx}`}
                name={`project-website-${idx}`}
                autoComplete="off"
                placeholder="Website"
                value={project.website || ''}
                onChange={e => handleProjectChange(idx, 'website', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteProject(idx)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addProject}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover-blink"
          >
            Add Project
          </button>

          <hr className="my-6" />

          {/* Certificates */}
          <h3 className="text-lg font-semibold mb-2">Certificates</h3>
          {edit.certificates.map((cert, idx) => (
            <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
              <input
                id={`cert-name-${idx}`}
                name={`cert-name-${idx}`}
                autoComplete="off"
                placeholder="Certificate Name"
                value={cert.name}
                onChange={e => handleCertificateChange(idx, 'name', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`cert-issuer-${idx}`}
                name={`cert-issuer-${idx}`}
                autoComplete="off"
                placeholder="Issuer"
                value={cert.issuer}
                onChange={e => handleCertificateChange(idx, 'issuer', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`cert-date-${idx}`}
                name={`cert-date-${idx}`}
                autoComplete="off"
                placeholder="Date"
                value={cert.date}
                onChange={e => handleCertificateChange(idx, 'date', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`cert-url-${idx}`}
                name={`cert-url-${idx}`}
                autoComplete="url"
                placeholder="Certificate URL"
                value={cert.url}
                onChange={e => handleCertificateChange(idx, 'url', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteCertificate(idx)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addCertificate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover-blink"
          >
            Add Certificate
          </button>

          <hr className="my-6" />

          {/* Events */}
          <h3 className="text-lg font-semibold mb-2">Events</h3>
          {edit.events.map((event, idx) => (
            <div key={idx} className="mb-4 p-2 border rounded bg-gray-50">
              <input
                id={`event-title-${idx}`}
                name={`event-title-${idx}`}
                autoComplete="off"
                placeholder="Event Title"
                value={event.title}
                onChange={e => handleEventChange(idx, 'title', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                id={`event-description-${idx}`}
                name={`event-description-${idx}`}
                autoComplete="off"
                placeholder="Event Description"
                value={event.description}
                onChange={e => handleEventChange(idx, 'description', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`event-image-${idx}`}
                name={`event-image-${idx}`}
                autoComplete="url"
                placeholder="Image URL (optional)"
                value={event.image || ''}
                onChange={e => handleEventChange(idx, 'image', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                id={`event-date-${idx}`}
                name={`event-date-${idx}`}
                autoComplete="off"
                placeholder="Date"
                value={event.date}
                onChange={e => handleEventChange(idx, 'date', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteEvent(idx)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover-blink"
          >
            Add Event
          </button>

          <hr className="my-6" />

          {/* AI Experience */}
          <h3 className="text-lg font-semibold mb-2">AI Experience</h3>
          <label className="block mb-2 font-medium">
            AI Description:
            <textarea
              id="ai-description"
              name="ai-description"
              autoComplete="off"
              placeholder="Describe your AI experience"
              value={edit.aiExperience.description}
              onChange={e => handleAIExperienceChange('description', e.target.value)}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
              rows={4}
            />
          </label>
          <label className="block mb-2 font-medium">
            Current Investigation:
            <textarea
              id="ai-investigation"
              name="ai-investigation"
              autoComplete="off"
              placeholder="Describe your current AI investigation progress"
              value={edit.aiExperience.currentInvestigation}
              onChange={e => handleAIExperienceChange('currentInvestigation', e.target.value)}
              className="w-full mt-1 mb-3 p-2 border rounded bg-gray-50"
              rows={4}
            />
          </label>
          <h4 className="font-medium mb-2 mt-4">AI Projects:</h4>
          {(edit.aiExperience.projects || []).map((project, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded bg-gray-50">
              <input
                id={`ai-project-title-${idx}`}
                name={`ai-project-title-${idx}`}
                autoComplete="off"
                placeholder="Project Title"
                value={project.title}
                onChange={e => handleAIProjectChange(idx, 'title', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                id={`ai-project-description-${idx}`}
                name={`ai-project-description-${idx}`}
                autoComplete="off"
                placeholder="Project Description"
                value={project.description}
                onChange={e => handleAIProjectChange(idx, 'description', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                rows={3}
              />
              <input
                id={`ai-project-tech-${idx}`}
                name={`ai-project-tech-${idx}`}
                autoComplete="off"
                placeholder="Technologies (comma separated)"
                value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                onChange={e => handleAIProjectChange(idx, 'technologies', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteAIProject(idx)}
              >
                Delete Project
              </button>
            </div>
          ))}
          <button
            onClick={addAIProject}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover-blink mb-4"
          >
            Add AI Project
          </button>

          <h4 className="font-medium mb-2">AI Achievements:</h4>
          {edit.aiExperience.achievements.map((achievement, idx) => (
            <div key={idx} className="mb-2 flex items-center gap-2">
              <input
                id={`ai-achievement-${idx}`}
                name={`ai-achievement-${idx}`}
                autoComplete="off"
                placeholder="Achievement description"
                value={achievement}
                onChange={e => handleAIAchievementChange(idx, e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteAIAchievement(idx)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addAIAchievement}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover-blink"
          >
            Add AI Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
