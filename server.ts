import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure db directory and database structure exist
const DB_FILE = path.join(process.cwd(), 'db.json');

// Initialize template profile helper
function calculateLevel(xp: number): number {
  if (xp >= 5000) return 8;
  if (xp >= 3500) return 7;
  if (xp >= 2000) return 6;
  if (xp >= 1000) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

function getXpToNextLevel(xp: number, currentLevel: number): number {
  const levelXpTargets: { [level: number]: number } = {
    1: 100,
    2: 250,
    3: 500,
    4: 1000,
    5: 2000,
    6: 3500,
    7: 5000,
    8: 5000,
  };
  const target = levelXpTargets[currentLevel] || 5000;
  return Math.max(0, target - xp);
}

function generateEmptyProfile(username: string, email: string): any {
  return {
    username,
    email,
    role: 'Student',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 1,
    weeklyStreak: 1,
    completedTopics: [],
    completedQuizzedTopics: [],
    bookmarks: [],
    completedChallenges: [],
    completedProjects: [],
    timeSpentMinutes: 0,
    consistencyScore: 85,
    projectedCompletionDate: '2026-12-15',
    notes: {},
    rewards: [],
  };
}

// Read/write helpers for persistent file-based JSON DB
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = {
        users: {
          'demo@gmail.com': {
            email: 'demo@gmail.com',
            username: 'HarshaDev',
            passwordHash: 'argon2_or_bcrypt_mock', // Mock hash
            profile: generateEmptyProfile('HarshaDev', 'demo@gmail.com')
          }
        },
        leaderboard: [
          { username: "Sarah_Dev", role: "Student", xp: 12450, level: 14, streak: 28 },
          { username: "AlexCodenoob", role: "Student", xp: 10800, level: 12, streak: 15 },
          { username: "HarshaDev", role: "Student", xp: 0, level: 1, streak: 1 },
          { username: "HackerOne", role: "Student", xp: 8750, level: 9, streak: 22 },
          { username: "ByteSized", role: "Student", xp: 7420, level: 8, streak: 6 },
          { username: "CodeSprint", role: "Student", xp: 6200, level: 7, streak: 12 }
        ]
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database file", err);
    return { users: {}, leaderboard: [] };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to database file", err);
  }
}

const app = express();
app.use(express.json());

// Initialize server-side Google GenAI with recommended telemetry User-Agent header
let aiClient: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;
if (api_key) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log("Gemini Client initialized successfully using server key.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is missing from env variables. AI assistance routes will operate in mock mode.");
}

// Track active sessions in memory
let activeSessionEmail: string | null = 'demo@gmail.com'; // Default user auto-log is demo

// API ROUTINGS

// Register
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are strictly required.' });
  }

  const db = readDB();
  if (db.users[email]) {
    return res.status(400).json({ error: 'Email has already been registered.' });
  }

  const newProfile = generateEmptyProfile(username, email);
  if (role) {
    newProfile.role = role === 'Admin' || role === 'Mentor' ? role : 'Student';
  }

  db.users[email] = {
    email,
    username,
    passwordHash: 'secured_mock_hash',
    profile: newProfile
  };

  // Insert into leaderboard if not exists
  if (!db.leaderboard.find((u: any) => u.username === username)) {
    db.leaderboard.push({
      username,
      role: newProfile.role,
      xp: 0,
      level: 1,
      streak: 1
    });
  }

  writeDB(db);
  activeSessionEmail = email;
  res.status(201).json({ success: true, profile: newProfile });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = readDB();
  const user = db.users[email];
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or secret credentials.' });
  }

  activeSessionEmail = email;
  res.status(200).json({ success: true, profile: user.profile });
});

// Logout
app.post('/api/logout', (req, res) => {
  activeSessionEmail = null;
  res.status(200).json({ success: true });
});

// Forgot Password
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  // Simulated OTP logic
  res.status(200).json({
    success: true,
    message: `Resetted code stream. Secret 6-digit OTP verification code sent successfully to ${email}.`
  });
});

// Verify OTP (Forgot Password continuation)
app.post('/api/verify-otp', (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Verification elements are missing.' });
  }
  res.status(200).json({
    success: true,
    message: 'OTP verified. Password updated successfully!'
  });
});

// Profile Lookup
app.get('/api/profile', (req, res) => {
  if (!activeSessionEmail) {
    return res.status(401).json({ error: 'Unauthorized configuration. Please sign in.' });
  }
  const db = readDB();
  const user = db.users[activeSessionEmail];
  if (!user) {
    return res.status(404).json({ error: 'Profile metadata not found.' });
  }
  res.status(200).json(user.profile);
});

// Save user progress
app.post('/api/save-progress', (req, res) => {
  if (!activeSessionEmail) {
    return res.status(401).json({ error: 'Unauthorized activity logs update.' });
  }

  const {
    topicId,
    quizCompleted,
    isChallenge,
    isProject,
    timeSpentIncr,
    xpBonus
  } = req.body;

  const db = readDB();
  const user = db.users[activeSessionEmail];
  if (!user) {
    return res.status(404).json({ error: 'User lookup was un-resolvable.' });
  }

  const profile = user.profile;
  let gainedXP = 0;

  // Track completed lessons
  if (topicId && !quizCompleted && !isChallenge && !isProject) {
    if (!profile.completedLessons) {
      profile.completedLessons = [];
    }
    if (!profile.completedLessons.includes(topicId)) {
      profile.completedLessons.push(topicId);
    }
    if (!profile.completedTopics.includes(topicId)) {
      profile.completedTopics.push(topicId);
    }
    gainedXP += 20; // XP per topic completed

    const totalTopicsCount = 15;
    profile.completionPercentage = Math.round((profile.completedTopics.length / totalTopicsCount) * 100);
  }

  // Quiz completed elements
  if (quizCompleted && topicId) {
    if (!profile.completedQuizzedTopics.includes(topicId)) {
      profile.completedQuizzedTopics.push(topicId);
    }
    gainedXP += 10; // XP per quiz finished

    // Save score
    const scoreVal = req.body.quizScore !== undefined ? req.body.quizScore : 100;
    profile.notes = {
      ...profile.notes,
      [`${topicId}_quiz_score`]: String(scoreVal)
    };
  }

  // Challenge completed elements
  if (isChallenge && topicId) {
    if (!profile.completedChallenges.includes(topicId)) {
      profile.completedChallenges.push(topicId);
    }
    profile.consistencyScore = Math.min(100, (profile.consistencyScore || 0) + 10);
  }

  // Project completed elements
  if (isProject && topicId) {
    if (!profile.completedProjects.includes(topicId)) {
      profile.completedProjects.push(topicId);
    }
    gainedXP += 100; // XP per project finished
  }

  // Custom added time analytics / study trackers
  if (timeSpentIncr) {
    profile.timeSpentMinutes += timeSpentIncr;
    if (!profile.learningHours) {
      profile.learningHours = 0;
    }
    profile.learningHours = Number((profile.learningHours + (timeSpentIncr / 60)).toFixed(4));
  }

  // Apply gained XP & check leveling up
  profile.xp += gainedXP;
  
  const oldLvl = profile.level || 1;
  const currentLvl = calculateLevel(profile.xp);
  
  if (currentLvl > oldLvl) {
    profile.level = currentLvl;
    profile.rewards.push({
      id: `lvl-${currentLvl}`,
      title: `Ranked Up to Level ${currentLvl}`,
      text: `Acquired higher master credentials of computer science.`,
      date: new Date().toISOString().split('T')[0]
    });
  }

  profile.xpToNextLevel = getXpToNextLevel(profile.xp, profile.level);

  // Let's calibrate leaderboard statistics
  const userLeader = db.leaderboard.find((u: any) => u.username === profile.username);
  if (userLeader) {
    userLeader.xp = profile.xp;
    userLeader.level = profile.level;
    userLeader.streak = profile.streak;
  } else {
    db.leaderboard.push({
      username: profile.username,
      role: profile.role,
      xp: profile.xp,
      level: profile.level,
      streak: profile.streak
    });
  }

  // Sort leaderboard in place
  db.leaderboard.sort((a: any, b: any) => b.xp - a.xp);

  writeDB(db);
  res.status(200).json({ success: true, profile, gainedXP });
});

// Toggle/Save Bookmarks
app.post('/api/bookmark', (req, res) => {
  if (!activeSessionEmail) return res.status(401).json({ error: 'Auth failed' });
  const { topicId } = req.body;
  if (!topicId) return res.status(400).json({ error: 'Topic ID is missing' });

  const db = readDB();
  const user = db.users[activeSessionEmail];
  if (!user) return res.status(404).json({ error: 'Not found' });

  const idx = user.profile.bookmarks.indexOf(topicId);
  if (idx > -1) {
    user.profile.bookmarks.splice(idx, 1);
  } else {
    user.profile.bookmarks.push(topicId);
  }

  writeDB(db);
  res.status(200).json({ success: true, bookmarks: user.profile.bookmarks });
});

// Save or edit notes
app.post('/api/notes', (req, res) => {
  if (!activeSessionEmail) return res.status(401).json({ error: 'Unregistered user context' });
  const { topicId, noteText } = req.body;
  if (!topicId) return res.status(400).json({ error: 'No associated task topic ID mapped' });

  const db = readDB();
  const user = db.users[activeSessionEmail];
  if (!user) return res.status(404).json({ error: 'User does not exist' });

  user.profile.notes[topicId] = noteText;
  writeDB(db);
  res.status(200).json({ success: true, notes: user.profile.notes });
});

// Fetch Analytics Dashboard Details
app.get('/api/analytics', (req, res) => {
  if (!activeSessionEmail) return res.status(401).json({ error: 'Unauthorized configuration' });
  const db = readDB();
  const user = db.users[activeSessionEmail];
  if (!user) return res.status(404).json({ error: 'Profile unmapped' });

  const p = user.profile;
  const metrics = {
    weeklyActivity: [
      { day: "Mon", hr: 1.2 },
      { day: "Tue", hr: 1.8 },
      { day: "Wed", hr: p.timeSpentMinutes > 30 ? (p.timeSpentMinutes / 60) : 0.8 },
      { day: "Thu", hr: 2.2 },
      { day: "Fri", hr: 1.5 },
      { day: "Sat", hr: 0.5 },
      { day: "Sun", hr: 1.3 }
    ],
    topicMastery: [
      { name: "HTML5", value: p.completedTopics.filter(t => t.startsWith('html') || t.includes('html')).length > 0 ? 100 : 25 },
      { name: "CSS3 / Flex", value: p.completedTopics.filter(t => t.includes('css') || t.includes('flex') || t.includes('grid')).length > 0 ? 80 : 20 },
      { name: "JS ES6", value: p.completedTopics.filter(t => t.includes('js') || t.includes('dom')).length > 0 ? 95 : 10 },
      { name: "React", value: p.completedTopics.filter(t => t.includes('react')).length > 0 ? 75 : 0 },
      { name: "Backend APIs", value: p.completedTopics.filter(t => t.includes('node') || t.includes('express') || t.includes('api')).length > 0 ? 60 : 0 },
      { name: "Data Structures", value: 30 }
    ],
    milestones: [
      { badgeName: "First Steps", description: "Completed structural fundamentals introduction block.", unlocked: p.completedTopics.length > 0 },
      { badgeName: "CSS Explorer", description: "Completed css-boxmodel, flexbox or grid concepts rules.", unlocked: p.completedTopics.some(t => t.includes('css') || t.includes('flex')) },
      { badgeName: "JS Alchemist", description: "Solved custom JavaScript practice exercise runs.", unlocked: p.completedTopics.some(t => t.includes('js')) },
      { badgeName: "SaaS Maker", description: "Successfully finished an advanced engineering project.", unlocked: p.completedProjects.length > 0 }
    ],
    leaderboard: db.leaderboard,
  };

  res.status(200).json(metrics);
});

// Streak updater helper
app.get('/api/streak', (req, res) => {
  if (!activeSessionEmail) return res.status(401).json({ error: 'No active session' });
  const db = readDB();
  const user = db.users[activeSessionEmail];
  if (!user) return res.status(404).json({ error: 'No profile' });

  // Add random streak bonus logic for display animation demo
  user.profile.streak += 1;
  writeDB(db);
  res.status(200).json({ success: true, newStreak: user.profile.streak });
});

// Server-side AI Academic doubts assistant using gemini-3.5-flash
app.post('/api/mentor/chat', async (req, res) => {
  const { question, activeTopicContext, codeSnippet, lineByLine, fixErrors, learningLevel } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'A question query is required.' });
  }

  const level = learningLevel || 'Beginner';

  // If no API key configured, yield fallback educational answers tailored to their specified learningLevel
  if (!aiClient) {
    let mockResponse = `### AI Code Sensei (Local Sandbox Mode)\n\n*Note: Running in offline sandbox mode. To explore live personalized answers, configure **GEMINI_API_KEY** under **Settings > Secrets** in AI Studio.*\n\n`;
    
    if (codeSnippet) {
      mockResponse += `#### 🔍 Selected Code Analysis (${level} Layer)\n`;
      const lines = codeSnippet.split('\n');
      lines.forEach((line: string, i: number) => {
        if (line.trim()) {
          mockResponse += `**Line ${i + 1}:** \`${line.trim()}\`  \n`;
          if (level === 'Beginner') {
            mockResponse += `> 💡 *Beginner Insight:* This assigns or triggers a helper block. Variables act like named folders that store records. Make sure the spelling is 100% correct so physical browser engines can retrieve your data without throwing a screen freeze.\n`;
          } else if (level === 'Intermediate') {
            mockResponse += `> ⚡ *Intermediate Insight:* This represents standard block scope execution. Note the binding flow of variables and parameters. It's best to maintain clean lexical encapsulation to prevent variable leakage!\n`;
          } else {
            mockResponse += `> 🛑 *Advanced Spec & Big O:* Stack frames are pushed onto the process thread sequentially. At high scales, this operation runs in constant $\\mathcal{O}(1)$ time, but watch out for closure heap memory allocation traps if referenced inside persistent event listeners.\n`;
          }
        }
      });
    }

    mockResponse += `\n#### 🛠️ Level-Based Debugging Tips (${level} Level)\n`;
    if (level === 'Beginner') {
      mockResponse += `- **Tip 1:** Spelling is casesensitive! Double-check that your capitals (like \`getElementById\`) match perfectly.\n- **Tip 2:** Always open and close brackets \`{ }\` in correct pairs to avoid layout syntax confusion.\n- **Tip 3:** Check your selector names match the HTML id!`;
    } else if (level === 'Intermediate') {
      mockResponse += `- **Tip 1:** Prefer strict comparison operators \`===\` to avoid implicit type-coercion bugs.\n- **Tip 2:** Handle potential errors gracefully inside asynchronous async/await flow charts using try/catch wrappers.\n- **Tip 3:** Isolate layout calculations from main painting schedules using transforms.`;
    } else {
      mockResponse += `- **Tip 1:** Watch out for the temporal dead zone (TDZ) when ordering let & const bindings.\n- **Tip 2:** Use chrome performance profilers to trace rendering frame recalculations and optimize script loops.\n- **Tip 3:** Ensure base-case guard checks are evaluated first to safeguard stack limits during recursive execution paths.`;
    }

    mockResponse += `\n\n#### 🎯 Context-Specific Insights for study topic: "${activeTopicContext || 'General'}"\n`;
    mockResponse += `This is a fundamental mechanism of ${activeTopicContext || 'Web Dev'}. Keep practicing local sandbox simulations to harden your muscle memory!`;

    return res.status(200).json({ text: mockResponse });
  }

  try {
    let customPrompt = `You are "DevAcad AI Mentor & Code Sensei", an exceptional, friendly, world-class computer science professor. 
Explain coding structures elegantly tailored directly to the user's current chosen learning level: **${level}**.

Use the following level-specific guidelines:
- If Beginner: Focus on high-level mechanics, friendly real-world analogies, explain terms literally, and avoid intimidating jargon.
- If Intermediate: Address architectural patterns, design flow rules, synchronous versus asynchronous order of operations, and idiomatic ES6 usages.
- If Advanced: Focus on performance benchmarks, computational complexity (Big O parameters), RAM stack/heap interactions, Chrome layout painting, and security hardening.

Here is the current topic of study context: "${activeTopicContext || 'General Web Dev'}".
`;

    if (codeSnippet) {
      customPrompt += `\nThe user provided this snippet of code:\n\`\`\`js\n${codeSnippet}\n\`\`\`\n`;
    }
    if (lineByLine) {
      customPrompt += `\nCRITICAL SPECIAL TASK: Explain the provided code snippet line-by-line using beautiful Markdown headings, inline bolding, and clear pointers. Analyze each line individually.\n`;
    }
    customPrompt += `\nPlease also provide a dedicated section with 3 premium context-specific insights and 3 tailored, level-appropriate "Debugging & Optimization Tips" for this specific category.\n`;
    customPrompt += `\nUser's specific inquiry/question:\n${question}`;

    const geminiResponse = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: customPrompt
    });

    res.status(200).json({ text: geminiResponse.text });
  } catch (err: any) {
    console.error("Gemini API call failed:", err);
    res.status(500).json({ error: "AI Mentor call could not complete successfully: " + err.message });
  }
});

// Interactive AI Interview Evaluation
app.post('/api/mentor/interview', async (req, res) => {
  const { questionId, questionTitle, studentAnswer, category } = req.body;
  if (!studentAnswer) {
    return res.status(400).json({ error: 'Please write or frame an answer to evaluate.' });
  }

  if (!aiClient) {
    return res.status(200).json({
      text: `### Interview Evaluator (Local Sandbox Mode)\n\n*Configure your GEMINI_API_KEY in Settings to unlock real precision scoring!*\n\n**Candidate's Response on "${questionTitle}"**:\n"${studentAnswer}"\n\n**Evaluational score estimation**: 7.5 / 10\n- **Strengths**: Good standard understanding of general terms.\n- **Improvement Areas**: Introduce specific technical references, scope indicators, or standard browser performance considerations in your explanations.\n- **FAANG standards**: Ensure your code is dry and robust.`
    });
  }

  try {
    const prompt = `You are a Senior FAANG Tech Recruiter and Technical Interviewer. Evaluate the candidate's answer for the technical web development question:\n\n` +
      `Question Topic: "${questionTitle}" (Category: ${category})\n` +
      `Candidate's Submitted Answer: \n"${studentAnswer}"\n\n` +
      `Please return a highly detailed, constructive evaluation containing of:\n` +
      `1. Score (from 1 to 10)\n` +
      `2. Accurate, specific rating on technical correctness\n` +
      `3. Any missing keywords or definitions they should have included\n` +
      `4. A refined, premium 'Senior Engineer' level answer model representing outstanding performance\n` +
      `5. Practical tips for showcasing this knowledge in visual resumes and portfolios. Wrap your response in beautiful, encouraging Markdown structure with clear dividers.`;

    const examResponse = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });

    res.status(200).json({ text: examResponse.text });
  } catch (err: any) {
    console.error("Gemini Interview evaluation failed:", err);
    res.status(500).json({ error: "Could not evaluate interview session: " + err.message });
  }
});

// Serve static elements or Vite development middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    // Ensure index.html serves correctly for client routes fallback
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static build folder distribution.");
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
