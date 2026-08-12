const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_MODEL || "gemini-flash-latest";

app.get("/", (req, res) => {
  res.json({
    message: "AI Chatbot backend is running",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key is not configured.",
      });
    }

    const { history } = req.body;

    if (!Array.isArray(history)) {
      return res.status(400).json({
        error: "Invalid chat history.",
      });
    }

    const contents = history.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const GEMINI_URL =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${GEMINI_MODEL}:generateContent`;

    const response = await axios.post(
      GEMINI_URL,
      {
        systemInstruction: {
          parts: [
            {
              text: "You are a helpful, friendly assistant inside a mobile chat app. Keep answers concise and clear.",
            },
          ],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: GEMINI_API_KEY,
        },
        timeout: 30000,
      }
    );

    const reply =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        error: "The AI returned an empty response.",
      });
    }

    res.json({
      reply: reply.trim(),
    });
  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error?.message ||
      "Something went wrong while contacting Gemini.";

    res.status(status).json({
      error: message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Chatbot backend running on port ${PORT}`);
});