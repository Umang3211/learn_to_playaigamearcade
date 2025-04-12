# AI Game Arcade - Educational Platform

An interactive educational game platform for K-12 students that combines gaming with learning through AI-generated questions and feedback.

## Features

- Multiple educational games (Tic Tac Toe, Connect 4, Geometry Dash-like runner)
- AI-generated, age-appropriate questions before each move
- AI opponent with simulated reasoning
- Rest Mode with motivational messages and fun facts
- Progress tracking and summaries for parents/teachers
- Content safety and ethics checking

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```

3. Create a `.env` file in the root directory with:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=your_mongodb_uri_here
   ```

4. Start the development server:
   ```bash
   npm run dev:full
   ```

## Project Structure

- `server.js` - Backend server with API endpoints
- `client/` - React frontend application
- `models/` - Database models
- `routes/` - API routes
- `utils/` - Utility functions

## API Endpoints

- POST `/api/generate-question` - Generate educational questions
- POST `/api/check-ethics` - Check content safety
- POST `/api/generate-rest-mode` - Generate rest mode content
- POST `/api/generate-summary` - Generate progress summaries

## Technologies Used

- React
- Node.js
- Express
- Socket.io
- OpenAI API
- MongoDB
- Material-UI

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 