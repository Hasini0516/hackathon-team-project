from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env

token = os.getenv("HF_TOKEN")


client = InferenceClient(
    model="HuggingFaceH4/zephyr-7b-beta",
    token=token
)

def career_advisor(question):
    # List of keywords to decide if it's a roadmap question
    roadmap_keywords = ["career", "path", "become", "field", "developer", "engineer", "data", "learn", "AI", "switch", "job", "intern", "roadmap"]

    # Check if question is specific enough to follow roadmap format
    is_specific = any(word.lower() in question.lower() for word in roadmap_keywords)

    if is_specific:
        prompt = f"""<|system|>You are a Senior Career Coach.<|end|>
<|user|>I'm a professional asking: "{question}"
Please answer in this format:
1. Month 1–3: Learn [X] via [Y]
2. Month 4–6: Apply [Z] via [W]
3. Key skills: ...
4. Resource links: ...
5. Salary range: ...
6. Success rate: ...%<|end|>
<|assistant|>"""
    else:
        prompt = f"""<|system|>You are a Senior Career Coach.<|end|>
<|user|>{question}<|end|>
<|assistant|>"""

    response = client.text_generation(prompt, max_new_tokens=512, temperature=0.7)
    return response




if __name__ == "__main__":
    user_question = input("Ask a career question: ")
    reply = career_advisor(user_question)
    print("\n🤖 Career Advisor:\n", reply)