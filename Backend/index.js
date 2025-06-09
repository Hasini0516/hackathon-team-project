const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const adviceQueue  = require('./adviceQueue');
const config = require('./config');
require('dotenv').config();
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const { addScrapeJob, getJobStatus } = require('./memoryQueue'); 
const app = express();
app.use(express.json());

// Connect MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
})();


// --- JWT Middleware ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(config.jwtSecret);
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.id;
    next();
  } catch(err) {
      console.error('JWT verification error:', err);
    return res.status(403).json({ msg: 'Invalid token' });
  }
};
const isValidLinkedInUrl = (url) => {
  const pattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?$/;
  return pattern.test(url);
};

// --- 1. Register ---
app.post('/register', async (req, res) => {
      console.log(config.jwtSecret);
  const { email, password, linkedinUrl } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Email & password required' });
      if (linkedinUrl && !isValidLinkedInUrl(linkedinUrl)) {
  return res.status(400).json({ msg: 'Invalid LinkedIn profile URL' });
}
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash, linkedinUrl });
  await user.save();

  return res.status(201).json({ message: 'User registered successfully' });
});

// --- 2. Login ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Email & password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '24h' });
  return res.status(200).json({ accessToken: token, message: 'Login success' });
});

// --- 3. Trigger LinkedIn Scrape ---
app.post('/scrape', authenticate, async (req, res) => {
  console.log(' POST /scrape called, userId=', req.userId);

  try {
    const jobId = addScrapeJob(req.userId);
    return res.status(202).json({ taskId: jobId });
  } catch (err) {
    console.error(' Error enqueueing scrape job:', err);
    return res.status(500).json({ msg: 'Failed to enqueue job', error: err.message });
  }
});

// 3a. Scrape Status
app.get('/scrape/status/:taskId', authenticate, async (req, res) => {
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
app.post('/advice', authenticate, async (req, res) => {
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
app.get('/advice/status/:taskId', authenticate, async (req, res) => {
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
app.post('/conversations', authenticate, async (req, res) => {
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
app.get('/conversations', authenticate, async (req, res) => {
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
app.put('/user/linkedin', authenticate, async (req, res) => {
  const { linkedinUrl } = req.body;
  if (!linkedinUrl) return res.status(400).json({ msg: 'linkedinUrl required' });

  await User.findByIdAndUpdate(req.userId, { linkedinUrl });
  return res.status(200).json({ msg: 'LinkedIn URL updated' });
});

app.use((req, res) => {
  res.status(404).json({ msg: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Internal server error' });
});

// --- Start Server ---
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
