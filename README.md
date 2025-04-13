# AI Game Arcade

An educational gaming platform that combines fun games with math learning.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys
   - Never commit your `.env` file or share your API keys

4. Start the development servers:
   ```bash
   # Terminal 1 (Server)
   node server.js

   # Terminal 2 (Client)
   cd client
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

1. **Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Keep this key secure and never share it publicly

## Security Guidelines

### Environment Variables
- Never commit your `.env` file
- Use `.env.example` as a template
- Keep API keys and secrets secure
- Rotate API keys regularly

### Code Security
- Validate all user inputs
- Use HTTPS in production
- Implement proper error handling
- Keep dependencies updated
- Use environment variables for all sensitive data

### Development Best Practices
- Use strong passwords for all services
- Enable 2FA where available
- Regularly audit dependencies for vulnerabilities
- Keep your development environment secure
- Use secure coding practices

### API Security
- Implement rate limiting
- Use proper authentication
- Validate all API responses
- Handle errors gracefully
- Log security events

## Features

- Multiple educational games
- Grade-appropriate math questions
- Progress tracking
- User authentication
- Real-time feedback

## Games

1. **Tic Tac Toe**
   - Classic game with math questions
   - Answer correctly to place your piece

2. **Connect Four**
   - Strategic gameplay with math challenges
   - Questions after each move

3. **Geometry Runner**
   - Endless runner with math obstacles
   - Answer questions to continue

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 