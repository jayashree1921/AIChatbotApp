import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_HISTORY_KEY = "@ai_chatbot_history_v1";

/**
 * Loads persisted chat history from device storage.
 * Returns an empty array if nothing has been saved yet or on error.
 */
export async function loadChatHistory() {
  try {
    const raw = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to load chat history:", error);
    return [];
  }
}

/**
 * Persists the full chat history array to device storage.
 */
export async function saveChatHistory(messages) {
  try {
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (error) {
    console.warn("Failed to save chat history:", error);
  }
}

/**
 * Clears all persisted chat history.
 */
export async function clearChatHistory() {
  try {
    await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.warn("Failed to clear chat history:", error);
  }
}
