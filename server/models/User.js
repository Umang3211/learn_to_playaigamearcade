const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema); 