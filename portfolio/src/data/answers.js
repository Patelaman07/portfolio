export const ANSWERS = {
  agentic:{ t:"The AI Frontend Engineer is my flagship agentic system: it takes a feature request, plans the component/page breakdown, then generates a real frontend file tree — components, pages, routing and styles — instead of just describing what to build. Scoped to one clear frontend-lead role so its output stays inspectable.", s:'AI Frontend Engineer · case study' },
  cpp:{ t:"Yes — DSA and graph algorithms are a genuine interest, not just a checkbox: 300+ problems solved on LeetCode. The AI Coding Error Explainer compiles real C++ with g++, parses the compiler output, and explains what broke.", s:'AI Coding Error Explainer · case study' },
  stack:{ t:"Frontend: React.js, JavaScript (ES6+), Tailwind CSS. Backend: Node.js, Express.js, MongoDB, REST APIs, JWT auth — the MERN stack. AI: LangGraph, LangChain, agentic workflows, Ollama for local dev.", s:'Skills matrix' },
  default:{ t:"I answer from Aman's actual portfolio data. Try asking about the AI Frontend Engineer, the C++ Error Explainer, the tech stack, or availability. If something isn't on record, I'll tell you rather than guess.", s:null }
};

export function classify(q){
  if(/agent|frontend engineer|codegen/i.test(q)) return 'agentic';
  if(/c\+\+|dsa|algorith/i.test(q)) return 'cpp';
  if(/stack|tech|tool/i.test(q)) return 'stack';
  return 'default';
}
