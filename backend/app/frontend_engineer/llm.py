from langchain_google_genai import ChatGoogleGenerativeAI

from ..gemini_config import GEMINI_API_KEY, GEMINI_CHAT_MODEL

llm = ChatGoogleGenerativeAI(
    model=GEMINI_CHAT_MODEL,
    google_api_key=GEMINI_API_KEY,
    temperature=0.2,
)