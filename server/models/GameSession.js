const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['ticTacToe', 'connectFour', 'geometryRunner']
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  score: {
    type: Number,
    default: 0
  },
  questionsAnswered: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    userAnswer: String,
    isCorrect: Boolean,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  gameState: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('GameSession', gameSessionSchema); 