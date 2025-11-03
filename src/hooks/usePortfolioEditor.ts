import { useState, useEffect, useRef, useContext } from 'react';
import { PortfolioContext } from '../PortfolioProvider';
import { PortfolioInfo, Skill, Project, Certificate, Event, AIProject } from '../types/portfolio';
import { saveToLocalStorage } from '../utils/localStorage';

export function usePortfolioEditor() {
  const { info, setInfo } = useContext(PortfolioContext);
  const [edit, setEdit] = useState<PortfolioInfo>(info);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync edit state with context info when it changes
  useEffect(() => {
    setEdit(info);
  }, [info]);

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
  }, [edit, setInfo]);

  // Data validation
  function validateData(data: PortfolioInfo) {
    if (!data.name || !data.email) return false;
    return true;
  }

  // Handler functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEdit({ ...edit, [name]: value });
  };

  const addProject = () => {
    setEdit({ ...edit, projects: [...edit.projects, { name: '', description: '', technologiesUsed: [], date: '', endDate: '' }] });
  };

  const deleteProject = (idx: number) => {
    setEdit({ ...edit, projects: edit.projects.filter((_, i) => i !== idx) });
  };

  const handleProjectChange = (idx: number, field: keyof Project, value: any) => {
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
  };

  const addSkill = () => {
    setEdit({ ...edit, skills: [...edit.skills, { name: '', category: '', proficiency: '' }] });
  };

  const deleteSkill = (idx: number) => {
    setEdit({ ...edit, skills: edit.skills.filter((_, i) => i !== idx) });
  };

  const handleSkillChange = (idx: number, field: keyof Skill, value: string) => {
    const newSkills = edit.skills.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setEdit({ ...edit, skills: newSkills });
  };

  const addCoreCompetency = () => {
    setEdit({ ...edit, coreCompetencies: [...edit.coreCompetencies, { category: '', description: '' }] });
  };

  const deleteCoreCompetency = (idx: number) => {
    setEdit({ ...edit, coreCompetencies: edit.coreCompetencies.filter((_, i) => i !== idx) });
  };

  const addAdditionalDetail = () => {
    setEdit({ ...edit, additionalDetails: [...(edit.additionalDetails || []), { category: '', description: '' }] });
  };

  const deleteAdditionalDetail = (idx: number) => {
    setEdit({ ...edit, additionalDetails: (edit.additionalDetails || []).filter((_, i) => i !== idx) });
  };

  const addEducation = () => {
    setEdit({ ...edit, education: [...edit.education, { name: '', degree: '', startDate: '', endDate: '' }] });
  };

  const deleteEducation = (idx: number) => {
    setEdit({ ...edit, education: edit.education.filter((_, i) => i !== idx) });
  };

  // Certificate management
  const addCertificate = () => {
    setEdit({ ...edit, certificates: [...edit.certificates, { name: '', issuer: '', date: '', url: '' }] });
  };

  const deleteCertificate = (idx: number) => {
    setEdit({ ...edit, certificates: edit.certificates.filter((_, i) => i !== idx) });
  };

  const handleCertificateChange = (idx: number, field: keyof Certificate, value: string) => {
    const newCertificates = edit.certificates.map((c, i) => i === idx ? { ...c, [field]: value } : c);
    setEdit({ ...edit, certificates: newCertificates });
  };

  // Event management
  const addEvent = () => {
    setEdit({ ...edit, events: [...edit.events, { title: '', description: '', image: '', date: '' }] });
  };

  const deleteEvent = (idx: number) => {
    setEdit({ ...edit, events: edit.events.filter((_, i) => i !== idx) });
  };

  const handleEventChange = (idx: number, field: keyof Event, value: string) => {
    const newEvents = edit.events.map((e, i) => i === idx ? { ...e, [field]: value } : e);
    setEdit({ ...edit, events: newEvents });
  };

  // AI Experience management
  const handleAIExperienceChange = (field: 'description' | 'currentInvestigation', value: string) => {
    setEdit({ ...edit, aiExperience: { ...edit.aiExperience, [field]: value } });
  };

  const addAIAchievement = () => {
    setEdit({ ...edit, aiExperience: { ...edit.aiExperience, achievements: [...edit.aiExperience.achievements, ''] } });
  };

  const deleteAIAchievement = (idx: number) => {
    setEdit({ ...edit, aiExperience: { ...edit.aiExperience, achievements: edit.aiExperience.achievements.filter((_, i) => i !== idx) } });
  };

  const handleAIAchievementChange = (idx: number, value: string) => {
    const newAchievements = edit.aiExperience.achievements.map((a, i) => i === idx ? value : a);
    setEdit({ ...edit, aiExperience: { ...edit.aiExperience, achievements: newAchievements } });
  };

  // AI Project management
  const addAIProject = () => {
    setEdit({
      ...edit,
      aiExperience: {
        ...edit.aiExperience,
        projects: [...(edit.aiExperience.projects || []), { title: '', description: '', technologies: [] }]
      }
    });
  };

  const deleteAIProject = (idx: number) => {
    setEdit({
      ...edit,
      aiExperience: {
        ...edit.aiExperience,
        projects: (edit.aiExperience.projects || []).filter((_, i) => i !== idx)
      }
    });
  };

  const handleAIProjectChange = (idx: number, field: keyof AIProject, value: any) => {
    const newProjects = (edit.aiExperience.projects || []).map((p, i) => {
      if (i === idx) {
        if (field === 'technologies' && typeof value === 'string') {
          return { ...p, technologies: value.split(',').map((s: string) => s.trim()) };
        }
        return { ...p, [field]: value };
      }
      return p;
    });
    setEdit({ ...edit, aiExperience: { ...edit.aiExperience, projects: newProjects } });
  };

  return {
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
    deleteCoreCompetency,
    addAdditionalDetail,
    deleteAdditionalDetail,
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
  };
}
