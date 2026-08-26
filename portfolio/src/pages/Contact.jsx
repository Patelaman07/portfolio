import { useState } from 'react';
import Button from '../components/Button';
import ChatPanel from '../components/ChatPanel';

const EMPTY = { name: '', email: '', msg: '' };

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function onChange(field, v) {
    setValues(s => ({ ...s, [field]: v }));
  }

  function onSend() {
    const next = {
      name: !values.name.trim(),
      email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email),
      msg: values.msg.trim().length < 10,
    };
    setErrors(next);
    const ok = !next.name && !next.email && !next.msg;
    if (ok) {
      setSent(true);
      setValues(EMPTY);
    } else {
      setSent(false);
    }
  }

  return (
    <section className="view" id="contact">
      <div className="eyebrow">Contact</div>
      <h2>Let's build something.</h2>
      <p className="lead" style={{ margin: '10px 0 14px' }}>Send a note, or just chat with the assistant — it's the same agent that powers the whole site.</p>
      <p style={{ margin: '0 0 30px', fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--muted)' }}>
        Direct: <a href="mailto:skillsexplorer203@gmail.com" style={{ color: 'var(--accent)' }}>skillsexplorer203@gmail.com</a>
        {' · '}
        <a href="https://github.com/Patelaman07" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>GitHub</a>
        {' · '}
        <a href="https://www.linkedin.com/in/aman-patel-77b5ba288/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>LinkedIn</a>
      </p>
      <div className="contact-grid">
        <div>
          <div className={`field${errors.name ? ' err' : ''}`}>
            <label htmlFor="c-name">Name</label>
            <input id="c-name" type="text" placeholder="Your name"
              value={values.name} onChange={e => onChange('name', e.target.value)} />
            <div className="msg">Please enter your name.</div>
          </div>
          <div className={`field${errors.email ? ' err' : ''}`}>
            <label htmlFor="c-email">Email</label>
            <input id="c-email" type="email" placeholder="you@company.com"
              value={values.email} onChange={e => onChange('email', e.target.value)} />
            <div className="msg">Enter a valid email address.</div>
          </div>
          <div className={`field${errors.msg ? ' err' : ''}`}>
            <label htmlFor="c-msg">Message</label>
            <textarea id="c-msg" rows={4} placeholder="What are you working on?"
              value={values.msg} onChange={e => onChange('msg', e.target.value)} />
            <div className="msg">Add a short message (10+ characters).</div>
          </div>
          <Button onClick={onSend}>Send message</Button>
          {sent && (
            <div style={{ display: 'block', marginTop: 14, color: 'var(--brass)', fontSize: 14, fontFamily: 'var(--font-mono)' }}>
              ✓ Sent — I'll reply within a day.
            </div>
          )}
        </div>
        <ChatPanel />
      </div>
    </section>
  );
}
