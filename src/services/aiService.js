import axios from "axios";

const BACKEND_URL = "https://aichatbotapp-qa09.onrender.com";

export class AIServiceError extends Error {
  constructor(message, isConfigError = false) {
    super(message);
    this.name = "AIServiceError";
    this.isConfigError = isConfigError;
  }
}

export async function sendMessageToAI(history) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/chat`,
      {
        history,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const reply = response?.data?.reply;

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
      const message = error.response?.data?.error;

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
        "The request timed out. Please try again."
      );
    }

    throw new AIServiceError(
      "Network error. Please check your internet connection."
    );
  }
}