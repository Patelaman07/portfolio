import { useState } from 'react';
import { askAgent } from '../lib/agent';

const HINTS = [
  ["What is the AI Frontend Engineer?"],
  ["Do you know C++ and DSA?"],
  ["What's your stack?"],
].map(([label]) => label);

export default function AskBar() {
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);
  const [displayed, setDisplayed] = useState('');
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [source, setSource] = useState(null);

  function ask(q) {
    setShow(true);
    setSource(null);
    setDisplayed('');
    setThinking(true);
    setStreaming(true);

    askAgent(q, {
      onToken: text => {
        setThinking(false);
        setDisplayed(prev => prev + text);
      },
      onDone: ({ sources, grounded }) => {
        setStreaming(false);
        setSource(grounded && sources.length ? sources[0] : null);
      },
    });
  }

  return (
    <div className="ask in">
      <div className="ask-shell">
        <span className="spark">✦</span>
        <input
          placeholder="Ask this portfolio anything — e.g. “What's your strongest agentic project?”"
          aria-label="Ask the portfolio agent"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && input.trim()) ask(input.trim()); }}
        />
        <button className="ask-go" onClick={() => input.trim() && ask(input.trim())}>Ask</button>
      </div>
      <div className="ask-hints">
        {HINTS.map(label => (
          <button className="chip" key={label} onClick={() => { setInput(label); ask(label); }}>{label}</button>
        ))}
      </div>
      <div className={`answer${show ? ' show' : ''}`}>
        <div className="who"><span className="dot" />Portfolio Agent</div>
        <div>
          {thinking
            ? <span className="thinking"><i /><i /><i /></span>
            : <>{displayed}{streaming && <span className="cursor" />}</>}
        </div>
        {source && (
          <div className="src">↳ source:&nbsp;<b>{source}</b></div>
        )}
      </div>
    </div>
  );
}
