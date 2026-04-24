from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

def analyze_error(log_text):
    prompt = f"""
    You are an expert backend engineer.
    Explain the error clearly. Keep it very short.
    Give 2-3 bullet point fixes.
    Don't include any "\n" like signs just the content in well structured way.
    
    Error: {log_text}
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=prompt
    )
    
    return response.text
