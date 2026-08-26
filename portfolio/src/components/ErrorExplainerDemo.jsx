import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { compileCode, explainError } from '../lib/explainer';

const STARTER_CODE = `#include <iostream>
#include <string>

int main() {
    std::string name = "world";
    int count = "3";  // oops — wrong type
    for (int i = 0; i < count; i++) {
        std::cout << "Hello, " << name << "!" << std::endl;
    }
    return 0;
}
`;

const LANGUAGES = [
  ['en', 'English'],
  ['hi', 'हिन्दी'],
  ['hinglish', 'Hinglish'],
];

function useSiteTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

export default function ErrorExplainerDemo() {
  const theme = useSiteTheme();
  const [code, setCode] = useState(STARTER_CODE);
  const [compiling, setCompiling] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeError, setActiveError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  function onMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  function setMarkers(errors) {
    const editor = editorRef.current, monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    monaco.editor.setModelMarkers(model, 'gcc', errors.map(e => ({
      severity: e.type === 'error' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
      startLineNumber: e.line, startColumn: e.column, endLineNumber: e.line, endColumn: e.column + 1,
      message: e.message,
    })));
  }

  async function onCompile() {
    setCompiling(true);
    setError(null);
    setActiveError(null);
    setExplanation('');
    try {
      const r = await compileCode(code);
      setResult(r);
      setMarkers(r.errors || []);
    } catch {
      setError("Can't reach the explainer service — is the backend running on :8000?");
    } finally {
      setCompiling(false);
    }
  }

  async function onExplain(err) {
    setActiveError(err);
    setExplanation('');
    setExplaining(true);
    const editor = editorRef.current;
    if (editor) {
      editor.revealLineInCenter(err.line);
      editor.setPosition({ lineNumber: err.line, column: err.column });
    }
    try {
      await explainError(code, err, language, {
        onToken: t => setExplanation(prev => prev + t),
        onDone: () => setExplaining(false),
      });
    } catch {
      setError('Lost connection while explaining.');
      setExplaining(false);
    }
  }

  return (
    <div className="ee-demo">
      <div className="ee-editor-wrap">
        <Editor
          height="320px"
          language="cpp"
          value={code}
          onChange={v => setCode(v ?? '')}
          onMount={onMount}
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          options={{ minimap: { enabled: false }, fontSize: 13.5, scrollBeyondLastLine: false }}
        />
      </div>

      <div className="ee-toolbar">
        <button className="btn btn-primary" onClick={onCompile} disabled={compiling}>
          {compiling ? <span className="thinking"><i /><i /><i /></span> : '▶ Compile & run'}
        </button>
        <span className="fe-note" style={{ margin: 0 }}>Real g++ 13, compiled on this machine — no Docker sandbox in this dev build.</span>
      </div>

      {error && <p className="fe-error">{error}</p>}

      {result && result.success && (
        <div className="ee-output">
          <div className="ee-output-head">✓ Compiled &amp; ran</div>
          <pre>{result.stdout || '(no output)'}</pre>
        </div>
      )}

      {result && !result.success && result.errors.length > 0 && (
        <div className="ee-errors">
          {result.errors.map((e, i) => (
            <div className={`ee-error-item${activeError === e ? ' active' : ''}`} key={i}>
              <div className="ee-error-head">
                <span className={`tag ${e.type === 'error' ? 'ee-tag-error' : 'ee-tag-warning'}`}>{e.type}</span>
                <span className="ee-error-loc">line {e.line}:{e.column}</span>
                <button className="btn btn-ghost" onClick={() => onExplain(e)}>Explain</button>
              </div>
              <div className="ee-error-msg">{e.message}</div>
            </div>
          ))}
        </div>
      )}

      {activeError && (
        <div className="ee-explain">
          <div className="ee-lang-picker">
            {LANGUAGES.map(([id, label]) => (
              <button
                key={id}
                className={`chip${language === id ? ' active' : ''}`}
                onClick={() => { setLanguage(id); onExplain(activeError); }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="answer show">
            <div className="who"><span className="dot" />Explainer</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {explaining && !explanation
                ? <span className="thinking"><i /><i /><i /></span>
                : <>{explanation}{explaining && <span className="cursor" />}</>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
