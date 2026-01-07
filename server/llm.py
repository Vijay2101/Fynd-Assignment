from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

MODEL_NAME = os.environ.get("MODEL_NAME")

def call_llm(prompt):
    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        max_tokens=600,
        response_format={"type": "json_object"},
    )
    return completion.choices[0].message.content.strip()
