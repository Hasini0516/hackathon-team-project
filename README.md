# 🤖 LinkedIn Career Intelligence Agent
**AI-powered career advisory system that analyzes LinkedIn profiles and provides personalized guidance using an Agentic AI architecture with GPT-4 and LangChain.**

---

## 🚀 Features
- 🔗 **LinkedIn profile scraping & analysis** with improved error handling and manual login support
- 🧠 **Agentic AI** powered by GPT-4 & LangChain
- 💬 Real-time chat interface
- 🔄 Background processing with Celery
- 📊 Career level assessment, job market fit, and skill recommendations
- 🔒 Secure authentication with JWT
- 📝 Conversation history tracking

---

## 🧠 Agentic AI Architecture
Powered by **LangChain Agents** and **Tools**:
- **Agent Role:** Career strategist that decides which tools to invoke
- **Tools:**
 - LinkedIn Scraper Tool (via Puppeteer with manual login support)
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
- **Backend:** Node.js, Express, Mongoose, Bull (for queues), JWT
- **AI Layer:** OpenAI GPT-4, LangChain Agents, Chains, Tools, Memory
- **Scraping:** Puppeteer with improved error handling
- **Database:** MongoDB (via Mongoose)
- **API Client:** Axios (for external API calls)
- **Authentication:** JWT-based auth system

---

## 📦 Quick Setup

### Prerequisites
- Node.js (LTS version recommended)
- MongoDB (running instance)
- Chrome browser (for Puppeteer)
- OpenAI API key (if using OpenAI services)

---

### Installation

```bash
# Clone and setup
git clone https://github.com/Hasini0516/hackathon-team-project.git
cd hackathon-team-project/Backend

# Install Node.js dependencies
npm install

# Setup environment variables (create a .env file based on .env.example)
cp .env.example .env
# Fill in API keys and credentials in .env file (e.g., MONGO_URI, JWT_SECRET)
```

### Running the Backend

```bash
# Start the Node.js backend server
npm start

# Or, for development with nodemon:
npm run dev
```

### LinkedIn Scraper Usage
The LinkedIn scraper now supports manual login for better reliability:
1. When you make a request to scrape a profile, a browser window will open
2. Log in to LinkedIn manually in the browser window
3. Navigate to the profile you want to scrape
4. The scraper will automatically extract the profile data

---

## 🔄 Agentic Flow
```
User Input ─▶ LangChain Agent
                 │
         ┌───────┴────────┐
         ▼                ▼
   Tool: LinkedIn Scraper   Tool: Job Market Analyzer
         ▼                ▼
      Tool: Skill Gap Evaluator ─▶ Chain: Career Roadmap Generator
         ▼
      Final Answer ▶ Returned to User
```

## 🔗 Local Dev URLs
- API: http://localhost:8080
- Frontend UI: http://localhost:3000 (if connected)

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
