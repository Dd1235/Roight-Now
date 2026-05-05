export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
    >
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb">
          <span className={isDark ? "moon-mark" : "sun-mark"} />
        </span>
      </span>
      <span>{isDark ? "Night" : "Day"}</span>
    </button>
  );
}
