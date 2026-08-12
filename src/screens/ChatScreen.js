import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import uuid from "react-native-uuid";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import TypingIndicator from "../components/TypingIndicator";
import { sendMessageToAI, AIServiceError } from "../services/aiService";
import {
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
} from "../services/storageService";
import colors from "../theme/colors";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const listRef = useRef(null);

  // Load persisted history on mount
  useEffect(() => {
    (async () => {
      const history = await loadChatHistory();
      setMessages(history);
      setIsHistoryLoading(false);
    })();
  }, []);

  // Persist history whenever it changes
  useEffect(() => {
    if (!isHistoryLoading) {
      saveChatHistory(messages);
    }
  }, [messages, isHistoryLoading]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleSend = async (text) => {
    const userMessage = {
      id: uuid.v4(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    scrollToEnd();

    try {
      const reply = await sendMessageToAI(updatedMessages);
      const botMessage = {
        id: uuid.v4(),
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const message =
        error instanceof AIServiceError
          ? error.message
          : "Something went wrong. Please try again.";
      const errorMessage = {
        id: uuid.v4(),
        role: "assistant",
        content: message,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToEnd();
    }
  };

  const handleClearChat = () => {
  if (Platform.OS === "web") {
    const confirmed = window.confirm(
      "This will delete your entire chat history."
    );

    if (confirmed) {
      setMessages([]);
      clearChatHistory();
    }

    return;
  }

  Alert.alert("Clear chat", "This will delete your entire chat history.", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Clear",
      style: "destructive",
      onPress: async () => {
        setMessages([]);
        await clearChatHistory();
      },
    },
  ]);
};

  if (isHistoryLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>
            {isLoading ? "typing..." : "online"}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClearChat}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

     {messages.length === 0 ? (
  <View style={styles.emptyState}>
    <Text style={styles.aiIcon}>🤖</Text>

    <Text style={styles.emptyTitle}>
      Welcome to AI Assistant
    </Text>

    <Text style={styles.emptySubtitle}>
      Ask questions, learn new things, or get help with your projects.
    </Text>

    <View style={styles.suggestions}>
      <TouchableOpacity
        style={styles.suggestionButton}
        onPress={() => handleSend("Explain artificial intelligence simply")}
      >
        <Text style={styles.suggestionText}>
          Explain AI simply
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.suggestionButton}
        onPress={() => handleSend("Help me learn JavaScript")}
      >
        <Text style={styles.suggestionText}>
          Help me learn JavaScript
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.suggestionButton}
        onPress={() => handleSend("Give me a project idea")}
      >
        <Text style={styles.suggestionText}>
          Give me a project idea
        </Text>
      </TouchableOpacity>
    </View>
  </View>
) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToEnd}
        />
      )}

      {isLoading && <TypingIndicator />}

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  clearText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  aiIcon: {
  fontSize: 50,
  marginBottom: 15,
},

suggestions: {
  width: "100%",
  marginTop: 25,
},

suggestionButton: {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginBottom: 10,
},

suggestionText: {
  color: colors.textPrimary,
  fontSize: 14,
  textAlign: "center",
},
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});
