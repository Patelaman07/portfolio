export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <span>© {year} Aman Patel</span>
        <span>React · FastAPI · LangGraph · Gemini</span>
        <div className="foot-links">
          <a href="https://github.com/Patelaman07" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/aman-patel-77b5ba288/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:skillsexplorer203@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}
