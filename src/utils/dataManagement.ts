import { PortfolioInfo } from '../types/portfolio';
import { saveToLocalStorage } from './localStorage';

export function exportData(info: PortfolioInfo) {
  const dataStr = JSON.stringify(info, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(
  defaultInfo: PortfolioInfo,
  onSuccess: (data: PortfolioInfo) => void,
  onError: (error: string) => void
) {
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
        certificates: Array.isArray(raw.certificates) ? raw.certificates : [],
        events: Array.isArray(raw.events) ? raw.events : [],
        aiExperience: raw.aiExperience || { description: '', currentInvestigation: '', achievements: [] },
      };

      if (!normalized.name || !normalized.email) {
        onError('Import validation error: name and email are required.');
        return;
      }

      const res = saveToLocalStorage(normalized);
      if (!res.success) {
        onError(`Storage error after import: ${res.error || 'Unknown error'}`);
      } else {
        onSuccess(normalized);
      }
    } catch (e: any) {
      onError(`Failed to import JSON: ${e?.message || 'Unknown error'}`);
    }
  };
  input.click();
}

export function clearAllData(
  defaultInfo: PortfolioInfo,
  onConfirm: (data: PortfolioInfo) => void
) {
  if (window.confirm('Are you sure you want to clear all data?')) {
    saveToLocalStorage(defaultInfo);
    onConfirm(defaultInfo);
  }
}
