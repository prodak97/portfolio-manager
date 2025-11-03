import { PortfolioInfo } from '../types/portfolio';

const STORAGE_KEY = 'portfolio-data';
const BACKUP_KEY = 'portfolio-backups';

// Safe JSON parse helper
export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function saveToLocalStorage(data: PortfolioInfo): { success: boolean; error?: string } {
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
          console.warn('Backup skipped due to storage quota. Primary data saved.');
          break;
        }
      }
    } catch (backupErr) {
      console.warn('Backup step failed:', backupErr);
    }
    return { success: true };
  } catch (err: any) {
    const message = err && err.message ? err.message : 'Unknown storage error';
    return { success: false, error: message };
  }
}

export function loadFromLocalStorage(defaultValue: PortfolioInfo): PortfolioInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return safeJsonParse(raw, defaultValue);
  } catch {
    return defaultValue;
  }
}
