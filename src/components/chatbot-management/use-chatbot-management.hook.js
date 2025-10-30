import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  const [newChatbotData, setNewChatbotData] = useState({
    name: "",
    description: "",
    category: "general",
    isFavorite: false,
  });
  const hasInitialFetched = useRef(false);
  const lastFiltersRef = useRef(null);

  useEffect(() => {
    if (!hasInitialFetched.current) {
      hasInitialFetched.current = true;
      dispatch(fetchChatbots({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filterKey = `${filters.search || ""}-${filters.category || ""}-${filters.status || ""}`;
    const lastFilterKey = lastFiltersRef.current;

    if (filterKey === lastFilterKey) {
      return;
    }

    lastFiltersRef.current = filterKey;

    const timeoutId = setTimeout(() => {
      dispatch(fetchChatbots(filters));
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.status]);

  useEffect(() => {
    if (selectedChatbot) {
      setNewChatbotData({
        name: selectedChatbot.name || "",
        description: selectedChatbot.description || "",
        category: selectedChatbot.category || "general",
        isFavorite: selectedChatbot.is_public || false,
      });
    } else {
      setNewChatbotData({
        name: "",
        description: "",
        category: "general",
        isFavorite: false,
      });
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(setFilters({ search: query }));
  };

  const handleImmediateSearch = (query) => {
    setSearchQuery(query);
    dispatch(setFilters({ search: query }));
    dispatch(fetchChatbots({ ...filters, search: query }));
  };

  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category: category === "all" ? "" : category }));
  };

  const handleStatusFilter = (status) => {
    dispatch(setFilters({ status: status === "all" ? "" : status }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    dispatch(clearFilters());
  };

  const handleCreateChatbot = async (chatbotData) => {
    const result = await dispatch(createChatbot(chatbotData));
    if (result.type.endsWith("/fulfilled")) {
      setShowCreateModal(false);
    }
    return result;
  };

  const handleUpdateChatbot = async (chatbotId, updateData) => {
    const result = await dispatch(updateChatbot({ chatbotId, updateData }));
    if (result.type.endsWith("/fulfilled")) {
      setShowCreateModal(false);
      setSelectedChatbot(null);
    }
    return result;
  };

  const handleDeleteChatbot = async () => {
    if (!selectedChatbot) return;

    const result = await dispatch(deleteChatbot(selectedChatbot.id));
    if (result.type.endsWith("/fulfilled")) {
      setShowDeleteModal(false);
      setSelectedChatbot(null);
    }
    return result;
  };

  const handleEditChatbot = (chatbot) => {
    setSelectedChatbot(chatbot);
    setShowCreateModal(true);
  };

  const handleDeleteClick = (chatbot) => {
    setSelectedChatbot(chatbot);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newChatbotData.name.trim()) {
      let result;
      if (selectedChatbot) {
        result = await handleUpdateChatbot(selectedChatbot.id, {
          name: newChatbotData.name,
          description: newChatbotData.description,
          category: newChatbotData.category,
          is_public: newChatbotData.isFavorite,
        });
      } else {
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

  const filteredChatbots = useMemo(() => {
    return chatbots.filter((chatbot) => {
      const matchesSearch =
        !searchQuery ||
        chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chatbot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chatbot.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        !filters.category || chatbot.category === filters.category;
      const matchesStatus =
        !filters.status || chatbot.status === filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [chatbots, searchQuery, filters.category, filters.status]);

  const chatbotsByCategory = useMemo(() => {
    return filteredChatbots.reduce((acc, chatbot) => {
      const category = chatbot.category || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(chatbot);
      return acc;
    }, {});
  }, [filteredChatbots]);

  const categoryStats = useMemo(() => {
    return Object.keys(chatbotsByCategory).map((category) => ({
      category,
      count: chatbotsByCategory[category].length,
      chatbots: chatbotsByCategory[category],
    }));
  }, [chatbotsByCategory]);

  const categories = useMemo(() => {
    return [
      { id: "all", name: "All", count: filteredChatbots.length },
      ...categoryStats.map((stat) => ({
        id: stat.category,
        name:
          stat.category.charAt(0).toUpperCase() +
          stat.category.slice(1).replace("_", " "),
        count: stat.count,
      })),
    ];
  }, [filteredChatbots, categoryStats]);

  return {
    chatbots: filteredChatbots,
    chatbotsByCategory,
    categoryStats,
    categories,
    loading,
    error,
    searchQuery,
    filters,
    showCreateModal,
    showDeleteModal,
    selectedChatbot,
    newChatbotData,
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
    handleSubmit,
    formatLastActivity,
    setShowCreateModal,
    setShowDeleteModal,
    setSelectedChatbot,
    setNewChatbotData,
  };
};
