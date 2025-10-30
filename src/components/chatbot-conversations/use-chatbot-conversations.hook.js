"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversationsInChatbot,
  createConversationInChatbot,
} from "@/provider/features/chatbot/chatbot.slice";
import {
  deleteConversation,
  updateConversation,
  toggleConversationStar,
} from "@/provider/features/chat/chat.slice";
import { isLoginVerified } from "@/common/utils/access-token.util";

const GLOBAL_FETCHED_CHATBOT_IDS = new Set();
const GLOBAL_FETCHING_CHATBOT_IDS = new Set();

export default function useChatbotConversations({
  chatbot,
  searchQuery: propSearchQuery = "",
}) {
  const dispatch = useDispatch();
  const lastRefreshTime = useRef(null);
  const chatbotId = chatbot?.id ? String(chatbot.id) : null;

  const chatbotConversations = useSelector((state) =>
    chatbotId ? state.chatbot.chatbotConversations[chatbotId] || [] : []
  );
  const isLoading = useSelector((state) => state.chatbot.loading);
  const error = useSelector((state) => state.chatbot.error);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [showTrainingPanel, setShowTrainingPanel] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editConversationId, setEditConversationId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [newConversationData, setNewConversationData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const propChatbotId = chatbot?.id ? String(chatbot.id) : null;

    if (!propChatbotId || !isLoginVerified()) {
      return;
    }

    if (GLOBAL_FETCHED_CHATBOT_IDS.has(propChatbotId)) {
      return;
    }

    if (GLOBAL_FETCHING_CHATBOT_IDS.has(propChatbotId)) {
      return;
    }

    GLOBAL_FETCHED_CHATBOT_IDS.add(propChatbotId);
    GLOBAL_FETCHING_CHATBOT_IDS.add(propChatbotId);

    dispatch(
      fetchConversationsInChatbot({
        chatbotId: propChatbotId,
        params: { skip: 0, limit: 100 },
      })
    ).finally(() => {
      GLOBAL_FETCHING_CHATBOT_IDS.delete(propChatbotId);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbot?.id]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    return date.toLocaleDateString();
  };

  const formattedConversations = useMemo(() => {
    return chatbotConversations.map((conv) => ({
      id: conv.id || conv.conversation_id,
      title: conv.title || "Untitled Conversation",
      preview:
        conv.description || conv.last_message || "Start a new conversation...",
      lastMessage: conv.last_message || "",
      timestamp: formatTimestamp(
        conv.last_message_at || conv.updated_at || conv.created_at
      ),
      messageCount: conv.message_count || 0,
      isStarred: conv.is_starred || false,
    }));
  }, [chatbotConversations]);

  const filteredConversations = useMemo(() => {
    if (!propSearchQuery.trim()) {
      return formattedConversations;
    }
    const query = propSearchQuery.toLowerCase();
    return formattedConversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(query) ||
        conv.preview.toLowerCase().includes(query)
    );
  }, [formattedConversations, propSearchQuery]);

  const handleCreateConversation = useCallback(
    async (conversationData) => {
      if (!chatbot?.id || !isLoginVerified() || isCreating) return;

      setIsCreating(true);
      const result = await dispatch(
        createConversationInChatbot({
          chatbotId: chatbot.id,
          conversationData: {
            title: conversationData.title,
            description: conversationData.description || "",
          },
        })
      );

      if (result.type.endsWith("/fulfilled")) {
        setNewConversationData({ title: "", description: "" });
        setShowCreateForm(false);
        setIsCreating(false);
        return result.payload.conversation;
      }
      setIsCreating(false);
    },
    [chatbot?.id, dispatch, isCreating]
  );

  const refreshConversations = useCallback(
    (chatbotIdToRefresh) => {
      if (!chatbotIdToRefresh || !isLoginVerified()) return;

      const chatbotIdStr = String(chatbotIdToRefresh);
      const now = Date.now();
      if (lastRefreshTime.current && now - lastRefreshTime.current < 500) {
        return;
      }

      if (!GLOBAL_FETCHING_CHATBOT_IDS.has(chatbotIdStr)) {
        lastRefreshTime.current = now;
        GLOBAL_FETCHING_CHATBOT_IDS.add(chatbotIdStr);

        dispatch(
          fetchConversationsInChatbot({
            chatbotId: chatbotIdStr,
            params: { skip: 0, limit: 100 },
          })
        ).finally(() => {
          GLOBAL_FETCHING_CHATBOT_IDS.delete(chatbotIdStr);
        });
      }
    },
    [dispatch]
  );

  const handleDeleteConversation = useCallback(
    async (conversationId) => {
      if (!isLoginVerified() || !chatbotId) return;

      const result = await dispatch(deleteConversation(conversationId));
      if (result.type.endsWith("/fulfilled")) {
        refreshConversations(chatbotId);
        if (selectedConversation === conversationId) {
          setSelectedConversation(null);
        }
      }
      setShowContextMenu(null);
    },
    [chatbotId, dispatch, selectedConversation, refreshConversations]
  );

  const handleUpdateConversation = useCallback(
    async (conversationId, title) => {
      if (!isLoginVerified() || !chatbotId) return;

      const result = await dispatch(
        updateConversation({ conversationId, title })
      );
      if (result.type.endsWith("/fulfilled")) {
        refreshConversations(chatbotId);
      }
      setShowContextMenu(null);
    },
    [chatbotId, dispatch, refreshConversations]
  );

  const handleToggleStar = useCallback(
    async (conversationId, currentIsStarred) => {
      if (!isLoginVerified() || !chatbotId) return;

      const result = await dispatch(
        toggleConversationStar({
          conversationId,
          isStarred: !currentIsStarred,
        })
      );
      if (result.type.endsWith("/fulfilled")) {
        refreshConversations(chatbotId);
      }
    },
    [chatbotId, dispatch, refreshConversations]
  );

  const handleRename = useCallback((conversationId, currentTitle) => {
    setEditConversationId(conversationId);
    setEditTitle(currentTitle);
  }, []);

  const handleSaveRename = useCallback(async () => {
    if (!editTitle.trim() || !editConversationId) return;

    await handleUpdateConversation(editConversationId, editTitle.trim());
    setEditConversationId(null);
    setEditTitle("");
    setShowContextMenu(null);
  }, [editTitle, editConversationId, handleUpdateConversation]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newConversationData.title.trim() || isCreating) return;
      await handleCreateConversation(newConversationData);
    },
    [newConversationData, isCreating, handleCreateConversation]
  );

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

  return {
    conversations: formattedConversations,
    filteredConversations,
    selectedConversation,
    showCreateForm,
    showContextMenu,
    showTrainingPanel,
    newConversationData,
    isLoading,
    error,
    isCreating,
    editConversationId,
    editTitle,
    setSelectedConversation,
    setShowCreateForm,
    setShowContextMenu,
    setShowTrainingPanel,
    setNewConversationData,
    setEditConversationId,
    setEditTitle,
    handleCreateConversation,
    handleDeleteConversation,
    handleUpdateConversation,
    handleToggleStar,
    handleRename,
    handleSaveRename,
    handleSubmit,
  };
}
