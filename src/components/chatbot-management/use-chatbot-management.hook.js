import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatbots,
  createChatbot,
  updateChatbot,
  deleteChatbot,
  setFilters,
  clearFilters,
  clearError,
} from "../../provider/features/chatbot/chatbot.slice";

export const useChatbotManagement = () => {
  const dispatch = useDispatch();
  const { chatbots, loading, error, filters } = useSelector(
    (state) => state.chatbot
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load chatbots on component mount (without filters)
  useEffect(() => {
    dispatch(fetchChatbots({}));
    setIsInitialLoad(false);
  }, [dispatch]);

  // Debounced search effect - only trigger when filters change after initial load
  useEffect(() => {
    // Skip the initial render to avoid double API call
    if (isInitialLoad) return;

    const timeoutId = setTimeout(() => {
      dispatch(fetchChatbots(filters));
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [dispatch, filters, isInitialLoad]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(setFilters({ search: query }));
  };

  // Handle immediate search (for Enter key or search button)
  const handleImmediateSearch = (query) => {
    setSearchQuery(query);
    dispatch(setFilters({ search: query }));
    // Trigger immediate API call
    dispatch(fetchChatbots({ ...filters, search: query }));
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category: category === "all" ? "" : category }));
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    dispatch(setFilters({ status: status === "all" ? "" : status }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    dispatch(clearFilters());
  };

  // Handle create chatbot
  const handleCreateChatbot = async (chatbotData) => {
    const result = await dispatch(createChatbot(chatbotData));
    if (result.type.endsWith("/fulfilled")) {
      setShowCreateModal(false);
      // Redux state will automatically update lastUpdated timestamp
    }
    return result;
  };

  // Handle update chatbot
  const handleUpdateChatbot = async (chatbotId, updateData) => {
    const result = await dispatch(updateChatbot({ chatbotId, updateData }));
    if (result.type.endsWith("/fulfilled")) {
      setShowCreateModal(false);
      setSelectedChatbot(null);
      // Redux state will automatically update lastUpdated timestamp
    }
    return result;
  };

  // Handle delete chatbot
  const handleDeleteChatbot = async () => {
    if (!selectedChatbot) return;

    const result = await dispatch(deleteChatbot(selectedChatbot.id));
    if (result.type.endsWith("/fulfilled")) {
      setShowDeleteModal(false);
      setSelectedChatbot(null);
      // Redux state will automatically update lastUpdated timestamp
    }
    return result;
  };

  // Handle edit chatbot
  const handleEditChatbot = (chatbot) => {
    setSelectedChatbot(chatbot);
    setShowCreateModal(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (chatbot) => {
    setSelectedChatbot(chatbot);
    setShowDeleteModal(true);
  };

  // Clear error when component unmounts or error changes
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Get filtered chatbots
  const filteredChatbots = chatbots.filter((chatbot) => {
    const matchesSearch =
      !searchQuery ||
      chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !filters.category || chatbot.category === filters.category;
    const matchesStatus = !filters.status || chatbot.status === filters.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get chatbots by category
  const chatbotsByCategory = filteredChatbots.reduce((acc, chatbot) => {
    const category = chatbot.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(chatbot);
    return acc;
  }, {});

  // Get category stats
  const categoryStats = Object.keys(chatbotsByCategory).map((category) => ({
    category,
    count: chatbotsByCategory[category].length,
    chatbots: chatbotsByCategory[category],
  }));

  return {
    // State
    chatbots: filteredChatbots,
    chatbotsByCategory,
    categoryStats,
    loading,
    error,
    searchQuery,
    filters,
    showCreateModal,
    showDeleteModal,
    selectedChatbot,

    // Actions
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
  };
};
