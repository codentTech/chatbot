"use client";

import Header from "../header/header.component";
import ChatArea from "../chat-area/chat-area.component";

export default function AIChatbot({
  isDarkMode,
  chatMessages,
  message,
  setMessage,
  isRecording,
  setIsRecording,
  sidebarOpen,
  setSidebarOpen,
  isNewChat,
  handleStartChat,
  selectedModel,
  setSelectedModel,
}) {
  return (
    <div className="flex-1 flex flex-col relative">
      {/* Header Component */}
      <Header
        isDarkMode={isDarkMode}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Chat Area Component */}
      <ChatArea
        isDarkMode={isDarkMode}
        chatMessages={chatMessages}
        message={message}
        setMessage={setMessage}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isNewChat={isNewChat}
        handleStartChat={handleStartChat}
      />
    </div>
  );
}
