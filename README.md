# Scholarship Eligibility Checker

A modern web application that helps students find eligible scholarships based on their criteria, powered by AI chat assistance using Google's Gemini API.

## 🚀 Live Demo

**[View Live Demo](https://scholarship-finder-ezte.vercel.app)**

## Features

- 📋 **Eligibility Checking**: Input your details (caste, income, state, education level) to find matching scholarships
- 💬 **AI Chat Assistant**: Ask questions about scholarships and get intelligent responses
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📱 **Responsive Design**: Works on all devices
- 🔍 **40+ Scholarships**: Comprehensive database covering all Indian states

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Backend**: Flask (Python)
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Deployment**: Vercel-ready

## Setup

### Prerequisites
- Python 3.11+
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Prajith0820/scheme_checker.git
cd scheme_checker
```

2. Create a virtual environment:
```bash
python3 -m venv backend/venv
source backend/venv/bin/activate  # On Windows: backend\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

4. Create `.env` file in the `backend` directory:
```
GEMINI_API_KEY=your_api_key_here
```

5. Run the server:
```bash
cd backend
python app.py
```

6. Open `frontend/index.html` in your browser or serve it via a local server.

## Project Structure

```
scheme_checker/
├── backend/
│   ├── app.py              # Flask server
│   ├── schemes.json        # Scholarship database
│   ├── requirements.txt    # Python dependencies
│   └── .env               # API keys (not in git)
└── frontend/
    ├── index.html         # Main eligibility checker
    ├── chat.html          # AI chat interface
    ├── scheme.html        # Scheme details page
    ├── script.js          # Main page logic
    └── chat.js            # Chat logic
```

## API Endpoints

- `GET /schemes` - Get all scholarships
- `POST /check` - Check eligibility based on criteria
- `POST /chat` - Chat with AI assistant
- `GET /scheme/:id` - Get specific scholarship details

## Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy!

## License

MIT

## Author

Built with ❤️ using Google Gemini AI
