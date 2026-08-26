from google.genai import types

from ..gemini_config import GEMINI_CHAT_MODEL, client

LANGUAGE_INSTRUCTIONS = {
    "en": "Respond in clear, simple English.",
    "hi": "Respond in Hindi, written in Devanagari script.",
    "hinglish": "Respond in Hinglish — Hindi mixed with English, written in Latin script, the way people actually text in India.",
}

SYSTEM_PROMPT = """You are explaining a C++ compiler error to a developer, possibly a learner.
Given their code and one specific compiler diagnostic, explain in this order:
1. What happened — in plain terms, not compiler jargon.
2. Why it happened — point at the specific line/expression that caused it.
3. How to fix it — be concrete, referencing their actual variable/function names.
Keep it to 4-6 sentences total. Do not rewrite their whole program — describe the fix in words.
{language_instruction}"""


def explain_error_stream(code: str, error: dict, language: str):
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    system_instruction = SYSTEM_PROMPT.format(language_instruction=lang_instruction)
    user_content = (
        f"Code:\n```cpp\n{code}\n```\n\n"
        f"Compiler {error['type']} at line {error['line']}, column {error['column']}: "
        f"{error['message']}\n\nExplain this."
    )
    for chunk in client.models.generate_content_stream(
        model=GEMINI_CHAT_MODEL,
        contents=[types.Content(role="user", parts=[types.Part(text=user_content)])],
        config=types.GenerateContentConfig(system_instruction=system_instruction),
    ):
        if chunk.text:
            yield chunk.text
