"use client";

import {
  Copy,
  Edit,
  Mic,
  Paperclip,
  RefreshCcw,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import MessageRenderer from "./messagee-renderer";

function ChatArea({
  isDarkMode,
  chatMessages,
  setChatMessages,
  message,
  setMessage,
  isRecording,
  setIsRecording,
  onSendMessage,
  onKeyPress,
  isLoading = false,
}) {
  const messagesEndRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [streamedMessageIds, setStreamedMessageIds] = useState(new Set());
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isTypingFadingOut, setIsTypingFadingOut] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom when entering chat or new messages arrive
  useEffect(() => {
    // Smooth scroll with a small delay to allow animations to start
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }, [chatMessages]);

  // Clear typing indicator when new messages arrive
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage && lastMessage.type === "ai") {
        setIsAiTyping(false);
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          setTypingTimeout(null);
        }
      }
    }
  }, [chatMessages, typingTimeout]);

  // Initialize - mark ALL existing messages as already streamed (no streaming for existing messages)
  useEffect(() => {
    if (chatMessages.length > 0 && !isInitialized) {
      const existingMessageIds = new Set(chatMessages.map((msg) => msg.id));
      setStreamedMessageIds(existingMessageIds);
      setPreviousMessageCount(chatMessages.length);
      setIsInitialized(true);
    } else if (chatMessages.length === 0 && !isInitialized) {
      setIsInitialized(true);
    }
  }, [chatMessages.length, isInitialized]); // Only run when not initialized

  // No typing indicator - go straight to streaming like ChatGPT

  // Simulate streaming effect for AI messages
  const simulateStreaming = (message, messageId) => {
    // Start fade-out transition for typing indicator
    setIsTypingFadingOut(true);

    // Wait for fade-out animation to complete before starting streaming
    setTimeout(() => {
      setIsAiTyping(false);
      setIsTypingFadingOut(false);
      setStreamingMessageId(messageId);
      setStreamingMessage("");

      const words = message.split(" ");
      let currentText = "";
      let wordIndex = 0;

      // Start streaming immediately after typing indicator fades out
      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
          setStreamingMessage(currentText);
          wordIndex++;
          // Auto-scroll during streaming
          setTimeout(() => scrollToBottom(), 10);
        } else {
          clearInterval(streamInterval);
          setStreamingMessageId(null);
          setStreamingMessage("");
          // Mark this message as streamed
          setStreamedMessageIds((prev) => new Set([...prev, messageId]));
          // Final scroll after streaming completes
          setTimeout(() => scrollToBottom(), 100);
        }
      }, 35); // Slightly slower for smoother effect
    }, 300); // Shorter fade-out duration for smoother transition
  };

  // Check for new AI messages and start streaming
  useEffect(() => {
    if (!isInitialized) return; // Don't process until initialized

    const currentMessageCount = chatMessages.length;
    const lastMessage = chatMessages[chatMessages.length - 1];

    // Only stream if:
    // 1. There's a last message
    // 2. It's an AI message
    // 3. We're not already streaming
    // 4. The message count has increased (new message)
    // 5. This message hasn't been streamed before
    if (
      lastMessage &&
      lastMessage.type === "ai" &&
      !streamingMessageId &&
      currentMessageCount > previousMessageCount &&
      !streamedMessageIds.has(lastMessage.id)
    ) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        simulateStreaming(lastMessage.content, lastMessage.id);
      }, 50);
    }

    // Update the previous message count
    setPreviousMessageCount(currentMessageCount);
  }, [
    chatMessages,
    streamingMessageId,
    previousMessageCount,
    streamedMessageIds,
    isInitialized,
  ]);

  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;

    // Clear any existing typing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Show typing indicator with a small delay for smoother transition
    setTimeout(() => {
      setIsAiTyping(true);
    }, 100);

    // Set a timeout to hide typing indicator if no response comes
    const timeout = setTimeout(() => {
      setIsAiTyping(false);
    }, 10000); // 10 seconds timeout
    setTypingTimeout(timeout);

    // Use the external send message handler
    if (onSendMessage) {
      onSendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      {/* Enhanced Chat Messages */}
      <div className="flex-1 overflow-y-scroll overflow-x-visible relative custom-scrollbar">
        {/* Animated Background Pattern - Fixed positioning for smooth scrolling */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/40 to-slate-900/90" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-2 sm:space-y-4 mt-4">
          {chatMessages.length === 0 ? (
            // no conersation found
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-purple-300">No conversation found</p>
              </div>
            </div>
          ) : chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => {
              // Hide AI messages that are about to be streamed (to prevent flickering)
              const isAiMessageBeingStreamed =
                msg.type === "ai" && streamingMessageId === msg.id;
              const isAiMessageWaitingToStream =
                msg.type === "ai" &&
                isAiTyping &&
                !streamedMessageIds.has(msg.id);

              // Don't render AI messages that are waiting to stream or currently streaming
              if (isAiMessageWaitingToStream && !isAiMessageBeingStreamed) {
                return null;
              }

              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} ${msg.type === "user" ? "animate-slide-in-right" : "animate-slide-in-left"} transform transition-all duration-500 ease-out hover:scale-[1.01]`}
                  style={{
                    animationDelay: `${index * 0.02}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div
                    className={`max-w-[85vw] sm:max-w-2xl relative transition-all duration-500 ease-out group ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-purple-800/50 via-purple-700/60 to-purple-800/50 text-white border border-purple-600/40 shadow-purple-500/20 rounded-xl p-3 sm:p-4 rounded-br-md shadow-lg hover:shadow-2xl backdrop-blur-sm transition-shadow duration-300"
                        : `${isDarkMode ? "text-white" : "text-slate-900"} p-3 sm:p-4`
                    }`}
                  >
                    <div
                      className={`text-xs leading-relaxed whitespace-pre-wrap ${isDarkMode ? "!text-white" : "!text-slate-900"}`}
                    >
                      <MessageRenderer
                        content={
                          msg.type === "ai" && streamingMessageId === msg.id
                            ? streamingMessage
                            : msg.content
                        }
                        isDarkMode={isDarkMode}
                      />
                      {msg.type === "ai" && streamingMessageId === msg.id && (
                        <span className="inline-block w-0.5 h-4 bg-gradient-to-b from-purple-400 to-purple-600 ml-1 animate-pulse rounded-full shadow-sm"></span>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${isDarkMode ? "border-purple-700/20" : "border-purple-300/20"}`}
                    >
                      <div
                        className={`text-xs ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                      >
                        {msg.timestamp}
                      </div>

                      {msg.type === "ai" ? (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className={`p-1 sm:p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-purple-100/50"} transition-colors ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                          >
                            <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            className={`p-1 sm:p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-purple-100/50"} transition-colors ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                          >
                            <ThumbsUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            className={`p-1 sm:p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-purple-100/50"} transition-colors ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                          >
                            <ThumbsDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className={`p-1 sm:p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-purple-100/50"} transition-colors ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                          >
                            <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            className={`p-1 sm:p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-purple-100/50"} transition-colors ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                          >
                            <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            className={`p-1 sm:p-1.5 rounded-md ${isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-purple-100/50"} transition-colors ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
                          >
                            <RefreshCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-purple-300">Loading conversation...</p>
              </div>
            </div>
          )}

          {/* Compact AI Typing Indicator */}
          {isAiTyping && !streamingMessageId && (
            <div
              className={`flex justify-start transition-all duration-300 ease-in-out ${
                isTypingFadingOut
                  ? "opacity-0 transform translate-y-2"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              <div className="max-w-[85vw] sm:max-w-2xl bg-gradient-to-r from-slate-800/30 to-purple-800/20 backdrop-blur-sm rounded-xl rounded-bl-md px-3 py-2 border border-purple-500/20 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div
                      className="w-1 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-typing-dots shadow-sm"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-typing-dots shadow-sm"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-typing-dots shadow-sm"
                      style={{ animationDelay: "400ms" }}
                    ></div>
                  </div>
                  <span className="text-purple-300 text-xs font-medium">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-2 sm:p-4 relative z-10">
        {/* Background is now handled by the fixed background above */}
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2 sm:p-3 hover:bg-white/15 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-purple-500/10">
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything... I'm here to help!"
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-24 text-xs sm:text-sm focus:outline-none transition-all duration-300 focus:placeholder-purple-300"
                  rows="1"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              {/* Quick Actions */}
              <div className="hidden md:flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-center sm:justify-start">
                <button className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white">
                  ✨ Explain this code
                </button>
                <button className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white">
                  🎨 Design ideas
                </button>
                <button className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white">
                  📝 Write content
                </button>
                <button className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors text-white">
                  🔍 Research topic
                </button>
              </div>

              <div className="flex justify-end items-center gap-1.5 sm:gap-2 mt-2 sm:mt-0">
                <button className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white flex items-center justify-center hover:scale-105">
                  <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex items-center justify-center text-white hover:scale-105 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 shadow-lg"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-purple-500/25 active:scale-95"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
