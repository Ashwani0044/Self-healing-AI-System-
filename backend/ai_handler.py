import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

model = genai.GenerativeModel("gemini-flash-2.5")

def analyze_error(log_text):
    prompt = f"""
                You are an expert backend engineer.

                Explain the error clearly.
                Keep it short.
                Give 2-3 bullet point fixes.

                Error:
                {log_text}
            """
    
    response = model.generate_content(prompt)
    return response.text