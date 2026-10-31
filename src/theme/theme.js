const REQUIRED_COLORS = ['bg', 'fg', 'accent', 'muted'];

// Returns a list of problems; an empty list means the theme is valid.
export function validateTheme(theme) {
  const errors = [];
  if (typeof theme.name !== 'string') errors.push('name eksik');
  if (typeof theme.font !== 'string') errors.push('font eksik');
  for (const key of REQUIRED_COLORS) {
    if (!theme.colors || typeof theme.colors[key] !== 'string') {
      errors.push(`colors.${key} eksik`);
    }
  }
  return errors;
}

// Writes each color as a --<key> CSS custom property on the given element.
export function applyTheme(theme, root) {
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--${key}`, value);
  }
  root.style.setProperty('font-family', theme.font);
  // Optional CSS background (gradients, stars); themes without one get a plain background.
  root.style.setProperty('--bg-image', theme.background ?? 'none');
}
