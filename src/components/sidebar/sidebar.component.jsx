"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Archive,
  Brain,
  ChevronLeft,
  ChevronRight,
  Edit,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import useChatSidebar from "./use-chat-sidebar.hook";
import chatbotService from "@/provider/features/chatbot/chatbot.service";

function Sidebar({
  sidebarOpen = true,
  setSidebarOpen = () => {},
  selectedConversation = 1,
  setSelectedConversation = () => {},
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredConv, setHoveredConv] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState(null);

  // Local state for sidebar chatbots (independent from main page filters)
  const [sidebarChatbots, setSidebarChatbots] = useState([]);
  const [sidebarChatbotsLoading, setSidebarChatbotsLoading] = useState(false);

  // Get Redux state to detect changes
  const { chatbots: reduxChatbots, lastUpdated } = useSelector((state) => ({
    chatbots: state.chatbot.chatbots,
    lastUpdated: state.chatbot.lastUpdated,
  }));

  // Use the chat sidebar hook
  const {
    conversations,
    isLoading,
    isError,
    errorMessage,
    handleNewChat,
    handleDeleteFromFavorites,
    handleDeleteFromRecent,
    handleToggleStar,
    handleClearConversation,
    handleUpdateConversation,
    isCreatingConversation,
    isDeletingConversation,
    deletingFromFavorites,
    deletingFromRecent,
  } = useChatSidebar();

  // Function to fetch sidebar chatbots
  const fetchSidebarChatbots = async () => {
    setSidebarChatbotsLoading(true);
    try {
      const data = await chatbotService.getChatbots({}); // Always fetch without filters
      setSidebarChatbots(data);
    } catch (error) {
      console.error("Failed to fetch sidebar chatbots:", error);
      setSidebarChatbots([]);
    } finally {
      setSidebarChatbotsLoading(false);
    }
  };

  // Fetch chatbots on component mount (independent from main page filters)
  useEffect(() => {
    fetchSidebarChatbots();
  }, []);

  // Refresh sidebar chatbots when navigating to chatbots page (in case new ones were created/deleted)
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === "/chatbots") {
        fetchSidebarChatbots();
      }
    };

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Sync sidebar with Redux state changes (React way)
  useEffect(() => {
    // When Redux state changes (chatbots added/deleted/updated), sync sidebar
    if (lastUpdated && reduxChatbots.length !== sidebarChatbots.length) {
      // Only refresh if the count changed (simple optimization)
      fetchSidebarChatbots();
    }
  }, [lastUpdated, reduxChatbots.length, sidebarChatbots.length]);

  // Refresh sidebar when window regains focus (in case user switched tabs and came back)
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if we're on a page that might have modified chatbots
      if (window.location.pathname.includes("/chatbots")) {
        fetchSidebarChatbots();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleContextMenu = (e, convId) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(showContextMenu === convId ? null : convId);
  };

  const handleDeleteClick = (convId) => {
    setShowContextMenu(null);
    setDeleteConversationId(convId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConversationId) return;

    const success = await handleDeleteConversation(deleteConversationId);
    if (success) {
      console.log("Conversation deleted successfully");
    }

    setShowDeleteConfirm(false);
    setDeleteConversationId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteConversationId(null);
  };

  const handleStarClick = async (convId, currentIsStarred) => {
    setShowContextMenu(null);
    console.log(
      "🚀 Star click for conversation:",
      convId,
      "current:",
      currentIsStarred
    );
    const success = await handleToggleStar(convId, currentIsStarred);
    console.log("🚀 Star toggle result:", success);
    if (success) {
      // Optionally show success message
      console.log("Star status updated successfully");
    } else {
      console.log("Failed to update star status");
    }
  };

  const handleClearClick = async (convId) => {
    setShowContextMenu(null);
    const success = await handleClearConversation(convId);
    if (success) {
      // Optionally show success message
      console.log("Conversation cleared successfully");
    }
  };

  const handleRenameClick = (convId, currentTitle) => {
    setShowContextMenu(null);
    setEditingConversationId(convId);
    setEditingTitle(currentTitle);
  };

  const handleRenameSubmit = async () => {
    if (!editingTitle.trim() || !editingConversationId) return;

    const success = await handleUpdateConversation(
      editingConversationId,
      editingTitle.trim()
    );
    if (success) {
      setEditingConversationId(null);
      setEditingTitle("");
      console.log("Conversation renamed successfully");
    }
  };

  const handleRenameCancel = () => {
    setEditingConversationId(null);
    setEditingTitle("");
  };

  const handleChatbotClick = (path) => {
    // On mobile, close sidebar after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    router.push(path);
  };

  const handleCreateChatbot = () => {
    // Navigate to chatbots page where user can create new chatbot
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    router.push("/chatbots");
  };

  const handleConversationClick = (convId) => {
    setSelectedConversation(convId);
    // On mobile, close sidebar after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    router.push(`/chat/${convId}`);
  };

  return (
    <>
      {/* Click outside to close context menu */}
      {showContextMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowContextMenu(null)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-16" : "w-80"
        } bg-slate-900/95 backdrop-blur-md border-r border-purple-800/30 transition-all duration-300 ease-in-out flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-[9999] h-full flex flex-col`}
        style={{
          background:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(88, 28, 135, 0.2) 50%, rgba(15, 23, 42, 0.95) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center ${
            collapsed
              ? "justify-center px-2 py-3"
              : "justify-between p-2.5 sm:p-3"
          } border-b border-purple-800/30 flex-shrink-0`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-slate-700 via-purple-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-xs sm:text-sm">
                Chatbot
              </span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1.5 sm:p-1.5 rounded-lg hover:bg-purple-800/20 transition-colors text-purple-300 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            ) : (
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
          </button>
        </div>

        {/* New Chat Button */}
        <div
          className={`${collapsed ? "px-2" : "px-2.5 sm:px-3"} py-2.5 flex-shrink-0`}
        >
          {collapsed ? (
            <button
              onClick={handleNewChat}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-800/30 hover:bg-purple-700/40 border-purple-700/50 border rounded-lg transition-all duration-200 flex items-center justify-center mx-auto group relative"
              title="New chat"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
              {/* Tooltip */}
              <div className="absolute left-16 bg-slate-800 text-white border-purple-700/50 px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border pointer-events-none">
                New chat
              </div>
            </button>
          ) : (
            <button
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-purple-800/30 via-purple-700/40 to-purple-800/30 hover:from-purple-700/40 hover:via-purple-600/50 hover:to-purple-700/40 border-purple-700/50 text-purple-200 border rounded-lg py-1 px-2.5 sm:px-3 font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
              New Chat
            </button>
          )}
        </div>

        {/* Chatbots Section - Only show when not collapsed */}
        {!collapsed && (
          <div className="px-2.5 sm:px-3 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Chatbots
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={fetchSidebarChatbots}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Refresh chatbots"
                  disabled={sidebarChatbotsLoading}
                >
                  <RefreshCw
                    className={`w-3 h-3 text-purple-400 ${sidebarChatbotsLoading ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={handleCreateChatbot}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Create new chatbot"
                >
                  <Plus className="w-3 h-3 text-purple-400" />
                </button>
              </div>
            </div>

            {/* Chatbot List */}
            <div className="space-y-1">
              {sidebarChatbotsLoading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : sidebarChatbots.length > 0 ? (
                <>
                  {sidebarChatbots.slice(0, 5).map((chatbot) => (
                    <button
                      key={chatbot.id}
                      onClick={() =>
                        handleChatbotClick(`/chatbots/${chatbot.id}`)
                      }
                      className="w-full flex items-center justify-between px-2 py-1 hover:bg-white/10 rounded transition-colors text-left group"
                    >
                      <span className="text-white text-xs font-medium truncate">
                        {chatbot.name}
                      </span>
                      <span className="text-purple-400 text-xs">
                        {chatbot.conversation_count || 0} chats
                      </span>
                    </button>
                  ))}

                  {/* Show "View All" if there are more than 5 chatbots */}
                  {sidebarChatbots.length > 5 && (
                    <button
                      onClick={() => handleChatbotClick("/chatbots")}
                      className="w-full mt-1.5 px-2 py-1 text-xs text-purple-300 hover:text-white hover:bg-white/10 rounded transition-colors font-medium"
                    >
                      View All ({sidebarChatbots.length}) →
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-purple-400">No chatbots yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorites Section - Only show when not collapsed */}
        {!collapsed && (
          <div className="px-2.5 sm:px-3 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Favorites
              </h3>
            </div>

            {/* Favorites List */}
            <div className="space-y-1">
              {conversations
                .filter((conv) => conv.is_starred)
                .slice(0, 5)
                .map((conv) => (
                  <div key={conv.id} className="relative group">
                    <button
                      onClick={() => handleConversationClick(conv.id)}
                      className="w-full flex items-center justify-between px-2 py-1 hover:bg-white/10 rounded transition-colors text-left group"
                    >
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current" />
                      </div>

                      <div className="flex-1 min-w-0 ml-1">
                        <span className="text-white text-xs font-medium truncate">
                          {conv.title}
                        </span>
                      </div>

                      <div
                        className={`flex items-center gap-1 transition-opacity flex-shrink-0 ${
                          showContextMenu === conv.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <div
                          onClick={(e) => handleContextMenu(e, conv.id)}
                          className="p-1 hover:bg-purple-700/40 rounded-md transition-colors cursor-pointer"
                          title="More options"
                        >
                          <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                        </div>
                      </div>
                    </button>

                    {/* Context Menu for Favorites */}
                    {showContextMenu === conv.id && (
                      <div className="absolute right-2 top-8 bg-slate-800/95 border-purple-700/50 backdrop-blur-md border rounded-lg shadow-xl z-20 min-w-32 sm:min-w-36 py-1">
                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => handleRenameClick(conv.id, conv.title)}
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Rename
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() =>
                            handleStarClick(conv.id, conv.is_starred)
                          }
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Star
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${conv.is_starred ? "fill-current text-yellow-400" : ""}`}
                          />
                          {conv.is_starred ? "Unstar" : "Star"}
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => handleClearClick(conv.id)}
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Clear Messages
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-red-900/30 transition-colors text-red-400"
                          onClick={() => handleDeleteClick(conv.id)}
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {deletingConversationId === conv.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <button className="w-full mt-1.5 px-2 py-1 text-xs text-purple-300 hover:text-white hover:bg-white/10 rounded transition-colors font-medium">
              View All →
            </button>
          </div>
        )}

        {/* Divider */}
        <hr className="border-t border-purple-600/50 mx-2.5 sm:mx-3 mb-3 flex-shrink-0" />

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-1.5 min-h-0 custom-scrollbar">
          {!collapsed && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Recent Conversations
              </h3>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-4">
              <p className="text-red-400 text-xs">{errorMessage}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-purple-300 text-xs hover:text-white mt-2"
              >
                Retry
              </button>
            </div>
          )}

          {/* Conversations List */}
          {!isLoading && !isError && (
            <div className="space-y-0.5">
              {conversations
                .filter((conv) => !conv.is_starred)
                .map((conv) => (
                  <div
                    key={conv.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredConv(conv.id)}
                    onMouseLeave={() => setHoveredConv(null)}
                  >
                    <button
                      onClick={() => handleConversationClick(conv.id)}
                      className={`w-full flex items-center px-2 py-0.5 rounded transition-all duration-200 ${
                        selectedConversation === conv.id
                          ? "bg-gradient-to-r from-purple-800/40 via-purple-700/50 to-purple-800/40 shadow-lg border border-purple-600/30"
                          : "hover:bg-purple-800/20 hover:shadow-md"
                      }`}
                    >
                      {collapsed ? (
                        // Collapsed view - just icon
                        <div className="w-full flex justify-start">
                          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                        </div>
                      ) : (
                        // Expanded view
                        <div className="flex items-center w-full min-w-0 text-left">
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {conv.is_starred && (
                              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 ml-1">
                            {editingConversationId === conv.id ? (
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleRenameSubmit();
                                  } else if (e.key === "Escape") {
                                    handleRenameCancel();
                                  }
                                }}
                                onBlur={handleRenameSubmit}
                                className="font-medium text-xs bg-transparent border-none outline-none text-white w-full"
                                autoFocus
                              />
                            ) : (
                              <span
                                className={`font-medium text-xs truncate ${
                                  selectedConversation === conv.id
                                    ? "text-white"
                                    : "text-purple-100"
                                }`}
                              >
                                {conv.title}
                              </span>
                            )}
                          </div>

                          <div
                            className={`flex items-center gap-1 transition-opacity flex-shrink-0 ml-auto ${
                              showContextMenu === conv.id
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <div
                              onClick={(e) => handleContextMenu(e, conv.id)}
                              className="p-1 hover:bg-purple-700/40 rounded-md transition-colors cursor-pointer"
                              title="More options"
                            >
                              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                            </div>
                          </div>
                        </div>
                      )}
                    </button>

                    {/* Context Menu */}
                    {showContextMenu === conv.id && !collapsed && (
                      <div className="absolute right-2 top-8 bg-slate-800/95 border-purple-700/50 backdrop-blur-md border rounded-lg shadow-xl z-20 min-w-32 sm:min-w-36 py-1">
                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => handleRenameClick(conv.id, conv.title)}
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Rename
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => handleStarClick(conv.id)}
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Star
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${conv.is_starred ? "fill-current text-yellow-400" : ""}`}
                          />
                          Star
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-purple-700/30 transition-colors text-purple-200"
                          onClick={() => handleClearClick(conv.id)}
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Clear Messages
                        </button>

                        <button
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-red-900/30 transition-colors text-red-400"
                          onClick={() => handleDeleteClick(conv.id)}
                          disabled={deletingFromFavorites === conv.id}
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {deletingConversationId === conv.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && hoveredConv === conv.id && (
                      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-slate-800/95 text-white border-purple-700/50 px-2 py-1.5 rounded-lg shadow-lg z-50 min-w-48 sm:min-w-56 border pointer-events-none backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs">
                            {conv.title}
                          </span>
                          {conv.is_starred && (
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <div className="text-xs text-purple-300">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-purple-400 mt-1">
                          {conv.last_message || "No messages yet"}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Bottom Settings - Only show when not collapsed */}
        {!collapsed && (
          <div className="px-4 py-2 border-t border-purple-600/50 flex-shrink-0">
            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/20 transition-colors text-purple-300"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        )}

        {/* Collapsed settings icon */}
        {collapsed && (
          <div className="py-2 flex-shrink-0">
            <button
              onClick={() => router.push("/settings")}
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-purple-800/20 transition-colors text-purple-300 mx-auto group relative"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
              {/* Tooltip */}
              <div className="absolute left-16 bg-slate-800 text-white border-purple-700/50 px-2 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border pointer-events-none">
                Settings
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/95 border border-red-700/50 backdrop-blur-md rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Conversation
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
