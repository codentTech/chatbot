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
import { Send, Paperclip, Mic, MessageCircleIcon } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleStartChat = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const text = messageText.trim();
    setMessage(""); // Clear input immediately

    try {
      setIsLoading(true);

      console.log("Creating conversation with message:", text);

      // First create a new conversation
      const conversationResult = await dispatch(
        createConversation({ title: "New Chat" })
      );

      console.log("Conversation result:", conversationResult);

      if (conversationResult.type.endsWith("/fulfilled")) {
        const conversationId = conversationResult.payload.id;
        console.log("Created conversation ID:", conversationId);

        // Then send the message to the new conversation
        const messageResult = await dispatch(
          sendMessage({
            message: text,
            conversationId: conversationId,
            model: "gpt-4o",
          })
        );

        console.log("Message result:", messageResult);

        if (messageResult.type.endsWith("/fulfilled")) {
          // Navigate to the chat page
          console.log("Navigating to chat:", conversationId);
          router.push(`/chat/${conversationId}`);
        } else {
          // If message sending failed, still navigate to the conversation
          console.log(
            "Message failed, but navigating to chat:",
            conversationId
          );
          router.push(`/chat/${conversationId}`);
        }
      } else {
        console.error("Conversation creation failed:", conversationResult);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
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
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedConversation={null}
        setSelectedConversation={() => {}}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header Component */}
        <Header
          selectedModel="gpt-4o"
          setSelectedModel={() => {}}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Eye-catching New Chat Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 w-full max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-purple-600/20 to-purple-800/30 rounded-2xl flex items-center justify-center border border-purple-600/30 backdrop-blur-sm shadow-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-inner">
                <MessageCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent leading-tight">
              Start a New Conversation
            </h1>
            <p className="text-purple-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-lg mx-auto leading-relaxed px-2">
              Ask me anything - I'm here to help with coding, design, writing,
              research, and much more.
            </p>
          </div>

          {/* Chat Input Area */}
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2 sm:p-3">
              <div className="flex items-end gap-2 sm:gap-3">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything... I'm here to help!"
                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-24 text-xs sm:text-sm focus:outline-none"
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
                  <button className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-white flex items-center justify-center">
                    <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={() => handleStartChat(message)}
                    disabled={!message.trim() || isLoading}
                    className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
