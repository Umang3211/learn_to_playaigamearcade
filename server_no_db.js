const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// In-memory storage
const users = {};
const gameProgress = {};

// Middleware
app.use(cors());
app.use(express.json());

// Sample questions
const QUESTIONS = {
  Math: [
    {
      question: 'What is 5 + 3?',
      options: {
        A: '7',
        B: '8',
        C: '9',
        D: '10'
      },
      correctAnswer: 'B'
    },
    {
      question: 'What is 10 - 4?',
      options: {
        A: '5',
        B: '6',
        C: '7',
        D: '8'
      },
      correctAnswer: 'B'
    },
    {
      question: 'What is 3 × 4?',
      options: {
        A: '10',
        B: '11',
        C: '12',
        D: '13'
      },
      correctAnswer: 'C'
    }
  ],
  Science: [
    {
      question: 'What is the largest planet in our solar system?',
      options: {
        A: 'Earth',
        B: 'Mars',
        C: 'Jupiter',
        D: 'Saturn'
      },
      correctAnswer: 'C'
    },
    {
      question: 'What do plants need to grow?',
      options: {
        A: 'Water, sunlight, and air',
        B: 'Water and air only',
        C: 'Sunlight only',
        D: 'Air only'
      },
      correctAnswer: 'A'
    }
  ],
  English: [
    {
      question: 'Which word is a noun?',
      options: {
        A: 'run',
        B: 'happy',
        C: 'dog',
        D: 'quickly'
      },
      correctAnswer: 'C'
    },
    {
      question: 'What is the plural of "cat"?',
      options: {
        A: 'cat',
        B: 'cats',
        C: 'cates',
        D: 'caties'
      },
      correctAnswer: 'B'
    }
  ]
};

// Routes
app.post('/api/users', (req, res) => {
  const { username, gradeLevel, subject = 'Math' } = req.body;
  
  if (users[username]) {
    return res.json(users[username]);
  }
  
  const user = {
    username,
    gradeLevel,
    subject,
    gameProgress: {
      ticTacToe: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
      connectFour: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
      geometryRunner: { highScore: 0, questionsAnswered: 0, correctAnswers: 0 }
    }
  };
  
  users[username] = user;
  gameProgress[username] = user.gameProgress;
  
  res.status(201).json(user);
});

app.put('/api/users/:username/progress', (req, res) => {
  const { username } = req.params;
  const { gameType, progress } = req.body;
  
  if (!gameProgress[username]) {
    gameProgress[username] = {
      ticTacToe: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
      connectFour: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
      geometryRunner: { highScore: 0, questionsAnswered: 0, correctAnswers: 0 }
    };
  }
  
  gameProgress[username][gameType] = {
    ...gameProgress[username][gameType],
    ...progress
  };
  
  res.json(gameProgress[username][gameType]);
});

app.get('/api/users/:username/progress', (req, res) => {
  const { username } = req.params;
  
  if (!gameProgress[username]) {
    gameProgress[username] = {
      ticTacToe: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
      connectFour: { wins: 0, losses: 0, questionsAnswered: 0, correctAnswers: 0 },
      geometryRunner: { highScore: 0, questionsAnswered: 0, correctAnswers: 0 }
    };
  }
  
  res.json(gameProgress[username]);
});

app.post('/api/questions', (req, res) => {
  const { subject = 'Math', gradeLevel = '3-4' } = req.body;
  
  console.log(`Generating question for subject: ${subject}, grade level: ${gradeLevel}`);
  
  const questions = QUESTIONS[subject] || QUESTIONS.Math;
  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];
  
  console.log('Returning question:', question);
  
  // Add CORS headers to ensure client can access the response
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  res.json(question);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} WITHOUT MongoDB`);
}); 