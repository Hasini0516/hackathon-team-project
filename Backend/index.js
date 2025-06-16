console.log('index.js: Script started.');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const config = require('./config');
const auth = require('./middleware/auth');
const { getLinkedInClient, handleChatRequest, handleLinkedInProfileRequest } = require('./api');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const adviceQueue = require('./adviceQueue');
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const { addScrapeJob, getJobStatus } = require('./memoryQueue');
const { getCareerAdvice } = require('./services/hfService');
const { getJobs } = require('./services/jobService');
const careerIntelligenceService = require('./services/careerIntelligenceService');
const LinkedInScraper = require('./scraper');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// --- API Router ---
const apiRouter = express.Router();
console.log('index.js: apiRouter created.');

// Unprotected routes
app.get('/', (req, res) => {
  res.send('API is live 🎉');
});

apiRouter.post('/register', async (req, res) => {
    try {
        const { email, password, name, linkedinUrl, careerGoals, skills } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({
            email,
            password,
            name,
            linkedinUrl,
            careerGoals,
            skills
        });
        await user.save();

        res.status(201).json({ message:"User created successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

apiRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id }, config.jwtSecret);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Temporary test endpoint
apiRouter.get('/test', (req, res) => {
  console.log('apiRouter: /test endpoint hit.');
  res.json({ message: 'Test endpoint reached successfully!' });
});

// Apply auth middleware to all routes below this line in apiRouter
apiRouter.use(auth);

// Protected routes
apiRouter.post('/chat', handleChatRequest);
apiRouter.post('/linkedin/profile', handleLinkedInProfileRequest);

// --- 3. Trigger LinkedIn Scrape ---
apiRouter.post('/scrape', async (req, res) => {
    console.log(`[SCRAPE] POST /scrape called by userId=${req.userId}`);
    try {
        const { linkedinUrl } = req.body;
        if (!linkedinUrl) {
            return res.status(400).json({ error: 'LinkedIn URL is required' });
        }

        const jobId = addScrapeJob(req.userId, linkedinUrl);
        console.log(`[SCRAPE] Job enqueued: jobId=${jobId} for userId=${req.userId}`);
        return res.status(202).json({ taskId: jobId });
    } catch (err) {
        console.error(`[SCRAPE] Error enqueueing job for userId=${req.userId}:`, err.stack || err);
        return res.status(500).json({ error: 'Failed to enqueue job', message: err.message });
    }
});


apiRouter.get('/jobs', async (req, res) => {
  // expect query params: title and location
  const { title, location } = req.query;
  if (!title || !location) {
    return res.status(400).json({ msg: 'title and location query params required' });
  }
  try {
    const jobs = await getJobs(title, location);
    // you can limit or format the response
    const top5 = jobs.slice(0, 5).map(job => ({
      title: job.job_title,
      employer: job.employer_name,
      location: `${job.job_city}, ${job.job_country}`,
      link: job.job_apply_link
    }));
    return res.status(200).json({ jobs: top5 });
  } catch (err) {
    console.error('[JOBS] Error:', err);
    return res.status(500).json({ msg: 'Failed to fetch jobs' });
  }
});

// 3a. Scrape Status
apiRouter.get('/scrape/status/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const statusObj = getJobStatus(taskId);

  if (!statusObj) {
    return res.status(404).json({ status: 'not found' });
  }

  if (statusObj.status === 'pending') {
    return res.status(202).json({ status: 'pending' });
  }

  // job finished
  if (statusObj.status === 'success') {
    return res.status(200).json({ status: statusObj.result });
  } else {
    // failure
    return res.status(500).json({ status: 'failure', error: statusObj.error });
  }
});

// --- 4. Ask for Career Advice (Stub) ---
apiRouter.post('/advice', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ msg: 'Question required' });

    const job = adviceQueue.add({ userId: req.userId, question });
    return res.status(202).json({ taskId: job.id });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
});

// 4a. Advice Status
apiRouter.get('/advice/status/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const statusObj = adviceQueue.getStatus(taskId);

  if (!statusObj) {
    return res.status(404).json({ status: 'not found' });
  }

  if (statusObj.status === 'pending') {
    return res.status(202).json({ status: 'pending' });
  }

  if (statusObj.status === 'success') {
    return res.status(200).json({ status: 'success', result: statusObj.result });
  }

  return res.status(500).json({ status: 'failure', error: statusObj.error });
});


apiRouter.post('/career-advisor', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ msg: 'Question required' });
  try {
    const advice = await getCareerAdvice(question);
    return res.status(200).json({ advice });
  } catch (err) {
    console.error('[CAREER-ADVISOR] Error:', err);
    return res.status(500).json({ msg: 'Failed to get advice' });
  }
});

// post conversation
apiRouter.post('/conversations', async (req, res) => {
    try {
        const { history, aiResponses } = req.body;

        if (!history || !aiResponses) {
            return res.status(400).json({ error: 'history and aiResponses are required' });
        }

        const newConv = new Conversation({
            userId: req.userId,
            history,
            aiResponses
        });

        await newConv.save();
        console.log(`[CONVERSATION] Saved conversation for userId=${req.userId}`);

        return res.status(201).json({
            message: 'Conversation saved',
            conversationId: newConv._id
        });
    } catch (err) {
        console.error('[CONVERSATION] Error saving conversation:', err);
        return res.status(500).json({ error: 'Failed to save conversation' });
    }
});

// --- 5. Get Conversations ---
apiRouter.get('/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.userId })
            .sort({ updatedAt: -1 });

        console.log(`[CONVERSATION] Retrieved ${conversations.length} conversations for userId=${req.userId}`);

        return res.status(200).json(conversations.map(conv => ({
            id: conv._id,
            history: conv.history,
            aiResponses: conv.aiResponses,
            lastUpdated: conv.updatedAt
        })));
    } catch (err) {
        console.error('[CONVERSATION] Error retrieving conversations:', err);
        return res.status(500).json({ error: 'Failed to retrieve conversations' });
    }
});

// --- 6. Update LinkedIn URL ---
apiRouter.put('/user/linkedin', async (req, res) => {
  const { linkedinUrl } = req.body;
  if (!linkedinUrl) return res.status(400).json({ msg: 'linkedinUrl required' });

  await User.findByIdAndUpdate(req.userId, { linkedinUrl });
  return res.status(200).json({ msg: 'LinkedIn URL updated' });
});

// --- New API Endpoints for Career Intelligence Agent ---

// 7. Conversational Career Strategist
apiRouter.post('/career-strategist', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        if (!message) return res.status(400).json({ msg: 'Message required' });
        console.log(`[CHATBOT] POST /api/career-strategist by userId=${req.userId} message="${message}"`);
        const strategy = await careerIntelligenceService.getCareerStrategy(
            req.userId,
            message,
            conversationHistory
        );
        console.log(`[CHATBOT] Strategy generated for userId=${req.userId}`);
        return res.status(200).json(strategy);
    } catch (error) {
        console.error('[CHATBOT] Error in career strategist:', error.stack || error);
        return res.status(500).json({ msg: 'Failed to get career strategy', error: error.message });
    }
});

// 8. Predictive Career Pathway Intelligence
apiRouter.get('/career-pathways', async (req, res) => {
    try {
        const pathways = await careerIntelligenceService.getCareerPathways(req.userId);
        return res.status(200).json(pathways);
    } catch (error) {
        console.error('Error in predictive career pathways:', error);
        return res.status(500).json({ msg: 'Failed to get career pathways', error: error.message });
    }
});

// 9. Active Network Strategy Engine
apiRouter.post('/network-strategy', async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) return res.status(400).json({ msg: 'Goal required' });

        const strategy = await careerIntelligenceService.getNetworkStrategy(req.userId, goal);
        return res.status(200).json(strategy);
    } catch (error) {
        console.error('Error in network strategy:', error.stack || error);
        return res.status(500).json({ msg: 'Failed to get network strategy', error: error.message });
    }
});

// 10. Market Intelligence Hub
apiRouter.get('/market-intelligence', async (req, res) => {
    try {
        const insights = await careerIntelligenceService.getMarketIntelligence(req.userId);
        return res.status(200).json(insights);
    } catch (error) {
        console.error('Error in market intelligence:', error.stack || error);
        return res.status(500).json({ msg: 'Failed to get market intelligence', error: error.message });
    }
});

// 11. Personal Brand Building Assistant
apiRouter.post('/brand-building', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ msg: 'Query required' });

        const brandBuildingContent = await careerIntelligenceService.getBrandBuildingContent(req.userId, query);
        return res.status(200).json(brandBuildingContent);
    } catch (error) {
        console.error('Error in personal brand building:', error.stack || error);
        return res.status(500).json({ msg: 'Failed to get personal brand building content', error: error.message });
    }
});

// Apply the apiRouter to the /api base path
console.log('index.js: Attempting to mount apiRouter to /api');
app.use('/api', apiRouter);

// Generic 404 handler
app.use((req, res) => {
  console.log(`index.js: 404: Endpoint not found for path: ${req.originalUrl}`);
  res.status(404).json({ msg: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER] An error occurred:', err); // Log the actual error object
  if (err.stack) {
    console.error('[GLOBAL ERROR HANDLER] Stack trace:', err.stack);
  }
  res.status(500).json({ msg: 'Internal server error' });
});

// Start server
const PORT = config.port || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
