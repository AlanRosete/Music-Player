import { Sun, Moon } from './icons.jsx';

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
    >
      <span className={`theme-toggle__icons ${isDark ? 'is-dark' : ''}`}>
        <Sun className="theme-toggle__sun" width="15" height="15" />
        <Moon className="theme-toggle__moon" width="15" height="15" />
      </span>
    </button>
  );
}
