# 🤖 Career Intelligence Backend

A Node.js-based backend service that provides personalized career guidance and job market insights.

## 🚀 Core Features

- 📊 **Morning Career Briefing**
  - Personalized daily career insights
  - Industry trends and growth tips
  - Recommended actions for career development

- 🛣️ **Career Pathways**
  - Current role analysis
  - Potential career progression paths
  - Required skills and timeline for each path
  - Personalized recommendations

- 🔍 **Job Listings**
  - Search jobs by title and location
  - Detailed job information
  - Required skills and salary ranges
  - Application links

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT-based auth system
- **API Client:** Axios
- **Environment:** dotenv for configuration

## 📦 Setup & Installation

### Prerequisites
- Node.js (LTS version)
- MongoDB (running instance)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/career-intelligence.git
cd career-intelligence/Backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
```

### Environment Variables
Create a `.env` file with the following variables:
```
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 🔒 API Endpoints

### Protected Routes (Require JWT Authentication)

1. **Morning Briefing**
   ```
   GET /api/morning-briefing
   ```
   Returns personalized career insights and recommendations.

2. **Career Pathways**
   ```
   GET /api/career-pathways
   ```
   Returns potential career paths based on user profile.

3. **Job Listings**
   ```
   GET /api/job-listings?title={jobTitle}&location={location}
   ```
   Returns job listings matching the search criteria.

## 🧪 Testing

Test the endpoints using the provided test script:
```bash
# Run the test script
node test.js
```

## 📝 Project Structure

```
Backend/
├── services/           # Business logic services
├── models/            # Database models
├── middleware/        # Express middleware
├── utils/            # Utility functions
├── config.js         # Configuration
└── index.js          # Main application file
```

## 🔄 Development

```bash
# Start development server
npm run dev

# Run tests
npm test
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
