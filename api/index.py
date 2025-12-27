from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load schemes from backend directory
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
schemes_path = os.path.join(backend_dir, 'schemes.json')

with open(schemes_path, 'r') as f:
    schemes = json.load(f)

@app.route("/")
@app.route("/api")
def home():
    return {"message": "Scheme Checker Backend Running"}

@app.route("/api/check", methods=["POST"])
def check_schemes():
    user = request.json
    eligible = []

    for scheme in schemes:
        if (
            user["student_type"] == scheme["student_type"]
            and user["year"] in scheme["year"]
            and user["category"] in scheme["category"]
            and user["income"] <= scheme["income_limit"]
            and (scheme["state"] == "All" or user["state"] == scheme["state"])
        ):
            eligible.append(scheme)

    return jsonify(eligible)

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_question = data.get("question", "")
        scheme = data.get("scheme", {})

        prompt = f"""
You are an AI assistant that answers questions about government
student scholarship schemes.

Use ONLY the information provided in the scheme details.
If the information is not clearly mentioned, say that it depends
on official guidelines and suggest checking the official website.

Scheme Details:
Name: {scheme.get('name')}
Eligible Category: {', '.join(scheme.get('category', []))}
Income Limit: {scheme.get('income_limit')}
State: {scheme.get('state')}
Benefits: {scheme.get('benefits')}
Documents Required: {', '.join(scheme.get('documents', []))}
How to Apply: {scheme.get('how_to_apply')}
Deadline: {scheme.get('deadline')}

Student Question:
{user_question}
"""

        # Get API key from environment
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            print("ERROR: GEMINI_API_KEY not found in environment variables")
            return jsonify({
                "answer": "Error: API key not configured. Please set GEMINI_API_KEY environment variable."
            })
        
        # Remove any quotes from API key
        api_key = api_key.strip('"').strip("'")
        
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

        response = requests.post(
            f"{url}?key={api_key}",
            json={
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ]
            },
            timeout=30
        )

        result = response.json()
        
        # Check for API errors
        if "error" in result:
            error_msg = result["error"].get("message", "Unknown API error")
            print(f"Gemini API Error: {error_msg}")
            return jsonify({
                "answer": f"API Error: {error_msg}"
            })

        # STRICT parsing: AI answer only
        if (
            "candidates" in result
            and len(result["candidates"]) > 0
            and "content" in result["candidates"][0]
            and "parts" in result["candidates"][0]["content"]
            and len(result["candidates"][0]["content"]["parts"]) > 0
            and "text" in result["candidates"][0]["content"]["parts"][0]
        ):
            return jsonify({
                "answer": result["candidates"][0]["content"]["parts"][0]["text"]
            })

        # If AI did not respond
        print(f"Unexpected API response structure: {result}")
        return jsonify({
            "answer": "The AI could not generate a response for this question."
        })

    except Exception as e:
        print(f"CHAT ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "answer": f"An error occurred while contacting the AI service: {str(e)}"
        })
