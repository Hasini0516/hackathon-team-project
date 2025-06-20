# 🚀 CareerPro 

A full-stack platform for personalized career guidance, job market insights, and professional growth powered by Node.js, React, and Python ML.

---

## 🗂️ Project Structure

```
hackathon-team-project/
├── Backend/           # Node.js/Express backend (API, DB, Auth, Integrations)
├── frontend/          # React + Vite frontend (user interface)
├── morning_brief/     # Python Flask ML microservice (morning briefing)
├── career-agent/      # (Optional) Additional Python microservice
└── README.md          # Main project documentation
```

---

## 🌟 Features

- **User Authentication** (JWT-based)
- **Personalized Morning Briefing** (ML-powered, Python Flask)
- **Career Pathways & Insights**
- **Job Listings** (via RapidAPI)
- **Career Advice** (via Hugging Face API)
- **Profile Management**
- **Modern, Responsive UI** (React + Tailwind)

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Axios
- **ML Service:** Python, Flask
- **Integrations:** Hugging Face, RapidAPI (Job Search)
- **Deployment:** GitHub Pages (frontend), Render/Railway/Heroku (backend & Python recommended)

---

## ⚡ Quick Start

### 1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd hackathon-team-project
```

### 2. **Backend Setup**
```bash
cd Backend
npm install
# Set up .env with:
# MONGO_URI=your_mongo_uri
# JWT_SECRET=your_jwt_secret
# HF_TOKEN=your_huggingface_token
# RAPIDAPI_KEY=your_rapidapi_key
npm start
```

### 3. **Python ML Service Setup**
```bash
cd ../morning_brief
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 morning_briefing_model.py
```

### 4. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

- **Backend:**  
  ```bash
  cd Backend
  node test.js
  ```
- **Frontend:**  
  Manual testing via browser.

---

## 🔑 Environment Variables

**Backend (`Backend/.env`):**
```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_token
RAPIDAPI_KEY=your_rapidapi_key
```

**Python ML Service (`morning_brief/.env` if needed):**
- Add any required tokens/keys for your ML model.

---

## 📁 Directory Details

- **Backend/**: Node.js API, MongoDB models, JWT auth, integrations.
- **frontend/**: React app, routes, components, API calls.
- **morning_brief/**: Python Flask app for ML-powered morning briefings.
- **career-agent/**: (Optional) Additional Python microservice.

---

## 📄 License

This project is licensed under the MIT License.


