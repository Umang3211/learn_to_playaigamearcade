import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Grid, Divider, Card, CardContent } from '@mui/material';

function ProgressSummary({ username, subject, gradeLevel }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching progress data
    const fetchProgress = async () => {
      try {
        // In a real app, you'd fetch from an API
        // const res = await fetch(`/api/users/${username}/progress`);
        // const data = await res.json();
        
        // For now, use mock data
        setTimeout(() => {
          const mockProgress = {
            questionsAnswered: 12,
            correctAnswers: 8,
            subjects: {
              [subject]: {
                questionsAnswered: 12,
                correctAnswers: 8,
                topics: {
                  addition: { correct: 3, total: 4 },
                  subtraction: { correct: 2, total: 3 },
                  multiplication: { correct: 1, total: 3 },
                  division: { correct: 2, total: 2 }
                }
              }
            }
          };
          setProgress(mockProgress);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setLoading(false);
      }
    };

    fetchProgress();
  }, [username, subject]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!progress) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No progress data found.</Typography>
      </Box>
    );
  }

  // Calculate areas that need improvement
  const needsImprovement = [];
  if (progress.subjects[subject]) {
    const topicsData = progress.subjects[subject].topics;
    Object.entries(topicsData).forEach(([topic, data]) => {
      const percentage = (data.correct / data.total) * 100;
      if (percentage < 70) {
        needsImprovement.push({ topic, percentage });
      }
    });
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Learning Progress
        </Typography>
        <Typography variant="h6" gutterBottom>
          {username} | Grade: {gradeLevel} | Subject: {subject}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Progress
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                    <CircularProgress 
                      variant="determinate" 
                      value={(progress.correctAnswers / progress.questionsAnswered) * 100} 
                      size={80}
                      thickness={4}
                      sx={{ color: 'success.main' }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" component="div" color="text.secondary">
                        {Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography>
                      You've answered {progress.correctAnswers} out of {progress.questionsAnswered} questions correctly.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Recommendations
                </Typography>
                {needsImprovement.length > 0 ? (
                  <>
                    <Typography paragraph>
                      Based on your performance, here are areas you might want to focus on:
                    </Typography>
                    <ul>
                      {needsImprovement.map(({ topic, percentage }) => (
                        <li key={topic}>
                          <Typography>
                            <strong style={{ textTransform: 'capitalize' }}>{topic}</strong>: {Math.round(percentage)}% correct
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Typography>
                    Great job! You're performing well in all areas. Keep up the good work!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Topic Breakdown
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {progress.subjects[subject] && Object.entries(progress.subjects[subject].topics).map(([topic, data]) => (
            <Grid item xs={12} sm={6} md={3} key={topic}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {topic}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={(data.correct / data.total) * 100} 
                        size={60}
                        thickness={4}
                        sx={{ 
                          color: data.correct / data.total >= 0.7 ? 'success.main' : 'warning.main' 
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" component="div" color="text.secondary">
                          {Math.round((data.correct / data.total) * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography>
                      {data.correct} / {data.total}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default ProgressSummary; 