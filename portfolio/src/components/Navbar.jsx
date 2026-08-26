import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/skills', 'Skills'],
  ['/projects', 'Projects'],
  ['/resume', 'Resume'],
  ['/contact', 'Contact'],
];

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <div className="brand">
          <span className="dot" />
          aman<span style={{ color: 'var(--accent)' }}>.dev</span>
        </div>
        <button className="theme-btn menu-btn" aria-label="Menu" onClick={() => setOpen(o => !o)}>☰</button>
        <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Primary">
          {LINKS.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="theme-btn"
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          style={{ transform: theme === 'light' ? 'rotate(180deg)' : 'none', transition: 'transform .3s var(--ease)' }}
        >
          ◐
        </button>
      </div>
    </header>
  );
}
