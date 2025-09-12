"use client";

import {
  clearConversation,
  deleteConversation,
  getConversations,
  resetConversations,
  toggleConversationStar,
  updateConversation,
} from "@/provider/features/chat/chat.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useChatSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Track which conversation is being deleted in each section
  const [deletingFromFavorites, setDeletingFromFavorites] = useState(null);
  const [deletingFromRecent, setDeletingFromRecent] = useState(null);

  // Get chat state from Redux
  const {
    conversations,
    createConversation: createState,
    deleteConversation: deleteState,
  } = useSelector((state) => state.chat);

  // Load conversations on mount
  useEffect(() => {
    dispatch(getConversations({ skip: 0, limit: 100 }));
  }, [dispatch]);

  // Handle new chat creation
  const handleNewChat = async () => {
    router.push("/");
    // try {
    //   const response = await dispatch(
    //     createConversation({ title: "New Chat" })
    //   );
    //   if (response.type.endsWith("/fulfilled")) {
    //     // Refresh conversations list
    //     dispatch(getConversations({ skip: 0, limit: 100 }));
    //     return response.payload;
    //   }
    //   return null;
    // } catch (error) {
    //   console.error("Failed to create conversation:", error);
    //   return null;
    // }
  };

  // Handle conversation deletion from Favorites
  const handleDeleteFromFavorites = async (conversationId) => {
    try {
      setDeletingFromFavorites(conversationId);
      const response = await dispatch(deleteConversation({ conversationId }));
      if (response.type.endsWith("/fulfilled")) {
        // Refresh conversations list
        dispatch(getConversations({ skip: 0, limit: 100 }));
        setDeletingFromFavorites(null);
        return true;
      }
      setDeletingFromFavorites(null);
      return false;
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      setDeletingFromFavorites(null);
      return false;
    }
  };

  // Handle conversation deletion from Recent Conversations
  const handleDeleteFromRecent = async (conversationId) => {
    try {
      setDeletingFromRecent(conversationId);
      const response = await dispatch(deleteConversation({ conversationId }));
      if (response.type.endsWith("/fulfilled")) {
        // Refresh conversations list
        dispatch(getConversations({ skip: 0, limit: 100 }));
        setDeletingFromRecent(null);
        return true;
      }
      setDeletingFromRecent(null);
      return false;
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      setDeletingFromRecent(null);
      return false;
    }
  };

  // Handle conversation star toggle
  const handleToggleStar = async (conversationId, currentIsStarred) => {
    try {
      console.log(
        "🚀 Dispatching toggleConversationStar for:",
        conversationId,
        "current:",
        currentIsStarred
      );
      const response = await dispatch(
        toggleConversationStar({
          conversationId,
          isStarred: !currentIsStarred,
        })
      );
      console.log("🚀 Toggle star response:", response);
      if (response.type.endsWith("/fulfilled")) {
        // Refresh conversations list
        console.log("🚀 Refreshing conversations list");
        dispatch(getConversations({ skip: 0, limit: 100 }));
        return true;
      }
      console.log("🚀 Toggle star failed:", response);
      return false;
    } catch (error) {
      console.error("Failed to toggle star:", error);
      return false;
    }
  };

  // Handle conversation clear
  const handleClearConversation = async (conversationId) => {
    try {
      const response = await dispatch(clearConversation({ conversationId }));
      if (response.type.endsWith("/fulfilled")) {
        // Refresh conversations list
        dispatch(getConversations({ skip: 0, limit: 100 }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to clear conversation:", error);
      return false;
    }
  };

  // Handle conversation update
  const handleUpdateConversation = async (conversationId, title) => {
    try {
      const response = await dispatch(
        updateConversation({ conversationId, title })
      );
      if (response.type.endsWith("/fulfilled")) {
        // Refresh conversations list
        dispatch(getConversations({ skip: 0, limit: 100 }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update conversation:", error);
      return false;
    }
  };

  // Refresh conversations
  const refreshConversations = () => {
    dispatch(getConversations({ skip: 0, limit: 100 }));
  };

  // Reset conversations state
  const resetConversationsState = () => {
    dispatch(resetConversations());
  };

  return {
    // State
    conversations: conversations.data || [],
    isLoading: conversations.isLoading,
    isError: conversations.isError,
    errorMessage: conversations.message,

    // Actions
    handleNewChat,
    handleDeleteFromFavorites,
    handleDeleteFromRecent,
    handleToggleStar,
    handleClearConversation,
    handleUpdateConversation,
    refreshConversations,
    resetConversationsState,

    // Create conversation state
    isCreatingConversation: createState.isLoading,
    createConversationError: createState.message,

    // Delete conversation state
    isDeletingConversation: deleteState.isLoading,
    deletingFromFavorites,
    deletingFromRecent,
    deleteConversationError: deleteState.message,
  };
}
