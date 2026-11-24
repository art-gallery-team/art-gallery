export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'art-gallery-theme';

export function getSavedTheme(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function toggleTheme(): Theme {
  const nextTheme: Theme = getSavedTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  return nextTheme;
}
