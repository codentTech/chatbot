"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Calendar,
  Star,
  Edit,
  MoreVertical,
  ArrowLeft,
  Share2,
  Archive,
  Trash2,
} from "lucide-react";

const ChatbotConversations = ({
  chatbot,
  onBackToChatbots,
  onNewConversation,
  searchQuery = "",
}) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [showTrainingPanel, setShowTrainingPanel] = useState(false);
  const [trainingFiles, setTrainingFiles] = useState([]);

  const [newConversationData, setNewConversationData] = useState({
    title: "",
    description: "",
  });

  // Sample conversations data - this would come from your backend
  const [conversations] = useState([
    {
      id: 1,
      title: "UX Design Best Practices",
      preview:
        "Discussion about mobile app UX design principles and current trends...",
      lastMessage: "What are the key principles for mobile-first design?",
      timestamp: "2 hours ago",
      messageCount: 24,
      isStarred: true,
    },
    {
      id: 2,
      title: "React Native Performance",
      preview:
        "Optimizing React Native app performance and reducing bundle size...",
      lastMessage: "How can I reduce the app bundle size?",
      timestamp: "1 day ago",
      messageCount: 18,
      isStarred: false,
    },
    {
      id: 3,
      title: "User Onboarding Flow",
      preview:
        "Designing an effective user onboarding experience for new users...",
      lastMessage: "What's the optimal number of onboarding steps?",
      timestamp: "3 days ago",
      messageCount: 31,
      isStarred: true,
    },
    {
      id: 4,
      title: "API Integration Strategy",
      preview: "Planning the backend API integration and data flow...",
      lastMessage: "Should I use REST or GraphQL for this project?",
      timestamp: "1 week ago",
      messageCount: 15,
      isStarred: false,
    },
    {
      id: 5,
      title: "Testing Strategy",
      preview: "Implementing comprehensive testing for the mobile app...",
      lastMessage: "What testing frameworks do you recommend?",
      timestamp: "2 weeks ago",
      messageCount: 22,
      isStarred: false,
    },
  ]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showContextMenu && !event.target.closest(".context-menu-container")) {
        setShowContextMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showContextMenu]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newConversationData.title.trim()) {
      const newConversation = {
        id: Date.now(),
        ...newConversationData,
        preview: "Start a new conversation...",
        lastMessage: "",
        timestamp: "Just now",
        messageCount: 0,
        isStarred: false,
      };
      onNewConversation(newConversation);
      setNewConversationData({
        title: "",
        description: "",
      });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900/90 via-purple-900/40 to-slate-900/90 text-white overflow-hidden">
      {/* Clean Header - Responsive */}
      <div className="border-b border-white/10 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBackToChatbots}
              className="text-purple-300 hover:text-white transition-colors p-1"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">
                {chatbot.name}
              </h1>
              <p className="text-xs sm:text-sm text-purple-300 truncate">
                {chatbot.conversationCount} conversations • {chatbot.lastActive}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">New Conversation</span>
              <span className="xs:hidden">New</span>
            </button>
            <button
              onClick={() => setShowTrainingPanel(true)}
              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span className="hidden sm:inline">Feed Knowledge</span>
              <span className="sm:hidden">Train</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Responsive Side by Side Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Side - Conversations List */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:pr-6">
            {/* Conversations */}
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">
                  No conversations found
                </h3>
                <p className="text-sm text-purple-300 mb-4 px-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start your first conversation to get started"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Start Conversation
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="relative group p-3 sm:p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white truncate text-sm sm:text-base">
                            {conv.title}
                          </h3>
                          {conv.isStarred && (
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-purple-300 line-clamp-2 leading-relaxed">
                          {conv.preview}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-1 transition-opacity flex-shrink-0 ${
                          showContextMenu === conv.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowContextMenu(conv.id);
                          }}
                          className="p-1 hover:bg-purple-700/40 rounded-md transition-colors cursor-pointer"
                          title="More options"
                        >
                          <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-purple-300">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{conv.messageCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="truncate">{conv.timestamp}</span>
                      </div>
                    </div>

                    {/* Context Menu */}
                    {showContextMenu === conv.id && (
                      <div className="context-menu-container absolute right-2 top-8 bg-slate-800/95 border-purple-700/50 backdrop-blur-md border rounded-lg shadow-xl z-20 min-w-32 sm:min-w-36 py-1">
                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => setShowContextMenu(null)}
                        >
                          <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Rename
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => setShowContextMenu(null)}
                        >
                          <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Share
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => setShowContextMenu(null)}
                        >
                          <Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Archive
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-red-900/30 transition-colors text-red-400"
                          onClick={() => setShowContextMenu(null)}
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Clean Project Details - Responsive */}
        <div className="hidden md:block w-full lg:w-96 flex-shrink-0 backdrop-blur-sm p-3 sm:p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-white/10">
          {/* Instructions Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm font-medium text-white">Instructions</h3>
              <button className="text-purple-300 hover:text-white transition-colors p-1">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-purple-300 leading-relaxed">
              This is a Next.js project with Tailwind CSS and Lucide React. The
              chatbot can help you with development questions, code reviews, and
              project guidance.
            </p>
          </div>

          {/* Files Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm font-medium text-white">Files</h3>
              <button className="text-purple-300 hover:text-white transition-colors p-1">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-2 sm:mb-3">
              <div className="flex items-center justify-between text-xs text-purple-300 mb-1">
                <span>Project Capacity</span>
                <span>2% used</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-purple-500 h-1.5 rounded-full"
                  style={{ width: "2%" }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-blue-400 font-medium">TXT</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">
                    Example and sample AuthModules for...
                  </p>
                  <p className="text-xs text-purple-300">374 lines</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500/20 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-yellow-400 font-medium">
                    JS
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">
                    tailwind.config.js
                  </p>
                  <p className="text-xs text-purple-300">350 lines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Conversation Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Start New Conversation
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-purple-300 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-1.5 sm:mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newConversationData.title}
                  onChange={(e) =>
                    setNewConversationData({
                      ...newConversationData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 outline-none transition-all text-sm font-medium"
                  placeholder="Enter conversation title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-1.5 sm:mb-2">
                  Description
                </label>
                <textarea
                  value={newConversationData.description}
                  onChange={(e) =>
                    setNewConversationData({
                      ...newConversationData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 outline-none transition-all text-sm font-medium resize-none"
                  placeholder="Describe what this conversation is about"
                  rows="3"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  Start Conversation
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm font-medium border border-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Training Panel */}
      {showTrainingPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 w-full max-w-lg sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                  Feed Knowledge to Your Bot
                </h3>
                <p className="text-purple-300 text-xs sm:text-sm">
                  Upload documents to teach your chatbot new information
                </p>
              </div>
              <button
                onClick={() => setShowTrainingPanel(false)}
                className="text-purple-300 hover:text-white transition-colors p-1 sm:p-2 hover:bg-white/10 rounded-lg self-end sm:self-start"
              >
                ✕
              </button>
            </div>

            {/* File Upload Section */}
            <div className="mb-4 sm:mb-6">
              <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-4 sm:p-6 md:p-8 text-center hover:border-purple-500/50 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-purple-300 mb-1 sm:mb-2 text-sm sm:text-base">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs sm:text-sm text-purple-400 mb-3 sm:mb-4 px-2">
                  Supports PDF, DOCX, TXT, CSV, and more. Max 10 files, 50MB
                  each.
                </p>
                <button className="px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium">
                  Choose Files
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
              <button
                onClick={() => setShowTrainingPanel(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Start training logic here
                  setShowTrainingPanel(false);
                }}
                disabled={trainingFiles.length === 0}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
              >
                Start Training
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotConversations;
