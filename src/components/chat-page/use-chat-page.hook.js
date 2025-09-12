"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationById,
  getConversationMessages,
  sendMessage,
  createConversation,
} from "@/provider/features/chat/chat.slice";

export const useChatPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const conversationId = params.id;

  // Redux state
  const {
    currentConversation,
    messages,
    sendMessage: sendMessageState,
    createConversation: createConversationState,
  } = useSelector((state) => state.chat);

  // Local state
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [pendingUserMessage, setPendingUserMessage] = useState(null);

  // Load conversation data when component mounts or conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadConversationData();
    }
  }, [conversationId]);

  // Load conversation and messages
  const loadConversationData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Loading conversation:", conversationId);

      // Load conversation details
      const conversationResult = await dispatch(
        getConversationById({ conversationId })
      );

      console.log("Conversation result:", conversationResult);

      if (conversationResult.type.endsWith("/rejected")) {
        setError("Conversation not found");
        return;
      }

      // Messages are already included in the conversation data, no need to load separately
      console.log(
        "Conversation loaded with messages:",
        conversationResult.payload
      );
    } catch (err) {
      setError("Failed to load conversation");
      console.error("Error loading conversation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || sendMessageState.isLoading) return;

    const messageText = message.trim();
    setMessage(""); // Clear input immediately for better UX

    // Add user message to local state immediately (before API call)
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      type: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setPendingUserMessage(tempUserMessage);

    try {
      setIsLoading(true);
      setError(null);

      const result = await dispatch(
        sendMessage({
          message: messageText,
          conversationId: conversationId,
          model: selectedModel,
        })
      );

      if (result.type.endsWith("/fulfilled")) {
        // Clear pending message and refresh conversation details
        setPendingUserMessage(null);
        await dispatch(getConversationById({ conversationId }));
      } else {
        setError("Failed to send message");
        setMessage(messageText); // Restore message if failed
        setPendingUserMessage(null); // Clear pending message
      }
    } catch (err) {
      setError("Failed to send message");
      setMessage(messageText); // Restore message if failed
      setPendingUserMessage(null); // Clear pending message
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    message,
    conversationId,
    selectedModel,
    dispatch,
    sendMessageState.isLoading,
  ]);

  // Handle creating a new conversation
  const handleNewConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await dispatch(
        createConversation({
          title: "New Chat",
        })
      );

      if (result.type.endsWith("/fulfilled")) {
        const newConversationId = result.payload.id;
        router.push(`/chat/${newConversationId}`);
      } else {
        setError("Failed to create new conversation");
      }
    } catch (err) {
      setError("Failed to create new conversation");
      console.error("Error creating conversation:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Format messages for display
  // Get messages from conversation data (backend includes messages in conversation response)
  const conversationMessages = currentConversation.data?.messages || [];

  // Add pending user message if it exists
  const allMessages = [...conversationMessages];
  if (pendingUserMessage) {
    allMessages.push({
      id: pendingUserMessage.id,
      message_type: "user",
      content: pendingUserMessage.content,
      timestamp: new Date().toISOString(),
    });
  }

  const formattedMessages = allMessages.map((msg, index) => ({
    id: msg.id || index,
    type: msg.message_type === "user" ? "user" : "ai",
    content: msg.content,
    timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return {
    // State
    conversationId,
    conversation: currentConversation.data,
    messages: formattedMessages,
    message,
    setMessage,
    selectedModel,
    setSelectedModel,
    isLoading:
      isLoading ||
      sendMessageState.isLoading ||
      currentConversation.isLoading ||
      messages.isLoading,
    error:
      error ||
      (currentConversation.isError ? currentConversation.message : null) ||
      (messages.isError ? messages.message : null) ||
      (sendMessageState.isError ? sendMessageState.message : null),

    // Actions
    handleSendMessage,
    handleNewConversation,
    handleKeyPress,
    loadConversationData,

    // Redux state
    sendMessageState,
    createConversationState,
  };
};
