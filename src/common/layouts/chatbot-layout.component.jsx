"use client";

import React, { useState } from "react";
import Header from "@/components/header/header.component";
import Sidebar from "@/components/sidebar/sidebar.component";
import { conversations } from "@/data/conversations";

export default function ChatbotLayout({
  children,
  title = "Chatbots",
  searchQuery: propSearchQuery = "",
  setSearchQuery: propSetSearchQuery = () => {},
  showSearch = false,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const handleNewChat = () => {
    // Navigate to new chat
  };

  return (
    <div className="h-screen text-white relative bg-gradient-to-br from-slate-900/90 via-purple-900/40 to-slate-900/90 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 h-full flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <Header
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            searchQuery={propSearchQuery}
            setSearchQuery={propSetSearchQuery}
            searchPlaceholder="Search conversations..."
            showSearch={showSearch}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-hidden min-w-0">
            {sidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Overlay - Fixed z-index to be below sidebar */}
    </div>
  );
}
