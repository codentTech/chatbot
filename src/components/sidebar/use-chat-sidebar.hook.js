"use client";

import {
  clearConversation,
  deleteConversation,
  getConversations,
  toggleConversationStar,
  updateConversation,
} from "@/provider/features/chat/chat.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoginVerified } from "@/common/utils/access-token.util";
import chatbotService from "@/provider/features/chatbot/chatbot.service";

export default function useChatSidebar({
  setSidebarOpen,
  setSelectedConversation,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  // ==================== STATES ====================

  // Redux selectors
  const { chatbots: reduxChatbots, lastUpdated } = useSelector((state) => ({
    chatbots: state.chatbot.chatbots,
    lastUpdated: state.chatbot.lastUpdated,
  }));

  const { conversations, deleteConversation: deleteState } = useSelector(
    (state) => state.chat
  );

  // Local state
  const [deletingFromFavorites, setDeletingFromFavorites] = useState(null);
  const [deletingFromRecent, setDeletingFromRecent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredConv, setHoveredConv] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState(null);
  const [sidebarChatbots, setSidebarChatbots] = useState([]);
  const [sidebarChatbotsLoading, setSidebarChatbotsLoading] = useState(false);

  // Derived state
  const isLoggedIn = isLoginVerified();

  // Helper function (needed by useEffect hooks)
  const fetchSidebarChatbots = useCallback(async () => {
    if (!isLoginVerified()) {
      setSidebarChatbots([]);
      return;
    }

    setSidebarChatbotsLoading(true);
    const data = await chatbotService.getChatbots({});
    setSidebarChatbots(data || []);
    setSidebarChatbotsLoading(false);
  }, []);

  // ==================== USEEFFECT HOOKS ====================

  // Load conversations on mount
  useEffect(() => {
    if (isLoginVerified()) {
      dispatch(getConversations({ skip: 0, limit: 100 }));
    }
  }, [dispatch]);

  // Fetch chatbots on component mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchSidebarChatbots();
    }
  }, [isLoggedIn, fetchSidebarChatbots]);

  // Refresh sidebar chatbots when navigating to chatbots page
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleRouteChange = () => {
      if (window.location.pathname === "/chatbots") {
        fetchSidebarChatbots();
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [isLoggedIn, fetchSidebarChatbots]);

  // Sync sidebar with Redux state changes
  useEffect(() => {
    if (!isLoggedIn) return;
    if (lastUpdated && reduxChatbots.length !== sidebarChatbots.length) {
      fetchSidebarChatbots();
    }
  }, [
    lastUpdated,
    reduxChatbots.length,
    sidebarChatbots.length,
    isLoggedIn,
    fetchSidebarChatbots,
  ]);

  // Refresh sidebar when window regains focus
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleFocus = () => {
      if (window.location.pathname.includes("/chatbots")) {
        fetchSidebarChatbots();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLoggedIn, fetchSidebarChatbots]);

  // ==================== FUNCTIONS ====================

  // API handlers
  const handleDeleteFromFavorites = async (conversationId) => {
    if (!isLoginVerified()) return false;

    setDeletingFromFavorites(conversationId);
    const response = await dispatch(deleteConversation({ conversationId }));
    if (response.type.endsWith("/fulfilled")) {
      dispatch(getConversations({ skip: 0, limit: 100 }));
    }
    setDeletingFromFavorites(null);
    return response.type.endsWith("/fulfilled");
  };

  const handleDeleteFromRecent = async (conversationId) => {
    if (!isLoginVerified()) return false;

    setDeletingFromRecent(conversationId);
    const response = await dispatch(deleteConversation({ conversationId }));
    if (response.type.endsWith("/fulfilled")) {
      dispatch(getConversations({ skip: 0, limit: 100 }));
    }
    setDeletingFromRecent(null);
    return response.type.endsWith("/fulfilled");
  };

  const handleToggleStar = async (conversationId, currentIsStarred) => {
    if (!isLoginVerified()) return false;

    const response = await dispatch(
      toggleConversationStar({
        conversationId,
        isStarred: !currentIsStarred,
      })
    );
    if (response.type.endsWith("/fulfilled")) {
      dispatch(getConversations({ skip: 0, limit: 100 }));
    }
    return response.type.endsWith("/fulfilled");
  };

  const handleClearConversation = async (conversationId) => {
    if (!isLoginVerified()) return false;

    const response = await dispatch(clearConversation({ conversationId }));
    if (response.type.endsWith("/fulfilled")) {
      dispatch(getConversations({ skip: 0, limit: 100 }));
    }
    return response.type.endsWith("/fulfilled");
  };

  const handleUpdateConversation = async (conversationId, title) => {
    if (!isLoginVerified()) return false;

    const response = await dispatch(
      updateConversation({ conversationId, title })
    );
    if (response.type.endsWith("/fulfilled")) {
      dispatch(getConversations({ skip: 0, limit: 100 }));
    }
    return response.type.endsWith("/fulfilled");
  };

  // Navigation handlers
  const handleNewChat = () => {
    router.push("/");
  };

  const handleChatbotClick = (path) => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    router.push(path);
  };

  const handleCreateChatbot = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    router.push("/chatbots");
  };

  const handleConversationClick = (convId) => {
    setSelectedConversation(convId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    router.push(`/chat/${convId}`);
  };

  // UI handlers
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

    const conversationList = Array.isArray(conversations)
      ? conversations
      : conversations?.data || [];
    const conversation = conversationList.find(
      (conv) => conv.id === deleteConversationId
    );
    const isFavorite = conversation?.is_starred;

    isFavorite
      ? await handleDeleteFromFavorites(deleteConversationId)
      : await handleDeleteFromRecent(deleteConversationId);

    setShowDeleteConfirm(false);
    setDeleteConversationId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteConversationId(null);
  };

  const handleStarClick = async (convId, currentIsStarred) => {
    setShowContextMenu(null);
    await handleToggleStar(convId, currentIsStarred);
  };

  const handleClearClick = async (convId) => {
    setShowContextMenu(null);
    await handleClearConversation(convId);
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
    }
  };

  const handleRenameCancel = () => {
    setEditingConversationId(null);
    setEditingTitle("");
  };

  // ==================== RETURN ====================
  return {
    // Data
    conversations: conversations.data || [],
    isLoading: conversations.isLoading,
    isError: conversations.isError,
    errorMessage: conversations.message,
    isLoggedIn,
    sidebarChatbots,
    sidebarChatbotsLoading,

    // UI state
    collapsed,
    hoveredConv,
    showContextMenu,
    editingConversationId,
    editingTitle,
    showDeleteConfirm,
    deleteConversationId,
    deletingFromFavorites,
    deletingFromRecent,
    isDeletingConversation: deleteState.isLoading,

    // Handlers
    handleNewChat,
    handleDeleteFromFavorites,
    handleDeleteFromRecent,
    handleToggleStar,
    handleClearConversation,
    handleUpdateConversation,
    toggleSidebar,
    handleContextMenu,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleStarClick,
    handleClearClick,
    handleRenameClick,
    handleRenameSubmit,
    handleRenameCancel,
    handleChatbotClick,
    handleCreateChatbot,
    handleConversationClick,
    fetchSidebarChatbots,
    setHoveredConv,
    setShowContextMenu,
    setEditingTitle,
  };
}
