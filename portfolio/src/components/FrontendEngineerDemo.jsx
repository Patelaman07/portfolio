import { useEffect, useRef, useState } from 'react';
import { PIPELINE, downloadUrl, getStatus, startGeneration } from '../lib/frontendEngineer';
import CodeBlock from './CodeBlock';

const POLL_MS = 3000;

export default function FrontendEngineerDemo() {
  const [task, setTask] = useState('A simple todo list app with add, complete and delete todos.');
  const [projectName, setProjectName] = useState('generated-app');
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [startError, setStartError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => () => clearInterval(pollRef.current), []);

  async function onStart() {
    setStartError(null);
    setJob(null);
    setActiveFile(null);
    try {
      const { job_id } = await startGeneration(task, projectName);
      setJobId(job_id);
      clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        try {
          const s = await getStatus(job_id);
          setJob(s);
          if (s.status === 'done' || s.status === 'error' || s.status === 'not_found') {
            clearInterval(pollRef.current);
            if (s.status === 'done') {
              const first = Object.keys(s.files)[0];
              setActiveFile(first || null);
            }
          }
        } catch {
          clearInterval(pollRef.current);
          setStartError('Lost connection to the AI Frontend Engineer service.');
        }
      }, POLL_MS);
    } catch {
      setStartError("Can't reach the AI Frontend Engineer service — is the backend running on :8000?");
    }
  }

  const running = job?.status === 'running';
  const done = job?.status === 'done';
  const completed = new Set(job?.completed_nodes || []);

  return (
    <div className="fe-demo">
      <div className="fe-form">
        <div className="field">
          <label htmlFor="fe-task">Feature request</label>
          <textarea id="fe-task" rows={3} value={task} onChange={e => setTask(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="fe-name">Project name</label>
          <input id="fe-name" type="text" value={projectName} onChange={e => setProjectName(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={onStart} disabled={running}>
          {running ? 'Generating…' : '▶ Run the agent'}
        </button>
        {!job && (
          <p className="fe-note">Runs ~20 real LLM calls across 10 agents — takes a few minutes.</p>
        )}
        {startError && <p className="fe-error">{startError}</p>}
      </div>

      {job && (
        <div className="fe-pipeline">
          {PIPELINE.map(([id, label]) => {
            const state = completed.has(id) ? 'done' : job.current_node === id ? 'active' : 'pending';
            return (
              <div className={`fe-step fe-step-${state}`} key={id}>
                <span className="fe-step-dot" />
                {label}
              </div>
            );
          })}
        </div>
      )}

      {job?.status === 'error' && (
        <p className="fe-error">Run failed: {job.error}</p>
      )}

      {done && (
        <div className="fe-result">
          <div className="fe-download">
            <div>
              <div className="fe-download-title">Your app is ready</div>
              <p className="fe-note">
                {Object.keys(job.files).length} files in <code>{job.project_slug || projectName}/</code> — download the folder and run it locally.
              </p>
            </div>
            <a className="btn btn-primary" href={downloadUrl(jobId)} download={`${job.project_slug || 'generated-app'}.zip`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
              Download .zip
            </a>
          </div>
          <div className="fe-browser">
            <div className="fe-filelist">
              {Object.keys(job.files).map(path => (
                <button
                  key={path}
                  className={`fe-file${path === activeFile ? ' active' : ''}`}
                  onClick={() => setActiveFile(path)}
                >
                  {path}
                </button>
              ))}
            </div>
            <div className="fe-fileview">
              {activeFile && <CodeBlock code={job.files[activeFile]} label={activeFile} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
