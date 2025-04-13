const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gradeLevel: {
    type: String,
    required: true,
    enum: ['1-2', '3-4', '5-6']
  },
  subject: {
    type: String,
    required: true,
    enum: ['Math', 'Science', 'English', 'History', 'Geography'],
    default: 'Math'
  },
  progress: {
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

module.exports = mongoose.model('User', userSchema); 