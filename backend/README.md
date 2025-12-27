# Scheme Checker - Setup Instructions

## Setting up Gemini API

To enable the chat assistant feature, you need to configure your Gemini API key:

1. **Get your API key:**
   - Visit https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Configure the API key:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and replace `your_gemini_api_key_here` with your actual API key:
     ```
     GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   python app.py
   ```

The chat assistant will now work properly and generate responses like a real GPT!

## Testing the Chat

1. Open `frontend/index.html` in your browser
2. Fill in your details and check for eligible schemes
3. Click on a scheme to view details
4. Click "Chat with AI Assistant" to ask questions about the scheme

The AI will answer questions based on the scheme details such as:
- "What are the eligibility criteria?"
- "What documents do I need?"
- "How do I apply?"
- "What is the income limit?"
