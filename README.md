# AI Chatbot App

A mobile AI chatbot application built using React Native and Expo. 
The application allows users to communicate with an AI assistant using the Google Gemini API.

## Features

- User-friendly chat interface
- AI-powered responses using Google Gemini
- Persistent chat history
- Loading/typing indicator
- Error handling
- Clear chat history
- Responsive mobile UI
- Chat timestamps

## Tech Stack

- React Native
- Expo
- JavaScript
- Google Gemini API
- AsyncStorage
- react-native-uuid

## AI Model

The application uses Google Gemini through the Gemini API.

The model is configured using:

`EXPO_PUBLIC_GEMINI_MODEL`

The API key is configured using:

`EXPO_PUBLIC_GEMINI_API_KEY`

## Project Structure

```text
AIChatbotApp/
├── components/
│   ├── ChatBubble.js
│   ├── ChatInput.js
│   └── TypingIndicator.js
├── screens/
│   └── ChatScreen.js
├── services/
│   ├── aiService.js
│   └── storageService.js
├── theme/
│   └── colors.js
├── assets/
├── app.json
├── package.json
└── README.md