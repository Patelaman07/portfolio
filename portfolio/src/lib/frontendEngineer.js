const API_URL = import.meta.env.VITE_FRONTEND_ENGINEER_API_URL || 'http://localhost:8000';

export const PIPELINE = [
  ['frontend_lead', 'Frontend Lead'],
  ['ui_agent', 'UI Architect'],
  ['component_agent', 'Component Architect'],
  ['routing_agent', 'Routing Architect'],
  ['state_agent', 'State Architect'],
  ['api_agent', 'API Architect'],
  ['styling_agent', 'Styling Architect'],
  ['codegen_agent', 'Codegen'],
  ['write_output', 'Write Output'],
  ['finalize_project', 'Finalize Report'],
];

export async function startGeneration(task, projectName) {
  const res = await fetch(`${API_URL}/api/frontend-engineer/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, project_name: projectName }),
  });
  if (!res.ok) throw new Error(`Failed to start: ${res.status}`);
  return res.json(); // { job_id }
}

export async function getStatus(jobId) {
  const res = await fetch(`${API_URL}/api/frontend-engineer/status/${jobId}`);
  if (!res.ok) throw new Error(`Failed to poll status: ${res.status}`);
  return res.json();
}
