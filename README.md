# 🤖 LinkedIn Career Intelligence Agent
**AI-powered career advisory system that analyzes LinkedIn profiles and provides personalized guidance using an Agentic AI architecture with GPT-4 and LangChain.**

---

## 🚀 Features
- 🔗 **LinkedIn profile scraping & analysis**
- 🧠 **Agentic AI** powered by GPT-4 & LangChain
- 💬 Real-time chat interface
- 🔄 Background processing with Celery
- 📊 Career level assessment, job market fit, and skill recommendations

---

## 🧠 Agentic AI Architecture
Powered by **LangChain Agents** and **Tools**:
- **Agent Role:** Career strategist that decides which tools to invoke
- **Tools:**
 - LinkedIn Scraper Tool (via Selenium)
 - Resume/Skill Parser Tool
 - Job Market Insights Tool (mocked or integrated with APIs)
 - Prompt Generator for role-based advice
- **Memory:** Stores chat history, analyzed profiles, and goals
- **Chains:**
 - Profile Analysis Chain
 - Career Roadmap Generator Chain
 - Skill Gap Analysis Chain

Agents dynamically select tools based on user queries to provide goal-driven, adaptive guidance.

---

## 🛠️ Tech Stack
- **Backend:** Flask, SQLAlchemy, Celery, Redis, JWT  
- **AI Layer:** OpenAI GPT-4, LangChain Agents, Chains, Tools, Memory  
- **Scraping:** Selenium, BeautifulSoup4  
- **Database:** SQLite / PostgreSQL  

---

## 📦 Quick Setup

### Prerequisites
- Python 3.8+  
- Redis  
- Chrome browser  
- OpenAI API key  
- LinkedIn credentials  

---

### Installation

# Clone and setup
git clone https://github.com/your-username/linkedin-career-agent.git
cd linkedin-career-agent/backend

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Fill in API keys and credentials

# Migrate database
flask db upgrade

# Start backend services
redis-server                                    # Terminal 1
celery -A app.celery worker --loglevel=info    # Terminal 2  
python app.py                                  # Terminal 3

🔄 Agentic Flow
 User Input ─▶ LangChain Agent
                 │
         ┌───────┴────────┐
         ▼                ▼
   Tool: LinkedIn Scraper   Tool: Job Market Analyzer
         ▼                ▼
      Tool: Skill Gap Evaluator ─▶ Chain: Career Roadmap Generator
         ▼
      Final Answer ▶ Returned to User

🔗 Local Dev URLs

-API: http://localhost:5000
-Frontend UI: http://localhost:3000 (if connected)


🤝 Contributing

-Fork the repository
-Create your feature branch (git checkout -b feature/AmazingFeature)
-Commit your changes (git commit -m 'Add some AmazingFeature')
-Push to the branch (git push origin feature/AmazingFeature)
-Open a Pull Request


📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
