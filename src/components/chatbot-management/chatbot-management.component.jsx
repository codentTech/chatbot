"use client";

import {
  Calendar,
  FolderOpen,
  MessageSquare,
  Plus,
  Search,
  Star,
  Edit,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatbotManagement } from "./use-chatbot-management.hook";

const ChatbotManagement = ({ onCreateChatbot }) => {
  const router = useRouter();
  const {
    chatbots,
    chatbotsByCategory,
    categoryStats,
    loading,
    searchQuery,
    filters,
    showCreateModal,
    showDeleteModal,
    selectedChatbot,
    handleSearch,
    handleImmediateSearch,
    handleCategoryFilter,
    handleStatusFilter,
    handleClearFilters,
    handleCreateChatbot,
    handleUpdateChatbot,
    handleDeleteChatbot,
    handleEditChatbot,
    handleDeleteClick,
    setShowCreateModal,
    setShowDeleteModal,
    setSelectedChatbot,
  } = useChatbotManagement();

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      technology: "from-blue-500 to-purple-600",
      general: "from-gray-500 to-slate-600",
      other: "from-orange-500 to-red-600",
      education: "from-purple-500 to-pink-600",
      customer_service: "from-green-500 to-teal-600",
      healthcare: "from-red-500 to-pink-600",
      finance: "from-yellow-500 to-orange-600",
      ecommerce: "from-indigo-500 to-blue-600",
      travel: "from-cyan-500 to-blue-600",
      entertainment: "from-pink-500 to-purple-600",
    };
    return colors[category] || "from-gray-500 to-slate-600";
  };

  // Helper function to format last activity
  const formatLastActivity = (lastActivity) => {
    if (!lastActivity) return "Never";
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  };

  const categories = [
    { id: "all", name: "All", count: chatbots.length },
    ...categoryStats.map((stat) => ({
      id: stat.category,
      name:
        stat.category.charAt(0).toUpperCase() +
        stat.category.slice(1).replace("_", " "),
      count: stat.count,
    })),
  ];

  const [newChatbotData, setNewChatbotData] = useState({
    name: "",
    description: "",
    category: "general",
    isFavorite: false,
  });

  // Populate form data when editing a chatbot
  useEffect(() => {
    if (selectedChatbot) {
      setNewChatbotData({
        name: selectedChatbot.name || "",
        description: selectedChatbot.description || "",
        category: selectedChatbot.category || "general",
        isFavorite: selectedChatbot.is_public || false,
      });
    } else {
      // Reset form when not editing
      setNewChatbotData({
        name: "",
        description: "",
        category: "general",
        isFavorite: false,
      });
    }
  }, [selectedChatbot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newChatbotData.name.trim()) {
      let result;
      if (selectedChatbot) {
        // Handle edit
        result = await handleUpdateChatbot(selectedChatbot.id, {
          name: newChatbotData.name,
          description: newChatbotData.description,
          category: newChatbotData.category,
          is_public: newChatbotData.isFavorite,
        });
      } else {
        // Handle create
        result = await handleCreateChatbot({
          name: newChatbotData.name,
          description: newChatbotData.description,
          category: newChatbotData.category,
          status: "active",
          model: "gpt-4o",
          system_prompt: "You are a helpful assistant.",
          is_public: newChatbotData.isFavorite,
          tags: [],
        });
      }

      // Only reset form and close modal if API call was successful
      if (result && result.type.endsWith("/fulfilled")) {
        setNewChatbotData({
          name: "",
          description: "",
          category: "general",
          isFavorite: false,
        });
        setSelectedChatbot(null);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Container with Max Width */}
      <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col h-full">
        {/* Enhanced Header Section with Responsive Flex Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              My Chatbots
            </h2>
            <p className="text-xs sm:text-sm text-purple-300">
              Manage your AI chatbot projects and conversations
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 font-medium text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">New Chatbot</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>

        {/* Search and Filters Section - Responsive Layout */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-0 sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search chatbots..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleImmediateSearch(e.target.value);
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category Filter - Horizontal Scroll on Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  filters.category === category.id ||
                  (category.id === "all" && !filters.category)
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/10 text-purple-300 hover:bg-white/20 border border-white/20"
                }`}
              >
                {category.name}
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Compact Chatbots Grid - Responsive */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
          {loading ? (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-400"></div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Loading chatbots...
              </h3>
            </div>
          ) : chatbots.length === 0 ? (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                No chatbots found
              </h3>
              <p className="text-purple-300 mb-3 sm:mb-4 text-sm max-w-md mx-auto px-4">
                {searchQuery || filters.category
                  ? "Try adjusting your search or filters"
                  : "Create your first chatbot to get started"}
              </p>
              {!searchQuery && !filters.category && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors text-sm font-medium"
                >
                  Create Chatbot
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-2 lg:gap-4 pb-4">
              {chatbots.map((chatbot) => (
                <div
                  key={chatbot.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-200 cursor-pointer w-full hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-purple-500/10"
                  onClick={() => router.push(`/chatbots/${chatbot.id}`)}
                >
                  {/* Compact Header */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-semibold text-white text-sm sm:text-base mb-1.5 sm:mb-2 truncate">
                        {chatbot.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-purple-300 line-clamp-2 leading-relaxed">
                        {chatbot.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      {chatbot.is_public && (
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      )}
                      <div className="flex gap-1">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditChatbot(chatbot);
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-purple-300" />
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(chatbot);
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Stats */}
                  <div className="flex items-center justify-between text-xs text-purple-300 mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      <span className="font-medium">
                        {chatbot.conversation_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs truncate">
                        {formatLastActivity(chatbot.last_activity)}
                      </span>
                    </div>
                  </div>

                  {/* Compact Category Badge */}
                  <div>
                    <span className="inline-block px-2 py-1 bg-white/10 border border-white/20 rounded-md text-xs text-purple-300 font-medium">
                      {chatbot.category?.charAt(0).toUpperCase() +
                        chatbot.category?.slice(1).replace("_", " ") || "Other"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compact Create Chatbot Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-slate-800 border border-white/20 rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {selectedChatbot ? "Edit Chatbot" : "Create New Chatbot"}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedChatbot(null);
                  }}
                  className="text-purple-300 hover:text-white transition-colors p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-1.5 sm:mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newChatbotData.name}
                    onChange={(e) =>
                      setNewChatbotData({
                        ...newChatbotData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 outline-none transition-all text-sm font-medium"
                    placeholder="Enter chatbot name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-1.5 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    value={newChatbotData.description}
                    onChange={(e) =>
                      setNewChatbotData({
                        ...newChatbotData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 outline-none transition-all text-sm font-medium resize-none"
                    placeholder="Describe your chatbot's purpose"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-1.5 sm:mb-2">
                    Category
                  </label>
                  <select
                    value={newChatbotData.category}
                    onChange={(e) =>
                      setNewChatbotData({
                        ...newChatbotData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none transition-all text-sm font-medium"
                  >
                    <option value="general" className="bg-slate-800 text-white">
                      General
                    </option>
                    <option
                      value="technology"
                      className="bg-slate-800 text-white"
                    >
                      Technology
                    </option>
                    <option
                      value="customer_service"
                      className="bg-slate-800 text-white"
                    >
                      Customer Service
                    </option>
                    <option
                      value="education"
                      className="bg-slate-800 text-white"
                    >
                      Education
                    </option>
                    <option
                      value="healthcare"
                      className="bg-slate-800 text-white"
                    >
                      Healthcare
                    </option>
                    <option value="finance" className="bg-slate-800 text-white">
                      Finance
                    </option>
                    <option
                      value="ecommerce"
                      className="bg-slate-800 text-white"
                    >
                      E-commerce
                    </option>
                    <option value="travel" className="bg-slate-800 text-white">
                      Travel
                    </option>
                    <option
                      value="entertainment"
                      className="bg-slate-800 text-white"
                    >
                      Entertainment
                    </option>
                    <option value="other" className="bg-slate-800 text-white">
                      Other
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    checked={newChatbotData.isFavorite}
                    onChange={(e) =>
                      setNewChatbotData({
                        ...newChatbotData,
                        isFavorite: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-purple-600 bg-transparent border-purple-500 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="isFavorite"
                    className="text-sm text-purple-300 cursor-pointer"
                  >
                    Mark as favorite
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    {selectedChatbot ? "Update Chatbot" : "Create Chatbot"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedChatbot(null);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm font-medium border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedChatbot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-slate-800 border border-white/20 rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Delete Chatbot
                </h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedChatbot(null);
                  }}
                  className="text-purple-300 hover:text-white transition-colors p-1"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-purple-300 text-sm">
                  Are you sure you want to delete "{selectedChatbot.name}"? This
                  action cannot be undone and will delete all conversations in
                  this chatbot.
                </p>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedChatbot(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteChatbot}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotManagement;
