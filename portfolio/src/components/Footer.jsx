const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.253c0 4.537 2.865 8.377 6.839 9.735.5.096.682-.223.682-.494 0-.244-.009-.89-.014-1.747-2.782.617-3.369-1.363-3.369-1.363-.454-1.164-1.11-1.474-1.11-1.474-.908-.63.069-.617.069-.617 1.003.072 1.531 1.049 1.531 1.049.892 1.554 2.341 1.105 2.91.845.09-.657.35-1.105.636-1.359-2.221-.256-4.556-1.126-4.556-5.01 0-1.106.387-2.011 1.023-2.72-.103-.256-.443-1.284.097-2.676 0 0 .834-.27 2.73 1.04A9.36 9.36 0 0 1 12 6.844c.844.004 1.694.116 2.488.34 1.895-1.31 2.727-1.04 2.727-1.04.542 1.392.202 2.42.1 2.676.638.709 1.022 1.614 1.022 2.72 0 3.894-2.339 4.75-4.566 5.001.359.32.678.949.678 1.912 0 1.38-.012 2.492-.012 2.833 0 .273.18.594.688.492A10.02 10.02 0 0 0 22 12.253C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 6.5 8.14 6.1a1.6 1.6 0 0 0 1.92 0L21 6.5" />
  </svg>
);

const LINKS = [
  { href: 'https://github.com/Patelaman07', label: 'GitHub', Icon: GitHubIcon },
  { href: 'https://www.linkedin.com/in/aman-patel-77b5ba288/', label: 'LinkedIn', Icon: LinkedInIcon },
  { href: 'mailto:skillsexplorer203@gmail.com', label: 'Email', Icon: MailIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <div className="foot-brand">
          <span className="brand">
            <span className="dot" />
            aman<span style={{ color: 'var(--accent)' }}>.dev</span>
          </span>
          <span className="foot-copy">© {year} Aman Patel</span>
        </div>

        <div className="foot-status">
          <span className="foot-pulse" />
          Open to agentic AI / full-stack roles
        </div>

        <div className="foot-icons">
          {LINKS.map(({ href, label, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
