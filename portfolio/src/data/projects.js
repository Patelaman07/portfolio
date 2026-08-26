export const PROJECTS = [
  { id:'agent', name:'AI Portfolio Agent', badge:'P0', tags:['LangGraph','RAG','Vector DB'],
    desc:'A grounded agent that answers questions about my profile, projects and resume — with visible sources and a safe fallback when facts aren\'t present.',
    problem:'Recruiters skim. A static portfolio can\'t answer the one specific question a visitor actually has.',
    solution:'A retrieval-grounded agent that classifies the request, pulls only relevant portfolio documents, generates an answer and validates it before rendering.',
    arch:'classify → retrieve context → generate → validate, orchestrated as a LangGraph workflow over a vector store of profile & project docs.',
    pipeline:['Classify request','Retrieve context','Generate answer','Validate & cite'],
    stack:['Next.js','FastAPI','LangGraph','Vector store','Ollama'],
    features:['Source chips on every answer','EN / Hindi / Hinglish','Refuses unknown facts','Streamed responses'],
    demo:'Live on the Home page — try the ask bar.',
    decisions:'Chose explicit retrieve-then-generate over a single mega-prompt so answers stay grounded and auditable.',
    code:`async def answer(q):
    ctx = await retrieve(q)   # vector search
    if not ctx:
        return "I don't have that on record."
    return await generate(q, ctx)` },
  { id:'frontend-engineer', name:'AI Frontend Engineer', badge:'P0', tags:['LangGraph','Codegen','React'],
    desc:'An autonomous agent that converts natural-language app requirements into a complete frontend codebase — through a plan-then-generate pipeline, not just a text plan.',
    problem:'Turning a product spec into an actual folder of frontend files is repetitive and mechanical, but most AI assistants stop at describing what to build rather than producing it — manual scaffolding still eats real setup time.',
    solution:'A multi-stage agent workflow — requirement parsing, application architecture planning, component-level code generation, and structured file-system output — that decomposes an ambiguous prompt into a concrete component hierarchy before writing a single file.',
    arch:'requirement parsing → architecture planning → component/page breakdown → per-file code generation → structured file-system output, orchestrated as a 10-node LangGraph workflow calling a local LLM per generation step.',
    pipeline:['Parse requirements','Plan architecture','Generate components','Write output folder'],
    stack:['LangGraph','LangChain','Python','FastAPI','Ollama'],
    features:['Outputs a real, ready-to-run file tree, not just prose','Architecture-planning layer before codegen','Estimated 80% cut in manual scaffolding time','Case-study walkthrough'],
    demo:'Live below — describe a feature and watch the agent pipeline generate a real file tree.',
    decisions:'Scoped to frontend-only output (no backend/testing/review agents) so the agent stays focused and its output stays inspectable — one clear responsibility instead of a whole simulated engineering org.',
    code:`plan = plan_pages(request)
# ["Home.jsx", "components/Card.jsx", ...]
for file in plan:
    write(file, generate(file, request))` },
  { id:'explainer', name:'AI Coding Error Explainer', badge:'P0', tags:['Monaco','C++','g++'],
    desc:'A VS-Code-like C++ editor that compiles your code with a real compiler, parses the errors, and explains what broke and how to fix it — in your language.',
    problem:'Compiler errors are cryptic, especially for learners and non-English speakers.',
    solution:'Compile with a real g++ in an isolated process, parse stderr into structured errors with line/column, highlight them in Monaco, then have an LLM explain: what happened, why, how to fix — with a code fix suggestion, not just prose.',
    arch:'Monaco → POST /compile (g++, process isolation + timeout) → parse diagnostics → set Monaco markers → POST /explain (streamed) → LLM explanation.',
    pipeline:['Monaco edit','Compile (g++, timeout-limited)','Parse errors','LLM explain'],
    stack:['Monaco','FastAPI','g++','Ollama'],
    features:['Structured error parsing (line/col/message)','EN / Hindi / Hinglish','Real Monaco error squiggles','No auto-edits in V1'],
    demo:'Live below — edit the code, compile it, and ask for an explanation of any error.',
    decisions:'No Docker available in this dev environment, so isolation is process-level (fresh temp dir per run, compile/run timeouts) rather than a full container sandbox — the roadmap calls for a real container before public deployment; this is an honest V1, not a security boundary.',
    code:`# real g++ diagnostic, parsed with a regex:
# <file>:<line>:<col>: error: <message>
DIAG_RE = re.compile(
    r"^(?P<file>.+?):(?P<line>\\d+):(?P<col>\\d+): "
    r"(?P<type>error|warning): (?P<message>.*)$"
)` },
];
