import axios from "axios";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export class AIServiceError extends Error {
  constructor(message, isConfigError = false) {
    super(message);
    this.name = "AIServiceError";
    this.isConfigError = isConfigError;
  }
}

export async function sendMessageToAI(history) {
  if (!GEMINI_API_KEY) {
    throw new AIServiceError(
      "No Gemini API key found. Add EXPO_PUBLIC_GEMINI_API_KEY to your .env file and restart the app.",
      true
    );
  }

  try {
    const contents = history.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

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
      throw new AIServiceError(
        "The AI returned an empty response. Please try again."
      );
    }

    return reply.trim();
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    }

    if (error.response) {
      const status = error.response.status;
      const message = error.response?.data?.error?.message;

      if (status === 400) {
        throw new AIServiceError(
          message || "Invalid Gemini request. Please check the configuration."
        );
      }

      if (status === 401 || status === 403) {
        throw new AIServiceError(
          "Invalid or unauthorized Gemini API key. Please check your .env file.",
          true
        );
      }

      if (status === 429) {
        throw new AIServiceError(
          "Gemini rate limit reached. Please wait and try again."
        );
      }

      throw new AIServiceError(
        message || `Request failed with status ${status}.`
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new AIServiceError(
        "The request timed out. Check your connection and try again."
      );
    }

    throw new AIServiceError(
      "Network error. Please check your internet connection."
    );
  }
}