import { useState } from 'react';
import { askAgent } from '../lib/agent';

const HINTS = [
  'What is the AI Frontend Engineer?',
  'Do you know C++ and DSA?',
  "What's your stack?",
];

// Mirrors the backend LangGraph nodes: meta arrives after classify + retrieve,
// tokens stream during generate, and done arrives after validation.
const STEPS = ['classify', 'retrieve', 'generate', 'validate'];
const PHASE_DONE = { idle: 0, routing: 0, generating: 2, done: 4 };

export default function AskBar() {
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState('idle');
  const [sources, setSources] = useState([]);

  function ask(q) {
    if (!q || (phase !== 'idle' && phase !== 'done')) return;
    setQuestion(q);
    setAnswer('');
    setSources([]);
    setPhase('routing');
    setInput('');

    askAgent(q, {
      onMeta: () => setPhase('generating'),
      onToken: text => {
        setPhase('generating');
        setAnswer(prev => prev + text);
      },
      onDone: ({ sources: s = [], grounded }) => {
        setPhase('done');
        setSources(grounded ? s : []);
      },
    });
  }

  const doneCount = PHASE_DONE[phase];
  const busy = phase === 'routing' || phase === 'generating';

  return (
    <div className="console" id="agent">
      <div className="console-head">
        <span>agent.ask()</span>
        <small>grounded in résumé + projects</small>
      </div>

      <div className="console-body" aria-live="polite">
        {phase === 'idle' ? (
          <>
            <p className="console-empty">Ask anything about my work. Answers come only from my résumé and project write-ups — and if it isn't on record, the agent says so.</p>
            <div className="hints">
              {HINTS.map(h => (
                <button type="button" className="chip" key={h} onClick={() => ask(h)}>{h}</button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="q-bubble">{question}</div>
            <div className="a-text">
              {phase === 'routing'
                ? <span className="thinking" aria-label="Thinking"><i /><i /><i /></span>
                : <>{answer}{busy && <span className="cursor" />}</>}
            </div>
            {sources.length > 0 && (
              <div className="src-row">
                {sources.map(s => <span className="src" key={s}>↳ {s}</span>)}
              </div>
            )}
            <div className="trace">
              {STEPS.map((s, i) => (
                <span key={s} style={{ display: 'contents' }}>
                  {i > 0 && <span>→</span>}
                  <span className={i < doneCount ? 'done' : i === doneCount && busy ? 'active' : ''}>
                    {i < doneCount ? '✓ ' : ''}{s}
                  </span>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <form className="console-form" onSubmit={e => { e.preventDefault(); ask(input.trim()); }}>
        <label htmlFor="ask-input">Ask about my work</label>
        <div className="console-row">
          <input
            id="ask-input"
            placeholder="Try: Has he worked with MongoDB?"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary" disabled={busy}>Ask</button>
        </div>
      </form>
    </div>
  );
}
