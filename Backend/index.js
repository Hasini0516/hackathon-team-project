require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const config = require('./config');
const auth = require('./middleware/auth');
const { getLinkedInClient } = require('./api');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const adviceQueue  = require('./adviceQueue');
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const { addScrapeJob, getJobStatus } = require('./memoryQueue');
const careerIntelligenceService = require('./services/careerIntelligenceService');
const LinkedInScraper = require('./scraper');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, linkedinUrl } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const user = new User({ email, password, linkedinUrl });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, config.jwtSecret);
        res.status(201).json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
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

// Protected routes
app.use('/api/career-strategist', auth);
app.use('/api/career-pathways', auth);
app.use('/api/network-strategy', auth);
app.use('/api/market-intelligence', auth);
app.use('/api/brand-building', auth);

// --- 3. Trigger LinkedIn Scrape ---
app.post('/scrape', auth, async (req, res) => {
  console.log(`[SCRAPE] POST /scrape called by userId=${req.userId}`);
  try {
    const jobId = addScrapeJob(req.userId);
    console.log(`[SCRAPE] Job enqueued: jobId=${jobId} for userId=${req.userId}`);
    return res.status(202).json({ taskId: jobId });
  } catch (err) {
    console.error(`[SCRAPE] Error enqueueing job for userId=${req.userId}:`, err.stack || err);
    return res.status(500).json({ msg: 'Failed to enqueue job', error: err.message });
  }
});

// 3a. Scrape Status
app.get('/scrape/status/:taskId', auth, async (req, res) => {
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
app.post('/advice', auth, async (req, res) => {
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
app.get('/advice/status/:taskId', auth, async (req, res) => {
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

// post conversation
app.post('/conversations', auth, async (req, res) => {
  const { history, aiResponses } = req.body;

  if (!history || !aiResponses) {
    return res.status(400).json({ msg: 'history and aiResponses are required' });
  }

  try {
    const newConv = new Conversation({
      userId: req.userId,
      history,
      aiResponses
    });

    await newConv.save();

    return res.status(201).json({ msg: 'Conversation saved', conversationId: newConv._id });
  } catch (err) {
    console.error('Error saving conversation:', err);
    return res.status(500).json({ msg: 'Failed to save conversation' });
  }
});

// --- 5. Get Conversations ---
app.get('/conversations', auth, async (req, res) => {
  const convs = await Conversation.find({ userId: req.userId }).sort({ updatedAt: -1 });
  const output = convs.map((c) => ({
    id: c._id,
    history: c.history,
    aiResponses: c.aiResponses,
    lastUpdated: c.updatedAt
  }));
  return res.status(200).json(output);
});

// --- 6. Update LinkedIn URL ---
app.put('/user/linkedin', auth, async (req, res) => {
  const { linkedinUrl } = req.body;
  if (!linkedinUrl) return res.status(400).json({ msg: 'linkedinUrl required' });

  await User.findByIdAndUpdate(req.userId, { linkedinUrl });
  return res.status(200).json({ msg: 'LinkedIn URL updated' });
});

// --- New API Endpoints for Career Intelligence Agent ---

// 7. Conversational Career Strategist
app.post('/api/career-strategist', auth, async (req, res) => {
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
app.get('/api/career-pathways', auth, async (req, res) => {
    try {
        const pathways = await careerIntelligenceService.getCareerPathways(req.userId);
        return res.status(200).json(pathways);
    } catch (error) {
        console.error('Error in predictive career pathways:', error);
        return res.status(500).json({ msg: 'Failed to get career pathways', error: error.message });
    }
});

// 9. Active Network Strategy Engine
app.post('/api/network-strategy', auth, async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) return res.status(400).json({ msg: 'Goal required' });

        const strategy = await careerIntelligenceService.getNetworkStrategy(req.userId, goal);
        return res.status(200).json(strategy);
    } catch (error) {
        console.error('Error in network strategy:', error);
        return res.status(500).json({ msg: 'Failed to get network strategy', error: error.message });
    }
});

// 10. Real-Time Market Intelligence
app.get('/api/market-intelligence', auth, async (req, res) => {
    try {
        const intelligence = await careerIntelligenceService.getMarketIntelligence(req.userId);
        return res.status(200).json(intelligence);
    } catch (error) {
        console.error('Error in market intelligence:', error);
        return res.status(500).json({ msg: 'Failed to get market intelligence', error: error.message });
    }
});

// 11. Automated Professional Brand Building
app.post('/api/brand-building', auth, async (req, res) => {
    try {
        const { focusArea } = req.body;
        if (!focusArea) return res.status(400).json({ msg: 'Focus area required' });

        const strategy = await careerIntelligenceService.getBrandBuildingStrategy(req.userId, focusArea);
        return res.status(200).json(strategy);
    } catch (error) {
        console.error('Error in brand building:', error);
        return res.status(500).json({ msg: 'Failed to generate brand building strategy', error: error.message });
    }
});

// 12. Morning Career Briefing
app.get('/api/morning-briefing', auth, async (req, res) => {
    try {
        const briefing = await careerIntelligenceService.getMorningBriefing(req.userId);
        return res.status(200).json(briefing);
    } catch (error) {
        console.error('Error in morning briefing:', error);
        return res.status(500).json({ msg: 'Failed to get morning briefing', error: error.message });
    }
});

// Scrape the logged-in user's LinkedIn profile (manual login flow)
app.post('/scrape-profile', auth, async (req, res) => {
  try {
    console.log(`[SCRAPE-PROFILE] POST /scrape-profile for userId="${req.userId}" (manual login flow)`);
    const scraper = new LinkedInScraper();
    const profile = await scraper.scrapeAndSaveProfile(req.userId);
    console.log(`[SCRAPE-PROFILE] Success for userId="${req.userId}"`);
    return res.status(200).json({ scrapedData: profile.rawData });
  } catch (error) {
    console.error(`[SCRAPE-PROFILE] Error scraping for userId="${req.userId}":`, error.stack || error);
    return res.status(500).json({ error: 'Failed to scrape profile', details: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ msg: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER]', err.stack || err);
  res.status(500).json({ msg: 'Internal server error' });
});

// Start server
const PORT = config.port || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
