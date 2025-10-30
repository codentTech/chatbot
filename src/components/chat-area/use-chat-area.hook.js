"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { enqueueSnackbar } from "notistack";
import { GUEST_CHAT_LIMITS } from "@/common/constants/chat.constant";

export default function useChatArea({
  chatMessages,
  setChatMessages,
  message,
  setMessage,
  isLoading,
  onSendMessage,
  onRetryMessage,
  isLoggedIn = true,
  onConversationChanged,
  conversationId,
}) {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastMessageCountRef = useRef(0);
  const previousFirstMessageIdRef = useRef(null);

  const [streamingMessage, setStreamingMessage] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [streamedMessageIds, setStreamedMessageIds] = useState(new Set());
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const hasShownSignInPromptRef = useRef(false);
  const hasShownDisabledPromptRef = useRef(false);
  const [aiContentOverrides, setAiContentOverrides] = useState(new Map());
  const typingWatchdogRef = useRef(null);
  const pendingAiQueueRef = useRef([]); // queue of { id, content }

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      if (typingWatchdogRef.current) {
        clearTimeout(typingWatchdogRef.current);
        typingWatchdogRef.current = null;
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [typingTimeout]);

  const scrollToBottom = useCallback((immediate = false) => {
    if (immediate) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    } else {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, []);

  const focusTextarea = useCallback(() => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }, 0);
  }, []);

  const handleExplainCode = useCallback(() => {
    setMessage("Explain this code:\n\n```\n// Your code here\n```");
    focusTextarea();
  }, [setMessage, focusTextarea]);

  const handleDesignIdeas = useCallback(() => {
    setMessage("Help me with design ideas for: ");
    focusTextarea();
  }, [setMessage, focusTextarea]);

  const handleWriteContent = useCallback(() => {
    setMessage("Write content about: ");
    focusTextarea();
  }, [setMessage, focusTextarea]);

  const handleResearchTopic = useCallback(() => {
    setMessage("Research and provide information about: ");
    focusTextarea();
  }, [setMessage, focusTextarea]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      scrollToBottom(false);
    }
  }, [chatMessages.length, scrollToBottom]);

  const userMessageCount = useMemo(() => {
    if (isLoggedIn) return 0;
    return chatMessages.filter((msg) => msg.type === "user").length;
  }, [chatMessages, isLoggedIn]);

  const isChatDisabled = useMemo(() => {
    return (
      !isLoggedIn && userMessageCount >= GUEST_CHAT_LIMITS.MAX_FREE_MESSAGES
    );
  }, [isLoggedIn, userMessageCount]);

  // Removed guest-specific typing trigger; typing will be derived from state

  useEffect(() => {
    if (
      !isLoggedIn &&
      userMessageCount === GUEST_CHAT_LIMITS.SIGN_IN_PROMPT_MESSAGE_COUNT &&
      !hasShownSignInPromptRef.current
    ) {
      hasShownSignInPromptRef.current = true;
      enqueueSnackbar(GUEST_CHAT_LIMITS.SIGN_IN_MESSAGE, {
        variant: "info",
        autoHideDuration: 7000,
      });
    }

    if (userMessageCount < GUEST_CHAT_LIMITS.SIGN_IN_PROMPT_MESSAGE_COUNT) {
      hasShownSignInPromptRef.current = false;
    }
  }, [userMessageCount, isLoggedIn]);

  useEffect(() => {
    if (
      isChatDisabled &&
      userMessageCount === GUEST_CHAT_LIMITS.MAX_FREE_MESSAGES &&
      !hasShownDisabledPromptRef.current
    ) {
      hasShownDisabledPromptRef.current = true;
      enqueueSnackbar(GUEST_CHAT_LIMITS.CHAT_DISABLED_MESSAGE, {
        variant: "warning",
        autoHideDuration: 8000,
      });
    }

    if (userMessageCount < GUEST_CHAT_LIMITS.MAX_FREE_MESSAGES) {
      hasShownDisabledPromptRef.current = false;
    }
  }, [isChatDisabled, userMessageCount]);

  const simulateStreaming = useCallback(
    (messageContent, messageId) => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }

      setIsAiTyping(false);
      setStreamingMessageId(messageId);
      setStreamingMessage("");

      const characters = messageContent.split("");
      let currentText = "";
      let charIndex = 0;
      let scrollCounter = 0;

      streamIntervalRef.current = setInterval(() => {
        if (charIndex < characters.length) {
          currentText += characters[charIndex];
          setStreamingMessage(currentText);
          setAiContentOverrides((prev) => {
            const next = new Map(prev);
            next.set(messageId, currentText);
            return next;
          });
          charIndex++;
          scrollCounter++;

          if (scrollCounter >= 15) {
            scrollCounter = 0;
            requestAnimationFrame(() => {
              scrollToBottom(false);
            });
          }
        } else {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }

          if (setChatMessages) {
            setChatMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId ? { ...msg, content: messageContent } : msg
              )
            );
          }

          setAiContentOverrides((prev) => {
            const next = new Map(prev);
            next.set(messageId, messageContent);
            return next;
          });

          setStreamedMessageIds((prev) => {
            const updated = new Set(prev);
            updated.add(messageId);
            return updated;
          });

          setTimeout(() => {
            setStreamingMessageId(null);
            setStreamingMessage("");
            scrollToBottom(false);

            // After completing, if there is any queued AI message, stream it next
            const nextItem = pendingAiQueueRef.current.shift();
            if (nextItem) {
              simulateStreaming(nextItem.content, nextItem.id);
            }
          }, 50);
        }
      }, 12);
    },
    [setChatMessages, scrollToBottom]
  );

  useEffect(() => {
    const currentCount = chatMessages.length;
    const firstMessageId = chatMessages.length > 0 ? chatMessages[0]?.id : null;

    const conversationChanged =
      previousFirstMessageIdRef.current !== null &&
      firstMessageId !== previousFirstMessageIdRef.current &&
      currentCount > 0;

    if (conversationChanged) {
      hasInitializedRef.current = false;
      setStreamingMessageId(null);
      setStreamingMessage("");
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
      pendingAiQueueRef.current = [];
    }

    if (!hasInitializedRef.current && currentCount > 0) {
      const existingAiMessageIds = new Set(
        chatMessages
          .filter(
            (msg) => msg.type === "ai" && msg.content && msg.content.trim()
          )
          .map((msg) => msg.id)
      );
      setStreamedMessageIds(existingAiMessageIds);
      lastMessageCountRef.current = currentCount;
      previousFirstMessageIdRef.current = firstMessageId;
      hasInitializedRef.current = true;
      setTimeout(() => scrollToBottom(true), 100);
      return;
    }

    if (hasInitializedRef.current && currentCount === 0) {
      hasInitializedRef.current = false;
      lastMessageCountRef.current = 0;
      previousFirstMessageIdRef.current = null;
      setStreamedMessageIds(new Set());
      setStreamingMessageId(null);
      setStreamingMessage("");
      setAiContentOverrides(new Map());
      pendingAiQueueRef.current = [];
      return;
    }

    if (!hasInitializedRef.current) {
      return;
    }

    // Build/extend queue from incoming AI messages with content
    for (const m of chatMessages) {
      if (
        m.type === "ai" &&
        m.content &&
        m.content.trim() !== "" &&
        !streamedMessageIds.has(m.id) &&
        m.id !== streamingMessageId &&
        !pendingAiQueueRef.current.find((q) => q.id === m.id)
      ) {
        pendingAiQueueRef.current.push({ id: m.id, content: m.content });
      }
    }

    // If nothing is streaming, start with the first queued item
    if (!streamingMessageId) {
      const nextItem = pendingAiQueueRef.current.shift();
      if (nextItem) {
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          setTypingTimeout(null);
        }
        setIsAiTyping(false);
        simulateStreaming(nextItem.content, nextItem.id);
      }
    }

    lastMessageCountRef.current = currentCount;
  }, [
    chatMessages,
    streamedMessageIds,
    streamingMessageId,
    typingTimeout,
    simulateStreaming,
    scrollToBottom,
  ]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.content) {
        setIsAiTyping(false);
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          setTypingTimeout(null);
        }
      }
    }

    // Drop overrides once server provides non-empty content
    setAiContentOverrides((prev) => {
      const next = new Map(prev);
      let changed = false;
      for (const msg of chatMessages) {
        if (
          msg.type === "ai" &&
          msg.content &&
          msg.content.trim() !== "" &&
          next.has(msg.id)
        ) {
          next.delete(msg.id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [chatMessages, typingTimeout]);

  // Improved typing indicator: show if there are only user messages and none are streaming AI, OR a new user message is pending
  useEffect(() => {
    const last = chatMessages[chatMessages.length - 1];
    const hasAnyAi = chatMessages.some(
      (msg) => msg.type === "ai" && msg.content && msg.content.trim() !== ""
    );
    const lastIsUser = last && last.type === "user";
    const noStreaming = !streamingMessageId;

    if (
      lastIsUser &&
      noStreaming &&
      !hasAnyAi &&
      !isChatDisabled &&
      !isAiTyping
    ) {
      setIsAiTyping(true);
    } else if (
      (hasAnyAi || streamingMessageId || isChatDisabled) &&
      isAiTyping
    ) {
      setIsAiTyping(false);
    }
  }, [chatMessages, isAiTyping, streamingMessageId, isChatDisabled]);

  // Clear local UI state when conversationId changes
  useEffect(() => {
    setStreamingMessage("");
    setStreamingMessageId(null);
    setStreamedMessageIds(new Set());
    setAiContentOverrides(new Map());
    setIsAiTyping(false);
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    if (onConversationChanged) {
      onConversationChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || isLoading || isChatDisabled) return;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // do not force typing here; derived effect will handle it

    if (onSendMessage) {
      onSendMessage();
    }
  }, [message, isLoading, typingTimeout, onSendMessage, isChatDisabled]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleCopyMessage = useCallback(async (messageContent, messageId) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(messageContent);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = messageContent;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      textArea.style.pointerEvents = "none";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  }, []);

  const handleEditMessage = useCallback(
    (messageIndex) => {
      const messageToEdit = chatMessages[messageIndex];
      if (!messageToEdit || messageToEdit.type !== "user") return;

      setMessage(messageToEdit.content);

      if (setChatMessages && typeof setChatMessages === "function") {
        setChatMessages((prev) => prev.slice(0, messageIndex));
      }

      setTimeout(() => {
        focusTextarea();
      }, 50);
    },
    [chatMessages, setMessage, setChatMessages, focusTextarea]
  );

  const handleRetryMessage = useCallback(
    async (messageIndex) => {
      const userMessage = chatMessages[messageIndex];
      if (!userMessage || userMessage.type !== "user") return;

      if (isLoading) return;

      if (setChatMessages && typeof setChatMessages === "function") {
        setChatMessages((prev) => {
          const updated = [...prev];
          if (updated[messageIndex + 1]?.type === "ai") {
            updated.splice(messageIndex + 1, 1);
          }
          return updated;
        });
      }

      if (onRetryMessage && typeof onRetryMessage === "function") {
        await onRetryMessage(userMessage.content, messageIndex);
      }
    },
    [chatMessages, isLoading, setChatMessages, onRetryMessage]
  );

  const getMessageContent = useCallback(
    (msg) => {
      if (msg.type === "user") {
        return msg.content || "";
      }

      if (msg.type === "ai") {
        if (streamingMessageId === msg.id) {
          return streamingMessage || aiContentOverrides.get(msg.id) || "";
        }
        return aiContentOverrides.get(msg.id) || msg.content || "";
      }

      return msg.content || "";
    },
    [streamingMessageId, streamingMessage, aiContentOverrides]
  );

  return {
    messagesEndRef,
    textareaRef,
    streamingMessage,
    streamingMessageId,
    streamedMessageIds,
    isAiTyping,
    isTypingFadingOut: false,
    copiedMessageId,
    isChatDisabled,
    userMessageCount,
    getMessageContent,
    handleExplainCode,
    handleDesignIdeas,
    handleWriteContent,
    handleResearchTopic,
    handleSendMessage,
    handleKeyPress,
    handleCopyMessage,
    handleEditMessage,
    handleRetryMessage,
  };
}
