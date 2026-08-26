import { ANSWERS, classify } from '../data/answers';

const API_URL = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:8000';

// Keeps the UI working on a static deploy (or whenever the FastAPI service
// isn't reachable) by replaying a canned answer through the same callback
// shape the real stream uses.
function localFallbackStream(question, { onMeta, onToken, onDone }) {
  const a = ANSWERS[classify(question)];
  onMeta({ category: classify(question), grounded: !!a.s });
  let i = 0;
  const iv = setInterval(() => {
    i += 3;
    onToken(a.t.slice(Math.max(0, i - 3), i));
    if (i >= a.t.length) {
      clearInterval(iv);
      onDone({ sources: a.s ? [a.s] : [], grounded: !!a.s });
    }
  }, 20);
}

/** Streams an answer from the AI Portfolio Agent (NDJSON over POST /api/agent/ask). */
export async function askAgent(question, { onMeta = () => {}, onToken = () => {}, onDone = () => {}, onError }) {
  try {
    const res = await fetch(`${API_URL}/api/agent/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok || !res.body) throw new Error(`Agent request failed: ${res.status}`);

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
        if (msg.type === 'meta') onMeta(msg);
        else if (msg.type === 'token') onToken(msg.text);
        else if (msg.type === 'done') onDone(msg);
      }
    }
  } catch (err) {
    onError?.(err);
    localFallbackStream(question, { onMeta, onToken, onDone });
  }
}
