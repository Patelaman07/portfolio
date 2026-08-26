const KEYWORDS = new Set([
  'async', 'await', 'def', 'return', 'if', 'not', 'while', 'for', 'auto', 'graph',
]);

// Tokenizes on strings/comments/keywords for lightweight highlighting without dangerouslySetInnerHTML.
function tokenize(line) {
  const tokens = [];
  const re = /(#.*$|\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let last = 0, m;
  while ((m = re.exec(line))) {
    if (m.index > last) tokens.push({ t: line.slice(last, m.index), k: 'plain' });
    if (m[1]) tokens.push({ t: m[1], k: 'cm' });
    else if (m[2]) tokens.push({ t: m[2], k: 'st' });
    else if (m[3]) tokens.push({ t: m[3], k: KEYWORDS.has(m[3]) ? 'kw' : 'plain' });
    last = re.lastIndex;
  }
  if (last < line.length) tokens.push({ t: line.slice(last), k: 'plain' });
  return tokens;
}

export default function CodeBlock({ code, label = 'snippet' }) {
  const lines = code.split('\n');
  return (
    <div className="codeblock">
      <div className="cb-head">
        <span className="d" /><span className="d" /><span className="d" />&nbsp;{label}
      </div>
      <pre>
        {lines.map((line, i) => (
          <span key={i}>
            {tokenize(line).map((tok, j) => (
              tok.k === 'plain'
                ? tok.t
                : <span key={j} className={tok.k}>{tok.t}</span>
            ))}
            {i < lines.length - 1 ? '\n' : null}
          </span>
        ))}
      </pre>
    </div>
  );
}
