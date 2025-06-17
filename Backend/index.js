console.log('index.js: Script started.');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const config = require('./config');
const auth = require('./middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const careerIntelligenceService = require('./services/careerIntelligenceService');
const jobService = require('./services/jobService');
const hfService = require('./services/hfService');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// --- API Router ---
const apiRouter = express.Router();
console.log('index.js: apiRouter created.');

app.get('/', (req, res) => {
  res.send('API is live 🎉');
});

// Public Routes
apiRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user.password);
        if (!user || !(user.password=== password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id }, config.jwtSecret);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/register', async (req, res) => {
    try {
        const { userId, email, password, fullName, headline, location } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userId, email, password: hashedPassword, fullName, headline, location });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, config.jwtSecret);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

apiRouter.get('/test', (req, res) => {
  console.log('apiRouter: /test endpoint hit.');
  res.json({ message: 'Test endpoint reached successfully!' });
});

// Apply auth middleware to all routes below this line in apiRouter
apiRouter.use(auth);

// Protected Routes
apiRouter.post('/morning-briefing', async (req, res) => {
    console.log('User ID:', req.userId);

    try {
        const briefing = await careerIntelligenceService.getMorningBriefing(req.userId);
        res.json(briefing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

apiRouter.get('/career-pathways', async (req, res) => {
    try {
        const pathways = await careerIntelligenceService.getCareerPathways(req.userId);
        res.json(pathways);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

apiRouter.get('/job-listings', async (req, res) => {
    const { title, location } = req.query;
    if (!title || !location) {
        return res.status(400).json({ error: 'title and location query params required' });
    }
    try {
        const jobs = await jobService.getJobs(title, location);
        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Career Advice Endpoint
apiRouter.post('/career-advice', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }
        const advice = await hfService.getCareerAdvice(question);
        res.json({ advice });
    } catch (error) {
        console.error('Error in career advice:', error);
        res.status(500).json({ error: error.message });
    }
});


app.use('/api', apiRouter);

// Generic 404 handler
app.use((req, res) => {
  console.log(`404: Endpoint not found for path: ${req.originalUrl}`);
  res.status(404).json({ msg: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ msg: 'Internal server error' });
});


// Start server
const PORT = config.port || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
