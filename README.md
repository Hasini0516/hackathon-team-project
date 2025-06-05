# 🤖 LinkedIn Career Intelligence Agent

**AI-powered career advisory system that analyzes LinkedIn profiles and provides personalized career guidance using GPT-4.**

---

## 🚀 Features

- LinkedIn profile scraping and analysis  
- AI-powered career advice with GPT-4  
- Real-time chat interface  
- Background processing with Celery  
- Career level assessment and skill recommendations  

---

## 🛠️ Tech Stack

- **Backend:** Flask, SQLAlchemy, Celery, Redis, JWT  
- **Scraping:** Selenium, BeautifulSoup4  
- **AI:** OpenAI GPT-4, LangChain  
- **Database:** SQLite / PostgreSQL  

---

## 📦 Quick Setup

### Prerequisites

- Python 3.8+  
- Redis  
- Chrome browser  
- OpenAI API key  
- LinkedIn account  

---

### Installation

```bash
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
