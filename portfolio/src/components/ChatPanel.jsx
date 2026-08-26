import { useRef, useState } from 'react';
import { askAgent } from '../lib/agent';

let nextId = 1;

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { id: 0, role: 'a', text: "Hi! Ask me about Aman's projects, stack or availability." },
  ]);
  const [typing, setTyping] = useState(false);
  const [value, setValue] = useState('');
  const bodyRef = useRef(null);

  function scrollToEnd() {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  }

  function send() {
    const v = value.trim();
    if (!v) return;
    setMessages(m => [...m, { id: nextId++, role: 'u', text: v }]);
    setValue('');
    setTyping(true);
    scrollToEnd();

    const replyId = nextId++;
    let started = false;

    askAgent(v, {
      onToken: text => {
        if (!started) {
          started = true;
          setTyping(false);
          setMessages(m => [...m, { id: replyId, role: 'a', text }]);
        } else {
          setMessages(m => m.map(msg => msg.id === replyId ? { ...msg, text: msg.text + text } : msg));
        }
        scrollToEnd();
      },
      onDone: () => scrollToEnd(),
    });
  }

  return (
    <div className="chatpanel">
      <div className="chat-head"><span className="dot" />Portfolio Agent<small>online</small></div>
      <div className="chat-body" ref={bodyRef}>
        {messages.map(m => (
          <div className={`bub ${m.role}`} key={m.id}>{m.text}</div>
        ))}
        {typing && (
          <div className="bub a"><span className="thinking"><i /><i /><i /></span></div>
        )}
      </div>
      <div className="chat-foot">
        <input
          placeholder="Type a message…"
          aria-label="Chat message"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
        />
        <button onClick={send}>↑</button>
      </div>
    </div>
  );
}
