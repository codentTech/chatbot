"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  createConversation,
  sendMessage,
} from "@/provider/features/chat/chat.slice";
import Sidebar from "../components/sidebar/sidebar.component";
import Header from "../components/header/header.component";
import ChatArea from "../components/chat-area/chat-area.component";
import NewChat from "../components/new-chat/new-chat.component";
import { isLoginVerified } from "@/common/utils/access-token.util";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Guest conversation messages (stored locally, not persisted)
  const [guestMessages, setGuestMessages] = useState([]);
  const [showGuestChat, setShowGuestChat] = useState(false);

  // Check if user is logged in
  const isLoggedIn = isLoginVerified();

  const handleStartChat = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const text = messageText.trim();
    setMessage(""); // Clear input immediately

    try {
      // Check if user is logged in
      if (isLoggedIn) {
        // Create conversation in background (do NOT route early)
        const conversationResult = await dispatch(
          createConversation({ title: "New Chat" })
        );

        if (conversationResult.type.endsWith("/fulfilled")) {
          const conversationId = conversationResult.payload.id;

          // Route directly to concrete chat page (no interim)
          router.push(`/chat/${conversationId}`);

          // Fire sendMessage in background
          dispatch(
            sendMessage({
              message: text,
              conversationId: conversationId,
              model: "gpt-4o",
            })
          );
        } else {
          console.error("Conversation creation failed:", conversationResult);
        }
      } else {
        // GUEST USER: Just send message and display response on same page
        setIsLoading(true);
        setShowGuestChat(true);

        // Add user message immediately
        const userMessage = {
          id: `guest-user-${Date.now()}`,
          type: "user",
          content: text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setGuestMessages((prev) => [...prev, userMessage]);

        // Send message to backend (without conversation ID)
        const messageResult = await dispatch(
          sendMessage({
            message: text,
            conversationId: null, // No conversation ID for guests
            model: "gpt-4o",
          })
        );

        if (messageResult.type.endsWith("/fulfilled")) {
          // Add AI response - ChatArea will detect and stream it smoothly
          // Service returns response.data.data, so payload is { user_message, ai_response, ... }
          const responseData = messageResult.payload;
          const aiContent = responseData?.ai_response || "";

          const aiMessage = {
            id: `guest-ai-${Date.now()}`,
            type: "ai",
            content: aiContent, // Full content - ChatArea will stream it
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setGuestMessages((prev) => [...prev, aiMessage]);
        } else {
          // Handle error - show error message
          const errorMessage = {
            id: `guest-error-${Date.now()}`,
            type: "ai",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setGuestMessages((prev) => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
      if (!isLoggedIn) {
        // Show error for guest user
        const errorMessage = {
          id: `guest-error-${Date.now()}`,
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setGuestMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      if (!isLoggedIn) setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    handleStartChat(message);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle new chat for guest users - clears current conversation
  const handleNewChat = () => {
    setGuestMessages([]);
    setShowGuestChat(false);
    setMessage("");
    // Scroll to top if needed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle retry for guest users - regenerates AI response without adding new user message
  const handleRetryMessage = async (messageContent, messageIndex) => {
    if (isLoading || !messageContent.trim()) return;

    try {
      setIsLoading(true);

      // Send message to backend (without conversation ID)
      const messageResult = await dispatch(
        sendMessage({
          message: messageContent,
          conversationId: null, // No conversation ID for guests
          model: "gpt-4o",
        })
      );

      if (messageResult.type.endsWith("/fulfilled")) {
        // Add AI response - ChatArea will detect and stream it smoothly
        const responseData = messageResult.payload;
        const aiContent = responseData?.ai_response || "";

        const aiMessage = {
          id: `guest-ai-${Date.now()}`,
          type: "ai",
          content: aiContent, // Full content - ChatArea will stream it
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setGuestMessages((prev) => [...prev, aiMessage]);
      } else {
        // Handle error - show error message
        const errorMessage = {
          id: `guest-error-${Date.now()}`,
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setGuestMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Failed to retry message:", error);
      // Show error message
      const errorMessage = {
        id: `guest-error-${Date.now()}`,
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setGuestMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-screen text-white overflow-hidden flex relative`}>
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-br from-slate-900/90 via-purple-900/40 to-slate-900/90" : "bg-gradient-to-br from-slate-100/90 via-purple-100/40 to-slate-100/90"}`}
        />
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDarkMode ? "bg-purple-500/5" : "bg-purple-300/10"} rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDarkMode ? "bg-slate-500/5" : "bg-slate-300/10"} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "2s" }}
        />
      </div>
      {/* Sidebar - Only show for logged in users */}
      {isLoggedIn && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedConversation={null}
          setSelectedConversation={() => {}}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header Component */}
        <Header
          selectedModel="gpt-4o"
          setSelectedModel={() => {}}
          sidebarOpen={isLoggedIn ? sidebarOpen : false}
          setSidebarOpen={isLoggedIn ? setSidebarOpen : () => {}}
          onNewChat={handleNewChat}
        />

        {/* Show Chat Area for guest users with messages, or new chat UI for guests without messages or logged in users */}
        {!isLoggedIn && showGuestChat ? (
          // Guest user with active conversation - show ChatArea
          <ChatArea
            isDarkMode={isDarkMode}
            chatMessages={guestMessages}
            setChatMessages={setGuestMessages}
            message={message}
            setMessage={setMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onSendMessage={handleSendMessage}
            onKeyPress={onKeyPress}
            isLoading={isLoading}
            onRetryMessage={handleRetryMessage}
          />
        ) : (
          // New chat UI (for logged in users or guests without messages)
          <NewChat
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onSendMessage={handleSendMessage}
            onKeyPress={onKeyPress}
          />
        )}
      </div>

      {/* Mobile Overlay - Only show when sidebar is open and user is logged in */}
      {isLoggedIn && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
