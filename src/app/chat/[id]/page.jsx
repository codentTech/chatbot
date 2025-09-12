"use client";

import { useState } from "react";
import Sidebar from "../../../components/sidebar/sidebar.component";
import Header from "../../../components/header/header.component";
import ChatArea from "../../../components/chat-area/chat-area.component";
import { useChatPage } from "../../../components/chat-page/use-chat-page.hook";

export default function ChatPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use the chat page hook for all chat functionality
  const {
    conversationId,
    conversation,
    messages: chatMessages,
    message,
    setMessage,
    selectedModel,
    setSelectedModel,
    isLoading,
    error,
    handleSendMessage,
    handleNewConversation,
    handleKeyPress,
  } = useChatPage();

  const handleNewChat = () => {
    handleNewConversation();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedConversation={conversationId}
        setSelectedConversation={() => {}}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header Component */}
        <Header
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Loading State */}
        {/* {isLoading && !chatMessages.length && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-purple-300">Loading conversation...</p>
            </div>
          </div>
        )} */}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 text-red-500">⚠️</div>
              </div>
              <p className="text-red-300 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Area Component */}
        {!error && (
          <ChatArea
            isDarkMode={isDarkMode}
            chatMessages={chatMessages}
            setChatMessages={() => {}} // Messages are managed by the hook
            message={message}
            setMessage={setMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Mobile Overlay - Fixed z-index to be below sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
