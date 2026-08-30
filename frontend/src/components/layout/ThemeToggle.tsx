import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`toggle-cont ${className}`}>
      <label className="toggle-switch" aria-label="Toggle dark/light theme">
        <input
          type="checkbox"
          checked={isLight}
          onChange={toggleTheme}
          aria-checked={isLight}
        />
        <span className="toggle-slider">
          <Sun className="icon-sun" />
          <Moon className="icon-moon" />
          <span className="toggle-knob" />
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;
