const API_URL = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:8000';

export async function compileCode(code) {
  const res = await fetch(`${API_URL}/api/explainer/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error(`Compile request failed: ${res.status}`);
  return res.json();
}

export async function explainError(code, error, language, { onToken, onDone }) {
  const res = await fetch(`${API_URL}/api/explainer/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, error, language }),
  });
  if (!res.ok || !res.body) throw new Error(`Explain request failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      const msg = JSON.parse(line);
      if (msg.type === 'token') onToken?.(msg.text);
      else if (msg.type === 'done') onDone?.();
    }
  }
}
