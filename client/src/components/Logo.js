import React from 'react';
import { Box, Typography } from '@mui/material';

// This component displays the educade logo using an image file
const Logo = ({ height = 40, showText = true }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img 
        src="/images/educade-logo.png" 
        alt="educade"
        height={height} 
        style={{ marginRight: showText ? '10px' : 0 }}
      />
      
      {showText && (
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ fontWeight: 'bold', color: 'inherit' }}
        >
          educade
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 