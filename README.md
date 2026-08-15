# AI Chatbot App

A mobile AI chatbot application built using React Native and Expo. The application allows users to communicate with an AI assistant powered by the Google Gemini API.

## Demo

https://aichatbotapp-frontend.onrender.com

## Features

- User-friendly chat interface
- AI-powered responses using Google Gemini
- Persistent chat history
- Loading/typing indicator
- Error handling
- Clear chat history
- Responsive UI
- Chat timestamps
- Backend API for secure Gemini communication

## Tech Stack

### Frontend
- React Native
- Expo
- JavaScript
- Axios
- AsyncStorage
- react-native-uuid

### Backend
- Node.js
- Express.js
- Axios
- CORS
- dotenv

### AI Service
- Google Gemini API

### Deployment
- GitHub
- Render

## Architecture

The application follows a frontend-backend architecture:

User
↓
React Native / Expo Frontend
↓
Node.js + Express Backend
↓
Google Gemini API
↓
AI Response
↓
Frontend

The frontend sends the conversation history to the backend through the `/api/chat` endpoint. The backend communicates with Google Gemini and returns the generated response to the frontend.

## Project Structure

```text
AIChatbotApp/
├── server/
│   └── server.js
│
├── src/
│   ├── components/
│   │   ├── ChatBubble.js
│   │   ├── ChatInput.js
│   │   └── TypingIndicator.js
│   │
│   ├── screens/
│   │   └── ChatScreen.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   └── storageService.js
│   │
│   └── theme/
│       └── colors.js
│
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md