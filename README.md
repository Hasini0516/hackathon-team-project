##LinkedIn Career Intelligence Agent

AI-powered career advisory system that analyzes LinkedIn profiles and provides personalized career guidance using GPT-4.
🚀 Features

    LinkedIn profile scraping and analysis
    AI-powered career advice with GPT-4
    Real-time chat interface
    Background processing with Celery
    Career level assessment and skill recommendations

🛠️ Tech Stack

Backend: Flask, SQLAlchemy, Celery, Redis, JWT Scraping: Selenium, BeautifulSoup4 AI: OpenAI GPT-4, LangChain Database: SQLite/PostgreSQL
📦 Quick Setup
Prerequisites

    Python 3.8+, Redis, Chrome browser
    OpenAI API key, LinkedIn account

Installation

bash

# Clone and setup
git clone https://github.com/your-username/linkedin-career-agent.git
cd linkedin-career-agent/backend

# Install dependencies
pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Edit .env with your API keys and credentials

# Database setup
flask db upgrade

# Start services
redis-server                                    # Terminal 1
celery -A app.celery worker --loglevel=info    # Terminal 2  
python app.py                                  # Terminal 3

🔧 Environment Variables

env

DATABASE_URL=sqlite:///career_agent.db
JWT_SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key
REDIS_URL=redis://localhost:6379/0
LINKEDIN_EMAIL=your-email
LINKEDIN_PASSWORD=your-password

📚 API Endpoints

POST /api/auth/register          # User registration
POST /api/auth/login             # User login
POST /api/profile/analyze        # Analyze LinkedIn profile
GET  /api/profile/list           # List analyzed profiles
POST /api/chat/message           # Get career advice
GET  /api/chat/history           # Chat history

🚀 Usage Example

bash

# 1. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Analyze LinkedIn profile
curl -X POST http://localhost:5000/api/profile/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"linkedin_url":"https://linkedin.com/in/username"}'

# 3. Get career advice
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"How to transition to product management?"}'

📁 Project Structure

backend/
├── app.py                    # Flask app entry point
├── config.py                 # Configuration
├── models/                   # Database models
├── services/                 # LinkedIn scraper & AI processor
├── routes/                   # API endpoints
├── tasks/                    # Background tasks
└── utils/                    # Helper functions

⚠️ Important Notes

    Rate Limits: 50 LinkedIn profiles/hour, 2-second delays
    Security: Stealth scraping techniques, JWT authentication
    Performance: Redis caching, background processing
    AI Processing: ~5 seconds per career advice query

🐛 Troubleshooting

bash

# Redis issues
redis-cli ping

# Database issues  
flask db upgrade

# Chrome driver issues
pip install --upgrade selenium

📄 License

MIT License - see LICENSE file for details.

API runs on http://localhost:5000
