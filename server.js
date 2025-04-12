const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ai_game_arcade', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  gradeLevel: {
    type: Number,
    required: true
  },
  gameProgress: {
    ticTacToe: {
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      questionsAnswered: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 }
    },
    connectFour: {
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      questionsAnswered: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 }
    },
    geometryRunner: {
      highScore: { type: Number, default: 0 },
      questionsAnswered: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Cached questions to handle rate limiting
const CACHED_QUESTIONS = {
  '1-2': [
    {
      question: 'What is 5 + 3?',
      options: { A: '7', B: '8', C: '9', D: '10' },
      correctAnswer: 'B'
    },
    {
      question: 'How many sides does a triangle have?',
      options: { A: '2', B: '3', C: '4', D: '5' },
      correctAnswer: 'B'
    },
    {
      question: 'What is 10 - 4?',
      options: { A: '5', B: '6', C: '7', D: '8' },
      correctAnswer: 'B'
    }
  ],
  '3-4': [
    {
      question: 'What is 12 × 3?',
      options: { A: '34', B: '36', C: '38', D: '40' },
      correctAnswer: 'B'
    },
    {
      question: 'What is 48 ÷ 6?',
      options: { A: '7', B: '8', C: '9', D: '10' },
      correctAnswer: 'B'
    },
    {
      question: 'A square has sides of 4 cm. What is its perimeter?',
      options: { A: '12 cm', B: '16 cm', C: '20 cm', D: '24 cm' },
      correctAnswer: 'B'
    }
  ],
  '5-6': [
    {
      question: 'What is 15 + 26?',
      options: { A: '39', B: '41', C: '43', D: '45' },
      correctAnswer: 'B'
    },
    {
      question: 'What is 12 × 5?',
      options: { A: '55', B: '60', C: '65', D: '70' },
      correctAnswer: 'B'
    },
    {
      question: 'A rectangle has a length of 8 cm and a width of 5 cm. What is its area?',
      options: { A: '13 cm²', B: '26 cm²', C: '40 cm²', D: '45 cm²' },
      correctAnswer: 'C'
    }
  ],
  '7-8': [
    {
      question: 'What is 3/4 + 1/2?',
      options: { A: '1', B: '1 1/4', C: '1 1/2', D: '2' },
      correctAnswer: 'B'
    },
    {
      question: 'What is 15% of 200?',
      options: { A: '20', B: '30', C: '40', D: '50' },
      correctAnswer: 'B'
    },
    {
      question: 'If x + 5 = 12, what is x?',
      options: { A: '5', B: '6', C: '7', D: '8' },
      correctAnswer: 'C'
    }
  ],
  '9-12': [
    {
      question: 'What is the value of x in the equation 2x + 5 = 15?',
      options: { A: '4', B: '5', C: '6', D: '7' },
      correctAnswer: 'B'
    },
    {
      question: 'What is the area of a circle with radius 3? (Use π = 3.14)',
      options: { A: '18.84', B: '28.26', C: '37.68', D: '47.10' },
      correctAnswer: 'B'
    },
    {
      question: 'What is the slope of the line y = 2x + 3?',
      options: { A: '1', B: '2', C: '3', D: '4' },
      correctAnswer: 'B'
    }
  ]
};

let lastQuestionIndex = -1;

// Routes
app.post('/api/users', async (req, res) => {
  const { username, gradeLevel } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    
    if (user) {
      // User exists, return their data
      return res.json(user);
    }
    
    // Create new user
    user = new User({
      username,
      gradeLevel,
      gameProgress: {
        ticTacToe: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
        connectFour: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
        geometryRunner: { highScore: 0, questionsAnswered: 0, correctAnswers: 0 }
      }
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:username/progress', async (req, res) => {
  const { username } = req.params;
  const { gameType, progress } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update game progress
    user.gameProgress[gameType] = {
      ...user.gameProgress[gameType],
      ...progress
    };
    
    await user.save();
    res.json(user.gameProgress[gameType]);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

app.get('/api/users/:username/progress', async (req, res) => {
  const { username } = req.params;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.gameProgress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.post('/api/generate-question', async (req, res) => {
  try {
    const { gradeLevel, subject, difficulty } = req.body;
    console.log('Request received:', req.body);
    
    const question = await generateQuestion(gradeLevel, subject, difficulty);
    console.log('Sending question:', question);
    
    res.json(question);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// Game Session Routes
app.post('/api/game-sessions', async (req, res) => {
  const { userId, gameType } = req.body;
  
  try {
    // For now, just return success without saving to database
    res.status(201).json({ userId, gameType, startTime: new Date() });
  } catch (error) {
    console.error('Error creating game session:', error);
    res.status(500).json({ error: 'Failed to create game session' });
  }
});

app.put('/api/game-sessions/:id', async (req, res) => {
  const { id } = req.params;
  const { score, questionsAnswered, correctAnswers, completed } = req.body;
  
  try {
    // For now, just return success without saving to database
    res.json({ id, score, questionsAnswered, correctAnswers, completed });
  } catch (error) {
    console.error('Error updating game session:', error);
    res.status(500).json({ error: 'Failed to update game session' });
  }
});

app.get('/api/users/:userId/game-sessions', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // For now, return empty array
    res.json([]);
  } catch (error) {
    console.error('Error fetching game sessions:', error);
    res.status(500).json({ error: 'Failed to fetch game sessions' });
  }
});

// Generate a question using Gemini API
async function generateQuestion(gradeLevel, subject, difficulty) {
  try {
    // First try to get a question from the cache
    const cachedQuestion = getCachedQuestion(gradeLevel);
    if (cachedQuestion) {
      console.log('Using cached question for grade level:', gradeLevel);
      return cachedQuestion;
    }

    // If no cached question, try Gemini API
    const prompt = `Generate a ${difficulty} difficulty multiple-choice math question about ${subject} for a ${gradeLevel} grade student.
    The question should be unique and under 280 characters.
    Format your response exactly like this:
    QUESTION: (the question)
    A) (first option)
    B) (second option)
    C) (third option)
    D) (fourth option)
    CORRECT_ANSWER=(A/B/C/D)`;

    console.log('Sending prompt to Gemini:', prompt);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Raw Gemini response:', text);

      // Parse the response
      const lines = text.split('\n');
      const question = lines[0].replace('QUESTION:', '').trim();
      const options = {
        A: lines[1].replace('A)', '').trim(),
        B: lines[2].replace('B)', '').trim(),
        C: lines[3].replace('C)', '').trim(),
        D: lines[4].replace('D)', '').trim()
      };
      const correctAnswer = lines[5].replace('CORRECT_ANSWER=', '').trim();

      return { question, options, correctAnswer };
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      // Fall back to cached questions if API fails
      return getCachedQuestion(gradeLevel);
    }
  } catch (error) {
    console.error('Error in generateQuestion:', error);
    // Always return a cached question as last resort
    return getCachedQuestion(gradeLevel);
  }
}

function getCachedQuestion(gradeLevel) {
  // Determine which grade group to use
  let gradeGroup;
  if (gradeLevel <= 2) gradeGroup = '1-2';
  else if (gradeLevel <= 4) gradeGroup = '3-4';
  else if (gradeLevel <= 6) gradeGroup = '5-6';
  else if (gradeLevel <= 8) gradeGroup = '7-8';
  else gradeGroup = '9-12';

  const questions = CACHED_QUESTIONS[gradeGroup];
  if (!questions || questions.length === 0) return null;

  // Get a random question, ensuring it's not the same as the last one
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * questions.length);
  } while (randomIndex === lastQuestionIndex && questions.length > 1);

  lastQuestionIndex = randomIndex;
  return questions[randomIndex];
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 