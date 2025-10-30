"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [pendingUserMessage, setPendingUserMessage] = useState(null);

  // Clear UI/pending state on conversation change
  useEffect(() => {
    setIsLoadingConversation(!!conversationId);
    setPendingUserMessage(null);
    setError(null);
    setMessage("");
    setIsLoading(false);
    // Optionally clear custom streaming/override state here if needed (use callback/ref)
  }, [conversationId]);

  const loadConversationData = useCallback(async () => {
    if (!conversationId) return;
    setIsLoadingConversation(true);
    setError(null);
    const conversationResult = await dispatch(
      getConversationById({ conversationId })
    );
    if (conversationResult.type.endsWith("/rejected")) {
      setError("Conversation not found");
      setIsLoading(false);
      setIsLoadingConversation(false);
      return;
    }
    setIsLoading(false);
    setIsLoadingConversation(false);
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (conversationId) {
      loadConversationData();
    }
  }, [conversationId, loadConversationData]);

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
      setMessage(messageText);
      setPendingUserMessage(null);
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

  // Handle retry message - regenerate AI response without adding new user message
  const handleRetryMessage = useCallback(
    async (messageContent, messageIndex) => {
      if (!messageContent.trim() || sendMessageState.isLoading) return;

      try {
        setIsLoading(true);
        setError(null);

        // Send message to regenerate AI response
        const result = await dispatch(
          sendMessage({
            message: messageContent,
            conversationId: conversationId,
            model: selectedModel,
          })
        );

        if (result.type.endsWith("/fulfilled")) {
          // Refresh conversation to get updated messages
          await dispatch(getConversationById({ conversationId }));
        } else {
          setError("Failed to retry message");
        }
      } catch (err) {
        setError("Failed to retry message");
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, selectedModel, dispatch, sendMessageState.isLoading]
  );

  const conversationMessages = useMemo(() => {
    return currentConversation.data?.messages || [];
  }, [currentConversation.data?.messages]);

  // Poll for first AI response if the conversation has a recent user message but no AI yet
  useEffect(() => {
    if (!conversationId) return;

    const hasAnyAi = conversationMessages.some(
      (m) => m.message_type !== "user"
    );
    const hasAnyUser = conversationMessages.some(
      (m) => m.message_type === "user"
    );

    // Only poll when there is at least one user message and no AI message yet
    if (hasAnyUser && !hasAnyAi) {
      let attempts = 0;
      let delay = 800; // start at 0.8s
      const maxAttempts = 10; // ~8-12s total with backoff
      let cancelled = false;

      const tick = async () => {
        if (cancelled) return;
        attempts += 1;
        await dispatch(getConversationById({ conversationId }));
        const latest = await new Promise((r) => setTimeout(r, 0), null);
        // Increase delay gradually
        delay = Math.min(2000, Math.round(delay * 1.25));
        if (attempts < maxAttempts) {
          setTimeout(tick, delay);
        }
      };

      const timer = setTimeout(tick, delay);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
  }, [conversationId, conversationMessages, dispatch]);

  const formattedMessages = useMemo(() => {
    const allMessages = [...conversationMessages];

    if (pendingUserMessage) {
      allMessages.push({
        id: pendingUserMessage.id,
        message_type: "user",
        content: pendingUserMessage.content,
        timestamp: new Date().toISOString(),
      });
    }

    return allMessages.map((msg, index) => ({
      id: msg.id || `msg-${index}`,
      type: msg.message_type === "user" ? "user" : "ai",
      content: msg.content || "",
      timestamp: msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
    }));
  }, [conversationMessages, pendingUserMessage]);

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
    isLoadingConversation,
    error:
      error ||
      (currentConversation.isError ? currentConversation.message : null) ||
      (messages.isError ? messages.message : null) ||
      (sendMessageState.isError ? sendMessageState.message : null),

    // Actions
    handleSendMessage,
    handleNewConversation,
    handleKeyPress,
    handleRetryMessage,
    loadConversationData,
    // For children/hooks to clear UI state
    clearConversationUIState: () => {
      setPendingUserMessage(null);
      setError(null);
      setMessage("");
      setIsLoading(false);
    },

    // Redux state
    sendMessageState,
    createConversationState,
  };
};
