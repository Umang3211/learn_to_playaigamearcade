import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, TextField, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Select, MenuItem, 
  FormControl, InputLabel, Typography, CircularProgress 
} from '@mui/material';
import TicTacToe from './games/TicTacToe';
import ConnectFour from './games/ConnectFour';
import GeometryRunner from './games/GeometryRunner';
import QuestionDisplay from './QuestionDisplay';
import Logo from './Logo';
import ProgressSummary from './ProgressSummary';

// Local question database
const questionsDB = {
  Math: {
    '1-2': [
      { question: 'What is 3 + 5?', options: { A: '7', B: '8', C: '9', D: '10' }, correctAnswer: 'B' },
      { question: 'What is 10 - 4?', options: { A: '5', B: '6', C: '7', D: '8' }, correctAnswer: 'B' },
      { question: 'What is 2 × 3?', options: { A: '5', B: '6', C: '7', D: '8' }, correctAnswer: 'B' },
      { question: 'What is 8 ÷ 2?', options: { A: '2', B: '3', C: '4', D: '5' }, correctAnswer: 'C' },
      { question: 'Which number comes after 17?', options: { A: '16', B: '17', C: '18', D: '19' }, correctAnswer: 'C' }
    ],
    '3-4': [
      { question: 'What is 12 × 5?', options: { A: '50', B: '55', C: '60', D: '65' }, correctAnswer: 'C' },
      { question: 'What is 36 ÷ 4?', options: { A: '7', B: '8', C: '9', D: '10' }, correctAnswer: 'C' },
      { question: 'What is 127 + 38?', options: { A: '155', B: '165', C: '175', D: '185' }, correctAnswer: 'B' },
      { question: 'What is the value of 3²?', options: { A: '6', B: '8', C: '9', D: '12' }, correctAnswer: 'C' },
      { question: 'What is 200 - 75?', options: { A: '115', B: '125', C: '135', D: '145' }, correctAnswer: 'B' }
    ],
    '5-6': [
      { question: 'What is the area of a rectangle with length 7 cm and width 4 cm?', options: { A: '22 cm²', B: '28 cm²', C: '30 cm²', D: '32 cm²' }, correctAnswer: 'B' },
      { question: 'Simplify: 2(3x + 4) - 5x', options: { A: 'x + 8', B: '6x + 8', C: 'x - 8', D: '6x - 8' }, correctAnswer: 'A' },
      { question: 'What is 3/4 of 128?', options: { A: '86', B: '92', C: '96', D: '102' }, correctAnswer: 'C' },
      { question: 'What is the perimeter of a square with side length 9 cm?', options: { A: '36 cm', B: '34 cm', C: '32 cm', D: '81 cm' }, correctAnswer: 'A' },
      { question: 'If 3x - 7 = 14, what is the value of x?', options: { A: '5', B: '7', C: '9', D: '11' }, correctAnswer: 'B' }
    ]
  },
  English: {
    '1-2': [
      { question: 'Which word is a noun?', options: { A: 'Run', B: 'Happy', C: 'Cat', D: 'Quickly' }, correctAnswer: 'C' },
      { question: 'Which letter comes after P in the alphabet?', options: { A: 'O', B: 'P', C: 'Q', D: 'R' }, correctAnswer: 'C' },
      { question: 'Which word means the opposite of "hot"?', options: { A: 'Warm', B: 'Cold', C: 'Cool', D: 'Freeze' }, correctAnswer: 'B' },
      { question: 'How many letters are in the word "cat"?', options: { A: '2', B: '3', C: '4', D: '5' }, correctAnswer: 'B' },
      { question: 'Which word is spelled correctly?', options: { A: 'Bik', B: 'Bike', C: 'Biek', D: 'Biyk' }, correctAnswer: 'B' }
    ],
    '3-4': [
      { question: 'Which word is a verb?', options: { A: 'Happy', B: 'Jump', C: 'Beautiful', D: 'Tree' }, correctAnswer: 'B' },
      { question: 'Which sentence uses correct punctuation?', options: { A: 'We went to the park', B: 'We went to the park.', C: 'we went to the park', D: 'We went to the park,' }, correctAnswer: 'B' },
      { question: 'Which word means the same as "big"?', options: { A: 'Small', B: 'Tiny', C: 'Large', D: 'Little' }, correctAnswer: 'C' },
      { question: 'Which word is a pronoun?', options: { A: 'Run', B: 'Jump', C: 'She', D: 'Happy' }, correctAnswer: 'C' },
      { question: 'Which is the correct plural of "child"?', options: { A: 'Childs', B: 'Childes', C: 'Children', D: 'Childies' }, correctAnswer: 'C' }
    ],
    '5-6': [
      { question: 'What is a noun?', options: { A: 'Action word', B: 'Person, place, or thing', C: 'Describing word', D: 'Connecting word' }, correctAnswer: 'B' },
      { question: 'What is the past tense of "run"?', options: { A: 'Running', B: 'Runs', C: 'Runned', D: 'Ran' }, correctAnswer: 'D' },
      { question: 'Which sentence uses correct punctuation?', options: { A: 'She said "hello."', B: 'She said, "Hello."', C: 'She said "Hello"', D: 'She said, hello.' }, correctAnswer: 'B' },
      { question: 'Which of these is a compound word?', options: { A: 'Happy', B: 'Sunshine', C: 'Running', D: 'Quickly' }, correctAnswer: 'B' },
      { question: 'Which word is spelled correctly?', options: { A: 'Necessary', B: 'Nesessary', C: 'Neccesary', D: 'Neccessary' }, correctAnswer: 'A' }
    ]
  },
  Science: {
    '1-2': [
      { question: 'Which animal lives in water?', options: { A: 'Dog', B: 'Cat', C: 'Fish', D: 'Bird' }, correctAnswer: 'C' },
      { question: 'What do plants need to grow?', options: { A: 'Candy', B: 'Water', C: 'Television', D: 'Cars' }, correctAnswer: 'B' },
      { question: 'Which is a living thing?', options: { A: 'Rock', B: 'Water', C: 'Tree', D: 'Sun' }, correctAnswer: 'C' },
      { question: 'Where do birds live?', options: { A: 'Nest', B: 'Cave', C: 'House', D: 'Pool' }, correctAnswer: 'A' },
      { question: 'What do we use to see things?', options: { A: 'Ears', B: 'Nose', C: 'Eyes', D: 'Hands' }, correctAnswer: 'C' }
    ],
    '3-4': [
      { question: 'What is the largest planet in our solar system?', options: { A: 'Earth', B: 'Mars', C: 'Jupiter', D: 'Venus' }, correctAnswer: 'C' },
      { question: 'Which of these is a source of light?', options: { A: 'Moon', B: 'Sun', C: 'Earth', D: 'Mars' }, correctAnswer: 'B' },
      { question: 'What do plants produce during photosynthesis?', options: { A: 'Carbon dioxide', B: 'Oxygen', C: 'Water', D: 'Soil' }, correctAnswer: 'B' },
      { question: 'Which animal is a mammal?', options: { A: 'Snake', B: 'Fish', C: 'Elephant', D: 'Lizard' }, correctAnswer: 'C' },
      { question: 'What is the study of living things called?', options: { A: 'Biology', B: 'Chemistry', C: 'Physics', D: 'Geology' }, correctAnswer: 'A' }
    ],
    '5-6': [
      { question: 'What is the process by which plants make their food called?', options: { A: 'Respiration', B: 'Photosynthesis', C: 'Digestion', D: 'Transpiration' }, correctAnswer: 'B' },
      { question: 'Which of these is NOT a state of matter?', options: { A: 'Solid', B: 'Liquid', C: 'Energy', D: 'Gas' }, correctAnswer: 'C' },
      { question: 'What force pulls objects toward the center of the Earth?', options: { A: 'Magnetism', B: 'Friction', C: 'Gravity', D: 'Tension' }, correctAnswer: 'C' },
      { question: 'What is the basic unit of life?', options: { A: 'Atom', B: 'Cell', C: 'Tissue', D: 'Organ' }, correctAnswer: 'B' },
      { question: 'Which system in the human body is responsible for circulating blood?', options: { A: 'Respiratory', B: 'Nervous', C: 'Digestive', D: 'Circulatory' }, correctAnswer: 'D' }
    ]
  },
  History: {
    '1-2': [
      { question: 'Who was the first president of the United States?', options: { A: 'Abraham Lincoln', B: 'George Washington', C: 'Thomas Jefferson', D: 'John Adams' }, correctAnswer: 'B' },
      { question: 'What holiday celebrates the American Declaration of Independence?', options: { A: 'Thanksgiving', B: 'Christmas', C: 'Fourth of July', D: 'Memorial Day' }, correctAnswer: 'C' },
      { question: 'Which of these is used to tell time?', options: { A: 'Book', B: 'Phone', C: 'Clock', D: 'Crayon' }, correctAnswer: 'C' },
      { question: 'Who helps sick people get better?', options: { A: 'Firefighter', B: 'Teacher', C: 'Doctor', D: 'Police officer' }, correctAnswer: 'C' },
      { question: 'What do we celebrate on Thanksgiving?', options: { A: 'Freedom', B: 'Harvest', C: 'Peace', D: 'New Year' }, correctAnswer: 'B' }
    ],
    '3-4': [
      { question: 'Who wrote the Declaration of Independence?', options: { A: 'George Washington', B: 'Abraham Lincoln', C: 'Thomas Jefferson', D: 'Benjamin Franklin' }, correctAnswer: 'C' },
      { question: 'What ancient civilization built the pyramids?', options: { A: 'Romans', B: 'Greeks', C: 'Egyptians', D: 'Chinese' }, correctAnswer: 'C' },
      { question: 'Who was known as the "Father of Our Country"?', options: { A: 'Thomas Jefferson', B: 'Abraham Lincoln', C: 'George Washington', D: 'John Adams' }, correctAnswer: 'C' },
      { question: 'What war was fought between the North and South in the United States?', options: { A: 'World War I', B: 'Revolutionary War', C: 'Civil War', D: 'World War II' }, correctAnswer: 'C' },
      { question: 'Which explorer is known for sailing to America in 1492?', options: { A: 'Marco Polo', B: 'Christopher Columbus', C: 'Ferdinand Magellan', D: 'Leif Erikson' }, correctAnswer: 'B' }
    ],
    '5-6': [
      { question: 'What document begins with "We the People"?', options: { A: 'Declaration of Independence', B: 'Magna Carta', C: 'U.S. Constitution', D: 'Bill of Rights' }, correctAnswer: 'C' },
      { question: 'Which civilization built the Great Wall of China?', options: { A: 'Japanese', B: 'Chinese', C: 'Korean', D: 'Mongolian' }, correctAnswer: 'B' },
      { question: 'Who was president during the Civil War?', options: { A: 'George Washington', B: 'Thomas Jefferson', C: 'Abraham Lincoln', D: 'Theodore Roosevelt' }, correctAnswer: 'C' },
      { question: 'What was the name of the ship that brought the Pilgrims to America?', options: { A: 'Santa Maria', B: 'Mayflower', C: 'Nina', D: 'Pinta' }, correctAnswer: 'B' },
      { question: 'Which ancient civilization is known for democracy?', options: { A: 'Egyptian', B: 'Roman', C: 'Greek', D: 'Persian' }, correctAnswer: 'C' }
    ]
  },
  Geography: {
    '1-2': [
      { question: 'What is the largest ocean on Earth?', options: { A: 'Atlantic', B: 'Indian', C: 'Arctic', D: 'Pacific' }, correctAnswer: 'D' },
      { question: 'What do we call a large body of water surrounded by land?', options: { A: 'Ocean', B: 'Lake', C: 'River', D: 'Stream' }, correctAnswer: 'B' },
      { question: 'Which of these is a season?', options: { A: 'Monday', B: 'Winter', C: 'Earth', D: 'Sky' }, correctAnswer: 'B' },
      { question: 'What continent is the United States on?', options: { A: 'Europe', B: 'Asia', C: 'North America', D: 'Africa' }, correctAnswer: 'C' },
      { question: 'What is the name of the planet we live on?', options: { A: 'Mars', B: 'Jupiter', C: 'Earth', D: 'Venus' }, correctAnswer: 'C' }
    ],
    '3-4': [
      { question: 'Which continent is the largest?', options: { A: 'North America', B: 'Europe', C: 'Africa', D: 'Asia' }, correctAnswer: 'D' },
      { question: 'What is the capital city of the United States?', options: { A: 'New York', B: 'Washington, D.C.', C: 'Los Angeles', D: 'Chicago' }, correctAnswer: 'B' },
      { question: 'Which country is known as the "Land of the Rising Sun"?', options: { A: 'China', B: 'Korea', C: 'Japan', D: 'Thailand' }, correctAnswer: 'C' },
      { question: 'What is the name of the longest river in the world?', options: { A: 'Amazon', B: 'Nile', C: 'Mississippi', D: 'Yangtze' }, correctAnswer: 'B' },
      { question: 'What is the largest rainforest in the world?', options: { A: 'Congo Rainforest', B: 'Amazon Rainforest', C: 'Daintree Rainforest', D: 'Sundarbans' }, correctAnswer: 'B' }
    ],
    '5-6': [
      { question: 'Which mountain is the tallest in the world?', options: { A: 'K2', B: 'Kilimanjaro', C: 'Mount Everest', D: 'Denali' }, correctAnswer: 'C' },
      { question: 'What is the driest desert in the world?', options: { A: 'Sahara', B: 'Atacama', C: 'Gobi', D: 'Kalahari' }, correctAnswer: 'B' },
      { question: 'Which of these countries is in Europe?', options: { A: 'Egypt', B: 'Brazil', C: 'France', D: 'Australia' }, correctAnswer: 'C' },
      { question: 'What are the imaginary lines that run east to west on a map called?', options: { A: 'Latitudes', B: 'Longitudes', C: 'Meridians', D: 'Equator' }, correctAnswer: 'A' },
      { question: 'Which ocean lies between North America and Europe?', options: { A: 'Pacific', B: 'Indian', C: 'Arctic', D: 'Atlantic' }, correctAnswer: 'D' }
    ]
  }
};

const GameManager = ({ game }) => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [gradeLevel, setGradeLevel] = useState('1-2');
  const [subject, setSubject] = useState('Math');
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  
  const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];
  
  useEffect(() => {
    if (!game) {
      navigate('/geometry-runner');
    }
  }, [game, navigate]);

  const handleLogin = () => {
    if (username.trim() === '') {
      alert('Please enter a username');
      return;
    }
    
    setShowLoginDialog(false);
  };

  const getRandomQuestion = useCallback(() => {
    setIsLoading(true);
    
    // Use the API endpoint instead of the local cache
    fetch('http://localhost:5000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, gradeLevel }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then(question => {
        console.log('Received question from API:', question);
        setCurrentQuestion(question);
        setShowQuestion(true);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error getting question from API:', error);
        // Fallback to local questions if API fails
        try {
          // Get the questions for the current subject and grade level
          const availableQuestions = questionsDB[subject][gradeLevel];
          
          if (!availableQuestions || availableQuestions.length === 0) {
            throw new Error(`No questions available for ${subject} at grade level ${gradeLevel}`);
          }
          
          // Pick a random question
          const randomIndex = Math.floor(Math.random() * availableQuestions.length);
          const question = availableQuestions[randomIndex];
          
          setCurrentQuestion(question);
          setShowQuestion(true);
        } catch (fallbackError) {
          console.error('Error with fallback questions:', fallbackError);
          // Ultimate fallback to Math questions
          const mathQuestions = questionsDB.Math[gradeLevel];
          const randomIndex = Math.floor(Math.random() * mathQuestions.length);
          setCurrentQuestion(mathQuestions[randomIndex]);
          setShowQuestion(true);
        } finally {
          setIsLoading(false);
        }
      });
      
    return null; // Initially return null, questions will be set asynchronously
  }, [subject, gradeLevel]);

  const handleAnswer = (isCorrect) => {
    setShowQuestion(false);
    setQuestionsAnswered(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectAnswers(prev => prev + 1);
      return true;
    }
    
    return false;
  };

  const renderGame = () => {
    switch (game) {
      case 'tic-tac-toe':
        return <TicTacToe getQuestion={getRandomQuestion} onAnswer={handleAnswer} />;
      case 'connect-four':
        return <ConnectFour getQuestion={getRandomQuestion} onAnswer={handleAnswer} />;
      case 'geometry-runner':
        return <GeometryRunner getQuestion={getRandomQuestion} onAnswer={handleAnswer} />;
      default:
        return <div>Invalid game</div>;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Dialog open={showLoginDialog} onClose={() => {}} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(90deg, #7b2cbf, #5a189a)',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Logo height={30} showText={false} />
          Welcome to educade
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Let's customize your learning experience!
            </Typography>
            
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
              autoFocus
            />
            
            <FormControl fullWidth variant="outlined">
              <InputLabel>Grade Level</InputLabel>
              <Select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                label="Grade Level"
              >
                <MenuItem value="1-2">Grades 1-2</MenuItem>
                <MenuItem value="3-4">Grades 3-4</MenuItem>
                <MenuItem value="5-6">Grades 5-6</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="outlined">
              <InputLabel>Subject</InputLabel>
              <Select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                label="Subject"
              >
                {subjects.map((sub) => (
                  <MenuItem key={sub} value={sub}>
                    {sub}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleLogin} 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Start Learning
          </Button>
        </DialogActions>
      </Dialog>

      {!showLoginDialog && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">
              Welcome, {username} | Grade: {gradeLevel} | Subject: {subject}
            </Typography>
            <Typography variant="h6">
              Score: {score} | Correct: {correctAnswers}/{questionsAnswered}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button 
              variant="contained" 
              color={showProgress ? "secondary" : "primary"}
              onClick={() => setShowProgress(!showProgress)}
            >
              {showProgress ? "Back to Game" : "View Progress"}
            </Button>
          </Box>
          
          {showProgress ? (
            <ProgressSummary 
              username={username} 
              subject={subject} 
              gradeLevel={gradeLevel} 
            />
          ) : (
            <>
              {renderGame()}
              
              <Dialog open={showQuestion && currentQuestion !== null} maxWidth="md" fullWidth>
                <DialogContent>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    currentQuestion && (
                      <QuestionDisplay
                        question={currentQuestion.question}
                        options={currentQuestion.options}
                        correctAnswer={currentQuestion.correctAnswer}
                        onAnswer={handleAnswer}
                      />
                    )
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default GameManager; 